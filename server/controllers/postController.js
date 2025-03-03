const Post = require('../models/Post');

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const { author, tag, search } = req.query;
    const query = {};

    // Apply filters if provided
    if (author) query.author = author;
    if (tag) query.tags = tag;
    if (search) query.$text = { $search: search };

    const posts = await Post.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create a post
exports.createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const newPost = new Post({
      title,
      content,
      tags: tags || [],
      author: req.user.id
    });

    const post = await newPost.save();
    
    // Populate the author field for the response
    await post.populate('author', 'username');
    
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get post by id
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.status(500).send('Server error');
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Find post
    let post = await Post.findById(req.params.id);

    // Check if post exists
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Update fields
    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags || post.tags;

    await post.save();
    
    // Populate the author field for the response
    await post.populate('author', 'username');
    
    res.json(post);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.status(500).send('Server error');
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if post exists
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await post.deleteOne();

    res.json({ message: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.status(500).send('Server error');
  }
};
