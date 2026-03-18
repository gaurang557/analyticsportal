import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Eye, Users, Clock, TrendingUp, ExternalLink, Github, LogIn, View } from 'lucide-react';
import Backend from './components/Backend.jsx';
import Apichart from './components/Apichart.jsx';
import Viewchart from './components/Viewchart.jsx';
const PortfolioAnalytics = () => {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [stats, setStats] = useState({
    totalViews: 25,
    totalUsers: 5,
    sessions: 16,
    avgDuration: 108,
    pageViews: 16
  });
  const [requestStats, setRequestStats] = useState({
    sent: 0,
    success: 0,
    failed: 0,
  });
  const [token, setToken] = useState(null);
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
      "Day": "Thu",
      "Views": 12,
      "Date": "2026-01-08"
    },
    {
      "Day": "Fri",
      "Views": 5,
      "Date": "2026-01-09"
    },
    {
      "Day": "Sat",
      "Views": 3,
      "Date": "2026-01-10"
    }
  ]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function pingBackend() {
      const isHealthy = await fetch(`${url}/api/health`) ? true : false;
      console.log("Backend health:", isHealthy);
    }
    pingBackend();
  }, []);

  const fetchAnalytics = async () => {
    if (isAuthenticated) {
      try {
        // Fetch data
        setLoading(true);
        const t = await getAccessTokenSilently();
        setToken(t);
        const response = await fetch(`${url}/api/analytics`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${t}`,
          }
        });

        const data = await response.json();
        // Parse and transform API hits
        const apihitsData = JSON.parse(data.apihitcount) || [];
        const apihitcount = apihitsData.map(obj => ({
          "date": obj.Item1, 
          "hitCount": obj.Item2
        }));

        setLoading(false);
        // Update state and localStorage
        setStats(data);
        localStorage.setItem('stats', JSON.stringify(data));
        
        setApihits(apihitcount);
        localStorage.setItem('apihits', JSON.stringify(apihitcount));
        
        const recentPageViews = data.pageViews?.slice(-7) || pageViews;
        setPageViews(recentPageViews);
        localStorage.setItem('pageViews', JSON.stringify(recentPageViews));
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    }
  };
  const refreshAnalytics = async () => {
  setRequestStats(prev => ({ ...prev, sent: prev.sent + 1 }));

  try {
    if (!isAuthenticated) throw new Error("Not authenticated");
    setLoading(true);
    const response = await fetch(`${url}/api/analytics`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("API failed");
    const data = await response.json();
    console.log("Fetched data:", data);
    const apihitsData = JSON.parse(data.apihitcount || "[]");
    const apihitcount = apihitsData.map(obj => ({
      date: obj.Item1,
      hitCount: obj.Item2,
    }));
    setLoading(false);
    setStats(data);
    setApihits(apihitcount);
    setPageViews(data.pageViews?.slice(-7) || []);

    localStorage.setItem("stats", JSON.stringify(data));
    localStorage.setItem("apihits", JSON.stringify(apihitcount));
    localStorage.setItem("pageViews", JSON.stringify(data.pageViews || []));

    setRequestStats(prev => ({ ...prev, success: prev.success + 1 }));
  } 
  catch (err) {
    console.error("Refresh failed:", err);
    setRequestStats(prev => ({ ...prev, failed: prev.failed + 1 }));
  } 
  finally {
    setLoading(false);
  }
};

  useEffect(() => {
  fetchAnalytics();
}, [isAuthenticated]);

  const StatCard = ({ icon: Icon, label, value = 0, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">
          {Number(value).toLocaleString()}
        </p>
      </div>
      <div className={`${color} p-3 rounded-full`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);


  return (
    <div>
      <div className='navbar'>
        <h1 className="heading">
          Website Analytics
        </h1>

        <div>
          <a
          href='https://gaurang557.github.io/portfolio/'
          target="_blank" 
          rel="noopener noreferrer"
          className="visitwebsitelink"
          >
          <span>Visit the website</span>
          </a>
        </div>

        {!isAuthenticated ? (
        <button className='login-button' onClick={() => loginWithRedirect()}>
          Log In / Sign Up
        </button>
      ) : (
        <button className='login-button' onClick={() => logout({ logoutParams: { returnTo: window.location.origin + "/analyticsportal" } })}>
          Log Out
        </button>
      )}
      </div>
      <div className="flex mb-8 items-center">
        
      </div>

      {/* Refresh & Request Metrics */}
      <div className="requestpanel">
        <button
          onClick={refreshAnalytics}
          // disabled={!isAuthenticated || loading}
          disabled={!isAuthenticated}
          className="flex refresh-button"
        >
          Refresh analytics
        </button>
        <div>
          Requests Sent: {requestStats.sent}
        </div>
        <div>
          Success: {requestStats.success}
        </div>
        <div>
          Excess requests: {requestStats.failed}
        </div>
      </div>

      <div className="InfoPanel">
          <p className="font-medium">
            The backend api rate limits the number of requests to 10 request per minute.
          </p>
          {!isAuthenticated && (
            <p className="font-medium">
                Kindly login to see the real data.
            </p>
          )}
          {loading && (
            <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm ">
              <p className="text-blue-700">
                fetching ...
              </p>
            </div>
          )}
      </div>
      
      <div className="statnchart">
        {/* Stats Grid */}
        <div className="statcard">
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
        <Viewchart pageViews={pageViews} />
      </div>

      {/* Right Section */}
      <Apichart apihits={apihits} />
    {/* Backend API Note */}
    {/* <Backend /> */}
    </div>
  );
};

export default PortfolioAnalytics;