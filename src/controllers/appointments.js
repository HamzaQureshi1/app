import { prismaClient } from '../index.js'


export const createAppointment = async(req, res) => {
  console.log('5')
    const { job_centre_id, date, address, benefit_name } = req.body;
    console.log('easy')
    const newAppointment = await prismaClient.appointments.create({
        data: {
          ...req.body,
          customer_id: 1, // Use the logged-in user's ID
        },
      });
      console.log('done')
      res.json(newAppointment)
  
}