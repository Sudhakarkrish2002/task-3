/**
 * API Utility Module
 * 
 * This module provides organized API functions for all backend endpoints.
 * 
 * USAGE:
 * - Use the organized API modules (authAPI, courseAPI, blogAPI, etc.) for standard operations
 * - Use apiRequest (default export) only for custom endpoints not covered by modules
 * 
 * Example:
 *   import { authAPI, courseAPI } from '../utils/api.js'
 *   const response = await authAPI.login({ email, password })
 *   const courses = await courseAPI.getAllCourses()
 */

// API base URL configuration
// Normalize so that the final base always ends with `/api`
let rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

if (rawBaseUrl.endsWith('/')) {
  rawBaseUrl = rawBaseUrl.slice(0, -1);
}
if (!rawBaseUrl.endsWith('/api')) {
  rawBaseUrl = `${rawBaseUrl}/api`;
}

const API_BASE_URL = rawBaseUrl;

// Get auth token from localStorage for active role
const getAuthToken = (role = null) => {
  // If role is specified, get token for that role
  if (role) {
    return localStorage.getItem(`token_${role}`);
  }
  
  // Otherwise, get token for active role
  const activeRole = localStorage.getItem('activeRole');
  if (activeRole) {
    return localStorage.getItem(`token_${activeRole}`);
  }
  
  // Fallback to old token format for backward compatibility
  return localStorage.getItem('token');
};

