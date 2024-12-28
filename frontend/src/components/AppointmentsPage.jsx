import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { set } from "zod";


const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [authError, setAuthError] = useState(false);
  const [userRole, setUserRole] = useState(null); 
  const [formData, setFormData] = useState({
    job_centre_id: "",
    date: "",
    address: "",
    benefit_name: "",
  });
  const [editId, setEditId] = useState(null); // Tracks the ID of the appointment being edited
    const navigate = useNavigate();

  const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://app-xmfz.onrender.com'
    : 'http://localhost:3000';

  const API_BASE_URL = `${baseUrl}/api/appointments`; // Replace with your backend URL

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/personal`, {
        withCredentials: true,
      });
      console.log(response.data, 'RESPONSE.DATA')
      setAppointments(response.data.data);
      setAuthError(false);
      setUserRole(response.data.role); 
      console.log(response.data.role, 'INSIDE FETCH')
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setAuthError(true);
      } else {
        console.error("Error fetching appointments:", error);
      }
    }
  };

  // Create a new appointment
  const createAppointment = async () => {
    try {
      await axios.post(`${API_BASE_URL}`, formData, {
        withCredentials: true,
      });
      alert("Appointment created successfully!");
      fetchAppointments();
      setFormData({
        job_centre_id: "",
        date: "",
        address: "",
        benefit_name: "",
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  // Update an appointment
  const updateAppointment = async () => {
    try {
      await axios.put(`${API_BASE_URL}/update/${editId}`, formData, {
        withCredentials: true,
      });
      alert("Appointment updated successfully!");
      fetchAppointments();
      setFormData({
        job_centre_id: "",
        date: "",
        address: "",
        benefit_name: "",
      });
      setEditId(null);
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  // Delete an appointment
  const deleteAppointment = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete/${id}`, {
        withCredentials: true,
      });
      alert("Appointment deleted successfully!");
      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Populate form for editing an appointment
  const handleEdit = (appointment) => {
    setFormData({
      job_centre_id: appointment.job_centre_id,
      date: appointment.date,
      address: appointment.address,
      benefit_name: appointment.benefit_name,
    });
    setEditId(appointment.appointment_id);
  };

  // Submit form (create or update based on `editId`)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      updateAppointment();
    } else {
      createAppointment();
    }
  };

  const logOut = async () => {
    try {
      await axios.post(`${API_BASE_URL}/logout`, {
        withCredentials: true,
      });
      () => navigate('/admin/appointments')
  
    } catch (error) {
      console.error( error);
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, []);



  return (
   
    <div>
      <h1>Appointments</h1>
      <button onClick={()=>{logOut}}>
    Logout
  </button>

      {authError ? (
        <p>You are not logged in. Please log in to view your appointments.</p>
      ) : (
        <>
          {/* Appointment Form */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="job_centre_id"
              placeholder="Job Centre ID"
              value={formData.job_centre_id}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="benefit_name"
              placeholder="Benefit Name"
              value={formData.benefit_name}
              onChange={handleInputChange}
              required
            />
            <button type="submit">
              {editId ? "Update Appointment" : "Create Appointment"}
            </button>
            {editId && (
              <button onClick={() => setEditId(null)}>Cancel Edit</button>
            )}
          </form>

          {/* Appointments List */}
          <h2>My Appointments</h2>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.appointment_id}>
                    <td>{appointment.job_centre_id}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.address}</td>
                    <td>{appointment.benefit_name}</td>
                    <td>
                      <button onClick={() => handleEdit(appointment)}>
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          deleteAppointment(appointment.appointment_id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
      {userRole === "ADMIN" && (
  <button
    onClick={() => navigate('/admin/appointments')} // Navigate to the admin view
  >
    View All Appointments
  </button>
)}
    </div>
  );
};

export default AppointmentsPage;