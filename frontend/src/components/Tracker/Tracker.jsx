import React, { useEffect, useState } from 'react';
import { useFormContext } from '../FormContext/FormContext.jsx';

const Tracker = () => {
  const { formSubmissions, user } = useFormContext();
  const [filterStatus, setFilterStatus] = useState('all');
  const [serverSubmissions, setServerSubmissions] = useState([]);

  // Load persisted pickups for this user
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://localhost:5001/api/pickups/mine', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setServerSubmissions(
            data.map((p) => ({
              date: p.date,
              time: p.time,
              address: p.address,
              wasteType: p.wasteType,
              instructions: p.instructions,
              status: p.status,
            }))
          );
        }
      } catch (e) {
        // ignore
      }
    };
    load();
  }, []);

  const userSubmissions = [...serverSubmissions, ...formSubmissions.filter(s => s.detected)];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (submission, index) => submission.status || 'Scheduled';

  const filteredSubmissions = filterStatus === 'all' 
    ? userSubmissions 
    : userSubmissions.filter(submission => {
        const status = getStatusText(submission, userSubmissions.indexOf(submission));
        return status.toLowerCase().includes(filterStatus.toLowerCase());
      });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pickup Tracker</h1>
          <p className="mt-2 text-gray-600">
            Track the status of your e-waste pickup requests, {user?.username || 'User'}.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-semibold text-gray-900">{userSubmissions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userSubmissions.filter((_, index) => getStatusText(_, index) === 'Pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userSubmissions.filter((_, index) => getStatusText(_, index) === 'In Progress').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userSubmissions.filter((_, index) => getStatusText(_, index) === 'Completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Pickup Requests List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Your Pickup Requests</h2>
          </div>
          
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No pickup requests</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filterStatus === 'all' 
                  ? "You haven't scheduled any pickups yet." 
                  : `No ${filterStatus} pickup requests found.`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredSubmissions.map((submission, index) => {
                const status = getStatusText(submission, userSubmissions.indexOf(submission));
                return (
                  <div key={index} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status.toLowerCase())}`}>
                          {status}
                        </span>
                        <span className="text-sm text-gray-500">Request #{index + 1}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {submission.date} at {submission.time}
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Pickup Details</h4>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p><span className="font-medium">Date:</span> {submission.date}</p>
                          <p><span className="font-medium">Time:</span> {submission.time}</p>
                          <p><span className="font-medium">Waste Type:</span> {submission.wasteType || 'Not specified'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Location</h4>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p>{submission.address}</p>
                          {submission.instructions && (
                            <p><span className="font-medium">Instructions:</span> {submission.instructions}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {submission.image && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">E-Waste Image</h4>
                        <img
                          src={URL.createObjectURL(submission.image)}
                          alt="E-Waste"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Status Timeline */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Status Timeline</h4>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="ml-2 text-sm text-gray-600">Request Submitted</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-300"></div>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${status === 'Scheduled' || status === 'In Progress' || status === 'Completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="ml-2 text-sm text-gray-600">Scheduled</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-300"></div>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${status === 'In Progress' || status === 'Completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="ml-2 text-sm text-gray-600">In Progress</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-gray-300"></div>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${status === 'Completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="ml-2 text-sm text-gray-600">Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tracker;
  