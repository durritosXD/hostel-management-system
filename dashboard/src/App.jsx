import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Attendance from './components/Attendance';
import LeaveRequests from './components/LeaveRequests';
import MissingItems from './components/MissingItems';
import Students from './components/Students';
import Settings from './components/Settings';
import Login from './components/Login';
import { mockUsers } from './data/hostelData';

function App() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check for existing login
  useEffect(() => {
    const savedUser = localStorage.getItem('hostelUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('hostelUser');
      }
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('hostelUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('hostelUser');
  };

  const handleNavigation = (componentName) => {
    setActiveComponent(componentName);
  };

  // Render components based on active state
  const renderComponent = () => {
    switch (activeComponent) {
      case 'attendance':
        return <Attendance />;
      case 'leave-requests':
        return <LeaveRequests />;
      case 'missing-items':
        return <MissingItems />;
      case 'auto-attendance':
        return <Attendance />;
      case 'students':
        return <Students />;
      case 'settings':
        return <Settings />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} currentUser={currentUser} />
      <div className="flex flex-1">
        <Sidebar onNavigate={handleNavigation} />
        <main className="flex-1 p-6 overflow-auto">
          {renderComponent()}
        </main>
      </div>
    </div>
  );
}

export default App;