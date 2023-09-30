const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Sample data for doctors
const doctors = [
  {
    id: 1,
    name: 'Dr. John Smith',
    specialty: 'Cardiologist',
    maxPatientsPerEvening: 10,
    availability: {
      Monday: '5:00 PM - 9:00 PM',
      Tuesday: '5:00 PM - 9:00 PM',
      Wednesday: '5:00 PM - 9:00 PM',
      Thursday: '5:00 PM - 9:00 PM',
      Friday: '5:00 PM - 9:00 PM',
    },
  },
  {
    id: 2,
    name: 'Dr. Jane Doe',
    specialty: 'Dermatologist',
    maxPatientsPerEvening: 8,
    availability: {
      Monday: '6:00 PM - 8:00 PM',
      Wednesday: '6:00 PM - 8:00 PM',
      Friday: '6:00 PM - 8:00 PM',
    },
  },
];

// Sample data for appointments
const appointments = [];

// Endpoint to get a list of all doctors
app.get('/api/doctors', (req, res) => {
  res.json(doctors);
});

// Endpoint to get detailed information about a specific doctor
app.get('/api/doctors/:doctorId', (req, res) => {
  const doctorId = parseInt(req.params.doctorId);
  const doctor = doctors.find((doc) => doc.id === doctorId);
  if (doctor) {
    res.json(doctor);
  } else {
    res.status(404).json({ error: 'Doctor not found' });
  }
});

// Endpoint to get a list of all appoinmentBooked
app.get('/api/bookedAppoinment', (req, res) => {
    res.json(appointments);
  });

// Endpoint to book an appointment
app.post('/api/appointments', (req, res) => {
  const { doctorId, appointmentTime } = req.body;

  // Check if the doctor exists
  const doctor = doctors.find((doc) => doc.id === doctorId);
  if (!doctor) {
    return res.status(404).json({ error: 'Doctor not found' });
  }

  // Check if the appointment time is valid
  if (
    !doctor.availability[appointmentTime] ||
    appointments.filter((apt) => apt.doctorId === doctorId).length >=
      doctor.maxPatientsPerEvening
  ) {
    return res.status(400).json({ error: 'Appointment not available' });
  }

  // Book the appointment
  appointments.push({
    doctorId,
    doctorName: doctor.name,
    appointmentTime,
  });

  res.status(201).json({ message: 'Appointment booked successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
