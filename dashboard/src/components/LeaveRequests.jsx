import React, { useState, useEffect } from 'react';
import { leaveRequestsData, LEAVE_COLORS } from '../data/hostelData';
import PieChartComponent from './charts/PieChart';
import dataService from '../services/dataService';

const LeaveRequests = ({ currentUser }) => {
  const [leaves, setLeaves] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [formData, setFormData] = useState({
    student: '',
    room: '',
    startDate: '',
    endDate: '',
    reason: '',
    requestType: 'leave', // 'leave' or 'outing'
    // Outing-specific fields
    outTime: '',
    expectedReturn: '',
    destination: '',
    purpose: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const isStudent = currentUser?.role === 'Student';
  
  // Load data from service
  useEffect(() => {
    loadData();
    
    // Subscribe to data changes
    const handleDataUpdate = () => {
      loadData();
    };
    
    dataService.subscribe('leaveRequests', handleDataUpdate);
    dataService.subscribe('outingPasses', handleDataUpdate);
    
    return () => {
      dataService.unsubscribe('leaveRequests', handleDataUpdate);
      dataService.unsubscribe('outingPasses', handleDataUpdate);
    };
  }, [currentUser]);
  
  const loadData = () => {
    const leaveRequests = dataService.getLeaveRequests(currentUser?.role, currentUser?.id);
    const outingPasses = dataService.getOutingPasses(currentUser?.role, currentUser?.id);
    
    // Combine and sort by creation date
    const allRequests = [...leaveRequests, ...outingPasses].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    setLeaves(allRequests);
  };
  
  // Pre-fill form for students
  useEffect(() => {
    if (isStudent && currentUser) {
      setFormData(prev => ({
        ...prev,
        student: currentUser.name,
        room: currentUser.roomNumber || '',
      }));
    }
  }, [isStudent, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      if (formData.requestType === 'outing') {
        const passData = {
          student: formData.student,
          room: formData.room,
          outDate: formData.startDate,
          outTime: formData.outTime,
          expectedReturn: formData.expectedReturn,
          destination: formData.destination,
          purpose: formData.purpose
        };
        
        // Validate data
        const validationErrors = dataService.validateOutingPass(passData);
        if (validationErrors.length > 0) {
          setError(validationErrors.join(', '));
          return;
        }
        
        dataService.createOutingPass(passData);
        setSuccess('Outing pass request submitted successfully!');
      } else {
        const requestData = {
          student: formData.student,
          room: formData.room,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason
        };
        
        // Validate data
        const validationErrors = dataService.validateLeaveRequest(requestData);
        if (validationErrors.length > 0) {
          setError(validationErrors.join(', '));
          return;
        }
        
        dataService.createLeaveRequest(requestData);
        setSuccess('Leave request submitted successfully!');
      }
      
      // Reset form
      setFormData({
        student: isStudent ? currentUser.name : '',
        room: isStudent ? currentUser.roomNumber || '' : '',
        startDate: '',
        endDate: '',
        reason: '',
        requestType: 'leave',
        outTime: '',
        expectedReturn: '',
        destination: '',
        purpose: '',
      });
      
      // Auto-hide success message and form
      setTimeout(() => {
        setSuccess('');
        setShowForm(false);
      }, 2000);
      
    } catch (error) {
      setError('Failed to submit request. Please try again.');
    }
  };

  const handleStatusChange = (id, status, approver = null) => {
    try {
      // Find the request to determine type
      const request = leaves.find(item => item.id === id);
      if (!request) return;
      
      const updates = {
        status,
        processedBy: status === 'Approved' ? (approver || currentUser?.name) : currentUser?.name
      };
      
      // Update in data service based on type
      if (request.type === 'outing' || request.outDate) {
        dataService.updateOutingPass(id, updates);
      } else {
        dataService.updateLeaveRequest(id, updates);
      }
      
      setSuccess(`Request ${status.toLowerCase()} successfully!`);
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      setError('Failed to update request status. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Filter by tab
  const getFilteredByTab = (data) => {
    switch (activeTab) {
      case 'leaves':
        return data.filter(item => item.type === 'leave' || (!item.type && item.startDate));
      case 'outing':
        return data.filter(item => item.type === 'outing' || item.outDate);
      default:
        return data;
    }
  };

  // Filter by student if needed
  let displayLeaves = leaves;
  if (isStudent && currentUser) {
    displayLeaves = leaves.filter(leave => leave.student === currentUser.name);
  }
  
  // Apply tab filter
  displayLeaves = getFilteredByTab(displayLeaves);
  
  // Apply search filter
  const filteredLeaves = displayLeaves.filter(leave => 
    leave.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (leave.destination && leave.destination.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderRequestRow = (request) => {
    const isOutingPass = request.type === 'outing' || request.outDate;
    
    return (
      <tr key={request.id}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {request.student}
          {isOutingPass && <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Outing</span>}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.room}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {isOutingPass 
            ? `${request.outDate} (${request.outTime} - ${request.expectedReturn})`
            : `${request.startDate} to ${request.endDate}`
          }
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {isOutingPass ? request.destination : request.reason?.substring(0, 30) + '...'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${request.status === 'Approved' ? 'bg-green-100 text-green-800' : 
              request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'}`}>
            {request.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {!isStudent && request.status === 'Pending' && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleStatusChange(request.id, 'Approved', currentUser?.name)}
                className="text-green-600 hover:text-green-900 font-medium"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusChange(request.id, 'Rejected')}
                className="text-red-600 hover:text-red-900 font-medium"
              >
                Reject
              </button>
            </div>
          )}
          {(isStudent || request.status !== 'Pending') && (
            <span className="text-gray-400">
              {request.approvedBy && `Approved by ${request.approvedBy}`}
            </span>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          {isStudent ? 'My Requests & Passes' : 'Leave Requests & Outing Passes'}
        </h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              setFormData(prev => ({...prev, requestType: 'leave'}));
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            Apply for Leave
          </button>
          <button 
            onClick={() => {
              setFormData(prev => ({...prev, requestType: 'outing'}));
              setShowForm(true);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
          >
            Apply for Outing Pass
          </button>
        </div>
      </div>
      
      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Success: </strong>
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 border-b">
            {['all', 'leaves', 'outing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 text-sm font-medium rounded-t-lg ${
                  activeTab === tab
                    ? 'bg-indigo-100 text-indigo-700 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'all' ? 'All Requests' : tab === 'leaves' ? 'Leave Requests' : 'Outing Passes'}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex justify-between items-center mb-4">
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
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-gray-50 p-6 rounded-md mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-700">
                  {formData.requestType === 'outing' ? 'Apply for Outing Pass' : 'Apply for Leave'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                    <input
                      type="text"
                      name="student"
                      value={formData.student}
                      onChange={handleChange}
                      disabled={isStudent}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                    <input
                      type="text"
                      name="room"
                      value={formData.room}
                      onChange={handleChange}
                      disabled={isStudent}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {formData.requestType === 'outing' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Out Time</label>
                        <input
                          type="time"
                          name="outTime"
                          value={formData.outTime}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expected Return</label>
                        <input
                          type="time"
                          name="expectedReturn"
                          value={formData.expectedReturn}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                        <input
                          type="text"
                          name="destination"
                          value={formData.destination}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                        <textarea
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleChange}
                          required
                          rows="2"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </>
                  )}
                </div>
                
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Submit {formData.requestType === 'outing' ? 'Outing Pass Request' : 'Leave Request'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates/Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeaves.length > 0 ? (
                  filteredLeaves.map(renderRequestRow)
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Request Statistics</h2>
          <PieChartComponent data={leaveRequestsData} colors={LEAVE_COLORS} />
          
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">Quick Guidelines</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="p-3 bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-800">Leave Requests</h4>
                <p>For overnight stays outside hostel</p>
              </div>
              <div className="p-3 bg-green-50 rounded-md">
                <h4 className="font-medium text-green-800">Outing Passes</h4>
                <p>For day trips returning same day</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequests;
