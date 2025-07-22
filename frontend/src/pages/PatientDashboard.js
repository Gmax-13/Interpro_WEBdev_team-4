import React, { useEffect, useState } from 'react';
import Icon from '../components/Icon';

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');

  useEffect(() => {
    fetch('/api/appointments/patient', {
      headers: { 'Authorization': localStorage.getItem('token') }
    })
      .then(res => res.json())
      .then(data => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load appointments');
        setLoading(false);
      });
  }, [cancelSuccess]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    setError('');
    setCancelSuccess('');
    try {
      const res = await fetch(`/api/appointments/cancel/${id}`, {
        method: 'PATCH',
        headers: { 'Authorization': localStorage.getItem('token') }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Cancel failed');
      setCancelSuccess('Appointment cancelled');
    } catch (err) {
      setError(err.message);
    }
  };

  // Profile state (placeholder, not persisted)
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [profileEdit, setProfileEdit] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Simulate loading user info from localStorage or API
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    setProfile({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
  }, []);

  const handleProfileChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setProfileEdit(false);
      setProfileMsg('Profile updated successfully');
      // Update localStorage user if present
      const user = JSON.parse(localStorage.getItem('user')) || {};
      localStorage.setItem('user', JSON.stringify({ ...user, ...profile }));
      setTimeout(() => setProfileMsg(''), 1200);
    } catch (err) {
      setProfileMsg(err.message);
    }
  };


  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
        <Icon name="calendar" className="mr-2 text-blue-500" /> My Appointments
      </h2>

      {/* Profile section */}
      <div className="bg-white rounded shadow p-4 mb-8">
        <div className="flex items-center mb-4">
          <Icon name="user-circle" className="mr-2 text-purple-500 text-xl" />
          <span className="font-semibold text-lg">My Profile</span>
        </div>
        {profileEdit ? (
          <form className="space-y-2" onSubmit={handleProfileSave}>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input name="name" className="border rounded p-2 w-full" value={profile.name} onChange={handleProfileChange} />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input name="email" className="border rounded p-2 w-full" value={profile.email} onChange={handleProfileChange} />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input name="phone" className="border rounded p-2 w-full" value={profile.phone} onChange={handleProfileChange} />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded mt-2">Save</button>
            <button type="button" className="ml-2 text-gray-500" onClick={() => setProfileEdit(false)}>Cancel</button>
          </form>
        ) : (
          <div>
            <div><strong>Name:</strong> {profile.name}</div>
            <div><strong>Email:</strong> {profile.email}</div>
            <div><strong>Phone:</strong> {profile.phone}</div>
            <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setProfileEdit(true)}>
              <Icon name="edit" className="mr-1" /> Edit Profile
            </button>
            {profileMsg && <div className="text-green-600 mt-2">{profileMsg}</div>}
          </div>
        )}
      </div>

      {/* Notifications section */}
      <NotificationsSection />

      {/* Appointments section */}
      <div>
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Icon name="calendar-check" className="mr-2 text-green-500" /> Upcoming & Past Appointments
        </h3>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : (
          <div className="space-y-4">
            {cancelSuccess && <div className="text-green-600 mb-2">{cancelSuccess}</div>}
            {appointments.length === 0 && <div>No appointments found.</div>}
            {appointments.map(appt => (
              <div key={appt._id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold flex items-center mb-1">
                    <Icon name="doctor" className="mr-2 text-purple-500" />
                    {appt.doctor?.user?.name || 'Doctor'}
                    <span className="ml-2 text-sm text-gray-500">({appt.doctor?.specializations?.join(', ')})</span>
                  </div>
                  <div className="text-sm text-gray-600 flex items-center mb-1">
                    <Icon name="hospital" className="mr-2 text-pink-500" />
                    {appt.clinic?.name} ({appt.clinic?.address})
                  </div>
                  <div className="text-sm text-gray-600 flex items-center mb-1">
                    <Icon name="calendar" className="mr-2 text-blue-500" />
                    {new Date(appt.date).toLocaleDateString()} {appt.timeSlot}
                  </div>
                  {appt.service && (
                    <div className="text-sm text-gray-600 flex items-center mb-1">
                      <Icon name="notes-medical" className="mr-2 text-green-500" />
                      {appt.service}
                    </div>
                  )}
                  {appt.notes && (
                    <div className="text-sm text-gray-600 flex items-center mb-1">
                      <Icon name="file-alt" className="mr-2 text-yellow-500" />
                      {appt.notes}
                    </div>
                  )}
                  <div className="text-xs text-gray-400">Status: {appt.status}</div>
                </div>
                {appt.status === 'booked' && (
                  <button
                    className="mt-4 md:mt-0 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                    onClick={() => handleCancel(appt._id)}
                  >
                    <Icon name="calendar-times" className="mr-1" /> Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;
