"use client";

import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/lib/api";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const BarChart = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Bar),
  { ssr: false }
);
const LineChart = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Line),
  { ssr: false }
);

const Dashboard = () => {
  const token = Cookies.get("token");
  const router = useRouter(); 

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  const {
    data: analytics,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      if (!token) throw new Error("No token found");
      return getAnalytics(token);
    },
    enabled: !!token,
  });

  if (isLoading) return <p>Loading dashboard data...</p>;
  if (error)
    return (
      <p className="text-red-500">
        Failed to load analytics: {error.message}
      </p>
    );

  const barChartData = {
    labels: analytics ? Object.keys(analytics.tagCounts) : [],
    datasets: [
      {
        label: "Tag Frequency",
        data: analytics ? Object.values(analytics.tagCounts) : [],
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(28, 70, 169, 0.69)",
        borderWidth: 1,
      },
    ],
  };

  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const postsPerDay = last7Days.reduce((acc, date) => {
    acc[date] = analytics?.recentPosts[date] || 0;
    return acc;
  }, {});

  const lineChartData = {
    labels: last7Days,
    datasets: [
      {
        label: "Posts Created",
        data: Object.values(postsPerDay),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 1,
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="w-full flex justify-between items-center py-5">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 rounded-lg px-7 py-3 text-white hover:bg-blue-400 transition"
        >
          See Posts
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-100 rounded-md">
          <h3 className="text-xl font-semibold mb-2">Tag Frequency</h3>
          <BarChart data={barChartData} />
        </div>

        <div className="p-4 bg-gray-100 rounded-md">
          <h3 className="text-xl font-semibold mb-2">
            Posts Created (Last 7 Days)
          </h3>
          <LineChart data={lineChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
