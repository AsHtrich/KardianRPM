import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Go back to the previous page
  const goBack = () => {
    navigate(-1);  // This will take the user to the previous page
  };

  // Fetch all alerts from the API
  const getAlerts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to a specific alert detail page
  const viewAlert = (alertID) => {
    navigate(`/alerts/${alertID}`);
  };

  return (
    <div className="alerts-container">
      <div className="buttons">
        {/* Go Back Button */}
        <button onClick={goBack} className="btn go-back">
          Go Back
        </button>

        {/* Get Alerts Button */}
        <button onClick={getAlerts} className="btn get-alerts">
          Get Alerts
        </button>
      </div>

      {/* Show Alerts Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="alerts-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Alert Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <tr key={alert.id}>
                    <td>{alert.id}</td>
                    <td>{alert.name}</td>
                    <td>{alert.description}</td>
                    <td>
                      {/* View Button for each alert */}
                      <button onClick={() => viewAlert(alert.id)} className="btn view-btn">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No alerts found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Alerts;
