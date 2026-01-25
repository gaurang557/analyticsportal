import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Eye, Users, Clock, TrendingUp, ExternalLink, Github, LogIn } from 'lucide-react';
import './index.css';
import './App.css';

const PortfolioAnalytics = () => {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
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
  
  // const url = 'http://localhost:5000';
  const url = "https://analyticsapi-6qg1.onrender.com";
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
    async function pingBackend() {
      const isHealthy = await fetch(`${url}/api/health`) ? true : false;
      console.log("Backend health:", isHealthy);
    }
    pingBackend();
  }, []);

  useEffect(() => {
  const fetchAnalytics = async () => {
    if (isAuthenticated) {
      try {
        setApihits(JSON.parse(localStorage.getItem('apihits')) || apihits);
        setPageViews(JSON.parse(localStorage.getItem('pageViews')) || pageViews);
        setStats(JSON.parse(localStorage.getItem('stats')) || stats);

        // Fetch data
        const token = await getAccessTokenSilently();
        const response = await fetch(`${url}/api/analytics`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        const data = await response.json();
        
        // Parse and transform API hits
        const apihitsData = JSON.parse(data.apihitcount) || [];
        const apihitcount = apihitsData.map(obj => ({
          "date": obj.Item1, 
          "hitCount": obj.Item2
        }));

        // Update state and localStorage
        setStats(data);
        localStorage.setItem('stats', JSON.stringify(data));
        
        setApihits(apihitcount);
        localStorage.setItem('apihits', JSON.stringify(apihitcount));
        
        const recentPageViews = data.pageViews?.slice(-7) || pageViews;
        setPageViews(recentPageViews);
        localStorage.setItem('pageViews', JSON.stringify(recentPageViews));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    }
  };

  fetchAnalytics();
}, [isAuthenticated]);

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
    <div className="topdiv justify-center">
      <div className='flex justify-end mb-4 navbar'>
        {!isAuthenticated ? (
        <button className='login-button' onClick={() => loginWithRedirect()}>
          Log In
        </button>
      ) : (
        <button className='login-button' onClick={() => logout({ logoutParams: { returnTo: window.location.origin + "/analyticsportal" } })}>
          Log Out
        </button>
      )}
      </div>
      <div className=' navbar'>
      </div>
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
          <span className="items-center access-portfolio text-gray-100">Access the portfolio</span>
          </a>
        </div>
      </div>
      {loading && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          <p className="font-medium">
            Showing dummy or previously loaded data till real data is loaded or till you are authenticated...
          </p>
          <p className="font-medium">
            This message will disappear once real data is loaded and you are authenticated.
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
  );
};

export default PortfolioAnalytics;