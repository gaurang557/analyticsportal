import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Eye, Users, Clock, TrendingUp, ExternalLink, Github } from 'lucide-react';
import './index.css';

const PortfolioAnalytics = () => {
  const [stats, setStats] = useState({
    totalViews: 25,
    totalUsers: 5,
    sessions: 16,
    avgDuration: 108,
    pageViews: 16
  });
  const [apihits, setApihits] = useState([
  {
    "date": "2026-01-12",
    "hitCount": 22
  }
]);
  
  const [pageViews, setPageViews] = useState([
    {
      "day": "Thu",
      "views": 12,
      "date": "2026-01-08"
    },
    {
      "day": "Fri",
      "views": 5,
      "date": "2026-01-09"
    },
    {
      "day": "Sat",
      "views": 3,
      "date": "2026-01-10"
    }
  ]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setApihits(JSON.parse(localStorage.getItem('apihits')) || apihits);
    setPageViews(JSON.parse(localStorage.getItem('pageViews')) || pageViews);
    setStats(JSON.parse(localStorage.getItem('stats')) || stats);
    // Fetch analytics data from your backend API
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // const response = await fetch('http://localhost:5000/api/analytics');
      const response = await fetch('https://analyticsapi-6qg1.onrender.com/api/analytics');
      var data = await response.json();
      var apihits = JSON.parse(data.apihitcount) || [];
      var apihitcount = apihits.map(obj => ({"date": obj.Item1, "hitCount": obj.Item2}));
      setStats(data || stats);
      localStorage.setItem('stats', JSON.stringify(data));
      setApihits(apihitcount || apihits);
      localStorage.setItem('apihits', JSON.stringify(apihitcount));
      setPageViews(data.pageViews.slice(-7) || pageViews);
      localStorage.setItem('pageViews', JSON.stringify(pageViews));
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
    }
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
        {loading && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <p className="font-medium">
              Showing previously loaded data
            </p>
            <p className="text-blue-700">
              We’re fetching the latest analytics in the background.  
              The API server may take up to <span className="font-semibold">~50 seconds</span> to respond after inactivity.
            </p>
          </div>
        )}
        <div className="statnchartcontainer">
        {/* Left Section */}
        <div className="statnchart">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          {/* Weekly Page Views */}
          <div className="chart-card">
            <h2 className="chart-title">Weekly Page Views</h2>
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

        {/* Right Section */}
        <div className="statnchart">
          <div className="chart-card">

            <div className="flex items-center justify-between mb-4">
              <h3 className="chart-title">Weekly count of number of Hits to google analytics api</h3>
              <a
              href='https://github.com/gaurang557/analyticsapi' target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
              <Github size={40} color="#070202" />
              <span className="items-center access-portfolio" style={{color: "black"}}>GitHub Repo</span>
              </a>
              <a
              href='https://analyticsapi-6qg1.onrender.com/swagger/index.html' target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
              <ExternalLink size={40} color="#5db5eb" />
              <span className="items-center access-portfolio" style={{color: "black"}}>Access the .NET API</span>
              </a>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={apihits}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hitCount" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
              href="https://analyticsapi-6qg1.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <code className="bg-blue-100 px-2 py-1 rounded">
                https://analyticsapi-6qg1.onrender.com
              </code>
            </a>
          </p>
        </div>
      </div>
    // </div>
  );
};

export default PortfolioAnalytics;