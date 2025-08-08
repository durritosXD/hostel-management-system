import React, { useState, useRef, useEffect } from 'react';
import { attendanceData } from '../data/hostelData';
import BarChartComponent from './charts/BarChart';

const Attendance = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureStatus, setCaptureStatus] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [faceDetected, setFaceDetected] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Mock attendance data for the current date
  useEffect(() => {
    const mockAttendance = [
      { id: 1, name: 'John Doe', room: 'A-101', time: '08:45 AM', status: 'Present' },
      { id: 2, name: 'Jane Smith', room: 'B-205', time: '09:10 AM', status: 'Present' },
      { id: 3, name: 'Robert Johnson', room: 'C-103', time: '', status: 'Absent' },
      { id: 4, name: 'Mary Williams', room: 'A-302', time: '08:30 AM', status: 'Present' },
      { id: 5, name: 'Mike Brown', room: 'D-105', time: '09:05 AM', status: 'Present' },
      { id: 6, name: 'David Miller', room: 'A-104', time: '', status: 'Absent' },
    ];
    
    setAttendance(mockAttendance);
  }, []);

  // Start webcam for face recognition
  const startCapture = async () => {
    try {
      setIsCapturing(true);
      setCaptureStatus('Initializing camera...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCaptureStatus('Camera active. Looking for faces...');
        
        // Simulate face recognition process
        setTimeout(() => {
          setFaceDetected(true);
          setCaptureStatus('Face detected! Analyzing...');
          
          setTimeout(() => {
            // Simulating successful recognition
            const today = new Date().toLocaleDateString();
            const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            // Find the first absent student and mark them present
            const updatedAttendance = [...attendance];
            const absentIndex = updatedAttendance.findIndex(s => s.status === 'Absent');
            
            if (absentIndex !== -1) {
              updatedAttendance[absentIndex].status = 'Present';
              updatedAttendance[absentIndex].time = time;
              setAttendance(updatedAttendance);
              
              setCaptureStatus(`Successfully marked ${updatedAttendance[absentIndex].name} as present!`);
              setTimeout(() => stopCapture(), 2000);
            } else {
              setCaptureStatus('All students already marked as present.');
              setTimeout(() => stopCapture(), 2000);
            }
          }, 2000);
        }, 3000);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCaptureStatus('Error: Could not access camera');
      setIsCapturing(false);
    }
  };

  // Stop webcam
  const stopCapture = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsCapturing(false);
    setFaceDetected(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Attendance System</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Auto Attendance</h2>
          
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100 relative">
            {isCapturing ? (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-64 object-cover"
                />
                <canvas 
                  ref={canvasRef} 
                  className="absolute top-0 left-0 w-full h-full"
                />
                {faceDetected && (
                  <div className="absolute inset-0 border-4 border-green-500 z-10 pointer-events-none"></div>
                )}
              </>
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}
          </div>
          
          {captureStatus && (
            <div className={`mt-3 p-2 text-sm rounded ${faceDetected ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
              {captureStatus}
            </div>
          )}
          
          <div className="mt-4 flex justify-center">
            {!isCapturing ? (
              <button 
                onClick={startCapture}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none"
              >
                Start Face Recognition
              </button>
            ) : (
              <button 
                onClick={stopCapture}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
              >
                Stop Camera
              </button>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Attendance Trends (Last 7 Days)</h2>
          <BarChartComponent data={attendanceData} dataKey1="present" dataKey2="absent" />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Today's Attendance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendance.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.room}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.time || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${student.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {student.status === 'Absent' ? (
                      <button 
                        onClick={() => {
                          const updatedAttendance = [...attendance];
                          const studentIndex = updatedAttendance.findIndex(s => s.id === student.id);
                          updatedAttendance[studentIndex].status = 'Present';
                          updatedAttendance[studentIndex].time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                          setAttendance(updatedAttendance);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Mark Present
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          const updatedAttendance = [...attendance];
                          const studentIndex = updatedAttendance.findIndex(s => s.id === student.id);
                          updatedAttendance[studentIndex].status = 'Absent';
                          updatedAttendance[studentIndex].time = '';
                          setAttendance(updatedAttendance);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Mark Absent
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;