How to Run the RBAC Blog Platform Locally

========================================

Prerequisites:
- Node.js (v14+ recommended)
- npm (comes with Node.js)
- MongoDB (local or MongoDB Atlas cloud)
- (Optional) Postman for API testing

Project Structure:
/backend    --> Node.js + Express.js (API Server)
/frontend   --> React.js (User Interface)

----------------------------------------

Backend Setup (Node.js + MongoDB):

1. Open terminal and navigate to backend folder:
   cd backend

2. Install backend dependencies:
   npm install

3. Create a .env file inside the backend folder with the following content:
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key

4. Start the backend server:
   npm run dev

- Server will be running at: http://localhost:5000

----------------------------------------

Frontend Setup (React):

1. Open a new terminal and navigate to frontend folder:
   cd frontend

2. Install frontend dependencies:
   npm install

3. Start the frontend development server:
   npm start

- React app will be running at: http://localhost:3000

----------------------------------------

Important Notes:

- Make sure the backend server is running before using the frontend.
- Configure the API base URL inside the frontend if needed.
  (Example: set baseURL to 'http://localhost:5000/api' in your Axios service.)

- Default roles are 'user' and 'admin'.
- Only admin users are allowed to create, update, or delete blog posts.
- Regular users can view all blog posts.

----------------------------------------

Summary of Actions and Role Permissions:

- Signup/Login --> Available for all users
- View Blog Posts --> Available for all users
- Create/Update/Delete Blog Posts --> Admin only (restricted by role-based middleware)

----------------------------------------

You are now ready to use the RBAC Blog Platform locally!

