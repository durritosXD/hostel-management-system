import React, { useState } from 'react';
import { missingItemsData, recentMissingItems, MISSING_COLORS } from '../data/hostelData';
import PieChartComponent from './charts/PieChart';

const MissingItems = () => {
  const [items, setItems] = useState(recentMissingItems);
  const [formData, setFormData] = useState({
    student: '',
    item: '',
    description: '',
    location: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newItem = {
      id: items.length + 1,
      student: formData.student,
      item: formData.item,
      description: formData.description,
      location: formData.location,
      status: 'Missing',
      reportedAt: new Date().toISOString(),
    };
    
    setItems([newItem, ...items]);
    setFormData({
      student: '',
      item: '',
      description: '',
      location: '',
    });
    
    setShowForm(false);
  };

  const handleStatusChange = (id, status) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, status } : item
    );
    setItems(updatedItems);
  };

  const filteredItems = items.filter(item => 
    item.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Missing Items</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">All Missing Items</h2>
            <div className="flex space-x-2">
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
              <button 
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {showForm ? 'Cancel' : 'Report Item'}
              </button>
            </div>
          </div>

          {showForm && (
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h3 className="font-medium text-gray-700 mb-3">Report Missing Item</h3>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <input
                      type="text"
                      name="item"
                      value={formData.item}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Seen Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    ></textarea>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    className="ml-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Submit Report
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.student}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.item}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${item.status === 'Found' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.status === 'Missing' ? (
                          <button
                            onClick={() => handleStatusChange(item.id, 'Found')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Mark as Found
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(item.id, 'Missing')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Mark as Missing
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
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
            <h3 className="text-md font-medium text-gray-700 mb-2">Frequently Lost Items</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li><span className="font-medium">Electronics:</span> Chargers, earphones, power banks</li>
              <li><span className="font-medium">Clothing:</span> Laundry items, sports uniforms</li>
              <li><span className="font-medium">Books:</span> Textbooks, notebooks, library books</li>
              <li><span className="font-medium">ID Cards:</span> Student IDs, access cards</li>
              <li><span className="font-medium">Others:</span> Umbrellas, water bottles, wallets</li>
            </ul>
          </div>
          
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">Lost & Found Policy</h3>
            <p className="text-sm text-gray-600">
              Found items should be deposited at the hostel reception. Items will be kept for 30 days before being donated or disposed of. Students are encouraged to label their belongings with their name and room number.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissingItems;