// In-memory storage for appointments (temporary solution)
let appointments = [];
let appointmentIdCounter = 1;

// Book a new appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctor, clinic, date, timeSlot, service, notes, patientName, doctorName, clinicName, patientPhone } = req.body;
    const patientId = req.user.id;

    // Check if the doctor is available for the given slot
    const conflict = appointments.find(apt => 
      apt.doctorId === parseInt(doctor) &&
      apt.clinicId === parseInt(clinic) &&
      apt.date === date &&
      apt.timeSlot === timeSlot &&
      (apt.status === 'pending' || apt.status === 'confirmed')
    );
    
    if (conflict) {
      return res.status(409).json({ error: 'This time slot is already booked.' });
    }

    const appointment = {
      id: appointmentIdCounter++,
      patientId,
      doctorId: parseInt(doctor),
      clinicId: parseInt(clinic),
      patientName: patientName || 'Patient',
      doctorName: doctorName || `Doctor ${doctor}`,
      clinicName: clinicName || `Clinic ${clinic}`,
      patientPhone: patientPhone || 'N/A',
      date,
      timeSlot,
      service: service || 'General Consultation',
      notes: notes || '',
      status: 'pending', // Changed from 'booked' to 'pending' for doctor approval
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    appointments.push(appointment);

    console.log('Appointment requested:', appointment);

    res.status(201).json({ 
      message: 'Appointment request submitted successfully! The doctor will review and confirm your appointment.',
      appointment
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(400).json({ error: err.message });
  }
};

// Get all appointments for a patient
exports.getPatientAppointments = async (req, res) => {
  try {
    const patientAppointments = appointments.filter(apt => apt.patient === req.user.id);
    
    // Enhance with doctor and clinic info
    const enhancedAppointments = patientAppointments.map(apt => ({
      ...apt,
      doctorName: `Doctor ${apt.doctor}`,
      clinicName: `Clinic ${apt.clinic}`,
      doctorSpecialty: 'General Practice'
    }));
    
    res.json(enhancedAppointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get appointments for a specific doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const doctorAppointments = appointments.filter(apt => apt.doctorId === doctorId);
    
    res.json(doctorAppointments);
  } catch (err) {
    console.error('Error fetching doctor appointments:', err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

// Cancel an appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointmentIndex = appointments.findIndex(apt => apt.id === parseInt(req.params.id));
    
    if (appointmentIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    const appointment = appointments[appointmentIndex];
    
    if (appointment.patient !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to cancel this appointment' });
    }
    
    appointments[appointmentIndex].status = 'cancelled';
    appointments[appointmentIndex].updatedAt = new Date();
    
    res.json({ message: 'Appointment cancelled', appointment: appointments[appointmentIndex] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get available time slots for a doctor on a date
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, clinicId, date } = req.query;
    
    // Standard time slots
    const slots = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
      '04:00 PM', '04:30 PM', '05:00 PM'
    ];
    
    // Find booked slots for this doctor, clinic, and date
    const bookedSlots = appointments
      .filter(apt => 
        apt.doctor === parseInt(doctorId) &&
        apt.clinic === parseInt(clinicId) &&
        apt.date === date &&
        apt.status === 'booked'
      )
      .map(apt => apt.timeSlot);
    
    // Return available slots
    const availableSlots = slots.filter(slot => !bookedSlots.includes(slot));
    
    res.json({ availableSlots });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all appointments (for admin/debugging)
exports.getAllAppointments = async (req, res) => {
  try {
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Confirm appointment (doctor only)
exports.confirmAppointment = async (req, res) => {
  try {
    const appointmentIndex = appointments.findIndex(apt => apt.id === parseInt(req.params.id));
    
    if (appointmentIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    appointments[appointmentIndex].status = 'confirmed';
    appointments[appointmentIndex].updatedAt = new Date();
    
    res.json({ message: 'Appointment confirmed', appointment: appointments[appointmentIndex] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Reject appointment (doctor only)
exports.rejectAppointment = async (req, res) => {
  try {
    const appointmentIndex = appointments.findIndex(apt => apt.id === parseInt(req.params.id));
    
    if (appointmentIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    appointments[appointmentIndex].status = 'rejected';
    appointments[appointmentIndex].updatedAt = new Date();
    
    res.json({ message: 'Appointment rejected', appointment: appointments[appointmentIndex] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Reschedule appointment (doctor only)
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { date, timeSlot } = req.body;
    const appointmentIndex = appointments.findIndex(apt => apt.id === parseInt(req.params.id));
    
    if (appointmentIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    appointments[appointmentIndex].date = date;
    appointments[appointmentIndex].timeSlot = timeSlot;
    appointments[appointmentIndex].status = 'confirmed';
    appointments[appointmentIndex].updatedAt = new Date();
    
    res.json({ message: 'Appointment rescheduled', appointment: appointments[appointmentIndex] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Complete appointment (doctor only)
exports.completeAppointment = async (req, res) => {
  try {
    const appointmentIndex = appointments.findIndex(apt => apt.id === parseInt(req.params.id));
    
    if (appointmentIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    appointments[appointmentIndex].status = 'completed';
    appointments[appointmentIndex].updatedAt = new Date();
    
    res.json({ message: 'Appointment completed', appointment: appointments[appointmentIndex] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
