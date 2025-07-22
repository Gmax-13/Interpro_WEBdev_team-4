import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

// Default clinic images for fallback
const defaultClinicImages = [
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80'
];

function ClinicListPage() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/clinics')
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

  // Get all unique specializations
  const allSpecs = Array.from(new Set(clinics.flatMap(clinic => clinic.services || [])));

  // Filter clinics
  const filteredClinics = clinics.filter(clinic => {
    const matchesName = clinic.name?.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = !specialization || (clinic.services && clinic.services.includes(specialization));
    return matchesName && matchesSpec;
  });

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
        <Icon name="hospital" className="mr-2 text-pink-600" /> Clinics
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
            <option value="">All Services</option>
            {allSpecs.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClinics.map((clinic, idx) => (
          <div key={clinic._id} className="bg-white p-6 rounded shadow hover:shadow-lg cursor-pointer" onClick={() => navigate(`/clinics/${clinic._id}`)}>
            <div className="flex items-center mb-4">
              <img
                src={clinic.photo || defaultClinicImages[idx % defaultClinicImages.length]}
                alt="Clinic"
                className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-pink-500"
              />
              <div>
                <div className="font-semibold text-lg flex items-center">
                  <Icon name="hospital" className="mr-2 text-pink-600" />
                  {clinic.name}
                </div>
                <div className="text-gray-500 flex items-center">
                  <Icon name="map" className="mr-1 text-blue-600" />
                  {clinic.address}
                </div>
              </div>
            </div>
            <div className="text-gray-700 text-sm mb-2">{clinic.mission}</div>
            <div className="text-blue-600 underline flex items-center">
              <Icon name="calendar" className="mr-1" /> View Profile
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClinicListPage;
