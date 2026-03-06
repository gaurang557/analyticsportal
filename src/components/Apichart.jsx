import React from 'react'
import { ExternalLink, Github } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const apichart = ({apihits}) => {
  return (
    <div className="backendapichart">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="chart-title">Weekly count of number of hits to backend api</h3>
            <a
            href='https://github.com/gaurang557/analyticsapi' target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
            <Github size={40} color="#faf8f8" />
            <span className="items-center access-portfolio" style={{color: "white"}}>Backend Api's GitHub Repo</span>
            </a>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={apihits}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hitCount" fill="#037089" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
  )
}

export default apichart