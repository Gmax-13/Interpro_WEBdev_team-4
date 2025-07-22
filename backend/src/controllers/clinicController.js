// Comprehensive Andhra Pradesh clinics data
const clinics = [
  // Visakhapatnam Clinics
  {
    id: 1,
    name: 'Apollo Hospitals Visakhapatnam',
    address: 'Arilova, Visakhapatnam, Andhra Pradesh 530040',
    location: 'Visakhapatnam',
    phone: '+91-891-2888888',
    email: 'info@apollovisakhapatnam.com',
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Emergency Care', 'ICU'],
    rating: 4.8,
    operatingHours: '24/7',
    facilities: ['Emergency Room', 'ICU', 'NICU', 'Laboratory', 'Pharmacy', 'Blood Bank', 'Radiology']
  },
  {
    id: 2,
    name: 'KIMS ICON Hospital',
    address: 'Visakhapatnam, Andhra Pradesh 530017',
    location: 'Visakhapatnam',
    phone: '+91-891-3040404',
    email: 'info@kimsicon.com',
    specialties: ['Dermatology', 'Plastic Surgery', 'Gastroenterology', 'Urology'],
    rating: 4.6,
    operatingHours: '24/7',
    facilities: ['OT Complex', 'Dialysis Unit', 'Endoscopy', 'CT Scan', 'MRI']
  },
  {
    id: 3,
    name: 'Care Hospitals Visakhapatnam',
    address: 'Ramnagar, Visakhapatnam, Andhra Pradesh 530002',
    location: 'Visakhapatnam',
    phone: '+91-891-6677777',
    email: 'info@carehospitals.com',
    specialties: ['Orthopedics', 'Joint Replacement', 'Sports Medicine', 'Physiotherapy'],
    rating: 4.7,
    operatingHours: '24/7',
    facilities: ['Arthroscopy Center', 'Joint Replacement Center', 'Physiotherapy', 'X-Ray', 'MRI']
  },
  // Vijayawada Clinics
  {
    id: 4,
    name: 'Manipal Hospitals Vijayawada',
    address: 'NH-5, Tadepalli, Vijayawada, Andhra Pradesh 522501',
    location: 'Vijayawada',
    phone: '+91-863-2344444',
    email: 'info@manipalhospitals.com',
    specialties: ['Gynecology', 'Obstetrics', 'Neonatology', 'Pediatrics'],
    rating: 4.7,
    operatingHours: '24/7',
    facilities: ['Maternity Ward', 'NICU', 'Labor Room', 'Ultrasound', 'Fetal Medicine']
  },
  {
    id: 5,
    name: 'Andhra Hospitals Vijayawada',
    address: 'Siddartha Nagar, Vijayawada, Andhra Pradesh 520010',
    location: 'Vijayawada',
    phone: '+91-866-2555555',
    email: 'info@andhrahospitals.com',
    specialties: ['Neurology', 'Neurosurgery', 'Stroke Care', 'Epilepsy Treatment'],
    rating: 4.8,
    operatingHours: '24/7',
    facilities: ['Neuro ICU', 'Stroke Unit', 'EEG Lab', 'CT Scan', 'MRI', 'Cath Lab']
  },
  {
    id: 6,
    name: 'Rainbow Children Hospital',
    address: 'Benz Circle, Vijayawada, Andhra Pradesh 520010',
    location: 'Vijayawada',
    phone: '+91-866-6677788',
    email: 'info@rainbowhospitals.com',
    specialties: ['Pediatrics', 'Pediatric Surgery', 'Child Development', 'Vaccination'],
    rating: 4.9,
    operatingHours: '24/7',
    facilities: ['Pediatric ICU', 'NICU', 'Play Therapy', 'Vaccination Center', 'Child Psychology']
  },
  // Guntur Clinics
  {
    id: 7,
    name: 'NRI Medical College Hospital',
    address: 'Chinakakani, Guntur, Andhra Pradesh 522503',
    location: 'Guntur',
    phone: '+91-863-2346666',
    email: 'info@nrimedical.com',
    specialties: ['General Medicine', 'Internal Medicine', 'Emergency Care', 'General Surgery'],
    rating: 4.5,
    operatingHours: '24/7',
    facilities: ['Emergency Room', 'ICU', 'Laboratory', 'Blood Bank', 'Pharmacy', 'Radiology']
  },
  {
    id: 8,
    name: 'LV Prasad Eye Institute',
    address: 'Kalluru, Guntur, Andhra Pradesh 522017',
    location: 'Guntur',
    phone: '+91-863-2555777',
    email: 'info@lvpei.org',
    specialties: ['Ophthalmology', 'Retina Care', 'Cornea Transplant', 'Pediatric Ophthalmology'],
    rating: 4.9,
    operatingHours: '8:00 AM - 6:00 PM',
    facilities: ['Eye Surgery Center', 'Retina Clinic', 'Contact Lens Clinic', 'Optical Shop']
  },
  // Tirupati Clinics
  {
    id: 9,
    name: 'SVIMS Tirupati',
    address: 'Alipiri Road, Tirupati, Andhra Pradesh 517507',
    location: 'Tirupati',
    phone: '+91-877-2287777',
    email: 'info@svims.gov.in',
    specialties: ['Cardiology', 'Cardiac Surgery', 'Interventional Cardiology', 'Heart Transplant'],
    rating: 4.8,
    operatingHours: '24/7',
    facilities: ['Cardiac Cath Lab', 'Heart Surgery', 'Cardiac ICU', 'Echo Lab', 'Stress Test Lab']
  },
  {
    id: 10,
    name: 'Apollo Reach Hospital',
    address: 'Chittoor Road, Tirupati, Andhra Pradesh 517501',
    location: 'Tirupati',
    phone: '+91-877-6677999',
    email: 'info@apolloreach.com',
    specialties: ['ENT', 'Head & Neck Surgery', 'Audiology', 'Speech Therapy'],
    rating: 4.6,
    operatingHours: '9:00 AM - 8:00 PM',
    facilities: ['ENT Surgery', 'Audiology Lab', 'Speech Therapy', 'Endoscopy']
  },
  // Kakinada Clinics
  {
    id: 11,
    name: 'Medicover Hospitals Kakinada',
    address: 'Sarpavaram Junction, Kakinada, Andhra Pradesh 533005',
    location: 'Kakinada',
    phone: '+91-884-2377777',
    email: 'info@medicoverkakinada.com',
    specialties: ['Gastroenterology', 'Hepatology', 'Endoscopy', 'Liver Transplant'],
    rating: 4.7,
    operatingHours: '24/7',
    facilities: ['Endoscopy Suite', 'Liver Clinic', 'Gastro ICU', 'Laboratory']
  },
  {
    id: 12,
    name: 'Government General Hospital Kakinada',
    address: 'Kakinada, Andhra Pradesh 533001',
    location: 'Kakinada',
    phone: '+91-884-2344555',
    email: 'info@gghkakinada.gov.in',
    specialties: ['Psychiatry', 'Mental Health', 'De-addiction', 'Counseling'],
    rating: 4.3,
    operatingHours: '24/7',
    facilities: ['Psychiatry Ward', 'Counseling Center', 'De-addiction Center', 'Emergency Psychiatry']
  },
  // Nellore Clinics
  {
    id: 13,
    name: 'Narayana Medical College',
    address: 'Chinthareddypalem, Nellore, Andhra Pradesh 524003',
    location: 'Nellore',
    phone: '+91-861-2317777',
    email: 'info@narayanamedical.com',
    specialties: ['Urology', 'Nephrology', 'Kidney Transplant', 'Dialysis'],
    rating: 4.6,
    operatingHours: '24/7',
    facilities: ['Dialysis Center', 'Urology Surgery', 'Kidney Transplant', 'Lithotripsy']
  },
  {
    id: 14,
    name: 'Apollo Hospitals Nellore',
    address: 'Pinakini Nagar, Nellore, Andhra Pradesh 524004',
    location: 'Nellore',
    phone: '+91-861-2555888',
    email: 'info@apollonellore.com',
    specialties: ['Radiology', 'Imaging', 'CT Scan', 'MRI', 'Mammography'],
    rating: 4.5,
    operatingHours: '24/7',
    facilities: ['CT Scan', 'MRI', 'Digital X-Ray', 'Ultrasound', 'Mammography']
  },
  // Kurnool Clinics
  {
    id: 15,
    name: 'Kurnool Medical College',
    address: 'Kurnool, Andhra Pradesh 518002',
    location: 'Kurnool',
    phone: '+91-8518-255777',
    email: 'info@kurnoolmedical.com',
    specialties: ['Oncology', 'Cancer Treatment', 'Chemotherapy', 'Radiation Therapy'],
    rating: 4.7,
    operatingHours: '24/7',
    facilities: ['Cancer Center', 'Chemotherapy Unit', 'Radiation Therapy', 'Oncology ICU']
  }
];

