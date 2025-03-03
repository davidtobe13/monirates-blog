const Post = require("../models/Post");

exports.getPostAnalytics = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0); 

    const posts = await Post.find({ createdAt: { $gte: sevenDaysAgo } });

    const postsPerDay = [...Array(7)].reduce((acc, _, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i)); 
      const dateString = date.toISOString().split("T")[0]; 
      acc[dateString] = 0;
      return acc;
    }, {});

    posts.forEach((post) => {
      const createdAt = new Date(post.createdAt).toISOString().split("T")[0];
      if (postsPerDay[createdAt] !== undefined) {
        postsPerDay[createdAt] += 1;
      }
    });

    const tagCounts = {};
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    res.json({
      recentPosts: postsPerDay, 
      tagCounts,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
