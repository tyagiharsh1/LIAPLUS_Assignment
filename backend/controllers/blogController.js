const BlogPost = require('../models/BlogPost');

exports.createBlogPost = async (req, res) => {
  const { title, content } = req.body;

  try {
    const blogPost = await BlogPost.create({
      title,
      content,
      author: req.user._id,
    });
    res.status(201).json(blogPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBlogPosts = async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Access denied: Only users can view all posts' });
    }
    // Populate author with name, email, and role
    const blogPosts = await BlogPost.find().populate('author', 'name email role');
    console.log('Fetched blog posts with authors:', blogPosts);
    // Format createdAt to ISO string or desired format
    const formattedPosts = blogPosts.map(post => ({
      _id: post._id,
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));
    res.json(formattedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBlogPostById = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id).populate('author', 'name email');
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    const formattedPost = {
      _id: blogPost._id,
      title: blogPost.title,
      content: blogPost.content,
      author: blogPost.author,
      createdAt: blogPost.createdAt,
      updatedAt: blogPost.updatedAt,
    };
    res.json(formattedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    if (blogPost.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }
    blogPost.title = req.body.title || blogPost.title;
    blogPost.content = req.body.content || blogPost.content;
    const updatedPost = await blogPost.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    if (blogPost.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    await BlogPost.deleteOne({ _id: req.params.id });
    res.json({ message: 'Blog post removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
