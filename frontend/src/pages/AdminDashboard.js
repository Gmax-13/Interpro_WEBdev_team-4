import React, { useEffect, useState } from 'react';
import Icon from '../components/Icon';

function AdminDashboard() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/clinics', {
      headers: { 'Authorization': localStorage.getItem('token') }
    })
      .then(res => res.json())
      .then(data => {
        setClinics(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load clinics');
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
        <Icon name="hospital" className="mr-2 text-pink-600" /> Admin Dashboard
      </h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : clinics.length === 0 ? (
        <div>No clinics found.</div>
      ) : (
        <div className="space-y-6">
          {clinics.map(clinic => (
            <div key={clinic._id} className="bg-white rounded shadow p-4">
              <div className="flex items-center mb-2">
                <Icon name="hospital" className="mr-2 text-pink-600" />
                <span className="font-semibold text-lg">{clinic.name}</span>
                <span className="ml-4 text-sm text-gray-500">{clinic.address}</span>
              </div>
              <div className="mb-2"><strong>Doctors:</strong> {clinic.doctors?.map(doc => doc.user?.name).join(', ')}</div>
              <div className="mb-2"><strong>Services:</strong> {clinic.services?.join(', ')}</div>
              <div className="mb-2"><strong>Appointments:</strong> {clinic.appointmentsCount || 0}</div>
              {/* Management actions */}
              <div className="mt-4 flex flex-col md:flex-row md:space-x-4">
                <button className="bg-green-500 text-white px-3 py-1 rounded mb-2 md:mb-0" onClick={() => alert('Add Doctor - implement modal or form')}>Add Doctor</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded mb-2 md:mb-0" onClick={() => alert('Remove Doctor - implement modal or form')}>Remove Doctor</button>
                <button className="bg-blue-500 text-white px-3 py-1 rounded mb-2 md:mb-0" onClick={() => alert('Manage Services - implement modal or form')}>Manage Services</button>
              </div>
              {/* Appointment analytics */}
              <div className="mt-4">
                <strong>Analytics:</strong>
                <div>Total Appointments: {clinic.appointmentsCount || 0}</div>
                {/* For real analytics, add charts or more detailed stats here */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
