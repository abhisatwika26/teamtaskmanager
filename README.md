# TeamSync - Team Task Manager 🚀

TeamSync is a full-stack collaborative task management web application built with the MERN stack. It allows teams to create projects, assign tasks, track progress, and manage members through a role-based access control system (Admin vs. Member).

![Live Demo](https://teamtaskmanagerethara.up.railway.app/) <!-- Replace with your live URL later -->

---

## 📸 Screenshots
*(Add screenshots of your live application here to show off your UI!)*

### Login & Authentication
> `<img src="link-to-your-login-screenshot.png" width="600" alt="Login Screen">`

### Admin Dashboard & Task Management
> `<img src="link-to-your-admin-dashboard-screenshot.png" width="600" alt="Admin Dashboard">`

### Member View
> `<img src="link-to-your-member-view-screenshot.png" width="600" alt="Member View">`

---

## ✨ Key Features
* **Role-Based Access Control (RBAC):** Distinct dashboards and permissions for Admins and Members.
* **Task Management:** Admins can create tasks with Due Dates, Priorities (Low, Medium, High), and assign them to specific members.
* **Progress Tracking:** Members can update their assigned task statuses (To Do, In Progress, Done).
* **Team Management:** Admins can seamlessly add or revoke access for team members.
* **Secure Authentication:** JWT-based secure login, signup, and direct password reset functionality.
* **Responsive Dashboard:** Real-time statistics tracking total, completed, in-progress, and overdue tasks.

---

## 🛠️ Tech Stack
* **Frontend:** React.js (Vite), Tailwind CSS, React Router DOM, Axios
* **Backend:** Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt.js
* **Database:** MongoDB (Mongoose ODM)
* **Deployment:** Railway

---

## 📁 Directory Structure
This project uses a monorepo structure, housing both the client and server in a single repository.

```text
team-task-manager/
├── backend/                # Node.js & Express API
│   ├── middleware/         # JWT Auth & Role validation
│   ├── models/             # Mongoose Schemas (User, Task)
│   ├── routes/             # API Endpoints (auth, tasks, users)
│   ├── package.json
│   └── server.js           # Backend Entry Point
├── frontend/               # React & Vite Application
│   ├── src/
│   │   ├── context/        # Global Auth Context
│   │   ├── pages/          # Login, Signup, Dashboard UI
│   │   ├── App.jsx         # App Routing
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
└── README.md
```
---

##  💻 Local Setup Instructions

Prerequisites
Node.js installed

MongoDB Community Server installed and running locally

Git

1. Clone the Repository
Bash
git clone [https://github.com/your-username/teamtaskmanager.git](https://github.com/your-username/teamtaskmanager.git)
cd teamtaskmanager
2. Backend Setup
Open a terminal and navigate to the backend folder:

Bash
cd backend
npm install
Create a .env file inside the backend folder and add the following:

Code snippet
PORT=5000
MONGO_URI= your mongodb url
JWT_SECRET=your_super_secret_jwt_key

Start the backend server:

Bash
npm run dev

3. Frontend Setup
Open a new terminal window and navigate to the frontend folder:

Bash
cd frontend
npm install
Create a .env file inside the frontend folder and add the following:

Code snippet
VITE_API_URL=http://localhost:5000
Start the React development server:

Bash
npm run dev
The application should now be running locally at http://localhost:5173.

## 🚀 Deployment Instructions (Railway)
This application is configured for seamless deployment as a monorepo on Railway.

Step 1: Provision the Database
Create a new project on Railway and select Provision MongoDB.

Once initialized, go to the MongoDB service's Variables tab and copy the generated MONGO_URL connection string.

Step 2: Deploy the Backend
Click New + -> GitHub Repo and select this repository.

Click on the newly created service and go to Settings -> Root Directory. Type /backend and save.

Go to the Variables tab and add:

MONGO_URI: (Paste the MongoDB string from Step 1)

JWT_SECRET: (Create a secure random string for production)

Go to Settings -> Networking and click Generate Domain. Copy this domain URL (ensure there is no trailing slash).

Step 3: Deploy the Frontend
Click New + -> GitHub Repo and select this repository again (you will have a second GitHub block).

Click on this new service, go to Settings -> Root Directory, type /frontend, and save.

Go to the Variables tab and add:

VITE_API_URL: (Paste the Backend domain URL generated in Step 2. Must include https://)

Go to Settings -> Networking and click Generate Domain.

Application is now live and fully connected!
