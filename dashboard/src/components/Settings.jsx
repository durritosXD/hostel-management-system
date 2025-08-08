import React, { useState } from 'react';

const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    hostelName: 'University Hostel',
    hostelCode: 'UH-001',
    address: '123 University Avenue',
    email: 'admin@universityhostel.com',
    phone: '123-456-7890',
    warden: 'Dr. James Wilson',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    leaveApprovals: true,
    attendanceAlerts: true,
    missingItemAlerts: true,
    maintenanceAlerts: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    requireTwoFactor: false,
    sessionTimeout: '30',
    ipRestriction: false,
    autoLogout: true
  });

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings({ ...generalSettings, [name]: value });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({ ...notificationSettings, [name]: checked });
  };

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings({ 
      ...securitySettings, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleGeneralSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save to a database
    alert('General settings saved!');
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save to a database
    alert('Notification settings saved!');
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save to a database
    alert('Security settings saved!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-800 mb-4">General Settings</h2>
        <form onSubmit={handleGeneralSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name</label>
              <input
                type="text"
                name="hostelName"
                value={generalSettings.hostelName}
                onChange={handleGeneralChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Code</label>
              <input
                type="text"
                name="hostelCode"
                value={generalSettings.hostelCode}
                onChange={handleGeneralChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={generalSettings.address}
                onChange={handleGeneralChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={generalSettings.email}
                onChange={handleGeneralChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={generalSettings.phone}
                onChange={handleGeneralChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warden</label>
              <input
                type="text"
                name="warden"
                value={generalSettings.warden}
                onChange={handleGeneralChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save General Settings
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Notification Settings</h2>
        <form onSubmit={handleNotificationSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                id="emailNotifications"
                name="emailNotifications"
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                Email Notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="smsNotifications"
                name="smsNotifications"
                type="checkbox"
                checked={notificationSettings.smsNotifications}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-700">
                SMS Notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="leaveApprovals"
                name="leaveApprovals"
                type="checkbox"
                checked={notificationSettings.leaveApprovals}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="leaveApprovals" className="ml-2 block text-sm text-gray-700">
                Leave Approval Alerts
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="attendanceAlerts"
                name="attendanceAlerts"
                type="checkbox"
                checked={notificationSettings.attendanceAlerts}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="attendanceAlerts" className="ml-2 block text-sm text-gray-700">
                Attendance Alerts
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="missingItemAlerts"
                name="missingItemAlerts"
                type="checkbox"
                checked={notificationSettings.missingItemAlerts}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="missingItemAlerts" className="ml-2 block text-sm text-gray-700">
                Missing Item Alerts
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="maintenanceAlerts"
                name="maintenanceAlerts"
                type="checkbox"
                checked={notificationSettings.maintenanceAlerts}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="maintenanceAlerts" className="ml-2 block text-sm text-gray-700">
                Maintenance Alerts
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Notification Settings
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Security Settings</h2>
        <form onSubmit={handleSecuritySubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                id="requireTwoFactor"
                name="requireTwoFactor"
                type="checkbox"
                checked={securitySettings.requireTwoFactor}
                onChange={handleSecurityChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="requireTwoFactor" className="ml-2 block text-sm text-gray-700">
                Require Two-Factor Authentication
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
              <input
                type="number"
                name="sessionTimeout"
                value={securitySettings.sessionTimeout}
                onChange={handleSecurityChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div className="flex items-center">
              <input
                id="ipRestriction"
                name="ipRestriction"
                type="checkbox"
                checked={securitySettings.ipRestriction}
                onChange={handleSecurityChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="ipRestriction" className="ml-2 block text-sm text-gray-700">
                IP Address Restriction
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="autoLogout"
                name="autoLogout"
                type="checkbox"
                checked={securitySettings.autoLogout}
                onChange={handleSecurityChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="autoLogout" className="ml-2 block text-sm text-gray-700">
                Auto Logout on Inactivity
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Security Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;