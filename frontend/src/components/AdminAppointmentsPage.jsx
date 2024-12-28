import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://app-xmfz.onrender.com"
      : "http://localhost:3000";

  const API_BASE_URL = `${baseUrl}/api/appointments/all`; // Backend route for all appointments

  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        const response = await axios.get(API_BASE_URL, {
          withCredentials: true,
        });
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching all appointments:", error);
      }
    };

    fetchAllAppointments();
  }, []);

  return (
    <div>
      <h1>All Appointments</h1>
      {appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Job Centre ID</th>
              <th>Date</th>
              <th>Address</th>
              <th>Benefit Name</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.job_centre_id}</td>
                <td>{appointment.date}</td>
                <td>{appointment.address}</td>
                <td>{appointment.benefit_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminAppointmentsPage;