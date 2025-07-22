// Comprehensive Andhra Pradesh doctors data
const doctors = [
  // Visakhapatnam Doctors
  {
    id: 1,
    name: 'Dr. Rajesh Kumar',
    specialty: 'Cardiology',
    qualification: 'MBBS, MD, DM (Cardiology)',
    experience: '15 years',
    location: 'Visakhapatnam',
    clinic: 'Apollo Hospitals Visakhapatnam',
    address: 'Arilova, Visakhapatnam, Andhra Pradesh 530040',
    phone: '+91-891-2888888',
    rating: 4.8,
    available: true,
    employeeNumber: 'DOC001',
    consultationFee: 800
  },
  {
    id: 2,
    name: 'Dr. Priya Sharma',
    specialty: 'Dermatology',
    qualification: 'MBBS, MD (Dermatology)',
    experience: '12 years',
    location: 'Visakhapatnam',
    clinic: 'KIMS ICON Hospital',
    address: 'Visakhapatnam, Andhra Pradesh 530017',
    phone: '+91-891-3040404',
    rating: 4.6,
    available: true,
    employeeNumber: 'DOC002',
    consultationFee: 600
  },
  {
    id: 3,
    name: 'Dr. Emily Davis',
    email: 'emily.davis@familyhealth.com',
    specialty: 'General Practitioner',
    rating: 4.9,
    experience: '20 years',
    location: 'Uptown',
    clinic: { id: 3, name: 'Family Health Center', address: '789 Pine St, Uptown' },
    bio: 'Family doctor providing comprehensive healthcare for all ages.',
    qualifications: ['MD - Family Medicine', 'Board Certified'],
    services: ['General Checkup', 'Vaccinations', 'Health Screening'],
    availableSlots: ['08:30 AM', '10:00 AM', '01:30 PM', '03:00 PM'],
    photo: '/api/placeholder/150/150'
  },
  {
    id: 4,
    name: 'Dr. Robert Wilson',
    email: 'robert.wilson@sportsmed.com',
    specialty: 'Orthopedist',
    rating: 4.7,
    experience: '18 years',
    location: 'Medical District',
    clinic: { id: 4, name: 'Sports Medicine Clinic', address: '321 Elm St, Medical District' },
    bio: 'Orthopedic surgeon specializing in sports injuries and joint replacement.',
    qualifications: ['MD - Orthopedic Surgery', 'Sports Medicine Certified'],
    services: ['Joint Replacement', 'Sports Injury Treatment', 'Physical Therapy'],
    availableSlots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:30 PM'],
    photo: '/api/placeholder/150/150'
  },
  {
    id: 5,
    name: 'Dr. Lisa Chen',
    email: 'lisa.chen@childhealth.com',
    specialty: 'Pediatrician',
    rating: 4.8,
    experience: '14 years',
    location: 'Suburbs',
    clinic: { id: 5, name: 'Children\'s Health Clinic', address: '654 Maple Ave, Suburbs' },
    bio: 'Pediatrician dedicated to providing excellent healthcare for children.',
    qualifications: ['MD - Pediatrics', 'Child Development Specialist'],
    services: ['Child Checkup', 'Vaccinations', 'Growth Monitoring'],
    availableSlots: ['08:00 AM', '09:30 AM', '11:00 AM', '02:00 PM'],
    photo: '/api/placeholder/150/150'
  }
];

// Create or update doctor profile
exports.upsertDoctor = async (req, res) => {
  try {
    const { name, email, specialty, bio, experience, qualifications, services } = req.body;
    const userId = req.user.id;
    
    // Find existing doctor
    const existingIndex = doctors.findIndex(d => d.email === email);
    
    if (existingIndex !== -1) {
      // Update existing doctor
      doctors[existingIndex] = { ...doctors[existingIndex], name, email, specialty, bio, experience, qualifications, services };
      res.json({ message: 'Doctor profile updated', doctor: doctors[existingIndex] });
    } else {
      // Create new doctor
      const newDoctor = {
        id: doctors.length + 1,
        name,
        email,
        specialty,
        bio,
        experience,
        qualifications,
        services,
        rating: 4.5,
        location: 'Downtown',
        clinic: { id: 1, name: 'General Clinic', address: '123 Main St' },
        availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
        photo: '/api/placeholder/150/150'
      };
      doctors.push(newDoctor);
      res.status(201).json({ message: 'Doctor profile created', doctor: newDoctor });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const { location, specialty } = req.query;
    let filteredDoctors = doctors;
    
    if (location) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (specialty) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
    }
    
    res.json(filteredDoctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = doctors.find(d => d.id === parseInt(req.params.id));
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
