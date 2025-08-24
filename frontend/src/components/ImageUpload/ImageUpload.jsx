
import React, { useState, useContext, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormContext } from '../FormContext/FormContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ImageUpload = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    address: '',
    instructions: '',
    wasteType: '',
    image: null,
    detected: false,
    selectedCenter: null
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [mlResult, setMlResult] = useState(null);
  const { addFormSubmission } = useFormContext();
  const navigate = useNavigate();

  // Optional: fallback centers if user lands here directly without selecting one
  const availableCenters = [
    {
      id: 1,
      name: 'Green Earth Recycling Center',
      address: '123 Main Street, Downtown',
      phone: '+1-555-0123',
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM',
      services: ['Electronics', 'Batteries', 'Appliances'],
    },
    {
      id: 2,
      name: 'EcoTech Solutions',
      address: '456 Oak Avenue, Westside',
      phone: '+1-555-0456',
      hours: 'Mon-Sat: 9AM-7PM',
      services: ['Mobile Phones', 'Computers', 'TVs'],
    },
    {
      id: 3,
      name: 'Sustainable Waste Management',
      address: '789 Pine Street, Eastside',
      phone: '+1-555-0789',
      hours: 'Mon-Fri: 7AM-5PM',
      services: ['All E-Waste', 'Bulk Items', 'Corporate'],
    },
  ];

  // Get selected center from localStorage
  useEffect(() => {
    const selectedCenter = localStorage.getItem('selectedCenter');
    if (selectedCenter) {
      setFormData(prev => ({
        ...prev,
        selectedCenter: JSON.parse(selectedCenter)
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.selectedCenter) {
      toast.error('Please select a recycling center first!');
      return;
    }

    if (!formData.image) {
      toast.error('Please upload an image of your e-waste!');
      return;
    }

    setIsProcessing(true);
    setMlResult(null);

    try {
      // Step 1: Upload image to ML model for e-waste detection
      const formDataToSend = new FormData();
      formDataToSend.append('file', formData.image);

      const mlResponse = await axios.post('http://localhost:5002/uploads', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const detected = mlResponse.data.detected;
      setMlResult({ detected, message: mlResponse.data.message });

      if (detected) {
        // Step 2: If e-waste detected, schedule the pickup in backend
        try {
          const token = localStorage.getItem('token');
          const res = await fetch('http://localhost:5001/api/pickups', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
              center: {
                id: formData.selectedCenter.id,
                name: formData.selectedCenter.name,
                address: formData.selectedCenter.address,
                phone: formData.selectedCenter.phone,
              },
              date: formData.date,
              time: formData.time,
              address: formData.address,
              wasteType: formData.wasteType,
              instructions: formData.instructions,
            }),
          });
          if (!res.ok) {
            throw new Error('Failed to create pickup');
          }
        } catch (e) {
          console.error(e);
        }

        // Also keep local state list for UI continuity
        const pickupData = {
          ...formData,
          detected: true,
          center: formData.selectedCenter,
          status: 'scheduled',
          timestamp: new Date().toISOString(),
        };

        addFormSubmission(pickupData);
        
        toast.success('E-waste detected! Pickup scheduled successfully.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Clear localStorage and redirect to tracker
        localStorage.removeItem('selectedCenter');
        setTimeout(() => {
          navigate('/tracker');
        }, 2000);
      } else {
        toast.error('No e-waste detected. Please upload a valid e-waste image.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Error processing request:', error);
      toast.error('Failed to process request. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const goBackToCenters = () => {
    localStorage.removeItem('selectedCenter');
    navigate('/recycling-centers');
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6 bg-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-10 rounded-lg shadow-lg max-w-6xl">
        <div className="flex flex-col justify-center">
          <div className="flex justify-center mb-6">
            <img
              src="recycling.webp"
              alt="E-Waste Management"
              className="w-3/4 h-auto max-w-md rounded-lg shadow-lg"
            />
          </div>
          
          {formData.selectedCenter && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Selected Center</h3>
              <p className="text-blue-700 font-medium">{formData.selectedCenter.name}</p>
              <p className="text-blue-600 text-sm">{formData.selectedCenter.address}</p>
              <p className="text-blue-600 text-sm">{formData.selectedCenter.phone}</p>
            </div>
          )}

          <h2 className="text-2xl font-semibold text-orange-800 mb-4 text-center">
            Schedule E-Waste Pickup
          </h2>
          <p className="text-gray-700 text-center">
            Please fill out the form to schedule a pickup for your e-waste. 
            Upload a clear image of the items you want to dispose of.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-300 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {!formData.selectedCenter && (
              <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200">
                <p className="text-sm text-yellow-800 mb-2">No recycling center selected. Choose one to enable scheduling:</p>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
                  value={''}
                  onChange={(e) => {
                    const picked = availableCenters.find(c => String(c.id) === e.target.value);
                    if (picked) {
                      setFormData(prev => ({ ...prev, selectedCenter: picked }));
                      localStorage.setItem('selectedCenter', JSON.stringify(picked));
                    }
                  }}
                >
                  <option value="" disabled>Select a recycling center</option>
                  {availableCenters.map(center => (
                    <option key={center.id} value={center.id}>
                      {center.name} — {center.address}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-orange-800">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-800">
                Time *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-800">
                Pickup Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your pickup address"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-800">
                Type of E-Waste
              </label>
              <input
                type="text"
                name="wasteType"
                value={formData.wasteType}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="E.g., Batteries, Appliances, Electronics"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-800">
                Additional Instructions
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Add any special instructions here"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-800">
                Upload E-Waste Image *
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">
                Please upload a clear image of your e-waste items
              </p>
            </div>

            {/* ML Result Display */}
            {mlResult && (
              <div className={`p-3 rounded-lg ${
                mlResult.detected 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}>
                <p className="font-medium">
                  {mlResult.detected ? '✅ E-Waste Detected!' : '❌ No E-Waste Detected'}
                </p>
                <p className="text-sm">{mlResult.message}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={goBackToCenters}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back to Centers
              </button>
              <button
                type="submit"
                disabled={isProcessing || !formData.selectedCenter}
                className="flex-1 bg-orange-800 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Schedule Pickup'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ImageUpload;
