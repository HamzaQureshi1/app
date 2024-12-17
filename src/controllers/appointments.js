import { NotFoundException } from '../exceptions/not-found.js';
import { ErrorCodes } from '../exceptions/root.js';
import { prismaClient } from '../index.js'


export const createAppointment = async(req, res) => {

    const { job_centre_id, date, address, benefit_name } = req.body;

    const userId = req.user.id
    

    const newAppointment = await prismaClient.appointments.create({
        data: {
          ...req.body,
          customer_id: userId, // Use the logged-in user's ID
        },
      });
    
      res.json(newAppointment)
  
}

export const updateAppointment = async (req, res) => {
  try {
    const appointment = req.body;
    const updateAppointment = await prismaClient.appointments.update({
      where: {
        appointment_id: parseInt(req.params.id)
      },
      data:{
        ...appointment
      }
    })
    res.json(updateAppointment)

  } catch (error) {
    throw new NotFoundException('Appointment not found',ErrorCodes.APPOINTMENT_NOT_FOUND)
  }
}

export const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = parseInt(req.params.id); // Parse the ID from request parameters

    const deletedAppointment = await prismaClient.appointments.delete({
      where: {
        appointment_id: appointmentId, // Match by the primary key field
      },
    });

    res.status(200).json({
      message: "Appointment deleted successfully",
      deletedAppointment, // Return the deleted appointment details if needed
    });
  } catch (error) {
   

    if (error.code === "P2025") {
      // Prisma's specific error code for 'Record not found'
      throw new NotFoundException('Appointment not found',ErrorCodes.APPOINTMENT_NOT_FOUND)
    } 
  }
};


export const listAppointments = async (req, res) => {

    const count = await prismaClient.appointments.count();
    const appointments = await prismaClient.appointments.findMany({
      skip: req.query.skip || 0,
      take: 20
    })
  res.json({count, data:appointments})
}

export const viewMyAppointments = async (req, res) => {
  
  const userId = req.user.id
  
  const appointments = await prismaClient.appointments.findMany({
    where: {
      customer_id: userId, // Match by the primary key field
    },
  })
res.json({data:appointments})
}