// Create or update clinic profile
exports.upsertClinic = async (req, res) => {
  try {
    const { name, address, location, phone, email, mission, facilities, services } = req.body;
    
    // Find existing clinic
    const existingIndex = clinics.findIndex(c => c.name === name && c.address === address);
    
    if (existingIndex !== -1) {
      // Update existing clinic
      clinics[existingIndex] = { ...clinics[existingIndex], name, address, location, phone, email, mission, facilities, services };
      res.json({ message: 'Clinic profile updated', clinic: clinics[existingIndex] });
    } else {
      // Create new clinic
      const newClinic = {
        id: clinics.length + 1,
        name,
        address,
        location,
        phone,
        email,
        mission,
        facilities,
        services,
        doctors: [],
        rating: 4.5,
        hours: 'Mon-Fri: 9AM-5PM'
      };
      clinics.push(newClinic);
      res.status(201).json({ message: 'Clinic profile created', clinic: newClinic });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all clinics
exports.getClinics = async (req, res) => {
  try {
    const { location } = req.query;
    let filteredClinics = clinics;
    
    if (location) {
      filteredClinics = filteredClinics.filter(clinic => 
        clinic.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    res.json(filteredClinics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get clinic by ID
exports.getClinicById = async (req, res) => {
  try {
    const clinic = clinics.find(c => c.id === parseInt(req.params.id));
    if (!clinic) return res.status(404).json({ error: 'Clinic not found' });
    res.json(clinic);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
