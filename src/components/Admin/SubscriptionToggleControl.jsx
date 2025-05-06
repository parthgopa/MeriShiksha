import React, { useState, useEffect } from 'react';
import { useSubscriptionToggle } from '../../context/SubscriptionToggleContext';

/**
 * Admin component to control the subscription model toggle
 * This allows admins to easily switch between subscription-based and subscription-less models
 */
const SubscriptionToggleControl = () => {
  const { 
    wantSubscription, 
    loading, 
    error, 
    updateSubscriptionToggle 
  } = useSubscriptionToggle();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Handle toggle change
  const handleToggleChange = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    
    try {
      await updateSubscriptionToggle(!wantSubscription);
      setUpdateSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      setUpdateError(err.message || 'Failed to update subscription toggle');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
      <h2 className="text-xl font-bold text-white mb-4">
        Subscription Model Control
      </h2>
      
      <div className="mb-6">
        <p className="text-gray-300 mb-2">
          Toggle between subscription-based and subscription-less models for your application.
        </p>
        <p className="text-gray-400 text-sm mb-4">
          When disabled, all users will have unlimited access without subscription checks.
        </p>
        
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2  border-r-2 border-b-2 border-gray-800"></div>
            <span className="ml-2 text-gray-400">Loading...</span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white font-medium">Subscription Model:</span>
              <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                wantSubscription 
                  ? 'bg-green-900/30 text-green-400 border border-green-800' 
                  : 'bg-red-900/30 text-red-400 border border-red-800'
              }`}>
                {wantSubscription ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            
            <button
              onClick={handleToggleChange}
              disabled={isUpdating}
              className={`relative inline-flex h-8 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                wantSubscription ? 'bg-[var(--accent-teal)]' : 'bg-gray-700'
              }`}
            >
              <span className="sr-only">Toggle subscription model</span>
              <span
                className={`pointer-events-none relative inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  wantSubscription ? 'translate-x-8' : 'translate-x-0'
                }`}
              />
              {isUpdating && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-white"></span>
                </span>
              )}
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      {updateError && (
        <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded mb-4">
          Failed to update: {updateError}
        </div>
      )}
      
      {updateSuccess && (
        <div className="bg-green-900/30 border border-green-800 text-green-400 px-4 py-3 rounded mb-4">
          Subscription model successfully {wantSubscription ? 'enabled' : 'disabled'}!
        </div>
      )}
      
      <div className="mt-6 border-t border-gray-800 pt-4">
        <h3 className="text-lg font-medium text-white mb-2">What this means:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="font-bold text-[var(--accent-teal)] mb-2">When Enabled:</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Login/Signup pages are shown</li>
              <li>API usage is monitored</li>
              <li>API limits apply to free users</li>
              <li>Subscription prompts are shown</li>
              <li>Payment options are available</li>
            </ul>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="font-bold text-red-400 mb-2">When Disabled:</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Login/Signup pages are hidden</li>
              <li>No API usage tracking</li>
              <li>No subscription prompts</li>
              <li>All features available to all users</li>
              <li>Payment pages not accessible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionToggleControl;
