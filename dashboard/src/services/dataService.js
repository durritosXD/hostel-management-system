// Centralized Data Service for Hostel Management System
// This service manages all data operations and provides real-time updates

import { 
  recentLeaves, 
  recentMissingItems, 
  outingPasses, 
  enhancedMissingItems,
  mockUsers 
} from '../data/hostelData.js';

class DataService {
  constructor() {
    // Initialize data stores
    this.leaveRequests = [...recentLeaves];
    this.outingPasses = [...outingPasses];
    this.missingItems = [...enhancedMissingItems];
    this.users = [...mockUsers];
    
    // Event listeners for real-time updates
    this.listeners = {
      leaveRequests: [],
      outingPasses: [],
      missingItems: [],
      users: []
    };
  }

  // Event subscription methods
  subscribe(dataType, callback) {
    if (this.listeners[dataType]) {
      this.listeners[dataType].push(callback);
    }
  }

  unsubscribe(dataType, callback) {
    if (this.listeners[dataType]) {
      this.listeners[dataType] = this.listeners[dataType].filter(cb => cb !== callback);
    }
  }

  // Notify listeners of data changes
  notifyListeners(dataType) {
    if (this.listeners[dataType]) {
      this.listeners[dataType].forEach(callback => callback());
    }
  }

  // Leave Request Operations
  getLeaveRequests(userRole = null, userId = null) {
    if (userRole === 'Student' && userId) {
      return this.leaveRequests.filter(request => 
        this.getUserByName(request.student)?.id === userId
      );
    }
    return [...this.leaveRequests];
  }

  createLeaveRequest(requestData) {
    const newRequest = {
      id: this.generateId(this.leaveRequests),
      ...requestData,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      type: 'leave'
    };
    
    this.leaveRequests.unshift(newRequest);
    this.notifyListeners('leaveRequests');
    return newRequest;
  }

  updateLeaveRequest(id, updates) {
    const index = this.leaveRequests.findIndex(request => request.id === id);
    if (index !== -1) {
      this.leaveRequests[index] = { ...this.leaveRequests[index], ...updates };
      
      // Add approval details if status is being updated
      if (updates.status && updates.status !== 'Pending') {
        this.leaveRequests[index].processedAt = new Date().toISOString();
        if (updates.processedBy) {
          this.leaveRequests[index].processedBy = updates.processedBy;
        }
      }
      
      this.notifyListeners('leaveRequests');
      return this.leaveRequests[index];
    }
    return null;
  }

  // Outing Pass Operations
  getOutingPasses(userRole = null, userId = null) {
    if (userRole === 'Student' && userId) {
      return this.outingPasses.filter(pass => 
        this.getUserByName(pass.student)?.id === userId
      );
    }
    return [...this.outingPasses];
  }

  createOutingPass(passData) {
    const newPass = {
      id: this.generateId(this.outingPasses),
      ...passData,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      type: 'outing'
    };
    
    this.outingPasses.unshift(newPass);
    this.notifyListeners('outingPasses');
    return newPass;
  }

  updateOutingPass(id, updates) {
    const index = this.outingPasses.findIndex(pass => pass.id === id);
    if (index !== -1) {
      this.outingPasses[index] = { ...this.outingPasses[index], ...updates };
      
      // Add approval details if status is being updated
      if (updates.status && updates.status !== 'Pending') {
        this.outingPasses[index].processedAt = new Date().toISOString();
        if (updates.processedBy) {
          this.outingPasses[index].processedBy = updates.processedBy;
        }
      }
      
      this.notifyListeners('outingPasses');
      return this.outingPasses[index];
    }
    return null;
  }

  // Missing Items Operations
  getMissingItems(userRole = null, userId = null) {
    if (userRole === 'Student' && userId) {
      return this.missingItems.filter(item => 
        this.getUserByName(item.student)?.id === userId
      );
    }
    return [...this.missingItems];
  }

  createMissingItemReport(itemData) {
    const newItem = {
      id: this.generateId(this.missingItems),
      ...itemData,
      status: 'Missing',
      reportedAt: new Date().toISOString()
    };
    
    this.missingItems.unshift(newItem);
    this.notifyListeners('missingItems');
    return newItem;
  }

