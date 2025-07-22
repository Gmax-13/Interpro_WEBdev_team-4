import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/doctors', {
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Doctors loaded:', data);
        setDoctors(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading doctors:', err);
        setError('Failed to load doctors: ' + err.message);
        setLoading(false);
      });
  }, []);

  // Get all unique specializations
  const allSpecs = Array.from(new Set(doctors.map(doc => doc.specialty).filter(Boolean)));

  // Filter doctors
  const filteredDoctors = doctors.filter(doc => {
    const matchesName = doc.name?.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = !specialization || doc.specialty === specialization;
    return matchesName && matchesSpec;
  });

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
        <Icon name="user-md" className="mr-2 text-blue-600" /> Doctors
      </h2>
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        <div className="flex items-center mb-2 md:mb-0">
          <Icon name="search" className="mr-1 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name"
            className="border rounded px-3 py-1 w-48"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <Icon name="filter" className="mr-1 text-gray-500" />
          <select
            className="border rounded px-3 py-1 w-48"
            value={specialization}
            onChange={e => setSpecialization(e.target.value)}
          >
            <option value="">All Specializations</option>
            {allSpecs.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((doc) => (
          <div key={doc.id} className="bg-white p-6 rounded shadow hover:shadow-lg cursor-pointer" onClick={() => navigate(`/doctors/${doc.id}`)}>
            <div className="flex items-center mb-4">
              <img
                src={doc.photo || '/api/placeholder/150/150'}
                alt="Doctor"
                className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-blue-500"
              />
              <div>
                <div className="font-semibold text-lg flex items-center">
                  <Icon name="user-md" className="mr-2 text-blue-500" />
                  {doc.name}
                </div>
                <div className="text-gray-500 flex items-center">
                  <Icon name="stethoscope" className="mr-1 text-green-600" />
                  {doc.specialty}
                </div>
              </div>
            </div>
            <div className="text-gray-700 text-sm mb-2">{doc.bio}</div>
            <div className="flex items-center mb-2">
              <Icon name="star" className="text-yellow-400 mr-1" />
              <span>{doc.rating}</span>
            </div>
            <div className="text-blue-600 underline flex items-center">
              <Icon name="calendar" className="mr-1" /> View Profile
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorListPage;
