import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiUsers, FiSend, FiEdit, FiTrash2, FiPlusCircle, FiChevronRight } from 'react-icons/fi';

const MarketingDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('campaigns');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
    fetchTemplates();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/marketing/campaigns', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaigns(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch campaigns');
      setLoading(false);
      console.error(err);
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/marketing/templates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplates(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch templates');
      setLoading(false);
      console.error(err);
    }
  };

  const handleSendCampaign = async (campaignId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/marketing/send-campaign', 
        { campaign_id: campaignId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Campaign sent successfully!');
      fetchCampaigns();
    } catch (err) {
      alert('Failed to send campaign');
      console.error(err);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/marketing/campaigns/${campaignId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCampaigns(campaigns.filter(campaign => campaign._id !== campaignId));
        alert('Campaign deleted successfully!');
      } catch (err) {
        alert('Failed to delete campaign');
        console.error(err);
      }
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/marketing/templates/${templateId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTemplates(templates.filter(template => template._id !== templateId));
        alert('Template deleted successfully!');
      } catch (err) {
        alert('Failed to delete template');
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Email Marketing Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your email marketing campaigns and templates</p>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-3 text-sm font-medium ${activeTab === 'campaigns' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('campaigns')}
            >
              Campaigns
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${activeTab === 'templates' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('templates')}
            >
              Templates
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${activeTab === 'new-campaign' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('new-campaign')}
            >
              Create Campaign
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${activeTab === 'new-template' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('new-template')}
            >
              Create Template
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {loading && <p className="text-center py-4">Loading...</p>}
            {error && <p className="text-red-500 text-center py-4">{error}</p>}
            
            {/* Campaigns Tab */}
            {activeTab === 'campaigns' && !loading && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-800">Email Campaigns</h2>
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                    onClick={() => setActiveTab('new-campaign')}
                  >
                    <FiPlusCircle className="mr-2" /> New Campaign
                  </button>
                </div>
                
                {campaigns.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No campaigns found. Create your first campaign!</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Sent</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {campaigns.map(campaign => (
                          <tr key={campaign._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{campaign.subject}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {campaign.last_sent ? new Date(campaign.last_sent).toLocaleDateString() : 'Never'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {campaign.stats ? `${campaign.stats.successful || 0} sent` : 'No data'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                onClick={() => handleSendCampaign(campaign._id)}
                              >
                                <FiSend className="inline mr-1" /> Send
                              </button>
                              <button 
                                className="text-green-600 hover:text-green-900 mr-3"
                                onClick={() => setActiveTab('edit-campaign')}
                              >
                                <FiEdit className="inline mr-1" /> Edit
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleDeleteCampaign(campaign._id)}
                              >
                                <FiTrash2 className="inline mr-1" /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {/* Templates Tab */}
            {activeTab === 'templates' && !loading && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-800">Email Templates</h2>
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                    onClick={() => setActiveTab('new-template')}
                  >
                    <FiPlusCircle className="mr-2" /> New Template
                  </button>
                </div>
                
                {templates.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No templates found. Create your first template!</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(template => (
                      <div key={template._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-5">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">{template.name}</h3>
                          <p className="text-sm text-gray-500 mb-4">{template.description || 'No description'}</p>
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500">
                              Created: {new Date(template.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                className="text-green-600 hover:text-green-900"
                                onClick={() => setActiveTab('edit-template')}
                              >
                                <FiEdit />
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleDeleteTemplate(template._id)}
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* New Campaign Form */}
            {activeTab === 'new-campaign' && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-6">Create New Campaign</h2>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter campaign name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter email subject"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Template</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select a template</option>
                      {templates.map(template => (
                        <option key={template._id} value={template._id}>{template.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Call to Action Text</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="e.g., Learn More, Sign Up, Get Started"
                      defaultValue="Learn More"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Call to Action URL</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="https://merishiksha.com"
                      defaultValue="https://merishiksha.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User Filter (Optional)</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option value="all">All Users</option>
                      <option value="active">Active Users</option>
                      <option value="inactive">Inactive Users</option>
                      <option value="premium">Premium Users</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      type="button" 
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
                      onClick={() => setActiveTab('campaigns')}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      Create Campaign
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* New Template Form */}
            {activeTab === 'new-template' && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-6">Create New Template</h2>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter template name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter template description"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-64" 
                      placeholder="Enter email content (HTML supported)"
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">
                      You can use {{name}} and {{email}} as placeholders that will be replaced with the recipient's information.
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      type="button" 
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
                      onClick={() => setActiveTab('templates')}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      Create Template
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingDashboard;
