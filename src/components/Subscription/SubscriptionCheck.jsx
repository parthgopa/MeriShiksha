import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscriptionToggle } from '../../context/SubscriptionToggleContext';
import ApiLimitModal from './ApiLimitModal';
import api from '../../api/axios';

/**
 * A reusable component that checks if a user has API calls remaining or an active subscription
 * before allowing them to make API calls.
 * 
 * @param {Object} props
 * @param {Function} props.onSuccess - Function to call when user has API calls remaining
 * @param {Function} props.onError - Optional function to call when there's an error
 * @param {string} props.redirectPath - Optional path to redirect to if user is not logged in
 * @param {boolean} props.checkOnMount - Whether to check subscription on component mount
 */
const SubscriptionCheck = ({ 
  onSuccess, 
  onError, 
  redirectPath = '/login',
  checkOnMount = true,
  children 
}) => {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { currentUser, updateProfile } = useAuth();
  const { wantSubscription } = useSubscriptionToggle();
  const navigate = useNavigate();
  
  // Function to check if user can make API calls
  const checkApiAccess = async () => {
    if (isChecking) return; // Prevent multiple simultaneous checks
    
    setIsChecking(true);
    
    try {
      // If subscription feature is disabled, allow access without checks
      if (!wantSubscription) {
        console.log('Subscription system is disabled, granting API access');
        setIsChecking(false);
        setShowLimitModal(false); // Ensure modal is hidden
        if (onSuccess) onSuccess();
        return true;
      }
      
      // Check if user is logged in
      
      // Check if user has unlimited API calls (subscribed user) or has remaining calls
      // Use api_calls_remaining if available, otherwise fall back to max_api_calls
      const apiCallsRemaining = currentUser.api_calls_remaining !== undefined ? 
        currentUser.api_calls_remaining : currentUser.max_api_calls;
      const maxApiCalls = currentUser.max_api_calls;
      
      console.log('Current user data:', {
        max_api_calls: maxApiCalls,
        api_calls_remaining: apiCallsRemaining,
        user_id: currentUser.id,
        subscription_enabled: wantSubscription
      });
      
      // User has unlimited API calls (-1) or has remaining calls (> 0)
      if (maxApiCalls === -1 || apiCallsRemaining > 0) {
        // If not unlimited, decrement API call count
        if (maxApiCalls !== -1) {
          try {
            console.log('Decrementing API call count...');
            const response = await api.post("/api/user/decrement-api-calls", {}, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            
            // Update user in context with new API call count
            if (response.data) {
              console.log('API call decremented, new count:', response.data.max_api_calls);
              updateProfile(response.data);
              
              // Check if this was the last API call
              if (response.data.max_api_calls === 0) {
                console.log('Last API call used, will show modal on next attempt');
              }
            }
          } catch (error) {
            console.error("Error updating API call count:", error);
            if (onError) onError(error);
            setIsChecking(false);
            return false;
          }
        } else {
          console.log('User has unlimited API calls (premium subscription)');
        }
        
        // Success path - user has API calls available
        setIsChecking(false);
        setShowLimitModal(false); // Ensure modal is hidden
        if (onSuccess) onSuccess();
        return true;
      } else {
        // User has no API calls remaining
        console.log('No API calls remaining, showing limit modal');
        setShowLimitModal(true);
        setIsChecking(false);
        if (onError) onError(new Error("No API calls remaining"));
        return false;
      }
    } catch (error) {
      console.error("Error checking API access:", error);
      setIsChecking(false);
      if (onError) onError(error);
      return false;
    }
  };

  // Check on component mount if enabled, but only once
  useEffect(() => {
    // Only check on initial mount or when user changes
    if (checkOnMount) {
      console.log('Component mounted, checking API access...');
      // Reset modal state when component mounts
      setShowLimitModal(false);
      checkApiAccess();
    }
  }, [checkOnMount, currentUser?.id]); // Only depend on user ID to prevent unnecessary checks

  const handleCloseModal = () => {
    setShowLimitModal(false);
  };

  // Create a wrapper component to avoid passing checkApiAccess to DOM elements
  const ChildrenWithCheck = () => {
    if (!children) return null;
    
    // If children is a React element, clone it and pass the checkApiAccess function
    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        // Don't pass checkApiAccess to DOM elements
        ...(typeof children.type !== 'string' ? { checkApiAccess } : {})
      });
    }
    
    // If children is a function, call it with checkApiAccess
    if (typeof children === 'function') {
      return children({ checkApiAccess });
    }
    
    // Otherwise, just return the children
    return children;
  };

  return (
    <>
      <ChildrenWithCheck />
      {showLimitModal && (
        <ApiLimitModal 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
};

export default SubscriptionCheck;
