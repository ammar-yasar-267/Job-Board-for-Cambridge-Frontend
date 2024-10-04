import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Briefcase, MapPin, Clock, CreditCard, Calendar } from 'lucide-react';

const AllJobsFromCategoryPage = () => {
  const { category } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Filter states
  const [sortBy, setSortBy] = useState('');
  const [datePosted, setDatePosted] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [location, setLocation] = useState('');
  const [company, setCompany] = useState('');
  const [contractType, setContractType] = useState('');
  const [hours, setHours] = useState('');

  const fetchJobs = async (filters) => {
    try {
      const queryParams = new URLSearchParams({
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.datePosted && { datePosted: filters.datePosted }),
        ...(filters.salaryRange && { salaryRange: filters.salaryRange }),
        ...(filters.isRemote && { isRemote: filters.isRemote }),
        ...(filters.location && { location: filters.location }),
        ...(filters.company && { company: filters.company }),
        ...(filters.contractType && { contractType: filters.contractType }),
        ...(filters.hours && { hours: filters.hours })
      });

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/pages/${category}?${queryParams}`
      );
      const data = await response.json();

      // Directly use the jobs array
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs({
      sortBy,
      datePosted,
      salaryRange,
      isRemote,
      location,
      company,
      contractType,
      hours
    });
  }, [category, sortBy, datePosted, salaryRange, isRemote, location, company, contractType, hours]);

  const handleSearch = () => {
    if (searchTerm) {
      navigate(`/jobs/${searchTerm}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 select-none">
      <div className="bg-green-600 p-6 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center space-x-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="What job are you looking for?"
                className="w-full p-3 pr-10 rounded-lg border-2 border-green-500 focus:outline-none focus:border-green-700"
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Search className="absolute right-3 top-3 text-green-600" />
            </div>
            <input
              type="text"
              placeholder="Cambridge"
              className="w-48 p-3 rounded-lg border-2 border-green-500 focus:outline-none focus:border-green-700"
              value="Cambridge"
              readOnly={true}
            />
            <button
              onClick={handleSearch}
              className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition duration-300"
            >
              Search Jobs
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">{jobs.length} {category} Jobs in Cambridge</h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Filter Results</h3>
                  <FilterSection title="Sort by">
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="">Default</option>
                      <option value="date_posted">Date posted</option>
                      <option value="salary_asc">Salary (Low to High)</option>
                      <option value="salary_desc">Salary (High to Low)</option>
                    </select>
                  </FilterSection>

                  <FilterSection title="Date posted">
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={datePosted}
                      onChange={(e) => setDatePosted(e.target.value)}
                    >
                      <option value="">Any time</option>
                      <option value="1">Last 24 hours</option>
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                    </select>
                  </FilterSection>

                  <FilterSection title="Salary">
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.value)}
                    >
                      <option value="">Any</option>
                      <option value="0-30000">Up to £30,000</option>
                      <option value="30000-50000">£30,000 - £50,000</option>
                      <option value="50000-75000">£50,000 - £75,000</option>
                      <option value="75000-100000">£75,000 - £100,000</option>
                      <option value="100000-999999">£100,000+</option>
                    </select>
                  </FilterSection>

                  <FilterSection title="Contract type">
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={contractType}
                      onChange={(e) => setContractType(e.target.value)}
                    >
                      <option value="">Any</option>
                      <option value="permanent">Permanent</option>
                      <option value="contract">Contract</option>
                    </select>
                  </FilterSection>

                  <FilterSection title="Hours" last={true}>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                    >
                      <option value="">Any</option>
                      <option value="full_time">Full Time</option>
                      <option value="part_time">Part Time</option>
                    </select>
                  </FilterSection>
                </div>
              </div>
              <div className="w-full md:w-3/4">
                {jobs.length > 0 ? (
                  jobs.map((job, index) => (
                    <JobCard key={job.id || index} job={job} />
                  ))
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-gray-600">No jobs found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const FilterSection = ({ title, children, last = false }) => (
  <div className={`py-3 ${!last ? 'border-b border-gray-200' : ''}`}>
    <h4 className="font-semibold text-gray-700 mb-2">{title}</h4>
    {children}
  </div>
);

const JobCard = ({ job }) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-4 hover:shadow-lg transition duration-300">
    <h3 className="text-xl font-semibold mb-2 text-green-600">{job.job_title}</h3>
    <p className="font-semibold text-gray-700">{job.company}</p>
    <div className="flex flex-wrap items-center mt-2 text-gray-600">
      <div className="flex items-center mr-4 mb-2">
        <MapPin size={18} className="mr-1" />
        <span>{job.location}</span>
      </div>
      <div className="flex items-center mr-4 mb-2">
        <CreditCard size={18} className="mr-1" />
        <span>£{job.salary_min} - £{job.salary_max} {job.salary_max ? 'Per Year' : ''}</span>
      </div>
      {job.contract_type && (
        <div className="flex items-center mr-4 mb-2">
          <Briefcase size={18} className="mr-1" />
          <span>{job.contract_type === 'permanent' ? 'Permanent' : job.contract_type === 'contract' ? 'Contract' : job.contract_type}</span>
        </div>
      )}
      {job.contract_time && (
        <div className="flex items-center mr-4 mb-2">
          <Clock size={18} className="mr-1" />
          <span>{job.contract_time === 'part_time' ? 'Part Time' : job.contract_time === 'full_time' ? 'Full Time' : job.contract_time}</span>
        </div>
      )}
      {job.date_posted && (
        <div className="flex items-center mb-2">
          <Calendar size={18} className="mr-1" />
          <span>Posted {new Date(job.date_posted).toLocaleDateString()}</span>
        </div>
      )}
    </div>
    <div className="mt-4">
      <a 
        href={job.redirect_url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300"
      >
        View Job
      </a>
    </div>
  </div>
);

export default AllJobsFromCategoryPage;