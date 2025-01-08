

# Appointment App

This is a web-based application designed for the **Department for Work and Pensions (DWP)** to facilitate the scheduling of appointments between customers and their Benefit Officers.

The application is hosted at **[Appointment Tool](https://appointment-tool.netlify.app)**, and the source code is available on GitHub at **[Appointment App Repository](https://github.com/HamzaQureshi1/app)**.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Admin Access](#admin-access)
- [Security Measures](#security-measures)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Registration and Login**: Users can create accounts, log in securely, and access the appointments page.
- **JWT Authentication**: Users receive a JSON Web Token (JWT) upon successful login, enabling secure session management.
- **Appointment Management**: Users can create, view, edit, and delete their appointments.
- **Admin Access**: Admins can view all appointments across the platform.
- **Logout Functionality**: Ensures sessions are terminated securely by destroying the JWT token.
- **Responsive Design**: A user-friendly interface powered by React.
- **OWASP Defenses**: Application safeguards against common vulnerabilities.

---

## Technologies Used

### Frontend:
- **React**: For building the user interface.
- **Vite**: As the build tool for the React application.

### Backend:
- **Node.js**: For the server-side logic.
- **SQLite**: For database management with two tables: `Users` and `Appointments`.

### Testing & Deployment:
- **Vitest**: For backend testing.
- **CI/CD**: Continuous integration and deployment using GitHub Actions.
- **Netlify**: For hosting the frontend.
- **Render**: For hosting the backend.

---

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/HamzaQureshi1/app.git
   cd app
   ```

2. **Install Dependencies**:
   For the backend:
   ```bash
   npm install
   ```
   For the frontend:
   ```bash
   cd frontend
   npm install
   ```

3. **Database Setup**:
   Ensure SQLite is installed. The application uses two tables: `Users` and `Appointments`. Run the migrations if needed.

4. **Set up Environment Variables**:

   Follow the .env.example file to create a .env file 

5. **Run the Application**:
   Start the backend server:
   ```bash
   npm run dev
   ```
   Start the frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**:
   Navigate to `http://localhost:3000` (or the appropriate port set in the .env) to use the app.



## Testing

   In order to run tests, simply run the command npm run test.

## Usage

1. **Create an Account**: Register as a regular user to manage your appointments.
2. **Login**: Access your personal dashboard by logging in with your credentials.
3. **Manage Appointments**:
   - **View**: See all your appointments.
   - **Create**: Add new appointments.
   - **Edit**: Modify existing appointments.
   - **Delete**: Remove unwanted appointments.
4. **Logout**: Securely log out to end your session.

---

## Admin Access

Admins have special privileges to view all user appointments across the platform. 

**Admin Credentials**:
- **Email**: `test@test.com`
- **Password**: `tester`

Admin access is verified through middleware that checks the admin's credentials.

---

## Security Measures

The application implements several defenses against common OWASP vulnerabilities:
1. **Authentication & Authorization**:
   - JWT is used to manage sessions securely.
   - Admin middleware ensures only authorized users can access sensitive data.
2. **Data Protection**:
   - Passwords are securely hashed before storage.
   - Sensitive operations require token validation.
3. **Input Validation**:
   - All inputs are validated to prevent SQL injection, XSS, and other attacks.
4. **Logout Functionality**:
   - Destroying JWT tokens ensures that sessions are properly terminated.

---

## Contributing

Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the **MIT License**. See the LICENSE file for more details.

---

