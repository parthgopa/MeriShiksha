import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

// Create the context
const SubscriptionToggleContext = createContext();

// Custom hook to use the subscription toggle context
export const useSubscriptionToggle = () => {
  const context = useContext(SubscriptionToggleContext);
  if (!context) {
    throw new Error('useSubscriptionToggle must be used within a SubscriptionToggleProvider');
  }
  return context;
};

// Provider component
export const SubscriptionToggleProvider = ({ children }) => {
  const [wantSubscription, setWantSubscription] = useState(true); // Default to true
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch the subscription toggle state from API
  const fetchSubscriptionToggle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/api/admin/subscription-toggle');
      setWantSubscription(response.data.want_subscription);
      
      console.log('Subscription toggle state:', response.data.want_subscription);
      return response.data.want_subscription;
    } catch (err) {
      console.error('Error fetching subscription toggle:', err);
      setError('Failed to fetch subscription toggle state');
      // Default to true if there's an error
      return true;
    } finally {
      setLoading(false);
    }
  };

  // Function to update the subscription toggle state (admin only)
  const updateSubscriptionToggle = async (newState) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await api.put(
        '/api/admin/subscription-toggle',
        { want_subscription: newState },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setWantSubscription(response.data.want_subscription);
      console.log('Subscription toggle updated:', response.data.want_subscription);
      return response.data;
    } catch (err) {
      console.error('Error updating subscription toggle:', err);
      setError(err.response?.data?.error || 'Failed to update subscription toggle state');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch subscription toggle on mount
  // useEffect(() => {
  //   fetchSubscriptionToggle();
  // }, []);

  // Value to be provided by the context
  const value = {
    wantSubscription,
    loading,
    error,
    fetchSubscriptionToggle,
    updateSubscriptionToggle
  };

  return (
    <SubscriptionToggleContext.Provider value={value}>
      {children}
    </SubscriptionToggleContext.Provider>
  );
};

export default SubscriptionToggleContext;