// Base API request function (used internally by all API modules)
// Export as default for custom API calls that don't fit into modules
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    // Add timeout to fetch (30 seconds for Render.com cold starts)
    const timeoutMs = 30000;
    const controller = new AbortController();
    let timeoutId;
    
    // Create timeout promise as backup (in case AbortController doesn't work)
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        controller.abort(); // Also abort the controller
        reject(new Error(`Request timeout after ${timeoutMs}ms - Server may be sleeping (Render.com free tier) or slow to respond`));
      }, timeoutMs);
    });
    
    // Add abort signal to config
    const configWithTimeout = {
      ...config,
      signal: controller.signal
    };
    
    let response;
    try {
      // Use Promise.race to ensure timeout works even if AbortController fails
      const fetchPromise = fetch(url, configWithTimeout).then(res => {
        if (timeoutId) clearTimeout(timeoutId);
        return res;
      }).catch(err => {
        if (timeoutId) clearTimeout(timeoutId);
        throw err;
      });
      
      response = await Promise.race([fetchPromise, timeoutPromise]);
    } catch (fetchError) {
      if (timeoutId) clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError' || fetchError.message.includes('timeout')) {
        const timeoutError = new Error(`Request timeout after ${timeoutMs}ms - Server may be sleeping (Render.com free tier) or slow to respond`);
        timeoutError.status = 0;
        timeoutError.isTimeout = true;
        throw timeoutError;
      }
      throw fetchError;
    }
    
    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('JSON parse error:', parseError.message);
        throw new Error(`Failed to parse JSON response: ${parseError.message}`);
      }
    } else {
      const text = await response.text();
      console.error('Non-JSON response received:', contentType);
      throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
    }

    if (!response.ok) {
      // Handle 401 Unauthorized - try to refresh token instead of logging out
      if (response.status === 401) {
        // Try to refresh the token
        const token = getAuthToken();
        if (token) {
          try {
            const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            });

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              if (refreshData.success && refreshData.token) {
                // Update token in localStorage for active role
                const activeRole = localStorage.getItem('activeRole');
                if (activeRole) {
                  localStorage.setItem(`token_${activeRole}`, refreshData.token);
                  if (refreshData.user) {
                    localStorage.setItem(`user_${activeRole}`, JSON.stringify(refreshData.user));
                  }
                } else {
                  // Fallback to old format for backward compatibility
                  localStorage.setItem('token', refreshData.token);
                  if (refreshData.user) {
                    localStorage.setItem('user', JSON.stringify(refreshData.user));
                  }
                }
                // Retry the original request with new token
                const retryConfig = {
                  ...config,
                  headers: {
                    ...config.headers,
                    Authorization: `Bearer ${refreshData.token}`,
                  },
                };
                const retryResponse = await fetch(url, retryConfig);
                const retryContentType = retryResponse.headers.get('content-type');
                if (retryContentType && retryContentType.includes('application/json')) {
                  const retryData = await retryResponse.json();
                  if (retryResponse.ok) {
                    return retryData;
                  } else {
                    // If retry still fails, throw error but don't logout
                    const error = new Error(retryData.message || retryData.error || 'Request failed after token refresh');
                    error.status = retryResponse.status;
                    error.data = retryData;
                    throw error;
                  }
                } else {
                  const retryText = await retryResponse.text();
                  throw new Error(`Server returned non-JSON response: ${retryText.substring(0, 100)}`);
                }
              }
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // If refresh fails, don't logout - just throw the original error
            // User stays logged in and can retry manually
          }
        }
      }
      
      // Handle 429 Rate Limit errors with better messaging
      if (response.status === 429) {
        // Extract retry-after information from headers or response data
        let retryAfter = null;
        const retryAfterHeader = response.headers.get('Retry-After');
        if (retryAfterHeader) {
          retryAfter = parseInt(retryAfterHeader, 10);
        } else if (data.retryAfter) {
          retryAfter = parseInt(data.retryAfter, 10);
        } else if (data.retry_after) {
          retryAfter = parseInt(data.retry_after, 10);
        }
        
        // Validate and normalize retryAfter value
        // If value is unreasonably large (> 1 hour = 3600 seconds), assume it's in milliseconds
        if (retryAfter !== null && !isNaN(retryAfter)) {
          if (retryAfter > 3600) {
            // Likely in milliseconds, convert to seconds
            retryAfter = Math.ceil(retryAfter / 1000);
          }
          // Cap at 1 hour (3600 seconds) for display purposes
          if (retryAfter > 3600) {
            retryAfter = 3600;
          }
          // Ensure it's a positive number
          if (retryAfter < 0) {
            retryAfter = null;
          }
        } else {
          retryAfter = null;
        }
        
        const rateLimitError = new Error(data.message || data.error || 'Too many requests from this IP, please try again later.');
        rateLimitError.status = 429;
        rateLimitError.data = data;
        rateLimitError.retryAfter = retryAfter; // Will be null if not provided or invalid
        throw rateLimitError;
      }
      
      // Handle 403 Forbidden errors - check if it's a role mismatch
      // This can happen during role switching, so we'll still throw but with better context
      if (response.status === 403) {
        const errorMessage = data.message || data.error || 'Access forbidden';
        // Check if it's a role authorization error
        if (errorMessage.includes('not authorized') || errorMessage.includes('role')) {
          // This is expected during role transitions, but we still need to throw
          // The ProtectedRoute should prevent this by waiting for role switch
          const roleError = new Error(errorMessage);
          roleError.status = 403;
          roleError.data = data;
          roleError.isRoleError = true; // Flag to identify role-related errors
          throw roleError;
        }
      }
      
      // Create an error with more details
      const error = new Error(data.message || data.error || 'An error occurred');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // If it's already our custom error, just re-throw it
    if (error.status) {
      throw error;
    }
    // Handle timeout errors
    if (error.message && error.message.includes('timeout')) {
      const timeoutError = new Error('Request timed out. The server may be slow or unresponsive. Please try again.');
      timeoutError.status = 0;
      timeoutError.isTimeout = true;
      timeoutError.originalError = error;
      throw timeoutError;
    }
    
    // Handle network errors
    if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.name === 'TypeError' || error.message.includes('Network request failed'))) {
      const networkError = new Error('Unable to connect to server. Please check your internet connection and ensure the server is running. If using Render.com free tier, the server may be sleeping.');
      networkError.status = 0;
      networkError.isNetworkError = true;
      networkError.originalError = error;
      throw networkError;
    }
    // Otherwise, wrap and throw it
    throw error;
  }
};

// Health check function
export const checkBackendHealth = async () => {
  try {
    const healthUrl = `${API_BASE_URL}/health`;
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout for health check
    });
    
    if (response.ok) {
      const data = await response.json();
      return { healthy: true, data };
    } else {
      return { healthy: false, status: response.status };
    }
  } catch (error) {
    return { healthy: false, error: error.message };
  }
};

// Auth API functions
export const authAPI = {
  // Register user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user (credentials can include email, password, and optional role)
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get current user
  getMe: async () => {
    return apiRequest('/auth/me');
  },

  // Refresh token
  refreshToken: async () => {
    return apiRequest('/auth/refresh-token', {
      method: 'POST',
    });
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return apiRequest('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Get all roles
  getRoles: async () => {
    return apiRequest('/auth/roles');
  },

  // Forgot password
  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Reset password
  resetPassword: async (token, password) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },
};

// Helper function for retry logic with exponential backoff
const retryRequest = async (requestFn, maxRetries = 2, baseDelay = 1000) => {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      return await requestFn();
    } catch (error) {
      lastError = error;
      const shouldRetry = 
        (error.isTimeout || error.isNetworkError || error.status === 0) && 
        attempt < maxRetries;
      
      if (!shouldRetry) {
        break;
      }
    }
  }
  throw lastError;
};