  updateMissingItem(id, updates) {
    const index = this.missingItems.findIndex(item => item.id === id);
    if (index !== -1) {
      this.missingItems[index] = { ...this.missingItems[index], ...updates };
      
      // Add found details if status is being updated to Found
      if (updates.status === 'Found') {
        this.missingItems[index].foundAt = new Date().toISOString();
        if (updates.foundBy) {
          this.missingItems[index].foundBy = updates.foundBy;
        }
      }
      
      this.notifyListeners('missingItems');
      return this.missingItems[index];
    }
    return null;
  }

  // User Operations
  getUsers() {
    return [...this.users];
  }

  getUserById(id) {
    return this.users.find(user => user.id === id);
  }

  getUserByName(name) {
    return this.users.find(user => user.name === name);
  }

  createUser(userData) {
    const newUser = {
      id: this.generateId(this.users),
      ...userData
    };
    
    this.users.push(newUser);
    this.notifyListeners('users');
    return newUser;
  }

  // Combined requests for staff/warden view
  getAllRequests() {
    const leaves = this.leaveRequests.map(req => ({ ...req, requestType: 'leave' }));
    const outings = this.outingPasses.map(pass => ({ ...pass, requestType: 'outing' }));
    
    return [...leaves, ...outings].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  // Statistics for dashboard
  getStatistics() {
    const totalLeaves = this.leaveRequests.length;
    const pendingLeaves = this.leaveRequests.filter(req => req.status === 'Pending').length;
    const approvedLeaves = this.leaveRequests.filter(req => req.status === 'Approved').length;
    const rejectedLeaves = this.leaveRequests.filter(req => req.status === 'Rejected').length;

    const totalOutings = this.outingPasses.length;
    const pendingOutings = this.outingPasses.filter(pass => pass.status === 'Pending').length;
    const approvedOutings = this.outingPasses.filter(pass => pass.status === 'Approved').length;
    const rejectedOutings = this.outingPasses.filter(pass => pass.status === 'Rejected').length;

    const totalMissingItems = this.missingItems.length;
    const activeMissingItems = this.missingItems.filter(item => item.status === 'Missing').length;
    const foundItems = this.missingItems.filter(item => item.status === 'Found').length;

    return {
      leaves: {
        total: totalLeaves,
        pending: pendingLeaves,
        approved: approvedLeaves,
        rejected: rejectedLeaves
      },
      outings: {
        total: totalOutings,
        pending: pendingOutings,
        approved: approvedOutings,
        rejected: rejectedOutings
      },
      missingItems: {
        total: totalMissingItems,
        active: activeMissingItems,
        found: foundItems
      },
      totalPendingRequests: pendingLeaves + pendingOutings
    };
  }

  // Utility methods
  generateId(array) {
    return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
  }

  // Validation methods
  validateLeaveRequest(data) {
    const errors = [];
    
    if (!data.student) errors.push('Student name is required');
    if (!data.startDate) errors.push('Start date is required');
    if (!data.endDate) errors.push('End date is required');
    if (!data.reason) errors.push('Reason is required');
    if (new Date(data.startDate) >= new Date(data.endDate)) {
      errors.push('End date must be after start date');
    }
    
    return errors;
  }

  validateOutingPass(data) {
    const errors = [];
    
    if (!data.student) errors.push('Student name is required');
    if (!data.outDate) errors.push('Outing date is required');
    if (!data.outTime) errors.push('Out time is required');
    if (!data.expectedReturn) errors.push('Expected return time is required');
    if (!data.destination) errors.push('Destination is required');
    if (!data.purpose) errors.push('Purpose is required');
    
    return errors;
  }

  validateMissingItem(data) {
    const errors = [];
    
    if (!data.student) errors.push('Student name is required');
    if (!data.item) errors.push('Item name is required');
    if (!data.description) errors.push('Item description is required');
    if (!data.location) errors.push('Last known location is required');
    if (!data.category) errors.push('Item category is required');
    if (!data.contactInfo) errors.push('Contact information is required');
    
    return errors;
  }
}

// Create a singleton instance
const dataService = new DataService();

export default dataService;
