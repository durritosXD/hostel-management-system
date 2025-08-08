import React, { useState } from 'react';
import { mockUsers } from '../data/hostelData';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [loginField, setLoginField] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Support both username and email login
    const user = mockUsers.find(u => 
      (u.email === loginField || u.username === loginField) && u.password === password
    );
    
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials. Please check your username/email and password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Hostel Management System</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="login-field" className="sr-only">Username or Email</label>
              <input
                id="login-field"
                name="loginField"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username or Email"
                value={loginField}
                onChange={(e) => setLoginField(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
          
          <div className="text-center">
            {onSwitchToRegister && (
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-medium text-indigo-600 hover:text-indigo-500 mb-4"
              >
                Don't have an account? Register here
              </button>
            )}
          </div>
          
          <div className="text-sm text-center space-y-1">
            <p className="text-gray-600 font-medium">
              Demo Credentials:
            </p>
            <p className="text-gray-500">
              <strong>Admin:</strong> admin / admin123
            </p>
            <p className="text-gray-500">
              <strong>Teacher:</strong> teacher / teacher123
            </p>
            <p className="text-gray-500">
              <strong>Student:</strong> student1 / student123
            </p>
            <p className="text-gray-500">
              <strong>Warden:</strong> warden / warden123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;