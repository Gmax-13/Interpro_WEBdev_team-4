import React, { useEffect, useState } from 'react';
import Icon from '../components/Icon';

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    loadDoctorData();
    loadAppointments();
    loadNotifications();
  }, []);

  const loadDoctorData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { 'Authorization': token }
      });
      const data = await res.json();
      if (res.ok) {
        setDoctorInfo(data.user);
      }
    } catch (err) {
      console.error('Failed to load doctor info:', err);
    }
  };

  const loadAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/appointments/doctor', {
        headers: { 'Authorization': token }
      });
      const data = await res.json();
      if (res.ok) {
        const pending = data.filter(apt => apt.status === 'pending');
        const confirmed = data.filter(apt => apt.status === 'confirmed' || apt.status === 'completed');
        setPendingAppointments(pending);
        setConfirmedAppointments(confirmed);
        setAppointments(data);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load appointments');
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/notifications', {
        headers: { 'Authorization': token }
      });
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.slice(0, 5)); // Show latest 5 notifications
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const handleAppointmentAction = async (appointmentId, action, rescheduleData = null) => {
    try {
      const token = localStorage.getItem('token');
      const url = `http://localhost:5000/api/appointments/${appointmentId}/${action}`;
      const body = action === 'reschedule' ? rescheduleData : {};
      
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        loadAppointments();
        loadNotifications();
        setRescheduleModal(null);
        setNewDate('');
        setNewTime('');
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to update appointment');
      }
    } catch (err) {
      setError('Failed to update appointment');
    }
  };

  const openRescheduleModal = (appointment) => {
    setRescheduleModal(appointment);
    setNewDate(appointment.date.split('T')[0]);
    setNewTime(appointment.timeSlot);
  };

  const handleReschedule = () => {
    if (!newDate || !newTime) {
      setError('Please select both date and time');
      return;
    }
    
    handleAppointmentAction(rescheduleModal.id, 'reschedule', {
      date: newDate,
      timeSlot: newTime
    });
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Doctor Info Header */}
      {doctorInfo && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, Dr. {doctorInfo.name}</h1>
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center">
                  <Icon name="id-card" className="mr-2" />
                  <span>Employee ID: {doctorInfo.employeeNumber}</span>
                </div>
                <div className="flex items-center">
                  <Icon name="stethoscope" className="mr-2" />
                  <span>{doctorInfo.specialty}</span>
                </div>
                <div className="flex items-center">
                  <Icon name="user-md" className="mr-2" />
                  <span>{doctorInfo.qualification}</span>
                </div>
                <div className="flex items-center">
                  <Icon name="clock" className="mr-2" />
                  <span>{doctorInfo.experience} years exp.</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{pendingAppointments.length}</div>
              <div className="text-blue-100">Pending Requests</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Icon name="clock" className="text-orange-500 text-2xl mr-3" />
            <div>
              <div className="text-2xl font-bold text-orange-600">{pendingAppointments.length}</div>
              <div className="text-gray-600">Pending</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Icon name="check-circle" className="text-green-500 text-2xl mr-3" />
            <div>
              <div className="text-2xl font-bold text-green-600">{confirmedAppointments.length}</div>
              <div className="text-gray-600">Confirmed</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Icon name="calendar" className="text-blue-500 text-2xl mr-3" />
            <div>
              <div className="text-2xl font-bold text-blue-600">{appointments.length}</div>
              <div className="text-gray-600">Total</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Icon name="bell" className="text-purple-500 text-2xl mr-3" />
            <div>
              <div className="text-2xl font-bold text-purple-600">{notifications.length}</div>
              <div className="text-gray-600">Notifications</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon name="clock" className="mr-2" />
              Pending Requests ({pendingAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('confirmed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'confirmed'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon name="check-circle" className="mr-2" />
              Confirmed Appointments ({confirmedAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon name="bell" className="mr-2" />
              Notifications ({notifications.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <Icon name="spinner" className="text-4xl text-gray-400 animate-spin mb-4" />
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : (
            <>
              {/* Pending Appointments Tab */}
              {activeTab === 'pending' && (
                <div>
                  {pendingAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Icon name="calendar-times" className="text-6xl text-gray-300 mb-4" />
                      <p className="text-gray-600">No pending appointment requests</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingAppointments.map(appt => (
                        <div key={appt.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <Icon name="user" className="mr-2 text-blue-600" />
                                <span className="font-semibold text-lg">{appt.patientName}</span>
                                <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                  PENDING
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Icon name="calendar" className="mr-2 text-green-600" />
                                  <span>{new Date(appt.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center">
                                  <Icon name="clock" className="mr-2 text-blue-600" />
                                  <span>{appt.timeSlot}</span>
                                </div>
                                <div className="flex items-center">
                                  <Icon name="hospital" className="mr-2 text-purple-600" />
                                  <span>{appt.clinicName}</span>
                                </div>
                                <div className="flex items-center">
                                  <Icon name="phone" className="mr-2 text-gray-600" />
                                  <span>{appt.patientPhone || 'N/A'}</span>
                                </div>
                              </div>
                              {appt.notes && (
                                <div className="mt-2 flex items-start">
                                  <Icon name="file-alt" className="mr-2 text-yellow-600 mt-1" />
                                  <span className="text-sm text-gray-700">{appt.notes}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col space-y-2 ml-4">
                              <button
                                onClick={() => handleAppointmentAction(appt.id, 'confirm')}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                              >
                                <Icon name="check" className="mr-1" /> Accept
                              </button>
                              <button
                                onClick={() => openRescheduleModal(appt)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                              >
                                <Icon name="calendar-alt" className="mr-1" /> Reschedule
                              </button>
                              <button
                                onClick={() => handleAppointmentAction(appt.id, 'reject')}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
                              >
                                <Icon name="times" className="mr-1" /> Decline
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Confirmed Appointments Tab */}
              {activeTab === 'confirmed' && (
                <div>
                  {confirmedAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Icon name="calendar-check" className="text-6xl text-gray-300 mb-4" />
                      <p className="text-gray-600">No confirmed appointments</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {confirmedAppointments.map(appt => (
                        <div key={appt.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <Icon name="user" className="mr-2 text-blue-600" />
                                <span className="font-semibold text-lg">{appt.patientName}</span>
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  {appt.status.toUpperCase()}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Icon name="calendar" className="mr-2 text-green-600" />
                                  <span>{new Date(appt.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center">
                                  <Icon name="clock" className="mr-2 text-blue-600" />
                                  <span>{appt.timeSlot}</span>
                                </div>
                                <div className="flex items-center">
                                  <Icon name="hospital" className="mr-2 text-purple-600" />
                                  <span>{appt.clinicName}</span>
                                </div>
                                <div className="flex items-center">
                                  <Icon name="phone" className="mr-2 text-gray-600" />
                                  <span>{appt.patientPhone || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2 ml-4">
                              {appt.status === 'confirmed' && (
                                <>
                                  <button
                                    onClick={() => openRescheduleModal(appt)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                                  >
                                    <Icon name="calendar-alt" className="mr-1" /> Reschedule
                                  </button>
                                  <button
                                    onClick={() => handleAppointmentAction(appt.id, 'complete')}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                                  >
                                    <Icon name="check-circle" className="mr-1" /> Complete
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  {notifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Icon name="bell-slash" className="text-6xl text-gray-300 mb-4" />
                      <p className="text-gray-600">No notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map(notification => (
                        <div key={notification.id} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                          <div className="flex items-start">
                            <Icon name="bell" className="mr-3 text-purple-600 mt-1" />
                            <div className="flex-1">
                              <p className="text-gray-800">{notification.message}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Icon name="calendar-alt" className="mr-2 text-blue-600" />
              Reschedule Appointment
            </h3>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Patient: {rescheduleModal.patientName}</p>
              <p className="text-gray-600 mb-4">Current: {new Date(rescheduleModal.date).toLocaleDateString()} at {rescheduleModal.timeSlot}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Time</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Time</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setRescheduleModal(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
