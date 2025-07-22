import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Icon from '../components/Icon';

const defaultClinicImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=400&q=80',
];

function ClinicProfilePage() {
  const { id } = useParams();
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/api/clinics/${id}`)
      .then(res => res.json())
      .then(data => {
        setClinic(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load clinic profile');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!clinic) return <div className="text-center mt-10">Clinic not found</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded shadow mt-10">
      <div className="flex items-center mb-6">
        <img
          src={clinic.photo || defaultClinicImages[0]}
          alt="Clinic"
          className="w-24 h-24 rounded-full mr-6 object-cover border-2 border-pink-500"
        />
        <div>
          <div className="font-bold text-2xl mb-1 flex items-center">
            <Icon name="hospital" className="mr-2 text-pink-600" />
            {clinic.name}
          </div>
          <div className="text-gray-500 mb-2 flex items-center">
            <Icon name="map" className="mr-1 text-blue-600" />
            {clinic.address}
          </div>
          <div className="mt-2">
            {/* Google Map Embed */}
            <GoogleMapEmbed address={clinic.address} height={200} />
          </div>
          <div className="text-gray-700 mb-2">{clinic.mission}</div>
          <div className="mb-2 flex items-center">
            <Icon name="user" className="mr-1 text-purple-500" />
            <strong>Facilities:</strong> {clinic.facilities?.join(', ')}
          </div>
          <div className="mb-2 flex items-center">
            <Icon name="phone" className="mr-1 text-green-600" />
            <strong>Contact:</strong> {clinic.phone} | <Icon name="email" className="ml-2 mr-1 text-blue-500" /> {clinic.email}
          </div>
          {/* Map integration and Google Maps API can be added here */}
        </div>
      </div>
      <div className="mb-4 flex items-center">
        <Icon name="doctor" className="mr-2 text-blue-500" />
        <strong>Doctors:</strong>
        <ul className="list-disc ml-6">
          {clinic.doctors?.map(doc => (
            <li key={doc._id} className="flex items-center justify-between mb-2">
              <span>{doc.user?.name} ({doc.specializations?.join(', ')})</span>
              <button
                className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                onClick={() => navigate(`/book-appointment/${doc._id}/${clinic._id}`)}
              >
                <Icon name="calendar-plus" className="mr-1" /> Book Appointment
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4 flex items-center">
        <Icon name="stethoscope" className="mr-2 text-green-600" />
        <strong>Services:</strong> {clinic.services?.join(', ')}
      </div>
    </div>
  );
}

export default ClinicProfilePage;
