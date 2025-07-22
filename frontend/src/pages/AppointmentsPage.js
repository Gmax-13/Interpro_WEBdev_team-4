import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

function AppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      // Mock data - replace with actual API call
      const mockAppointments = [
        {
          id: 1,
          doctorName: 'Dr. Sarah Smith',
          specialty: 'Cardiologist',
          clinicName: 'City Medical Center',
          clinicAddress: '123 Main St, City Center',
          date: '2025-07-20',
          time: '10:00 AM',
          status: 'confirmed',
          type: 'consultation',
          notes: 'Regular checkup'
        },
        {
          id: 2,
          doctorName: 'Dr. Michael Johnson',
          specialty: 'Dermatologist',
          clinicName: 'Health Plus Clinic',
          clinicAddress: '456 Oak Ave, Downtown',
          date: '2025-07-22',
          time: '2:30 PM',
          status: 'pending',
          type: 'follow-up',
          notes: 'Skin condition follow-up'
        },
        {
          id: 3,
          doctorName: 'Dr. Emily Davis',
          specialty: 'General Practitioner',
          clinicName: 'Family Health Center',
          clinicAddress: '789 Pine St, Suburbs',
          date: '2025-07-15',
          time: '9:00 AM',
          status: 'completed',
          type: 'consultation',
          notes: 'Annual physical exam'
        },
        {
          id: 4,
          doctorName: 'Dr. Robert Wilson',
          specialty: 'Orthopedist',
          clinicName: 'Sports Medicine Clinic',
          clinicAddress: '321 Elm St, Medical District',
          date: '2025-07-25',
          time: '11:15 AM',
          status: 'cancelled',
          type: 'consultation',
          notes: 'Knee pain evaluation'
        }
      ];

      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    
    switch (filter) {
      case 'upcoming':
        return appointmentDate >= today && appointment.status !== 'cancelled';
      case 'past':
        return appointmentDate < today || appointment.status === 'completed';
      case 'cancelled':
        return appointment.status === 'cancelled';
      default:
        return true;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
        )
      );
    }
  };

  const handleRescheduleAppointment = (appointmentId) => {
    // Navigate to reschedule page or show modal
    alert('Reschedule functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading appointments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="mr-4 p-2 hover:bg-gray-100 rounded"
          >
            <Icon name="arrow-left" className="text-gray-600" />
          </button>
          <h2 className="text-3xl font-bold flex items-center">
            <Icon name="calendar" className="mr-2 text-blue-500" />
            My Appointments
          </h2>
        </div>
        <button 
          onClick={() => navigate('/book-appointment')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Icon name="plus" className="mr-2" />
          Book New Appointment
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b">
          {[
            { key: 'all', label: 'All Appointments', count: appointments.length },
            { key: 'upcoming', label: 'Upcoming', count: appointments.filter(a => new Date(a.date) >= new Date() && a.status !== 'cancelled').length },
            { key: 'past', label: 'Past', count: appointments.filter(a => new Date(a.date) < new Date() || a.status === 'completed').length },
            { key: 'cancelled', label: 'Cancelled', count: appointments.filter(a => a.status === 'cancelled').length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                filter === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(appointment => (
            <div key={appointment.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 mr-3">
                      {appointment.doctorName}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <div className="flex items-center mb-1">
                        <Icon name="user-md" className="mr-2 text-gray-400" />
                        <span>{appointment.specialty}</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <Icon name="calendar" className="mr-2 text-gray-400" />
                        <span>{appointment.date} at {appointment.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Icon name="tag" className="mr-2 text-gray-400" />
                        <span className="capitalize">{appointment.type}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-1">
                        <Icon name="hospital" className="mr-2 text-gray-400" />
                        <span>{appointment.clinicName}</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <Icon name="map-marker" className="mr-2 text-gray-400" />
                        <span>{appointment.clinicAddress}</span>
                      </div>
                      {appointment.notes && (
                        <div className="flex items-center">
                          <Icon name="note" className="mr-2 text-gray-400" />
                          <span>{appointment.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {appointment.status === 'confirmed' || appointment.status === 'pending' ? (
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => handleRescheduleAppointment(appointment.id)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Icon name="calendar" className="text-gray-300 text-6xl mb-4 mx-auto" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You don't have any appointments scheduled yet."
                : `No ${filter} appointments found.`
              }
            </p>
            <button 
              onClick={() => navigate('/book-appointment')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Book Your First Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentsPage;
