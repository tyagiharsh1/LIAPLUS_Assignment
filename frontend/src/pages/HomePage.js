import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './HomePage.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [expandedPosts, setExpandedPosts] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Check user role and fetch blogs accordingly
        if (user && user.role === 'user') {
          // Fetch all blogs for user role
          const response = await axios.get('http://localhost:5000/api/blogs');
          setPosts(response.data);
        } else {
          // For other roles, you can adjust fetching logic if needed
          const response = await axios.get('http://localhost:5000/api/blogs');
          setPosts(response.data);
        }
      } catch (err) {
        setError('Failed to fetch blog posts');
      }
    };
    fetchPosts();
  }, [user]);

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
      <h2>Blog Posts</h2>
      {error && <p className="error-message">{error}</p>}
      {posts.length === 0 ? (
        <p>No blog posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="blog-post">
            <h3>{post.title}</h3>
            {renderContent(post)}
            <p><em>Author: {post.author.name}</em></p>
            <p><small>Created at: {formatDate(post.createdAt)}</small></p>
          </div>
        ))
      )}
    </div>
  );
};

export default HomePage;
