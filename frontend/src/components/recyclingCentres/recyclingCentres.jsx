

import React, { useState, useEffect } from 'react';
import { useFormContext } from '../FormContext/FormContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

const RecyclingCenters = () => {
  const { user } = useFormContext();
  const navigate = useNavigate();
  const [recyclingCenters, setRecyclingCenters] = useState([
    {
      id: 1,
      name: "Green Earth Recycling Center",
      address: "123 Main Street, Downtown",
      phone: "+1-555-0123",
      email: "info@greenearth.com",
      hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM",
      services: ["Electronics", "Batteries", "Appliances"],
      coordinates: { lat: 40.7128, lng: -74.0060 },
      distance: "0.5 km"
    },
    {
      id: 2,
      name: "EcoTech Solutions",
      address: "456 Oak Avenue, Westside",
      phone: "+1-555-0456",
      email: "contact@ecotech.com",
      hours: "Mon-Sat: 9AM-7PM",
      services: ["Mobile Phones", "Computers", "TVs"],
      coordinates: { lat: 40.7589, lng: -73.9851 },
      distance: "1.2 km"
    },
    {
      id: 3,
      name: "Sustainable Waste Management",
      address: "789 Pine Street, Eastside",
      phone: "+1-555-0789",
      email: "hello@sustainable.com",
      hours: "Mon-Fri: 7AM-5PM",
      services: ["All E-Waste", "Bulk Items", "Corporate"],
      coordinates: { lat: 40.7505, lng: -73.9934 },
      distance: "2.1 km"
    }
  ]);

  const [selectedCenter, setSelectedCenter] = useState(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const handleSchedulePickup = (center) => {
    setSelectedCenter(center);
    setShowScheduleForm(true);
  };

  const closeScheduleForm = () => {
    setShowScheduleForm(false);
    setSelectedCenter(null);
  };

  const goToPickupForm = (center) => {
    // Store selected center in localStorage so ImageUpload can access it
    localStorage.setItem('selectedCenter', JSON.stringify(center));
    navigate('/image-upload');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recycling Centers</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.username || 'User'}! Find nearby recycling centers and schedule pickups.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/image-upload"
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Schedule New Pickup
            </Link>
            <Link
              to="/tracker"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Track My Pickups
            </Link>
          </div>
        </div>

        {/* Recycling Centers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {recyclingCenters.map((center) => (
            <div key={center.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{center.name}</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {center.distance}
                  </span>
                </div>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{center.address}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{center.phone}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{center.hours}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {center.services.map((service, idx) => (
                      <span key={idx} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => goToPickupForm(center)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Schedule Pickup
                  </button>
                  <button
                    onClick={() => window.open(`https://maps.google.com/?q=${center.address}`, '_blank')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Directions
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Schedule Pickup Modal */}
        {showScheduleForm && selectedCenter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Schedule Pickup at {selectedCenter.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Center Details</label>
                  <p className="text-sm text-gray-600">{selectedCenter.address}</p>
                  <p className="text-sm text-gray-600">{selectedCenter.phone}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Operating Hours</label>
                  <p className="text-sm text-gray-600">{selectedCenter.hours}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Services Offered</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedCenter.services.map((service, idx) => (
                      <span key={idx} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => goToPickupForm(selectedCenter)}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Go to Pickup Form
                </button>
                <button
                  onClick={closeScheduleForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecyclingCenters;









