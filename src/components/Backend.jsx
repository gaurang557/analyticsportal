import React from 'react'

const Backend = () => {
  return (
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
  )
}

export default Backend