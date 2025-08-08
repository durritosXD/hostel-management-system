import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { barChartData } from '../../data/mockData';

const BarChartComponent = ({ data = barChartData, dataKey1 = 'online', dataKey2 = 'inStore' }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey1} fill="#0088FE" />
        <Bar dataKey={dataKey2} fill="#FF8042" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;