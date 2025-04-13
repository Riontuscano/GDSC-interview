import { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

// Memoize interest option component for better performance
const InterestOption = memo(({ interest, isSelected, darkMode, onClick }) => (
  <div 
    onClick={onClick}
    className={`px-3 py-2 border rounded-md text-sm cursor-pointer transition-colors duration-200 ${
      isSelected
        ? darkMode
          ? 'bg-teal-800 border-teal-600 text-white'
          : 'bg-blue-100 border-blue-300 text-blue-800'
        : darkMode
          ? 'bg-slate-800 border-slate-700 hover:bg-slate-700'
          : 'bg-white border-gray-300 hover:bg-gray-50'
    }`}
  >
    {interest}
  </div>
));

export default function SignUp() {
  const { darkMode } = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    college: '',
    year: '',
    branch: '',
    interests: [],
  });
  
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const interestOptions = [
    'Web Development',
    'App Development',
    'Machine Learning',
    'Cloud Computing',
    'UI/UX Design',
    'Blockchain',
    'Cybersecurity',
    'Data Science',
    'IoT',
    'AR/VR',
  ];

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    
    // Clear error for this field when user types
    setErrors(prevErrors => {
      if (prevErrors[name]) {
        return {
          ...prevErrors,
          [name]: '',
        };
      }
      return prevErrors;
    });
  }, []);

  const handleInterestToggle = useCallback((interest) => {
    setFormData(prevData => {
      const newInterests = prevData.interests.includes(interest)
        ? prevData.interests.filter(item => item !== interest)
        : [...prevData.interests, interest];
        
      return {
        ...prevData,
        interests: newInterests,
      };
    });
    
    // Clear interest error
    setErrors(prevErrors => {
      if (prevErrors.interests) {
        return {
          ...prevErrors,
          interests: '',
        };
      }
      return prevErrors;
    });
  }, []);

  const validateStep1 = () => {
    const stepErrors = {};
    
    if (!formData.firstName.trim()) stepErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) stepErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      stepErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      stepErrors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      stepErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      stepErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      stepErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = () => {
    const stepErrors = {};
    
    if (!formData.phone.trim()) stepErrors.phone = 'Phone number is required';
    if (!formData.college.trim()) stepErrors.college = 'College name is required';
    if (!formData.year) stepErrors.year = 'Year is required';
    if (!formData.branch.trim()) stepErrors.branch = 'Branch is required';
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep3 = () => {
    const stepErrors = {};
    
    if (formData.interests.length === 0) {
      stepErrors.interests = 'Select at least one interest';
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 3 && validateStep3()) {
      setIsSubmitting(true);
      
      try {
        // Use the register function from AuthContext
        await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          college: formData.college,
          year: formData.year,
          branch: formData.branch,
          interests: formData.interests,
        });
        
        // Navigate to home page on successful registration
        navigate('/');
        
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({ submit: error.message || 'Failed to submit form. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <main className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-slate-900 text-white' : 'bg-sky-50 text-gray-900'}`}>
      <div className="max-w-md w-full mx-auto space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold">
            Join Unplug Community
          </h2>
          <p className={`mt-2 ${darkMode ? 'text-teal-300' : 'text-blue-600'}`}>
            Sign up to be part of our tech community
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className={`h-2.5 rounded-full ${darkMode ? 'bg-teal-500' : 'bg-blue-600'}`} style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
        
        <div className="flex justify-between text-sm mb-8">
          <span className={step >= 1 ? (darkMode ? 'text-teal-300' : 'text-blue-600') : 'text-gray-400'}>Account</span>
          <span className={step >= 2 ? (darkMode ? 'text-teal-300' : 'text-blue-600') : 'text-gray-400'}>Education</span>
          <span className={step >= 3 ? (darkMode ? 'text-teal-300' : 'text-blue-600') : 'text-gray-400'}>Interests</span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm
                      ${darkMode 
                        ? 'bg-slate-800 border-slate-600 focus:border-teal-500 focus:ring-teal-500' 
                        : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }
                      ${errors.firstName ? 'border-red-500' : ''}
                    `}
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm
                      ${darkMode 
                        ? 'bg-slate-800 border-slate-600 focus:border-teal-500 focus:ring-teal-500' 
                        : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }
                      ${errors.lastName ? 'border-red-500' : ''}
                    `}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm
                    ${darkMode 
                      ? 'bg-slate-800 border-slate-600 focus:border-teal-500 focus:ring-teal-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }
                    ${errors.email ? 'border-red-500' : ''}
                  `}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm
                    ${darkMode 
                      ? 'bg-slate-800 border-slate-600 focus:border-teal-500 focus:ring-teal-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }
                    ${errors.password ? 'border-red-500' : ''}
                  `}
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm
                    ${darkMode 
                      ? 'bg-slate-800 border-slate-600 focus:border-teal-500 focus:ring-teal-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }
                    ${errors.confirmPassword ? 'border-red-500' : ''}
                  `}
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Educational Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm
                    ${darkMode 
                      ? 'bg-slate-800 border-slate-600 focus:border-teal-500 focus:ring-teal-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }
                    ${errors.phone ? 'border-red-500' : ''}
                  `}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="college" className="block text-sm font-medium mb-1">College/University</label>
                <input
                  id="college"
                  name="college"
                  type="text"
                  value={formData.college}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm
                    ${darkMode 
                      ? 'bg-slate-800 border-slate-600 focus:border-teal-500 focus:ring-teal-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }
                    ${errors.college ? 'border-red-500' : ''}
                  `}
                />
                {errors.college && <p className="mt-1 text-sm text-red-500">{errors.college}</p>}
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium mb-1">Year of Study</label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm
                    ${darkMode 
                      ? 'bg-slate-800 border-slate-600 focus:border-teal-500 focus:ring-teal-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }
                    ${errors.year ? 'border-red-500' : ''}
                  `}
                >
                  <option value="" disabled>Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5+">5+ Year</option>
                </select>
                {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year}</p>}
              </div>

              <div>
                <label htmlFor="branch" className="block text-sm font-medium mb-1">Branch/Major</label>
                <input
                  id="branch"
                  name="branch"
                  type="text"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm
                    ${darkMode 
                      ? 'bg-slate-800 border-slate-600 focus:border-teal-500 focus:ring-teal-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }
                    ${errors.branch ? 'border-red-500' : ''}
                  `}
                />
                {errors.branch && <p className="mt-1 text-sm text-red-500">{errors.branch}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Technical Interests */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">Technical Interests (select all that apply)</label>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map(interest => (
                    <InterestOption
                      key={interest}
                      interest={interest}
                      isSelected={formData.interests.includes(interest)}
                      darkMode={darkMode}
                      onClick={() => handleInterestToggle(interest)}
                    />
                  ))}
                </div>
                {errors.interests && <p className="mt-1 text-sm text-red-500">{errors.interests}</p>}
              </div>

              <div className="pt-4">
                <label className="block text-sm font-medium mb-1">By clicking Submit, you agree to our Terms of Service and Privacy Policy</label>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
                  ${darkMode 
                    ? 'bg-slate-700 text-white hover:bg-slate-600' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
              >
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                  ${darkMode 
                    ? 'bg-teal-600 hover:bg-teal-700 ml-auto' 
                    : 'bg-blue-600 hover:bg-blue-700 ml-auto'
                  }`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white flex items-center
                  ${darkMode 
                    ? 'bg-teal-600 hover:bg-teal-700 ml-auto' 
                    : 'bg-blue-600 hover:bg-blue-700 ml-auto'
                  }
                  ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                `}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Submit'}
              </button>
            )}
          </div>
          
          {errors.submit && (
            <p className="mt-2 text-center text-sm text-red-500">{errors.submit}</p>
          )}
        </form>

        <div className="text-center mt-4">
          <p className="text-sm">
            Already have an account?{' '}
            <Link to="/login" className={darkMode ? 'text-teal-300 hover:text-teal-200' : 'text-blue-600 hover:text-blue-500'}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
} 