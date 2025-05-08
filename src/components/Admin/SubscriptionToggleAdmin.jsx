import React, { useState, useEffect } from "react";
import { useSubscriptionToggle } from "../../context/SubscriptionToggleContext";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";

const SubscriptionToggleAdmin = () => {
  const {
    wantSubscription,
    loading,
    error,
    updateSubscriptionToggle,
    fetchSubscriptionToggle,
  } = useSubscriptionToggle();
  const [editMode, setEditMode] = useState(false);
  const [toggleValue, setToggleValue] = useState(wantSubscription);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setToggleValue(wantSubscription);
  }, [wantSubscription]);

  const handleEdit = () => {
    setEditMode(true);
    setFeedback("");
  };

  const handleCancel = () => {
    setEditMode(false);
    setToggleValue(wantSubscription);
    setFeedback("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback("");
    try {
      await updateSubscriptionToggle(toggleValue);
      setFeedback("Subscription toggle updated successfully.");
      setEditMode(false);
      fetchSubscriptionToggle();
    } catch (err) {
      setFeedback("Failed to update subscription toggle.");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-[var(--primary-black)] text-white">
      <AdminHeader />
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Subscription Toggle (Admin)
          </h1>
          {loading ? (
            <div className="flex justify-center items-center" style={{ height: "200px" }}>
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--accent-teal)]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg text-center">{error}</div>
          ) : (
            <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-8">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-semibold text-lg">Require Subscription:</span>
                {editMode ? (
                  <select
                    className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] focus:border-transparent"
                    value={toggleValue ? "true" : "false"}
                    onChange={e => setToggleValue(e.target.value === "true")}
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-sm ${wantSubscription ? "bg-[var(--accent-teal)]/20 text-[var(--accent-teal)]" : "bg-gray-600/20 text-gray-300"}`}>
                    {wantSubscription ? "Enabled" : "Disabled"}
                  </span>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                {editMode ? (
                  <>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--primary-violet)] to-[var(--accent-teal)] text-white hover:opacity-90 transition-opacity"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-colors"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                )}
              </div>
              {feedback && (
                <div className="text-center mt-4 font-medium text-green-400">{feedback}</div>
              )}
            </div>
          )}
        </div>
      </main>
      <AdminFooter />
    </div>
  );
};

export default SubscriptionToggleAdmin;
