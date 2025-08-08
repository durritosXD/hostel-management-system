// Mock data for the Hostel Management System

// Stats for Dashboard
export const hostelStats = [
  {
    id: 1,
    title: 'Total Students',
    value: '458',
    change: '12%',
    trend: 'up',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Attendance Rate',
    value: '92%',
    change: '3%',
    trend: 'up',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Leave Requests',
    value: '24',
    change: '5%',
    trend: 'down',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Missing Items',
    value: '17',
    change: 'Same',
    trend: 'neutral',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
];

// Attendance data for charts
export const attendanceData = [
  { name: 'Monday', present: 435, absent: 23 },
  { name: 'Tuesday', present: 442, absent: 16 },
  { name: 'Wednesday', present: 428, absent: 30 },
  { name: 'Thursday', present: 439, absent: 19 },
  { name: 'Friday', present: 445, absent: 13 },
  { name: 'Saturday', present: 450, absent: 8 },
  { name: 'Sunday', present: 452, absent: 6 },
];

// Leave requests data for pie chart
export const leaveRequestsData = [
  { name: 'Approved', value: 45 },
  { name: 'Pending', value: 24 },
  { name: 'Rejected', value: 12 },
];

// Missing items data for pie chart
export const missingItemsData = [
  { name: 'Electronics', value: 38 },
  { name: 'Clothing', value: 28 },
  { name: 'Books', value: 15 },
  { name: 'ID Cards', value: 12 },
  { name: 'Others', value: 7 },
];

// Chart colors
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
export const LEAVE_COLORS = ['#4CAF50', '#FFC107', '#F44336'];
export const MISSING_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Recent leave requests for dashboard
export const recentLeaves = [
  { 
    id: 1, 
    student: 'John Doe', 
    room: 'A-101', 
    startDate: '2025-08-10', 
    endDate: '2025-08-12',
    reason: 'Family function',
    status: 'Approved', 
    createdAt: '2025-08-05T10:30:00Z'
  },
  { 
    id: 2, 
    student: 'Jane Smith', 
    room: 'B-205', 
    startDate: '2025-08-15', 
    endDate: '2025-08-18',
    reason: 'Medical appointment',
    status: 'Pending', 
    createdAt: '2025-08-07T09:15:00Z'
  },
  { 
    id: 3, 
    student: 'Robert Johnson', 
    room: 'C-103', 
    startDate: '2025-08-20', 
    endDate: '2025-08-22',
    reason: 'Academic conference',
    status: 'Pending', 
    createdAt: '2025-08-08T14:45:00Z'
  },
  { 
    id: 4, 
    student: 'Mary Williams', 
    room: 'A-302', 
    startDate: '2025-08-12', 
    endDate: '2025-08-14',
    reason: 'Family emergency',
    status: 'Approved', 
    createdAt: '2025-08-06T16:20:00Z'
  },
  { 
    id: 5, 
    student: 'Mike Brown', 
    room: 'D-105', 
    startDate: '2025-08-09', 
    endDate: '2025-08-11',
    reason: 'Personal work',
    status: 'Rejected', 
    createdAt: '2025-08-04T11:05:00Z'
  }
];

// Recent missing items for dashboard
export const recentMissingItems = [
  { 
    id: 1, 
    student: 'John Doe', 
    item: 'Laptop Charger', 
    description: 'Dell charger with blue tag', 
    location: 'Library',
    status: 'Missing', 
    reportedAt: '2025-08-06T10:30:00Z'
  },
  { 
    id: 2, 
    student: 'Jane Smith', 
    item: 'Water Bottle', 
    description: 'Blue hydro flask with stickers', 
    location: 'Sports Field',
    status: 'Found', 
    reportedAt: '2025-08-05T09:15:00Z'
  },
  { 
    id: 3, 
    student: 'Robert Johnson', 
    item: 'Textbook', 
    description: 'Engineering Mathematics Vol. 2', 
    location: 'Cafeteria',
    status: 'Missing', 
    reportedAt: '2025-08-07T14:45:00Z'
  },
  { 
    id: 4, 
    student: 'Mary Williams', 
    item: 'ID Card', 
    description: 'University ID with meal plan', 
    location: 'Lecture Hall',
    status: 'Found', 
    reportedAt: '2025-08-04T16:20:00Z'
  },
  { 
    id: 5, 
    student: 'Mike Brown', 
    item: 'Wireless Earbuds', 
    description: 'White earbuds in black case', 
    location: 'Gym',
    status: 'Missing', 
    reportedAt: '2025-08-08T11:05:00Z'
  }
];

// Mock users for login
export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    role: 'Administrator',
    email: 'admin@university.edu'
  },
  {
    id: 2,
    username: 'warden',
    password: 'warden123',
    name: 'James Wilson',
    role: 'Warden',
    email: 'warden@university.edu'
  },
  {
    id: 3,
    username: 'staff',
    password: 'staff123',
    name: 'Sarah Johnson',
    role: 'Staff',
    email: 'staff@university.edu'
  }
];

// Student attendance records for attendance page
export const studentAttendanceRecords = [
  { id: 1, name: 'John Doe', room: 'A-101', status: 'Present', date: '2025-08-08', time: '08:30 AM' },
  { id: 2, name: 'Jane Smith', room: 'B-205', status: 'Absent', date: '2025-08-08', time: '08:30 AM' },
  { id: 3, name: 'Robert Johnson', room: 'C-103', status: 'Present', date: '2025-08-08', time: '08:32 AM' },
  { id: 4, name: 'Mary Williams', room: 'A-302', status: 'Present', date: '2025-08-08', time: '08:28 AM' },
  { id: 5, name: 'Mike Brown', room: 'D-105', status: 'Present', date: '2025-08-08', time: '08:35 AM' },
  { id: 6, name: 'Sarah Davis', room: 'B-110', status: 'Present', date: '2025-08-08', time: '08:31 AM' },
  { id: 7, name: 'David Miller', room: 'C-205', status: 'Absent', date: '2025-08-08', time: '08:30 AM' },
  { id: 8, name: 'Laura Wilson', room: 'A-105', status: 'Present', date: '2025-08-08', time: '08:29 AM' },
  { id: 9, name: 'James Taylor', room: 'D-201', status: 'Present', date: '2025-08-08', time: '08:33 AM' },
  { id: 10, name: 'Emily Clark', room: 'B-301', status: 'Present', date: '2025-08-08', time: '08:30 AM' },
];