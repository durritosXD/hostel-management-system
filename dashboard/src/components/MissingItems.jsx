import React, { useState, useEffect } from 'react';
import { missingItemsData, MISSING_COLORS } from '../data/hostelData';
import PieChartComponent from './charts/PieChart';
import dataService from '../services/dataService';

const MissingItems = ({ currentUser }) => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    student: '',
    room: '',
    item: '',
    description: '',
    location: '',
    category: '',
    contactInfo: '',
    images: []
  });
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const isStudent = currentUser?.role === 'Student';

  // Categories for missing items
  const categories = ['Electronics', 'Clothing', 'Books', 'ID Cards', 'Personal Items', 'Sports Equipment', 'Others'];
  
  // Load data from service
  useEffect(() => {
    loadData();
    
    // Subscribe to data changes
    const handleDataUpdate = () => {
      loadData();
    };
    
    dataService.subscribe('missingItems', handleDataUpdate);
    
    return () => {
      dataService.unsubscribe('missingItems', handleDataUpdate);
    };
  }, [currentUser]);
  
  const loadData = () => {
    const missingItems = dataService.getMissingItems(currentUser?.role, currentUser?.id);
    setItems(missingItems);
  };

  // Pre-fill form for students
  useEffect(() => {
    if (isStudent && currentUser) {
      setFormData(prev => ({
        ...prev,
        student: currentUser.name,
        room: currentUser.roomNumber || '',
        contactInfo: currentUser.email || '',
      }));
    }
  }, [isStudent, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    const imageUrls = fileArray.map(file => URL.createObjectURL(file));
    setSelectedImages(prev => [...prev, ...imageUrls]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const itemData = {
        student: formData.student,
        room: formData.room,
        item: formData.item,
        description: formData.description,
        location: formData.location,
        category: formData.category,
        contactInfo: formData.contactInfo,
        images: formData.images || []
      };
      
      // Validate data
      const validationErrors = dataService.validateMissingItem(itemData);
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        return;
      }
      
      dataService.createMissingItemReport(itemData);
      setSuccess('Missing item report submitted successfully!');
      
      // Reset form
      setFormData({
        student: isStudent ? currentUser.name : '',
        room: isStudent ? currentUser.roomNumber || '' : '',
        item: '',
        description: '',
        location: '',
        category: '',
        contactInfo: isStudent ? currentUser.email || '' : '',
        images: []
      });
      setSelectedImages([]);
      
      // Auto-hide success message and form
      setTimeout(() => {
        setSuccess('');
        setShowForm(false);
      }, 2000);
      
    } catch (error) {
      setError('Failed to submit missing item report. Please try again.');
    }
  };

  const handleStatusChange = (id, status, foundBy = null) => {
    try {
      const updates = {
        status,
        foundBy: status === 'Found' ? (foundBy || currentUser?.name) : null
      };
      
      dataService.updateMissingItem(id, updates);
      setSuccess(`Item marked as ${status.toLowerCase()} successfully!`);
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      setError('Failed to update item status. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Filter items based on user role
  let displayItems = items;
  if (isStudent && currentUser) {
    displayItems = items.filter(item => item.student === currentUser.name);
  }

  const filteredItems = displayItems.filter(item => 
    item.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderItemRow = (item) => (
    <tr key={item.id}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {item.images && item.images.length > 0 && (
            <img 
              src={item.images[0]} 
              alt={item.item}
              className="h-10 w-10 rounded-lg object-cover mr-3"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">{item.student}</div>
            {item.room && <div className="text-sm text-gray-500">{item.room}</div>}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{item.item}</div>
          {item.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {item.category}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.description.length > 50 ? `${item.description.substring(0, 50)}...` : item.description}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${item.status === 'Found' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {item.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {!isStudent && item.status === 'Missing' && (
          <button
            onClick={() => handleStatusChange(item.id, 'Found', currentUser?.name)}
            className="text-green-600 hover:text-green-900 font-medium mr-2"
          >
            Mark as Found
          </button>
        )}
        {!isStudent && item.status === 'Found' && (
          <button
            onClick={() => handleStatusChange(item.id, 'Missing')}
            className="text-red-600 hover:text-red-900 font-medium mr-2"
          >
            Mark as Missing
          </button>
        )}
        {item.contactInfo && (
          <a 
            href={`mailto:${item.contactInfo}`}
            className="text-blue-600 hover:text-blue-900 font-medium"
          >
            Contact
          </a>
        )}
        {item.foundBy && (
          <div className="text-xs text-gray-500 mt-1">
            Found by {item.foundBy}
          </div>
        )}
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          {isStudent ? 'My Missing Items' : 'Missing Items'}
        </h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700"
        >
          {showForm ? 'Cancel' : 'Report Missing Item'}
        </button>
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
          {/* Search */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search items..."
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
                <h3 className="font-medium text-gray-700">Report Missing Item</h3>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <input
                      type="text"
                      name="item"
                      value={formData.item}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Seen Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
                    <input
                      type="email"
                      name="contactInfo"
                      value={formData.contactInfo}
                      onChange={handleChange}
                      disabled={isStudent}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows="3"
                      placeholder="Provide detailed description including color, size, brand, unique features..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  {/* Image Upload Section */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Images (Optional)</label>
                    <div className="mt-1">
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center ${
                          dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="mt-2">
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="font-medium text-indigo-600 hover:text-indigo-500">Upload images</span>
                            <span className="text-gray-500"> or drag and drop</span>
                          </label>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => handleImageUpload(e.target.files)}
                          />
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
                      </div>
                      
                      {/* Image Preview */}
                      {selectedImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                          {selectedImages.map((image, index) => (
                            <div key={index} className="relative">
                              <img 
                                src={image} 
                                alt={`Preview ${index + 1}`}
                                className="h-20 w-20 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                  >
                    Submit Report
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length > 0 ? (
                  filteredItems.map(renderItemRow)
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No missing items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Missing Items by Category</h2>
          <PieChartComponent data={missingItemsData} colors={MISSING_COLORS} />
          
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">Quick Tips</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="p-3 bg-orange-50 rounded-md">
                <h4 className="font-medium text-orange-800">Add Photos</h4>
                <p>Include clear photos to help others identify your item</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-800">Be Detailed</h4>
                <p>Describe unique features, colors, and identifying marks</p>
              </div>
              <div className="p-3 bg-green-50 rounded-md">
                <h4 className="font-medium text-green-800">Check Daily</h4>
                <p>Keep checking back as items are found regularly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissingItems;
