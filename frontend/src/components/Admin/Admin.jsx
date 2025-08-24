

// import React, { useContext, useState } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import { FormContext } from '../FormContext/FormContext';
// import 'react-toastify/dist/ReactToastify.css';

// const Admin = () => {
//   const { formSubmissions, setFormSubmissions } = useContext(FormContext);
//   const [checkedSubmissions, setCheckedSubmissions] = useState([]);

//   const handleCheckboxChange = (index) => {
//     const newCheckedSubmissions = [...checkedSubmissions];
//     if (newCheckedSubmissions.includes(index)) {
//       newCheckedSubmissions.splice(newCheckedSubmissions.indexOf(index), 1);
//     } else {
//       newCheckedSubmissions.push(index);
//       toast.success('Request completed successfully!', {
//         position: 'top-right',
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     }
//     setCheckedSubmissions(newCheckedSubmissions);
//     const updatedFormSubmissions = formSubmissions.filter(
//       (_, i) => !newCheckedSubmissions.includes(i)
//     );
//     setFormSubmissions(updatedFormSubmissions);
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-center mb-6 text-orange-800">Admin Dashboard</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {formSubmissions.map((submission, index) => (
//           <div key={index} className="bg-white p-6 rounded-lg shadow-md relative">
//             <div className="flex justify-between items-start">
//               <p className="text-gray-700">Date: {submission.date}</p>
//               <p className="text-gray-700">Time: {submission.time}</p>
//             </div>
//             <p className="text-gray-700 mb-2">Address: {submission.address}</p>
//             <p className="text-gray-700">Waste Type: {submission.wasteType}</p>
//             <p className="text-gray-700 mb-2">Instructions: {submission.instructions}</p>
//             {submission.image && (
//               <img
//                 src={URL.createObjectURL(submission.image)}
//                 alt="Uploaded E-Waste"
//                 className="mt-2 w-full h-40 object-cover rounded-lg"
//               />
//             )}

//             <div className="flex items-center mt-4">
//               <input
//                 type="checkbox"
//                 onChange={() => handleCheckboxChange(index)}
//                 className="mr-2"
//               />
//               <label className="text-sm text-gray-600">Mark as completed</label>
//             </div>
//           </div>
//         ))}
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Admin;

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useFormContext } from '../FormContext/FormContext.jsx';
import 'react-toastify/dist/ReactToastify.css';

