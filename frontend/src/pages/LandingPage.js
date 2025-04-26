import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LandingPage.css';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        if (user && user.role === 'user') {
          const response = await axios.get('http://localhost:5000/api/blogs');
          setPosts(response.data);
        } else {
          setPosts([]);
        }
      } catch (err) {
        setError('Failed to fetch blog posts');
      }
    };
    fetchBlogs();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to the DailyNest </h1>
        <p>Your platform to share and explore amazing blog posts.</p>

        {/* Button section with box */}
        <div className="button-box">
          <div className="buttons">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-primary">Login</Link>
                <Link to="/signup" className="btn btn-secondary">Register</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="btn btn-logout">Logout</button>
            )}
          </div>
        </div>

        {/* Error message if any */}
        {error && <p className="error-message">{error}</p>}

        {/* Blog posts */}
        {posts.length === 0 ? (
          user && user.role === 'user' ? (
            <p>No blog posts available.</p>
          ) : null
        ) : (
          <div className="blog-list">
            {posts.map((post) => (
              <div key={post._id} className="blog-post">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p><em>Author: {post.author.name}</em></p>
                <p><small>Created at: {new Date(post.createdAt).toLocaleString()}</small></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