// Course API functions
export const courseAPI = {
  // Get all courses
  getAllCourses: async (params = {}, retryOptions = { maxRetries: 2, enableRetry: true }) => {
    // Convert params to URLSearchParams, handling boolean values correctly
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Convert boolean to string 'true' or 'false'
        if (typeof value === 'boolean') {
          searchParams.append(key, value.toString());
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    const queryString = searchParams.toString();
    const url = `/courses${queryString ? `?${queryString}` : ''}`;
    
    const makeRequest = async () => {
      return await apiRequest(url);
    };
    
    try {
      if (retryOptions.enableRetry) {
        return await retryRequest(makeRequest, retryOptions.maxRetries);
      } else {
        return await makeRequest();
      }
    } catch (error) {
      console.error('Error fetching courses:', error.message);
      throw error;
    }
  },

  // Get course by ID
  getCourseById: async (courseId) => {
    return apiRequest(`/courses/${courseId}`);
  },

  // Get my courses (for students)
  getMyCourses: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/courses/my-courses/list${queryParams ? `?${queryParams}` : ''}`);
  },

  // Get my enrolled courses (for students)
  getMyEnrolledCourses: async () => {
    return apiRequest('/courses/my-enrolled-courses');
  },

  // Enroll in a course (for students)
  enrollInCourse: async (courseId) => {
    return apiRequest(`/courses/${courseId}/enroll`, {
      method: 'POST',
    });
  },

  // Create course (admin/content_writer)
  createCourse: async (courseData) => {
    return apiRequest('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  // Update course (admin/content_writer)
  updateCourse: async (courseId, courseData) => {
    return apiRequest(`/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  // Delete course (admin)
  deleteCourse: async (courseId) => {
    return apiRequest(`/courses/${courseId}`, {
      method: 'DELETE',
    });
  },

  // Publish course (admin/content_writer)
  // Can optionally include courseData and syllabusData for save and publish workflow
  publishCourse: async (courseId, action = 'publish', courseData = null) => {
    const body = { action }
    if (courseData) {
      Object.assign(body, courseData)
    }
    return apiRequest(`/courses/${courseId}/publish`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  // Get course syllabus
  getCourseSyllabus: async (courseId) => {
    return apiRequest(`/courses/${courseId}/syllabus`);
  },

  // Update course syllabus (admin/content_writer)
  updateCourseSyllabus: async (courseId, syllabusData) => {
    return apiRequest(`/courses/${courseId}/syllabus`, {
      method: 'PUT',
      body: JSON.stringify(syllabusData),
    });
  },
};

// Blog API functions
export const blogAPI = {
  // Get all blogs
  getAllBlogs: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/blogs${queryParams ? `?${queryParams}` : ''}`);
  },

  // Get blog by ID
  getBlogById: async (blogId) => {
    return apiRequest(`/blogs/${blogId}`);
  },

  // Get my blogs (admin/content_writer)
  getMyBlogs: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/blogs/my-posts/list${queryParams ? `?${queryParams}` : ''}`);
  },

  // Create blog (admin/content_writer)
  createBlog: async (blogData) => {
    return apiRequest('/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData),
    });
  },

  // Update blog (admin/content_writer)
  updateBlog: async (blogId, blogData) => {
    return apiRequest(`/blogs/${blogId}`, {
      method: 'PUT',
      body: JSON.stringify(blogData),
    });
  },

  // Delete blog (admin/content_writer)
  deleteBlog: async (blogId) => {
    return apiRequest(`/blogs/${blogId}`, {
      method: 'DELETE',
    });
  },

  // Submit blog for review
  submitBlogForReview: async (blogId) => {
    return apiRequest(`/blogs/${blogId}/submit`, {
      method: 'PUT',
    });
  },
};

// Internship API functions
export const internshipAPI = {
  // Get all internships
  getAllInternships: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/internships${queryParams ? `?${queryParams}` : ''}`);
  },

  // Get internship by ID
  getInternshipById: async (internshipId) => {
    return apiRequest(`/internships/${internshipId}`);
  },

  // Get my internships (employer)
  getMyInternships: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/internships/my-internships/list${queryParams ? `?${queryParams}` : ''}`);
  },

  // Create internship (employer)
  createInternship: async (internshipData) => {
    return apiRequest('/internships', {
      method: 'POST',
      body: JSON.stringify(internshipData),
    });
  },

  // Update internship (employer/admin)
  updateInternship: async (internshipId, internshipData) => {
    return apiRequest(`/internships/${internshipId}`, {
      method: 'PUT',
      body: JSON.stringify(internshipData),
    });
  },

  // Delete internship (employer/admin)
  deleteInternship: async (internshipId) => {
    return apiRequest(`/internships/${internshipId}`, {
      method: 'DELETE',
    });
  },

  // Apply to internship (student)
  applyToInternship: async (internshipId, applicationData) => {
    return apiRequest(`/internships/${internshipId}/apply`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  },

  // Update application status (admin/employer)
  updateApplicationStatus: async (internshipId, applicationId, status) => {
    return apiRequest(`/internships/${internshipId}/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Get current student's application details for a specific internship
  getMyApplicationDetails: async (internshipId) => {
    // Must match server route: GET /api/internships/:id/my-application
    return apiRequest(`/internships/${internshipId}/my-application`);
  },
};

// Workshop API functions
export const workshopAPI = {
  // Get all workshops
  getAllWorkshops: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/workshops${queryParams ? `?${queryParams}` : ''}`);
  },

  // Get workshop by ID
  getWorkshopById: async (workshopId) => {
    return apiRequest(`/workshops/${workshopId}`);
  },

  // Get my workshops (employer/admin)
  getMyWorkshops: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/workshops/my-workshops/list${queryParams ? `?${queryParams}` : ''}`);
  },

  // Create workshop (admin/employer)
  createWorkshop: async (workshopData) => {
    return apiRequest('/workshops', {
      method: 'POST',
      body: JSON.stringify(workshopData),
    });
  },

  // Update workshop (admin/employer)
  updateWorkshop: async (workshopId, workshopData) => {
    return apiRequest(`/workshops/${workshopId}`, {
      method: 'PUT',
      body: JSON.stringify(workshopData),
    });
  },

  // Register for workshop (authenticated users)
  registerForWorkshop: async (workshopId, registrationData) => {
    return apiRequest(`/workshops/${workshopId}/register`, {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  },

  // Delete workshop (admin)
  deleteWorkshop: async (workshopId) => {
    return apiRequest(`/workshops/${workshopId}`, {
      method: 'DELETE',
    });
  },

  // Publish workshop (admin)
  publishWorkshop: async (workshopId) => {
    return apiRequest(`/workshops/${workshopId}/publish`, {
      method: 'PUT',
    });
  },

  // Update workshop registration status (admin)
  updateRegistrationStatus: async (workshopId, registrationId, status) => {
    return apiRequest(`/admin/workshops/${workshopId}/registrations/${registrationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Payment API functions
export const paymentAPI = {
  // Create Razorpay order
  createOrder: async (orderData) => {
    return apiRequest('/payments/razorpay/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Verify Razorpay payment
  verifyPayment: async (paymentData) => {
    return apiRequest('/payments/razorpay/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  // Get payment by ID
  getPayment: async (paymentId) => {
    return apiRequest(`/payments/${paymentId}`);
  },

  // Get user's payments
  getMyPayments: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/payments/my-payments/list${queryParams ? `?${queryParams}` : ''}`);
  },

  // Get all payments (admin)
  getAllPayments: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/payments/list${queryParams ? `?${queryParams}` : ''}`);
  },

  // Update payment status (admin)
  updatePaymentStatus: async (paymentId, statusData) => {
    return apiRequest(`/payments/${paymentId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  },

  // Process refund (admin)
  processRefund: async (paymentId, refundData) => {
    return apiRequest(`/payments/${paymentId}/refund`, {
      method: 'PUT',
      body: JSON.stringify(refundData),
    });
  },
};

// Admin API functions
export const adminAPI = {
  // Dashboard
  getDashboardStats: async () => {
    return apiRequest('/admin/dashboard');
  },

  // Student Management
  getAllStudents: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/admin/students${queryParams ? `?${queryParams}` : ''}`);
  },

  getStudentById: async (studentId) => {
    return apiRequest(`/admin/students/${studentId}`);
  },

  updateStudent: async (studentId, studentData) => {
    return apiRequest(`/admin/students/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  },

  exportStudentsData: async () => {
    const token = getAuthToken();
    const url = `${API_BASE_URL}/admin/students/export`;
    
    const config = {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Export failed: ${error}`);
    }
    
    // Return CSV text content
    return await response.text();
  },

  // College Management
  getAllColleges: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/admin/colleges${queryParams ? `?${queryParams}` : ''}`);
  },

  getCollegeById: async (collegeId) => {
    return apiRequest(`/admin/colleges/${collegeId}`);
  },

  approveCollege: async (collegeId, action, data = {}) => {
    return apiRequest(`/admin/colleges/${collegeId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ action, ...data }),
    });
  },

  updateCollegePartnership: async (collegeId, partnershipLevel) => {
    return apiRequest(`/admin/colleges/${collegeId}/partnership`, {
      method: 'PUT',
      body: JSON.stringify({ partnershipLevel }),
    });
  },

  // Course Management
  getAllCourses: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/admin/courses${queryParams ? `?${queryParams}` : ''}`);
  },

  deleteCourse: async (courseId) => {
    return apiRequest(`/courses/${courseId}`, {
      method: 'DELETE',
    });
  },

  // Blog Management
  getAllBlogs: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/admin/blogs${queryParams ? `?${queryParams}` : ''}`);
  },

  approveBlog: async (blogId, action, reason = '') => {
    return apiRequest(`/admin/blogs/${blogId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ action, reason }),
    });
  },

  // Submission Management
  getAllSubmissions: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/admin/submissions${queryParams ? `?${queryParams}` : ''}`);
  },

  reviewSubmission: async (submissionId, action, reviewData = {}) => {
    return apiRequest(`/admin/submissions/${submissionId}/review`, {
      method: 'PUT',
      body: JSON.stringify({ action, ...reviewData }),
    });
  },

  // Internship Management
  getAllInternships: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/admin/internships${queryParams ? `?${queryParams}` : ''}`);
  },

  getInternshipById: async (internshipId) => {
    return apiRequest(`/admin/internships/${internshipId}`);
  },

  getAllInternshipApplications: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/admin/internships/applications${queryParams ? `?${queryParams}` : ''}`);
  },

  approveInternship: async (internshipId, action, rejectionReason = '') => {
    return apiRequest(`/admin/internships/${internshipId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ action, rejectionReason }),
    });
  },

  // Workshop Registration Management
  getAllWorkshopRegistrations: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/admin/workshops/registrations${queryParams ? `?${queryParams}` : ''}`);
  },

  // User Verification
  getUnverifiedUsers: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users/unverified${queryParams ? `?${queryParams}` : ''}`);
  },

  // Consultation Management
  getAllConsultations: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/admin/consultations${queryParams ? `?${queryParams}` : ''}`);
  },

  getConsultationById: async (consultationId) => {
    return apiRequest(`/admin/consultations/${consultationId}`);
  },

  updateConsultation: async (consultationId, consultationData) => {
    return apiRequest(`/admin/consultations/${consultationId}`, {
      method: 'PUT',
      body: JSON.stringify(consultationData),
    });
  },

  deleteConsultation: async (consultationId) => {
    return apiRequest(`/admin/consultations/${consultationId}`, {
      method: 'DELETE',
    });
  },

  // Job Management
  getAllJobs: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/admin/jobs${queryParams ? `?${queryParams}` : ''}`);
  },

  getJobById: async (jobId) => {
    return apiRequest(`/admin/jobs/${jobId}`);
  },
};

// Consultation API (Public)
export const consultationAPI = {
  createConsultation: async (consultationData) => {
    return apiRequest('/consultation', {
      method: 'POST',
      body: JSON.stringify(consultationData),
    });
  },
};

// Job API (Public)
export const jobAPI = {
  getAllJobs: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/jobs${queryParams ? `?${queryParams}` : ''}`);
  },

  getJobById: async (jobId) => {
    return apiRequest(`/jobs/${jobId}`);
  },

  // Admin only
  createJob: async (jobData) => {
    return apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },

  updateJob: async (jobId, jobData) => {
    return apiRequest(`/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  },

  deleteJob: async (jobId) => {
    return apiRequest(`/jobs/${jobId}`, {
      method: 'DELETE',
    });
  },
};

// Export apiRequest as both default and named export for flexibility
// Note: Prefer using the organized API modules (authAPI, courseAPI, etc.) when possible
export { apiRequest };
export default apiRequest;

