import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

function RegisterPage() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'patient', 
    phone: '',
    specialty: '',
    qualification: '',
    experience: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const specialties = [
    'General Medicine',
    'Cardiology',
    'Dermatology',
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'Neurology',
    'Psychiatry',
    'Ophthalmology',
    'ENT',
    'Dentistry',
    'Radiology',
    'Anesthesiology',
    'Emergency Medicine',
    'Internal Medicine'
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate doctor-specific fields
    if (form.role === 'doctor') {
      if (!form.specialty || !form.qualification || !form.experience) {
        setError('Please fill in all doctor-specific fields (specialty, qualification, experience)');
        return;
      }
    }
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Registration successful! Please check your email for welcome message. Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center">{success}</div>}
        <div className="relative mb-4">
          <span className="absolute left-3 top-3 text-gray-400">
            <Icon name="user" />
          </span>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-2 pl-10 border rounded"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="relative mb-4">
          <span className="absolute left-3 top-3 text-gray-400">
            <Icon name="email" />
          </span>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 pl-10 border rounded"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="relative mb-4">
          <span className="absolute left-3 top-3 text-gray-400">
            <Icon name="lock" />
          </span>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 pl-10 border rounded"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="relative mb-4">
          <span className="absolute left-3 top-3 text-gray-400">
            <Icon name="phone" />
          </span>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="w-full p-2 pl-10 border rounded"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        <div className="relative mb-4">
          <span className="absolute left-3 top-3 text-gray-400">
            <Icon name="user" />
          </span>
          <select
            name="role"
            className="w-full p-2 pl-10 border rounded"
            value={form.role}
            onChange={handleChange}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>
        
        {/* Doctor-specific fields */}
        {form.role === 'doctor' && (
          <>
            <div className="relative mb-4">
              <span className="absolute left-3 top-3 text-gray-400">
                <Icon name="stethoscope" />
              </span>
              <select
                name="specialty"
                className="w-full p-2 pl-10 border rounded"
                value={form.specialty}
                onChange={handleChange}
                required
              >
                <option value="">Select Specialty</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
            
            <div className="relative mb-4">
              <span className="absolute left-3 top-3 text-gray-400">
                <Icon name="user-md" />
              </span>
              <input
                type="text"
                name="qualification"
                placeholder="Qualification (e.g., MBBS, MD)"
                className="w-full p-2 pl-10 border rounded"
                value={form.qualification}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="relative mb-4">
              <span className="absolute left-3 top-3 text-gray-400">
                <Icon name="clock" />
              </span>
              <input
                type="text"
                name="experience"
                placeholder="Years of Experience"
                className="w-full p-2 pl-10 border rounded"
                value={form.experience}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 flex items-center justify-center">
          <Icon name="login" className="mr-2" /> Register
        </button>
        <div className="mt-4 text-center">
          <span>Already have an account? </span>
          <button type="button" className="text-blue-600 underline flex items-center justify-center" onClick={() => navigate('/login')}>
            <Icon name="user" className="mr-1" /> Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
