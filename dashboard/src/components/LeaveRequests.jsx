import React, { useState } from 'react';
import { leaveRequestsData, recentLeaves, LEAVE_COLORS } from '../data/hostelData';
import PieChartComponent from './charts/PieChart';

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState(recentLeaves);
  const [formData, setFormData] = useState({
    student: '',
    room: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newLeave = {
      id: leaves.length + 1,
      student: formData.student,
      room: formData.room,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    
    setLeaves([newLeave, ...leaves]);
    setFormData({
      student: '',
      room: '',
      startDate: '',
      endDate: '',
      reason: '',
    });
    
    setShowForm(false);
  };

  const handleStatusChange = (id, status) => {
    const updatedLeaves = leaves.map(leave => 
      leave.id === id ? { ...leave, status } : leave
    );
    setLeaves(updatedLeaves);
  };

  const filteredLeaves = leaves.filter(leave => 
    leave.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Leave Requests</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">All Leave Requests</h2>
            <div className="flex space-x-2">
              <div className="relative">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search requests..."
                  className="pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="absolute left-3 top-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <button 
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {showForm ? 'Cancel' : 'New Request'}
              </button>
            </div>
          </div>

          {showForm && (
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h3 className="font-medium text-gray-700 mb-3">Create New Leave Request</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                    <input
                      type="text"
                      name="student"
                      value={formData.student}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                    <input
                      type="text"
                      name="room"
                      value={formData.room}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    ></textarea>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    className="ml-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeaves.length > 0 ? (
                  filteredLeaves.map((leave) => (
                    <tr key={leave.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{leave.student}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.room}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.startDate} to {leave.endDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${leave.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                            leave.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {leave.status === 'Pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusChange(leave.id, 'Approved')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(leave.id, 'Rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {leave.status !== 'Pending' && (
                          <span className="text-gray-400">No actions available</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No leave requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Leave Requests Status</h2>
          <PieChartComponent data={leaveRequestsData} colors={LEAVE_COLORS} />
          
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">Leave Policy</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Students are allowed 10 days of leave per semester.</li>
              <li>Weekend leaves are not counted in the semester quota.</li>
              <li>Medical leaves require documentation from a registered doctor.</li>
              <li>Leave requests must be submitted at least 24 hours in advance.</li>
              <li>Emergency leaves can be approved by the warden directly.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequests;