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
import Register from './components/Register';
import { mockUsers } from './data/hostelData';

function App() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

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

  const handleSwitchToRegister = () => {
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
  };

  const handleRegister = (newUser) => {
    // In a real app, this would make an API call to register the user
    // For now, we'll just automatically log them in
    handleLogin(newUser);
    setShowRegister(false);
  };

  // Render components based on active state
  const renderComponent = () => {
    switch (activeComponent) {
      case 'attendance':
        return <Attendance currentUser={currentUser} />;
      case 'my-attendance':
        return <Attendance currentUser={currentUser} isStudentView={true} />;
      case 'leave-requests':
        return <LeaveRequests currentUser={currentUser} />;
      case 'missing-items':
        return <MissingItems currentUser={currentUser} />;
      case 'auto-attendance':
        return <Attendance currentUser={currentUser} />;
      case 'students':
        return <Students currentUser={currentUser} />;
      case 'settings':
        return <Settings currentUser={currentUser} />;
      case 'dashboard':
      default:
        return <Dashboard currentUser={currentUser} />;
    }
  };

  if (!isLoggedIn) {
    if (showRegister) {
      return (
        <Register 
          onRegister={handleRegister}
          onSwitchToLogin={handleSwitchToLogin}
        />
      );
    }
    return (
      <Login 
        onLogin={handleLogin}
        onSwitchToRegister={handleSwitchToRegister}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} currentUser={currentUser} />
      <div className="flex flex-1">
        <Sidebar onNavigate={handleNavigation} currentUser={currentUser} />
        <main className="flex-1 p-6 overflow-auto">
          {renderComponent()}
        </main>
      </div>
    </div>
  );
}

export default App;