const CenterSummary = () => {
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5001/api/pickups/summary/by-center', {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        });
        if (res.ok) setRows(await res.json());
      } catch {}
    };
    load();
  }, []);
  if (rows.length === 0) return null;
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Requests by Center</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((r, idx) => (
          <div key={idx} className="border rounded p-4 bg-gray-50">
            <div className="font-semibold text-gray-900">{r.center?.name || r._id}</div>
            <div className="text-sm text-gray-600">{r.center?.address}</div>
            <div className="mt-3 flex gap-3 text-sm">
              <span className="bg-gray-200 px-2 py-0.5 rounded">Total: {r.total}</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Scheduled: {r.scheduled}</span>
              <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded">In Progress: {r.in_progress}</span>
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">Completed: {r.completed}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Admin = () => {
  const { formSubmissions } = useFormContext();
  const [activeTab, setActiveTab] = useState('pickups');
  const [completedPickups, setCompletedPickups] = useState([]);
  const [recyclingCenters, setRecyclingCenters] = useState([
    {
      id: 1,
      name: "Green Earth Recycling Center",
      address: "123 Main Street, Downtown",
      phone: "+1-555-0123",
      email: "info@greenearth.com",
      hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM",
      services: ["Electronics", "Batteries", "Appliances"],
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 2,
      name: "EcoTech Solutions",
      address: "456 Oak Avenue, Westside",
      phone: "+1-555-0456",
      email: "contact@ecotech.com",
      hours: "Mon-Sat: 9AM-7PM",
      services: ["Mobile Phones", "Computers", "TVs"],
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    {
      id: 3,
      name: "Sustainable Waste Management",
      address: "789 Pine Street, Eastside",
      phone: "+1-555-0789",
      email: "hello@sustainable.com",
      hours: "Mon-Fri: 7AM-5PM",
      services: ["All E-Waste", "Bulk Items", "Corporate"],
      coordinates: { lat: 40.7505, lng: -73.9934 }
    }
  ]);

  // Load persisted pickups for admin
  const [scheduledPickups, setScheduledPickups] = useState([]);

  React.useEffect(() => {
    const fetchPickups = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5001/api/pickups', {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        });
        if (res.ok) {
          const data = await res.json();
          setScheduledPickups(
            data.map((p, idx) => ({
              id: p._id || idx + 1,
              user: p.user?.username || `User_${idx + 1}`,
              center: p.center,
              date: p.date,
              time: p.time,
              address: p.address,
              wasteType: p.wasteType,
              instructions: p.instructions,
              status: p.status || 'scheduled',
              slot: `${p.date} at ${p.time}`,
            }))
          );
        }
      } catch (e) {
        console.error('Failed to load pickups', e);
      }
    };
    fetchPickups();
  }, []);

  const handleMarkCompleted = (pickupId) => {
    setCompletedPickups(prev => [...prev, pickupId]);
    toast.success('Pickup marked as completed!');
  };

  const addRecyclingCenter = (newCenter) => {
    setRecyclingCenters(prev => [...prev, { ...newCenter, id: Date.now() }]);
    toast.success('Recycling center added successfully!');
  };

  const deleteRecyclingCenter = (id) => {
    setRecyclingCenters(prev => prev.filter(center => center.id !== id));
    toast.success('Recycling center deleted successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Monitor scheduled pickups and manage recycling centers</p>
        </div>

        {/* Center Summary */}
        <CenterSummary />

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('pickups')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pickups'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Scheduled Pickups ({scheduledPickups.length})
            </button>
            <button
              onClick={() => setActiveTab('centers')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'centers'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Recycling Centers ({recyclingCenters.length})
            </button>
          </nav>
        </div>

        {/* Scheduled Pickups Tab */}
        {activeTab === 'pickups' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Scheduled Pickups</h2>
              {scheduledPickups.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No scheduled pickups yet</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {scheduledPickups.map((pickup) => (
                    <div key={pickup.id} className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pickup.status)}`}>
                            {pickup.status === 'completed' ? 'Completed' : 'Scheduled'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">#{pickup.id}</span>
                      </div>
                      
                      {/* User and Center Information */}
                      <div className="space-y-2 text-sm mb-3">
                        <div className="flex justify-between">
                          <span className="font-medium">User:</span>
                          <span className="text-blue-600">{pickup.user}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Center:</span>
                          <span className="text-green-600">{pickup.center.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Time Slot:</span>
                          <span className="text-orange-600">{pickup.slot}</span>
                        </div>
                      </div>
                      
                      {/* Pickup Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Waste Type:</span>
                          <span>{pickup.wasteType || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Address:</span>
                          <span className="text-gray-600">{pickup.address}</span>
                        </div>
                      </div>
                      
                      {pickup.instructions && (
                        <div className="mt-3">
                          <p className="text-sm"><span className="font-medium">Instructions:</span></p>
                          <p className="text-sm text-gray-600">{pickup.instructions}</p>
                        </div>
                      )}

                      {/* Center Contact Info */}
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs font-medium text-blue-800 mb-1">Center Contact:</p>
                        <p className="text-xs text-blue-700">{pickup.center.phone}</p>
                        <p className="text-xs text-blue-700">{pickup.center.address}</p>
              </div>

                      {pickup.image && (
                        <div className="mt-3">
                          <img
                            src={URL.createObjectURL(pickup.image)}
                            alt="E-Waste Image"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-2">
                        <select
                          value={pickup.status}
                          onChange={async (e) => {
                            const next = e.target.value;
                            try {
                              const token = localStorage.getItem('token');
                              await fetch(`http://localhost:5001/api/pickups/${pickup.id}/status`, {
                                method: 'PATCH',
                                headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: token ? `Bearer ${token}` : '',
                                },
                                body: JSON.stringify({ status: next }),
                              });
                            } catch {}
                            setScheduledPickups((prev) => prev.map((p) => (p.id === pickup.id ? { ...p, status: next } : p)));
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recycling Centers Tab */}
        {activeTab === 'centers' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recycling Centers</h2>
                <button
                  onClick={() => {
                    const name = prompt('Enter center name:');
                    const address = prompt('Enter address:');
                    const phone = prompt('Enter phone:');
                    if (name && address && phone) {
                      addRecyclingCenter({
                        name,
                        address,
                        phone,
                        email: prompt('Enter email:') || '',
                        hours: prompt('Enter hours:') || 'Mon-Fri: 9AM-5PM',
                        services: prompt('Enter services (comma-separated):')?.split(',') || ['General E-Waste'],
                        coordinates: { lat: 40.7128, lng: -74.0060 }
                      });
                    }
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Add New Center
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {recyclingCenters.map((center) => (
                  <div key={center.id} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{center.name}</h3>
                      <button
                        onClick={() => deleteRecyclingCenter(center.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Address:</span> {center.address}</p>
                      <p><span className="font-medium">Phone:</span> {center.phone}</p>
                      {center.email && <p><span className="font-medium">Email:</span> {center.email}</p>}
                      <p><span className="font-medium">Hours:</span> {center.hours}</p>
                      <p><span className="font-medium">Services:</span></p>
                      <div className="flex flex-wrap gap-1">
                        {center.services.map((service, idx) => (
                          <span key={idx} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Admin;
