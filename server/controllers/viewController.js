const fs = require('fs');
const path = require('path');
const Post = require('../models/Post');

// Render home page with SSR
exports.renderHomePage = async (req, res) => {
  try {
    // Fetch recent posts
    const recentPosts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Read the HTML template
    const indexHtml = fs.readFileSync(path.resolve(__dirname, '../views', 'index.html'), 'utf8');
    
    // Insert the server-rendered content
    const renderedContent = `
      <div id="server-rendered-content">
        <h2>Recent Posts</h2>
        <ul>
          ${recentPosts.map(post => `
            <li>
              <h3>${post.title}</h3>
              <p>By: ${post.author.username}</p>
              <p>${post.content.substring(0, 100)}...</p>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
    
    // Replace placeholder with server-rendered content
    const fullHtml = indexHtml.replace('<!-- SERVER_RENDERED_CONTENT -->', renderedContent);
    
    res.send(fullHtml);
  } catch (err) {
    console.error(err);
    // Fallback to client-side rendering
    res.sendFile(path.resolve(__dirname, '../views', 'index.html'));
  }
};
