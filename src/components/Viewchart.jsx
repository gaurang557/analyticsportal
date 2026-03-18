import React from 'react'
// import { ExternalLink, Github } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Viewchart = ({pageViews}) => {
  console.log("Page views in Viewchart:", pageViews);
  return (
    <div className="chart-card">
          <h2 className="chart-title">Weekly Page Views</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pageViews}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Views" fill="#037089" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
    </div>
  )
}

export default Viewchart