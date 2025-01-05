import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

// Request interceptor with better error handling
Api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log the request configuration for debugging
    console.log('Request Config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });

    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);


Api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);
// Review endpoints with error handling
export const getProductReviewsApi = async (productId) => {
  try {
    return await Api.get(`/api/user/reviews/${productId}`);
  } catch (error) {
    console.error('Get Reviews Error:', error);
    throw error;
  }
};

export const createReviewApi = async (reviewData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    return await Api.post('/api/user/create_review', reviewData);
  } catch (error) {
    console.error('Create Review Error:', error);
    throw error;
  }
};

// Profile endpoints
export const getUserDetailsApi = (userId) =>
  Api.get(`/api/user/get_user/${userId}`);

export const updateProfileApi = (userId, formData) =>
  Api.put(`/api/user/update_profile/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const paymentApi = (data) => Api.post('/api/payment/checkout', data);
export const verifyApi = (id) => Api.post('/api/payment/verify-esewa', id);

export const getUserOrdersApi = () =>
  Api.post('/api/order/userorders', {}, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

//search api
export const searchApi = (params) => Api.get(`/api/food/search`, params)

// Forgot password
export const forgotPasswordApi = (data) => Api.post('/api/user/forgot_password', data)

// verify 
export const verifyOtpApi = (data) => Api.post('/api/user/verify_otp', data)

export default Api;