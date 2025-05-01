import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import Mylogo from "../../assets/MyLogonew.png";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    plan: "monthly",
    amount: 250
  });

  useEffect(() => {
    // Get plan and amount from location state if available
    if (location.state?.plan && location.state?.amount) {
      setPaymentData(prev => ({
        ...prev,
        plan: location.state.plan,
        amount: location.state.amount
      }));
    }
    
    // Redirect to subscription page if not logged in
    if (!currentUser) {
      navigate("/login", { state: { from: "/payment" } });
    }
  }, [location, navigate, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlanChange = (plan) => {
    setPaymentData(prev => ({
      ...prev,
      plan,
      amount: plan === "yearly" ? 2500 : 250
    }));
  };

  const initiatePayment = async () => {
    setLoading(true);
    setError("");
    
    try {
      // This would be replaced with your actual Paytm integration
      // For now, we'll simulate a successful payment
      
      // 1. In a real implementation, you would call your backend to create a payment order
      // const response = await api.post("/api/user/create-payment", {
      //   amount: paymentData.amount,
      //   plan: paymentData.plan,
      //   userId: currentUser.id
      // });
      
      // 2. Then you would redirect to Paytm payment page or open their SDK
      
      // 3. For this demo, we'll simulate a successful payment after 2 seconds
      setTimeout(async () => {
        // After successful payment, update the user's subscription status
        try {
          // In a real implementation, this would be handled by a webhook
          const response = await api.post("/api/user/update-subscription", {
            plan: paymentData.plan,
            // Set unlimited API calls for subscribers
            max_api_calls: -1, // -1 indicates unlimited
            subscription_end_date: paymentData.plan === "yearly" 
              ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
          
          // Update user in context
          if (response.data) {
            updateProfile(response.data);
          }
          
          setSuccess(true);
          setLoading(false);
          
          // Redirect to home after 3 seconds
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } catch (err) {
          setError("Failed to update subscription. Please contact support.");
          setLoading(false);
        }
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.error || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[var(--primary-black)] text-white py-8 px-4 overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header - More compact */}
        <div className="text-center mb-6">
          <img src={Mylogo} alt="MeriShiksha Logo" className="h-14 mx-auto mb-2" />
          <h1 className="text-2xl font-bold mb-2">
            <span className="text-[var(--accent-teal)]">Complete Your</span> Payment
          </h1>
          <p className="text-base text-gray-300 max-w-2xl mx-auto">
            You're just one step away from unlimited learning
          </p>
        </div>

        {success ? (
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl max-w-md mx-auto p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-4">Payment Successful!</h2>
            <p className="text-gray-300 mb-6">
              Thank you for subscribing to MeriShiksha Premium. Your account has been upgraded.
            </p>
            <Link
              to="/"
              className="bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-all inline-block"
            >
              Continue to Dashboard
            </Link>
          </div>
        ) : (
          /* Two-column layout for larger screens */
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Plan Details */}
            <div className="md:w-1/2">
              {/* Plan Selection */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl mb-6">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] px-5 py-4 text-center">
                  <h2 className="text-xl font-bold text-white">Premium Plan</h2>
                  <div className="mt-1 flex items-center justify-center">
                    <span className="text-3xl font-bold">₹{paymentData.amount}</span>
                    <span className="ml-2 text-base opacity-80">/{paymentData.plan === 'monthly' ? 'month' : 'year'}</span>
                  </div>
                </div>

                {/* Plan Selection */}
                <div className="p-5">
                  <label className="block text-white text-sm font-medium mb-3">Select Billing Cycle</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className={`py-2 px-3 rounded-lg border ${paymentData.plan === 'monthly' ? 'border-[var(--accent-teal)] bg-[var(--accent-teal)]/10' : 'border-gray-700 bg-gray-800'} flex flex-col items-center justify-center transition-all`}
                      onClick={() => handlePlanChange("monthly")}
                    >
                      <span className="font-medium">Monthly</span>
                      <span className="text-xs text-gray-400 mt-1">₹250/month</span>
                    </button>
                    <button
                      type="button"
                      className={`py-2 px-3 rounded-lg border ${paymentData.plan === 'yearly' ? 'border-[var(--accent-teal)] bg-[var(--accent-teal)]/10' : 'border-gray-700 bg-gray-800'} flex flex-col items-center justify-center transition-all`}
                      onClick={() => handlePlanChange("yearly")}
                    >
                      <span className="font-medium">Yearly</span>
                      <span className="text-xs text-gray-400 mt-1">₹2,500/year</span>
                      <span className="text-xs text-[var(--accent-teal)] mt-1">Save ₹500</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-5">
                  <h3 className="font-medium mb-3 text-white">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Plan</span>
                      <span>Premium {paymentData.plan === 'monthly' ? 'Monthly' : 'Yearly'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration</span>
                      <span>{paymentData.plan === 'monthly' ? '1 Month' : '1 Year'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price</span>
                      <span>₹{paymentData.amount}</span>
                    </div>
                    <div className="border-t border-gray-700 my-2 pt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-[var(--accent-teal)]">₹{paymentData.amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Payment Method */}
            <div className="md:w-1/2">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl h-full">
                <div className="p-5">
                  {error && (
                    <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-6">
                      {error}
                    </div>
                  )}
                  
                  {/* Payment Method */}
                  <div className="mb-6">
                    <label className="block text-white text-sm font-medium mb-3">Payment Method</label>
                    <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Paytm</div>
                          <div className="text-xs text-gray-400">You will be redirected to Paytm to complete payment</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info Summary */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3 text-white">Customer Information</h3>
                    <div className="space-y-2 text-sm bg-gray-800/50 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span>{currentUser?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="truncate ml-2">{currentUser?.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <button
                    onClick={initiatePayment}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:ring-opacity-50 disabled:opacity-70 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Processing...
                      </>
                    ) : (
                      'Complete Payment'
                    )}
                  </button>
                  
                  <p className="text-center text-xs text-gray-400 mt-4">
                    By proceeding, you agree to our Terms of Service and Privacy Policy
                  </p>

                  {/* Back Link */}
                  <div className="mt-6 text-center">
                    <Link
                      to="/subscription"
                      className="text-gray-400 hover:text-[var(--accent-teal)] transition-colors text-sm"
                    >
                      ← Back to Plans
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;