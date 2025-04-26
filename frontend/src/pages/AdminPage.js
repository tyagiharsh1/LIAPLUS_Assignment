import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './AdminPage.css';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const { user, logout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editPostId, setEditPostId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const navigate = useNavigate();
  const [expandedPosts, setExpandedPosts] = useState({});

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs');
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch blog posts');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const token = user.token;
      await axios.post(
        'http://localhost:5000/api/blogs',
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setContent('');
      setMessage('Blog post created successfully');
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog post');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setMessage('');
    try {
      const token = user.token;
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Blog post deleted successfully');
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete blog post');
    }
  };

  const handleEditClick = (post) => {
    setEditPostId(post._id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleCancelEdit = () => {
    setEditPostId(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleSaveEdit = async (id) => {
    setError('');
    setMessage('');
    try {
      const token = user.token;
      await axios.put(
        `http://localhost:5000/api/blogs/${id}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Blog post updated successfully');
      setEditPostId(null);
      setEditTitle('');
      setEditContent('');
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog post');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleExpand = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const renderContent = (post) => {
    const maxLength = 200;
    const isExpanded = expandedPosts[post._id];
    if (post.content.length <= maxLength) {
      return <p>{post.content}</p>;
    }
    if (isExpanded) {
      return (
        <>
          <p>{post.content}</p>
          <button className="read-more-btn" onClick={() => toggleExpand(post._id)}>Show less</button>
        </>
      );
    }
    return (
      <>
        <p>{post.content.substring(0, maxLength)}...</p>
        <button className="read-more-btn" onClick={() => toggleExpand(post._id)}>Read more</button>
      </>
    );
  };

  return (
    <div className="container">
      <button onClick={handleLogout} style={{ float: 'right', marginBottom: '10px' }}>
        Logout
      </button>
      <h2>Admin Dashboard</h2>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <form onSubmit={handleCreate}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Blog Post</button>
      </form>
      <h3>Existing Blog Posts</h3>
      {posts.length === 0 ? (
        <p>No blog posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="blog-post">
            {editPostId === post._id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(post._id)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <h4>{post.title}</h4>
                {renderContent(post)}
                <p><small>Created at: {formatDate(post.createdAt)}</small></p>
                <button onClick={() => handleEditClick(post)}>Update</button>
                <button onClick={() => handleDelete(post._id)}>Delete</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminPage;
