import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { getUserLocation, initializeLeafletMap, addMarkersToLeafletMap, addUserLocationMarker, calculateDistance } from '../services/locationService';

function BookAppointmentPage() {
  const { doctorId, clinicId } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [step, setStep] = useState(1); // 1: Location, 2: Doctor Selection, 3: Appointment Details
  const [selectedLocation, setSelectedLocation] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [service, setService] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Andhra Pradesh locations
  const locations = [
    { id: 1, name: 'Visakhapatnam', area: 'Port City', coordinates: { lat: 17.6868, lng: 83.2185 } },
    { id: 2, name: 'Vijayawada', area: 'Business Capital', coordinates: { lat: 16.5062, lng: 80.6480 } },
    { id: 3, name: 'Guntur', area: 'Agricultural Hub', coordinates: { lat: 16.3067, lng: 80.4365 } },
    { id: 4, name: 'Tirupati', area: 'Temple City', coordinates: { lat: 13.6288, lng: 79.4192 } },
    { id: 5, name: 'Kakinada', area: 'Fertilizer City', coordinates: { lat: 16.9891, lng: 82.2475 } },
    { id: 6, name: 'Nellore', area: 'Rice Bowl', coordinates: { lat: 14.4426, lng: 79.9865 } },
    { id: 7, name: 'Kurnool', area: 'Gateway of Rayalaseema', coordinates: { lat: 15.8281, lng: 78.0373 } }
  ];

  // State to store doctors from backend
  const [allDoctors, setAllDoctors] = useState([]);
  const [allClinics, setAllClinics] = useState([]);

  // Load doctors and clinics from backend
  useEffect(() => {
    const loadDoctorsAndClinics = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Load doctors
        const doctorsRes = await fetch('http://localhost:5000/api/doctors', {
          headers: { 'Authorization': token }
        });
        if (doctorsRes.ok) {
          const doctorsData = await doctorsRes.json();
          setAllDoctors(doctorsData);
        }
        
        // Load clinics
        const clinicsRes = await fetch('http://localhost:5000/api/clinics', {
          headers: { 'Authorization': token }
        });
        if (clinicsRes.ok) {
          const clinicsData = await clinicsRes.json();
          setAllClinics(clinicsData);
        }
      } catch (error) {
        console.error('Failed to load doctors and clinics:', error);
        setError('Failed to load doctors and clinics');
      }
    };
    
    loadDoctorsAndClinics();
  }, []);

  useEffect(() => {
    // Get user location from localStorage
    const storedLocation = getUserLocation();
    if (storedLocation) {
      setUserLocation(storedLocation);
    }
    
    // If doctorId and clinicId are provided via URL params, skip to step 3
    if (doctorId && clinicId && allDoctors.length > 0) {
      const doctor = allDoctors.find(d => d.id === parseInt(doctorId));
      const clinic = allClinics.find(c => c.id === parseInt(clinicId));
      if (doctor && clinic) {
        setSelectedDoctor(doctor);
        setSelectedClinic(clinic);
        setStep(3);
      }
    }
  }, [doctorId, clinicId, allDoctors, allClinics]);

  // Initialize Leaflet Map when step 1 is active
  useEffect(() => {
    if (step === 1 && mapRef.current && !map) {
      const initMap = async () => {
        try {
          // Default center to Andhra Pradesh, India
          const defaultCenter = userLocation 
            ? [userLocation.latitude, userLocation.longitude]
            : [17.3850, 78.4867]; // Andhra Pradesh coordinates
          
          const leafletMap = await initializeLeafletMap('leaflet-map', defaultCenter, 8);
          setMap(leafletMap);
          
          // Add clinic/hospital markers from our Andhra Pradesh data
          const mapLocations = locations.map(loc => ({
            ...loc,
            lat: loc.coordinates ? loc.coordinates.lat : 17.3850 + (Math.random() - 0.5) * 2,
            lng: loc.coordinates ? loc.coordinates.lng : 78.4867 + (Math.random() - 0.5) * 2,
            type: 'hospital',
            address: loc.area || 'Andhra Pradesh, India',
            phone: '+91-XXX-XXXXXXX',
            specialties: ['General Medicine', 'Emergency Care']
          }));
          
          // Set up global function for marker clicks
          window.selectLocation = (locationName) => {
            handleLocationSelect(locationName);
          };
          
          addMarkersToLeafletMap(leafletMap, mapLocations, (location) => {
            console.log('Location selected:', location.name);
          });
          
          // Add user location marker if available
          if (userLocation) {
            addUserLocationMarker(leafletMap, userLocation);
          }
          
        } catch (error) {
          console.error('Failed to initialize Leaflet Map:', error);
        }
      };
      
      // Wait for Leaflet library to load
      if (window.L) {
        initMap();
      } else {
        const checkLeaflet = setInterval(() => {
          if (window.L) {
            clearInterval(checkLeaflet);
            initMap();
          }
        }, 100);
        
        // Clear interval after 10 seconds to prevent infinite checking
        setTimeout(() => clearInterval(checkLeaflet), 10000);
      }
    }
  }, [step, map, userLocation]);

  useEffect(() => {
    if (selectedLocation && allDoctors.length > 0) {
      const filteredDoctors = allDoctors.filter(doctor => doctor.location === selectedLocation);
      setDoctors(filteredDoctors);
    }
  }, [selectedLocation, allDoctors]);

  useEffect(() => {
    if (date && selectedDoctor) {
      // Generate available slots for the selected date
      const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
      ];
      setSlots(timeSlots);
    }
  }, [date, selectedDoctor]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setStep(2);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedClinic(doctor.clinic);
    setStep(3);
  };

  const addNotification = (appointmentData) => {
    // Add notification to localStorage for demonstration
    const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const newNotification = {
      id: Date.now(),
      title: 'Appointment Booked Successfully',
      message: `Your appointment with ${appointmentData.doctorName} has been scheduled for ${appointmentData.date} at ${appointmentData.time}.`,
      type: 'success',
      time: 'Just now',
      timestamp: new Date(),
      read: false,
      actionable: true,
      action: {
        type: 'view_appointment',
        label: 'View Details',
        data: { appointmentId: appointmentData.id }
      }
    };
    existingNotifications.unshift(newNotification);
    localStorage.setItem('notifications', JSON.stringify(existingNotifications));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const appointmentData = {
        doctor: selectedDoctor.id,
        clinic: selectedClinic.id,
        date,
        timeSlot: selectedSlot,
        service: service || 'General Consultation',
        notes: notes || '',
        patientName: 'Patient', // This should come from user profile
        doctorName: selectedDoctor.name,
        clinicName: selectedClinic.name,
        patientPhone: 'N/A' // This should come from user profile
      };

      const response = await fetch('http://localhost:5000/api/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(appointmentData)
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(`Appointment booked successfully with ${selectedDoctor.name} at ${selectedClinic.name}!`);
        
        // Create notification for successful booking
        try {
          await fetch('http://localhost:5000/api/notifications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            },
            body: JSON.stringify({
              message: `Your appointment with ${selectedDoctor.name} on ${new Date(date).toLocaleDateString()} at ${selectedSlot} has been requested and is pending confirmation.`,
              type: 'appointment_requested'
            })
          });
        } catch (notifError) {
          console.warn('Failed to create notification:', notifError);
        }
        
        setTimeout(() => navigate('/dashboard'), 3000);
      } else {
        setError(result.error || 'Failed to book appointment');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((stepNum) => (
        <div key={stepNum} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {stepNum}
          </div>
          {stepNum < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderLocationStep = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Icon name="map-marker" className="mr-2 text-blue-500" />
        Select Your Location
      </h3>
      
      {/* Leaflet Map Integration */}
      <div className="mb-6">
        <div 
          id="leaflet-map" 
          ref={mapRef}
          className="w-full h-96 rounded-lg border border-gray-300"
          style={{ minHeight: '400px' }}
        >
          {!map && (
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
              <div className="text-center">
                <Icon name="map" className="text-gray-400 text-4xl mb-2" />
                <p className="text-gray-600">Loading Interactive Map...</p>
                <p className="text-sm text-gray-500 mt-2">Please wait while we load the map with Andhra Pradesh locations</p>
              </div>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Click on map markers to select a location, or choose from the Andhra Pradesh locations below
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((location) => (
          <button
            key={location.id}
            onClick={() => handleLocationSelect(location.name)}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
          >
            <div className="flex items-center mb-2">
              <Icon name="map-marker" className="text-blue-500 mr-2" />
              <h4 className="font-semibold">{location.name}</h4>
            </div>
            <p className="text-gray-600 text-sm">{location.area}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderDoctorStep = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          <Icon name="user-md" className="mr-2 text-blue-500" />
          Available Doctors in {selectedLocation}
        </h3>
        <button
          onClick={() => setStep(1)}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <Icon name="arrow-left" className="mr-1" />
          Change Location
        </button>
      </div>
      
      <div className="space-y-4">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
            onClick={() => handleDoctorSelect(doctor)}
          >
            <div className="flex items-start">
              <div className="bg-gray-200 rounded-full p-3 mr-4">
                <Icon name="user-md" className="text-gray-600 text-xl" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{doctor.name}</h4>
                <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <Icon name="star" className="text-yellow-500 mr-1" />
                  <span className="mr-4">{doctor.rating}</span>
                  <Icon name="clock" className="mr-1" />
                  <span className="mr-4">{doctor.experience}</span>
                  <Icon name="hospital" className="mr-1" />
                  <span>{doctor.clinic.name}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{doctor.clinic.address}</p>
              </div>
              <Icon name="chevron-right" className="text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppointmentStep = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          <Icon name="calendar" className="mr-2 text-blue-500" />
          Book Appointment
        </h3>
        <button
          onClick={() => setStep(2)}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <Icon name="arrow-left" className="mr-1" />
          Change Doctor
        </button>
      </div>
      
      {/* Selected Doctor Info */}
      {selectedDoctor && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="bg-blue-200 rounded-full p-3 mr-4">
              <Icon name="user-md" className="text-blue-600 text-xl" />
            </div>
            <div>
              <h4 className="font-semibold">{selectedDoctor.name}</h4>
              <p className="text-blue-600">{selectedDoctor.specialty}</p>
              <p className="text-sm text-gray-600">{selectedClinic.name}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <Icon name="exclamation-triangle" className="mr-2" />
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <Icon name="check-circle" className="mr-2" />
            {success}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Icon name="calendar" className="mr-2" />
            Appointment Date
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        
        {date && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Icon name="clock" className="mr-2" />
              Available Time Slots
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {slots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                    selectedSlot === slot
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Icon name="stethoscope" className="mr-2" />
            Service Type (Optional)
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="">Select a service</option>
            <option value="consultation">General Consultation</option>
            <option value="checkup">Regular Checkup</option>
            <option value="follow-up">Follow-up Visit</option>
            <option value="emergency">Emergency Consultation</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Icon name="file-alt" className="mr-2" />
            Additional Notes (Optional)
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any specific concerns or requirements..."
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !selectedSlot}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Icon name="spinner" className="mr-2 animate-spin" />
              Booking Appointment...
            </>
          ) : (
            <>
              <Icon name="calendar-check" className="mr-2" />
              Confirm Booking
            </>
          )}
        </button>
      </form>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
        <p className="text-gray-600">Find and book appointments with healthcare providers near you</p>
      </div>
      
      {renderStepIndicator()}
      
      {step === 1 && renderLocationStep()}
      {step === 2 && renderDoctorStep()}
      {step === 3 && renderAppointmentStep()}
    </div>
  );
}

export default BookAppointmentPage;
