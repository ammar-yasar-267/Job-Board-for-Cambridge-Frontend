import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NewsLetterSubscription from './NewsLetterSubscription';
import NotificationForEmail from './NotificationForEmail';

const JobBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState({});
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false); // Add this state
  const navigate = useNavigate();
  
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/footer`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const categoriesData = {};
      data.forEach(item => {
        if (!categoriesData[item.PageCategory]) {
          categoriesData[item.PageCategory] = [];
        }
        categoriesData[item.PageCategory].push({
          keyword: item.PageKeyword,
          pageName: item.PageName
        });
      });

      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm) {
      navigate(`/jobs/${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // const handleSubscribe = async (e) => {
  //   e.preventDefault();
  //   console.log('Subscribing email:', email);

  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/subscribe`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ email })
  //     });
      
  //     const result = await response.json();

  //     if (!response.ok) {
  //       throw new Error(result.message || 'Error subscribing email');
  //     }

  //     setNotification({ message: result.message, type: 'success' });
  //     setIsSubscribed(true); // Hide the subscription form on success
  //     setEmail('');
  //   } catch (error) {
  //     console.error('Error subscribing email:', error.message);
  //     setNotification({ message: error.message, type: 'error' });
  //   }
  // };

  const closeNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <img src="/logo.jpg" alt="Trovit Logo" className="w-32" />
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        <div 
          className="bg-cover bg-center py-12"
          style={{
            backgroundImage: 'url(./bg.jpg)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center text-white mb-2">Jobs Finder</h1>
            <p className="text-center text-gray-200 mb-12 max-w-2xl mx-auto">
              Job Ads from thousands of websites in just one search.
            </p>

            <div className="max-w-4xl mx-auto mb-12">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-grow relative">
                  <input
                    type="text"
                    placeholder="What? Job or company name"
                    className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Search className="absolute right-4 top-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Where? City or county"
                  className="flex-grow p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out"
                  value="Cambridge"
                  readOnly={true}
                />
                <button 
                  onClick={handleSearch}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Search
                </button>
              </div>
            </div>
            
            {/* Conditionally render NewsLetterSubscription based on isSubscribed */}
            {!isSubscribed && (
              <NewsLetterSubscription 
                email={email}
                setEmail={setEmail}
                // handleSubscribe={handleSubscribe}
              />
            )}

            {notification && (
              <NotificationForEmail
                message={notification.message}
                type={notification.type}
                onClose={closeNotification}
              />
            )}
          </div>
        </div>

        {!loadingCategories && !loadingJobs && (
          <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-semibold mb-8 text-gray-800">Job vacancies by category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
                {Object.entries(categories).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-lg font-medium mb-3 text-gray-700">{category}</h3>
                    <ul className="space-y-2">
                      {items.map(item => (
                        <li key={item.pageName}>
                          <a 
                            href={`/category/${item.keyword}`} 
                            className="text-green-600 hover:text-green-800 hover:underline text-sm transition duration-150 ease-in-out"
                          >
                            {item.keyword} jobs in Cambridge
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default JobBoard;