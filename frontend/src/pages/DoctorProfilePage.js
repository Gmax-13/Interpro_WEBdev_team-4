import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Icon from '../components/Icon';

const defaultDoctorImages = [
  'https://images.unsplash.com/photo-1511174511562-5f97f4f4e8a0?auto=format&fit=facearea&w=400&h=400',
  'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=facearea&w=400&h=400',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=facearea&w=400&h=400',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=400&h=400',
];

function DoctorProfilePage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/api/doctors/${id}`)
      .then(res => res.json())
      .then(data => {
        setDoctor(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load doctor profile');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!doctor) return <div className="text-center mt-10">Doctor not found</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded shadow mt-10">
      <div className="flex items-center mb-6">
        <img
          src={doctor.photo || defaultDoctorImages[0]}
          alt="Doctor"
          className="w-24 h-24 rounded-full mr-6 object-cover border-2 border-blue-500"
        />
        <div>
          <div className="font-bold text-2xl flex items-center">
            <Icon name="user" className="mr-2 text-blue-500" />
            {doctor.user?.name}
          </div>
          <div className="text-gray-500 mb-2 flex items-center">
            <Icon name="stethoscope" className="mr-1 text-green-600" />
            {doctor.specializations?.join(', ')}
          </div>
          <div className="text-gray-700 flex items-center">
            <Icon name="star" className="mr-1 text-yellow-400" /> 4.8 &nbsp;
            <Icon name="calendar" className="mr-1 text-blue-500" /> Experience: {doctor.experience} years
          </div>
          <div className="text-gray-700 flex items-center">
            <Icon name="user" className="mr-1 text-purple-500" /> Qualifications: {doctor.qualifications?.join(', ')}
          </div>
        </div>
      </div>
      <div className="mb-4 flex items-center">
        <Icon name="user" className="mr-2 text-gray-500" />
        <strong>Bio:</strong> {doctor.bio}
      </div>
      <div className="mb-4 flex items-center">
        <Icon name="stethoscope" className="mr-2 text-green-600" />
        <strong>Services:</strong> {doctor.services?.join(', ')}
      </div>
      <div className="mb-4">
        <strong>Clinics:</strong>
        <ul className="list-disc ml-6">
          {doctor.clinics?.map(clinic => (
            <li key={clinic._id} className="flex items-center justify-between mb-2">
              <span>{clinic.name} ({clinic.address})</span>
              <button
                className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                onClick={() => navigate(`/book-appointment/${doctor._id}/${clinic._id}`)}
              >
                <Icon name="calendar-plus" className="mr-1" /> Book Appointment
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Add reviews, contact info, map, etc. here */}
    </div>
  );
}

export default DoctorProfilePage;
