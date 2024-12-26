import React from "react";


const testPage = () => {
  

  return (
    <div>
      <h1>Appointments</h1>

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
    </div>
  );
};

export default testPage;