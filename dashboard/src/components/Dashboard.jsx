import React from 'react';
import AreaChartComponent from './charts/AreaChart';
import BarChartComponent from './charts/BarChart';
import PieChartComponent from './charts/PieChart';
import StatsCard from './StatsCard';
import { 
  hostelStats, 
  attendanceData, 
  leaveRequestsData, 
  missingItemsData, 
  LEAVE_COLORS, 
  MISSING_COLORS,
  recentLeaves,
  recentMissingItems
} from '../data/hostelData';

const Dashboard = ({ currentUser }) => {
  // Student-specific stats
  const getStudentStats = () => {
    return [
      {
        id: 1,
        title: 'My Attendance',
        value: '28/30',
        change: '93%',
        trend: 'up',
        icon: hostelStats[1].icon,
      },
      {
        id: 2,
        title: 'My Leave Requests',
        value: '2',
        change: '1 Pending',
        trend: 'neutral',
        icon: hostelStats[2].icon,
      },
      {
        id: 3,
        title: 'My Missing Items',
        value: '1',
        change: 'Active',
        trend: 'neutral',
        icon: hostelStats[3].icon,
      },
      {
        id: 4,
        title: 'Room Number',
        value: currentUser?.roomNumber || 'N/A',
        change: 'Active',
        trend: 'up',
        icon: hostelStats[0].icon,
      }
    ];
  };

  const isStudent = currentUser?.role === 'Student';
  const statsToShow = isStudent ? getStudentStats() : hostelStats;
  const dashboardTitle = isStudent ? `Welcome, ${currentUser.name}` : 'Dashboard Overview';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">{dashboardTitle}</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsToShow.map((stat, index) => (
          <StatsCard 
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
          />
        ))}
      </div>
      
      {/* Show detailed charts and tables only for non-student users */}
      {!isStudent && (
        <>
          {/* Charts - First Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Attendance Trends (Last 7 Days)</h2>
              <BarChartComponent data={attendanceData} dataKey1="present" dataKey2="absent" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Leave Requests Status</h2>
              <PieChartComponent data={leaveRequestsData} colors={LEAVE_COLORS} />
            </div>
          </div>
          
          {/* Recent Data Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Recent Leave Requests</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentLeaves.map((leave) => (
                      <tr key={leave.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{leave.student}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.room}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.startDate} to {leave.endDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${leave.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                              leave.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Recent Missing Items</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentMissingItems.map((item) => (
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Missing Items Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Missing Items by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div>
                <PieChartComponent data={missingItemsData} colors={MISSING_COLORS} />
              </div>
              <div className="flex items-center justify-center">
                <div className="space-y-2">
                  {missingItemsData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-4 h-4 mr-2" 
                        style={{ backgroundColor: MISSING_COLORS[index % MISSING_COLORS.length] }}
                      ></div>
                      <span>{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Student-specific quick actions */}
      {isStudent && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                Apply for Leave
              </button>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200">
                Apply for Outing Pass
              </button>
              <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition duration-200">
                Report Missing Item
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>✅ Attendance marked - Today 8:30 AM</p>
              <p>📋 Leave request submitted - Yesterday</p>
              <p>🔍 Missing item reported - 2 days ago</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Important Notices</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>🏠 Hostel maintenance on Sunday</p>
              <p>📢 New mess timings effective today</p>
              <p>🎉 Cultural fest next week</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;