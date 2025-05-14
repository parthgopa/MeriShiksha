import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiUsers, FiSend, FiEdit, FiTrash2, FiPlusCircle, FiChevronRight, FiBarChart2, FiEye } from 'react-icons/fi';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';

const MarketingDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalTemplates: 0,
    totalEmailsSent: 0,
    openRate: 0,
    clickRate: 0
  });
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    template_id: '',
    filter_criteria: 'all',
    cta_text: 'Learn More',
    cta_url: ''
  });
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    content: ''
  });
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    fetchCampaigns();
    fetchTemplates();
    calculateStats();
  }, [navigate]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(backendURL + "/api/marketing/campaigns", {
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
      const response = await axios.get(backendURL + "/api/marketing/templates", {
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

  const calculateStats = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll calculate based on local data
      setTimeout(() => {
        setStats({
          totalCampaigns: campaigns.length,
          totalTemplates: templates.length,
          totalEmailsSent: campaigns.reduce((total, campaign) => total + (campaign.stats?.total_sent || 0), 0),
          openRate: 35.8, // Example value
          clickRate: 12.4  // Example value
        });
      }, 500);
    } catch (err) {
      console.error('Error calculating stats:', err);
    }
  };

  const handleSendCampaign = async (campaignId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(backendURL + '/api/marketing/send-campaign', 
        { campaign_id: campaignId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the campaign in the local state
      setCampaigns(campaigns.map(campaign => {
        if (campaign._id === campaignId) {
          return {
            ...campaign,
            last_sent: new Date().toISOString(),
            send_count: (campaign.send_count || 0) + 1,
            stats: response.data.stats
          };
        }
        return campaign;
      }));
      
      // Recalculate stats
      calculateStats();
      setLoading(false);
      alert('Campaign sent successfully!');
    } catch (err) {
      setLoading(false);
      alert('Failed to send campaign: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        await axios.delete(`${backendURL}/api/marketing/campaigns/${campaignId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCampaigns(campaigns.filter(campaign => campaign._id !== campaignId));
        calculateStats();
        setLoading(false);
        alert('Campaign deleted successfully!');
      } catch (err) {
        setLoading(false);
        alert('Failed to delete campaign: ' + (err.response?.data?.error || err.message));
        console.error(err);
      }
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        await axios.delete(`${backendURL}/api/marketing/templates/${templateId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTemplates(templates.filter(template => template._id !== templateId));
        calculateStats();
        setLoading(false);
        alert('Template deleted successfully!');
      } catch (err) {
        setLoading(false);
        alert('Failed to delete template: ' + (err.response?.data?.error || err.message));
        console.error(err);
      }
    }
  };
  
  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${backendURL}/api/marketing/campaigns`,
        newCampaign,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Add the new campaign to the state
      const createdCampaign = {
        ...newCampaign,
        _id: response.data.campaign_id,
        created_at: new Date().toISOString(),
        stats: { total_sent: 0, successful: 0, failed: 0 },
        send_count: 0
      };
      
      setCampaigns([...campaigns, createdCampaign]);
      
      // Reset form and go back to campaigns tab
      setNewCampaign({
        name: '',
        subject: '',
        template_id: '',
        filter_criteria: 'all',
        cta_text: 'Learn More',
        cta_url: ''
      });
      setActiveTab('campaigns');
      calculateStats();
      setLoading(false);
      alert('Campaign created successfully!');
    } catch (err) {
      setLoading(false);
      alert('Failed to create campaign: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };
  
  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('You need to be logged in to create templates');
        setLoading(false);
        return;
      }
      
      // Prepare the template data
      const templateData = {
        name: newTemplate.name,
        description: newTemplate.description || '',
        content: newTemplate.content
      };
      
      console.log('Sending template data:', templateData);
      console.log('Using token:', token);
      
      const response = await axios.post(
        `${backendURL}/api/marketing/templates`,
        templateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Add the new template to the state
      const createdTemplate = {
        ...templateData,
        _id: response.data.template_id,
        created_at: new Date().toISOString()
      };
      
      setTemplates([...templates, createdTemplate]);
      
      // Reset form and go back to templates tab
      setNewTemplate({
        name: '',
        description: '',
        content: ''
      });
      setActiveTab('templates');
      calculateStats();
      setLoading(false);
      alert('Template created successfully!');
    } catch (err) {
      setLoading(false);
      alert('Failed to create template: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };
  
  const handleEditCampaign = (campaignId) => {
    const campaign = campaigns.find(c => c._id === campaignId);
    if (campaign) {
      setEditingCampaign({
        ...campaign,
        template_id: campaign.template_id || ''
      });
      setActiveTab('edit-campaign');
    }
  };
  
  const handleUpdateCampaign = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.put(
        `${backendURL}/api/marketing/campaigns/${editingCampaign._id}`,
        {
          name: editingCampaign.name,
          subject: editingCampaign.subject,
          template_id: editingCampaign.template_id,
          filter_criteria: editingCampaign.filter_criteria,
          cta_text: editingCampaign.cta_text,
          cta_url: editingCampaign.cta_url
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the campaign in the local state
      setCampaigns(campaigns.map(campaign => 
        campaign._id === editingCampaign._id ? editingCampaign : campaign
      ));
      
      setEditingCampaign(null);
      setActiveTab('campaigns');
      setLoading(false);
      alert('Campaign updated successfully!');
    } catch (err) {
      setLoading(false);
      alert('Failed to update campaign: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };
  
  const handleEditTemplate = (templateId) => {
    const template = templates.find(t => t._id === templateId);
    if (template) {
      setEditingTemplate({
        ...template
      });
      setActiveTab('edit-template');
    }
  };
  
  const handleUpdateTemplate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.put(
        `${backendURL}/api/marketing/templates/${editingTemplate._id}`,
        {
          name: editingTemplate.name,
          description: editingTemplate.description || '',
          content: editingTemplate.content
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the template in the local state
      setTemplates(templates.map(template => 
        template._id === editingTemplate._id ? editingTemplate : template
      ));
      
      setEditingTemplate(null);
      setActiveTab('templates');
      setLoading(false);
      alert('Template updated successfully!');
    } catch (err) {
      setLoading(false);
      alert('Failed to update template: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-[var(--primary-black)] text-white">
      <AdminHeader />
      
      {/* Main Content */}
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--accent-teal)]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--primary-violet)]/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-teal)] via-white to-[var(--primary-violet)]">
              Email Marketing Dashboard
            </h1>
            <p className="text-xl text-teal-100">
              Create, manage and analyze your email marketing campaigns
            </p>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[var(--accent-teal)]/10 mr-3">
                  <FiMail className="h-6 w-6 text-[var(--accent-teal)]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Campaigns</p>
                  <p className="text-2xl font-bold text-white">{stats.totalCampaigns}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[var(--accent-teal)]/10 mr-3">
                  <FiEdit className="h-6 w-6 text-[var(--accent-teal)]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Templates</p>
                  <p className="text-2xl font-bold text-white">{stats.totalTemplates}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[var(--accent-teal)]/10 mr-3">
                  <FiSend className="h-6 w-6 text-[var(--accent-teal)]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Emails Sent</p>
                  <p className="text-2xl font-bold text-white">{stats.totalEmailsSent}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[var(--accent-teal)]/10 mr-3">
                  <FiEye className="h-6 w-6 text-[var(--accent-teal)]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Open Rate</p>
                  <p className="text-2xl font-bold text-white">{stats.openRate}%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[var(--accent-teal)]/10 mr-3">
                  <FiBarChart2 className="h-6 w-6 text-[var(--accent-teal)]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Click Rate</p>
                  <p className="text-2xl font-bold text-white">{stats.clickRate}%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 shadow-lg rounded-xl overflow-hidden border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-white">Email Marketing Management</h2>
              <p className="text-gray-400 mt-1">Create and manage your email marketing campaigns and templates</p>
            </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'campaigns' ? 'text-[var(--accent-teal)] border-b-2 border-[var(--accent-teal)]' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('campaigns')}
            >
              Campaigns
            </button>
            
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'templates' ? 'text-[var(--accent-teal)] border-b-2 border-[var(--accent-teal)]' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('templates')}
            >
              Templates
            </button>
            
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'new-campaign' ? 'text-[var(--accent-teal)] border-b-2 border-[var(--accent-teal)]' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('new-campaign')}
            >
              <FiPlusCircle className="inline mr-1" /> New Campaign
            </button>
            
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'new-template' ? 'text-[var(--accent-teal)] border-b-2 border-[var(--accent-teal)]' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('new-template')}
            >
              <FiPlusCircle className="inline mr-1" /> New Template
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
                  <h2 className="text-xl font-medium text-white">Email Campaigns</h2>
                  <button 
                    className="bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center shadow-lg transition-all duration-300"
                    onClick={() => setActiveTab('new-campaign')}
                  >
                    <FiPlusCircle className="mr-2" /> New Campaign
                  </button>
                </div>
                
                {campaigns.length === 0 ? (
                  <div className="bg-gray-800/50 rounded-xl p-10 text-center border border-gray-700">
                    <FiMail className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg mb-4">No campaigns found</p>
                    <button
                      onClick={() => setActiveTab('new-campaign')}
                      className="bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] hover:opacity-90 text-white px-4 py-2 rounded-lg inline-flex items-center shadow-lg transition-all duration-300"
                    >
                      <FiPlusCircle className="mr-2" /> Create your first campaign
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-gray-700">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Subject</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Sent</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stats</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-900 divide-y divide-gray-800">
                        {campaigns.map(campaign => (
                          <tr key={campaign._id} className="hover:bg-gray-800 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-white">{campaign.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-300">{campaign.subject}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-300">
                                {campaign.last_sent ? new Date(campaign.last_sent).toLocaleDateString() : 'Never'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-300">
                                {campaign.stats ? (
                                  <div className="flex items-center">
                                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                    {campaign.stats.successful || 0} sent
                                  </div>
                                ) : 'No data'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                className="text-[var(--accent-teal)] hover:text-white mr-3 transition-colors"
                                onClick={() => handleSendCampaign(campaign._id)}
                              >
                                <FiSend className="inline mr-1" /> Send
                              </button>
                              <button 
                                className="text-[var(--primary-violet)] hover:text-white mr-3 transition-colors"
                                onClick={() => handleEditCampaign(campaign._id)}
                              >
                                <FiEdit className="inline mr-1" /> Edit
                              </button>
                              <button 
                                className="text-red-400 hover:text-red-300 transition-colors"
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
                  <h2 className="text-xl font-medium text-white">Email Templates</h2>
                  <button 
                    className="bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center shadow-lg transition-all duration-300"
                    onClick={() => setActiveTab('new-template')}
                  >
                    <FiPlusCircle className="mr-2" /> New Template
                  </button>
                </div>
                
                {templates.length === 0 ? (
                  <div className="bg-gray-800/50 rounded-xl p-10 text-center border border-gray-700">
                    <FiEdit className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg mb-4">No templates found</p>
                    <button
                      onClick={() => setActiveTab('new-template')}
                      className="bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] hover:opacity-90 text-white px-4 py-2 rounded-lg inline-flex items-center shadow-lg transition-all duration-300"
                    >
                      <FiPlusCircle className="mr-2" /> Create your first template
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(template => (
                      <div key={template._id} className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:border-[var(--accent-teal)] transition-all duration-300 transform hover:scale-[1.02]">
                        <div className="p-5">
                          <h3 className="text-lg font-medium text-white mb-1">{template.name}</h3>
                          <p className="text-sm text-gray-400 mb-4">{template.description || 'No description'}</p>
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500">
                              Created: {new Date(template.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex space-x-3">
                              <button 
                                className="text-[var(--primary-violet)] hover:text-white transition-colors"
                                onClick={() => handleEditTemplate(template._id)}
                                title="Edit template"
                              >
                                <FiEdit size={18} />
                              </button>
                              <button 
                                className="text-red-400 hover:text-red-300 transition-colors"
                                onClick={() => handleDeleteTemplate(template._id)}
                                title="Delete template"
                              >
                                <FiTrash2 size={18} />
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
                <h2 className="text-xl font-medium text-white mb-6">Create New Campaign</h2>
                <form className="space-y-6" onSubmit={handleCreateCampaign}>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Campaign Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-[var(--accent-teal)] focus:border-[var(--accent-teal)] text-white" 
                      placeholder="Enter campaign name"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Subject</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-[var(--accent-teal)] focus:border-[var(--accent-teal)] text-white" 
                      placeholder="Enter email subject"
                      value={newCampaign.subject}
                      onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Select Template</label>
                    <select 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-[var(--accent-teal)] focus:border-[var(--accent-teal)] text-white"
                      value={newCampaign.template_id}
                      onChange={(e) => setNewCampaign({...newCampaign, template_id: e.target.value})}
                      required
                    >
                      <option value="">Select a template</option>
                      {templates.map(template => (
                        <option key={template._id} value={template._id}>{template.name}</option>
                      ))}
                    </select>
                    {templates.length === 0 && (
                      <p className="text-yellow-500 text-xs mt-1">You need to create a template first</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Call to Action Text</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-[var(--accent-teal)] focus:border-[var(--accent-teal)] text-white" 
                      placeholder="e.g., Learn More, Sign Up, Get Started"
                      value={newCampaign.cta_text}
                      onChange={(e) => setNewCampaign({...newCampaign, cta_text: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Call to Action URL</label>
                    <input 
                      type="url" 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-[var(--accent-teal)] focus:border-[var(--accent-teal)] text-white" 
                      placeholder="https://merishiksha.com"
                      value={newCampaign.cta_url}
                      onChange={(e) => setNewCampaign({...newCampaign, cta_url: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">User Filter</label>
                    <select 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-[var(--accent-teal)] focus:border-[var(--accent-teal)] text-white"
                      value={newCampaign.filter_criteria}
                      onChange={(e) => setNewCampaign({...newCampaign, filter_criteria: e.target.value})}
                    >
                      <option value="all">All Users</option>
                      <option value="active">Active Users</option>
                      <option value="inactive">Inactive Users</option>
                      <option value="premium">Premium Users</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button 
                      type="button" 
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg mr-3 transition-colors"
                      onClick={() => setActiveTab('campaigns')}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] hover:opacity-90 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-300"
                      disabled={loading || templates.length === 0}
                    >
                      {loading ? 'Creating...' : 'Create Campaign'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* New Template Form */}
            {activeTab === 'new-template' && (
              <div>
                <h2 className="text-xl font-medium text-white mb-6">Create New Template</h2>
                <form className="space-y-6" onSubmit={handleCreateTemplate}>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Template Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-[var(--accent-teal)] focus:border-[var(--accent-teal)] text-white" 
                      placeholder="Enter template name"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description (Optional)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-[var(--accent-teal)] focus:border-[var(--accent-teal)] text-white" 
                      placeholder="Enter template description"
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                    <textarea 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-[var(--accent-teal)] focus:border-[var(--accent-teal)] text-white h-64 font-mono" 
                      placeholder="Enter email content (HTML supported)"
                      value={newTemplate.content}
                      onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                      required
                    ></textarea>
                    {/* <p className="text-xs text-gray-400 mt-2">
                      You can use <code className="bg-gray-700 px-1 py-0.5 rounded text-[var(--accent-teal)]"></code> and <code className="bg-gray-700 px-1 py-0.5 rounded text-[var(--accent-teal)]">{{email}}</code> as placeholders that will be replaced with the recipient's information.
                    </p> */}
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button 
                      type="button" 
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg mr-3 transition-colors"
                      onClick={() => setActiveTab('templates')}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] hover:opacity-90 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-300"
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Template'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Edit Campaign Form */}
            {activeTab === 'edit-campaign' && editingCampaign && (
              <div>
                <h2 className="text-xl font-medium text-white mb-6">Edit Campaign</h2>
                <form className="space-y-6" onSubmit={handleUpdateCampaign}>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Campaign Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-[var(--accent-teal)] focus:border-[var(--accent-teal)] text-white" 
                      placeholder="Enter campaign name"
                      value={editingCampaign.name}
                      onChange={(e) => setEditingCampaign({...editingCampaign, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Subject</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-[var(--accent-teal)] focus:border-[var(--accent-teal)] text-white" 
                      placeholder="Enter email subject"
                      value={editingCampaign.subject}
                      onChange={(e) => setEditingCampaign({...editingCampaign, subject: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Select Template</label>
                    <select 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-[var(--accent-teal)] focus:border-[var(--accent-teal)] text-white"
                      value={editingCampaign.template_id}
                      onChange={(e) => setEditingCampaign({...editingCampaign, template_id: e.target.value})}
                      required
                    >
                      <option value="">Select a template</option>
                      {templates.map(template => (
                        <option key={template._id} value={template._id}>{template.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Call to Action Text</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-[var(--accent-teal)] focus:border-[var(--accent-teal)] text-white" 
                      placeholder="e.g., Learn More, Sign Up, Get Started"
                      value={editingCampaign.cta_text}
                      onChange={(e) => setEditingCampaign({...editingCampaign, cta_text: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Call to Action URL</label>
                    <input 
                      type="url" 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-[var(--accent-teal)] focus:border-[var(--accent-teal)] text-white" 
                      placeholder="https://merishiksha.com"
                      value={editingCampaign.cta_url}
                      onChange={(e) => setEditingCampaign({...editingCampaign, cta_url: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">User Filter</label>
                    <select 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-[var(--accent-teal)] focus:border-[var(--accent-teal)] text-white"
                      value={editingCampaign.filter_criteria}
                      onChange={(e) => setEditingCampaign({...editingCampaign, filter_criteria: e.target.value})}
                    >
                      <option value="all">All Users</option>
                      <option value="active">Active Users</option>
                      <option value="inactive">Inactive Users</option>
                      <option value="premium">Premium Users</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button 
                      type="button" 
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg mr-3 transition-colors"
                      onClick={() => {
                        setEditingCampaign(null);
                        setActiveTab('campaigns');
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] hover:opacity-90 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-300"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Campaign'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Edit Template Form */}
            {activeTab === 'edit-template' && editingTemplate && (
              <div>
                <h2 className="text-xl font-medium text-white mb-6">Edit Template</h2>
                <form className="space-y-6" onSubmit={handleUpdateTemplate}>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Template Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-[var(--accent-teal)] focus:border-[var(--accent-teal)] text-white" 
                      placeholder="Enter template name"
                      value={editingTemplate.name}
                      onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description (Optional)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-[var(--accent-teal)] focus:border-[var(--accent-teal)] text-white" 
                      placeholder="Enter template description"
                      value={editingTemplate.description || ''}
                      onChange={(e) => setEditingTemplate({...editingTemplate, description: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                    <textarea 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-[var(--accent-teal)] focus:border-[var(--accent-teal)] text-white h-64 font-mono" 
                      placeholder="Enter email content (HTML supported)"
                      value={editingTemplate.content}
                      onChange={(e) => setEditingTemplate({...editingTemplate, content: e.target.value})}
                      required
                    ></textarea>
                    <p className="text-xs text-gray-400 mt-2">
                      You can use <code className="bg-gray-700 px-1 py-0.5 rounded text-[var(--accent-teal)]">{'{{'+'name'+'}}'}</code> and <code className="bg-gray-700 px-1 py-0.5 rounded text-[var(--accent-teal)]">{'{{'+'email'+'}}'}</code> as placeholders that will be replaced with the recipient's information.
                    </p>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button 
                      type="button" 
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg mr-3 transition-colors"
                      onClick={() => {
                        setEditingTemplate(null);
                        setActiveTab('templates');
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="bg-gradient-to-r from-[var(--accent-teal)] to-[var(--primary-violet)] hover:opacity-90 text-white px-6 py-2 rounded-lg shadow-lg transition-all duration-300"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Template'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      </main>
      
      <AdminFooter />
    </div>
  );
};

export default MarketingDashboard;
