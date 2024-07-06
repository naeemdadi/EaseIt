# EaseIt

EaseIt is a productivity app designed for organizations and teams to manage tasks and roles efficiently. It features a multi-role system where users can log in as Super Admin, Admin, or Employee, each with specific capabilities.

## Live Demo

Check out the live site [here](https://easeit.netlify.app/).

## Features

- **User Roles**:
  - **Super Admin**: Manage all users, including creating admins and employees, and access all tasks.
  - **Admin**: Create tasks, manage employees, and generate reports.
  - **Employee**: View and manage their assigned tasks.
- **Task Management**: Create, update, delete tasks, and assign tasks to employees with a chat feature for task discussions.
- **User Management**: Super Admin can add, edit, and remove users.
- **Real-time Communication**: Integrated chat feature for task discussions.
- **Responsive Design**: Fully functional on both desktop and mobile devices.

## Technologies Used

- **Frontend**: React.js, Material-UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, Passport.js
- **Real-time Communication**: Socket.io
- **Styling**: Material-UI
- **API Requests**: Axios

## Getting Started

### Prerequisites

To run this project locally, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- MongoDB

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/naeemdadi/EaseIt.git
    ```
2. Navigate to the project directory:
    ```bash
    cd EaseIt
    ```

3. Navigate to server
   ```bash
   cd server
   ```

4. Install the dependencies:
    ```bash
    npm install
    ```

5. Same for client directory

### Configuration

1. Create a `.env` file in the server directory and add your environment variables:
    ```env
    PORT=5000
    MONGODB_URL=your_mongodb_uri
    JWT_AUTH_TOKEN=auth_token
    CLOUDINARY_NAME=name
    CLOUDINARY_API_KEY=api_key
    CLOUDINARY_API_SECRET=api_secret
    ```

### Running the Application

To start the application locally, use the following command:
```bash
  npm start
```

## API Endpoints

### Authentication
- **POST /api/users/registerSuperAdmin**: Register a new super admin
- **POST /api/users/registerEmployee**: Register a new employee
- **POST /api/users/login**: Login a user and generate a JWT
- **POST /api/users/updateEmployee**: Update employee (Super Admin only)
- 

### Users
- **GET /api/company/list**: Retrieve all projects (Super Admin only)
- **POST /api/company/sendjoiningrequest**: Add a new user
- **GET /api/company/getemployees**: Get all employees in project (Super Admin and Admin only)
- **POST /api/company/makeanadmin**: Make employee an admin of the project (Super Admin only)
- **POST /api/company/removeanadmin**: Remove employee from admin of the project (Super Admin only)
- **PUT /api/users/:id**: Update a user (Super Admin only)
- **DELETE /api/users/:id**: Delete a user (Super Admin only)

### Tasks
- **GET /api/tasks/gettasks**: Retrieve all tasks (Super Admin, Admin only)
- **POST /api/tasks/newtask**: Create a new task (Super Admin, Admin only)
- **PUT /api/tasks/updatetask**: Update a task (Super Admin, Admin only)
- **DELETE /api/tasks/:id**: Delete a task (Admin only)
- **PUT /api/tasks/updatestatus**: Update status of the task (Super Admin, Admin only)

## Deployment

The application can be deployed on various platforms like Heroku, AWS, or any other cloud provider. Ensure you set the necessary environment variables for your deployment setup.

## Contact

For any questions or feedback, please contact Naeem Dadi at [Gmail](mailto:naeemdadi85@gmail.com).

