const express = require('express');
const {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
} = require('../controllers/blogController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getAllBlogPosts)
  .post(protect, authorizeRoles('admin'), createBlogPost);

router.route('/:id')
  .get(getBlogPostById)
  .put(protect, authorizeRoles('admin'), updateBlogPost)
  .delete(protect, authorizeRoles('admin'), deleteBlogPost);

module.exports = router;
