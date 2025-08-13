import React, { useState, useEffect } from 'react';
import './SensorValuePopup.css'; // Import the CSS file
import GaugeChart from 'react-gauge-chart';
import Biogasapi from './apis/Biogasapi';

const SensorValuePopup = ({ sensorId, onClose }) => {
  const [sensorValues, setSensorValues] = useState([]);   // Whole set of values in array
  const [loading, setLoading] = useState(true);

  const fetchSensorValue = async (sensorId) => {
    try {
      const response = await Biogasapi.get("/get-sensor-value", {
            headers: { sensor_id: sensorId }
          });
          const jsonData = response.data;
          setSensorValues(jsonData);
    } catch (err) {
      console.error(err.message);
    } finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSensorValue(sensorId);

    // Start an interval to refresh sensor values every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchSensorValue(sensorId);
    }, 10000); // 30 seconds in milliseconds

    // Cleanup the interval when the component unmounts or the popup is closed
    return () => {
      clearInterval(refreshInterval);
    };
  }, [sensorId]);

  return (
    <div className="sensor-value-popup-container">
      <div className="sensor-value-popup">
        <h2>Sensor Value</h2>
        {!loading ? (
          <>
            <GaugeChart
              id="sensor-gauge"
              nrOfLevels={10}
              colors={["#FF5F6D", "#FFC371"]}
              arcWidth={0.3}
              percent={sensorValues.length > 0 ? parseFloat(sensorValues[0].value) / 100 : 0}
              animate
            />
            <p>{sensorValues[0].value}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SensorValuePopup;
