import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Eye, Users, Clock, TrendingUp, ExternalLink } from 'lucide-react';
import './index.css';

const PortfolioAnalytics = () => {
  const [stats, setStats] = useState({
    totalViews: 0,
    totalUsers: 0,
    avgDuration: 0,
    pageViews: 0
  });
  
  const [pageViews, setPageViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const localstoragekey = 'portfolio-analytics-data';
  useEffect(() => {
    // Fetch analytics data from your backend API
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // const response = await fetch('http://localhost:55000/api/analytics');
      const response = await fetch('https://analyticsapi-6qg1.onrender.com/api/analytics');
      // https://analyticsapi-6qg1.onrender.com/api/analytics
      var data = await response.json();
      console.log(data);
      localStorage.setItem(localstoragekey, JSON.stringify(data));
      setStats(data || {
        totalViews: data.totalViews || 124,
        totalUsers: data.totalUsers || 89,
        avgDuration: data.avgDuration || 14,
        sessions: data.sessions || 108
      });
      setPageViews(data.pageViews || generateMockData());
      setLoading(false);
    } catch (error) {
      // data = localStorage.getItem(localstoragekey);
      data = {
        totalViews: 124,
        totalUsers:  89,
        avgDuration: 14,
        sessions:  108
      };
      setStats(data);
      setPageViews(data.pageViews || generateMockData());
      setLoading(false);
      console.error('Error:', error);
    }
  };

  const generateMockData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      views: Math.floor(Math.random() * 200) + 50
    }));
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value.toLocaleString()}</p>
        </div>
        <div className={`${color} p-3 rounded-full`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen min-w-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    // <div className="flex justify-center min-h-screen">
      <div className="topdiv justify-center">
        <div className="flex mb-8 items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Portfolio Analytics
          </h1>

          <div className="flex items-center">
            <a
            href='https://gaurang557.github.io/portfolio/'
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-600 text-gray-100 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >

            <ExternalLink size={40} color="#5db5eb" />
            <span className="items-center access-portfolio">Access the portfolio</span>
            </a>
          </div>
        </div>
        <div className='statnchart'>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Eye}
              label="Total Page Views"
              value={stats.totalViews}
              color="bg-blue-500"
            />
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats.totalUsers}
              color="bg-green-500"
            />
            <StatCard
              icon={Clock}
              label="Avg. Duration (sec)"
              value={stats.avgDuration}
              color="bg-purple-500"
            />
            <StatCard
              icon={TrendingUp}
              label="Sessions"
              value={stats.sessions}
              color="bg-orange-500"
            />
          </div>

          {/* Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Page Views</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pageViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Backend API Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg apinote">
          <h3 className="font-semibold text-blue-900 mb-2">📌 Backend Information</h3>
          <p className="text-blue-800 text-sm">
            This dashboard fetches data from .NET API endpoint running at &nbsp;
            <a
              href="https://analyticsapi-6qg1.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <code className="bg-blue-100 px-2 py-1 rounded">
                https://analyticsapi-6qg1.onrender.com
              </code>
            </a>,
            the .NET api in turn fetches data from Google Analytics Data API. The swagger of the api can be accessed 
            at <a
              href="https://analyticsapi-6qg1.onrender.com/swagger"
              target="_blank"
              rel="noopener noreferrer"
            >
              <code className="bg-blue-100 px-2 py-1 rounded">
                https://analyticsapi-6qg1.onrender.com/swagger
              </code>
            </a>
          </p>
        </div>
      </div>
    // </div>
  );
};

export default PortfolioAnalytics;