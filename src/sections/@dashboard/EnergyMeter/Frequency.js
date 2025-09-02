import React, { useState, useEffect } from "react";
import GaugeChart from "react-gauge-chart";
import { Card, Typography, styled } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Biogasapi from "../../../pages/apis/Biogasapi";

import Iconify from "../../../components/iconify"; // Assuming you have an Iconify component

const StyledIcon = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(10), // Increase the width of the icon
  height: theme.spacing(10), // Increase the height of the icon
  justifyContent: "center",
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary,
  backgroundImage: (theme) =>
    `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
      theme.palette.primary.dark,
      0.24
    )} 100%)`,
}));

const GaugePopup = styled("div")({
  height: 150,
  margin: "auto",
  marginBottom: 50,
  transition: "transform 0.3s ease-in-out",
});

const Frequency = () => {
  const [methane4, setMethane4] = useState(0.0)
  const [lastValidMethane4, setLastValidMethane4] = useState(0.0)
  const [value, setValue] = useState(0.5); // Initial value
  const [isPopped, setIsPopped] = useState(false);

  // Function to validate if the value is reasonable
  const isValidMethaneValue = (value) => {
    return value !== null && value !== undefined && !isNaN(value) && value >= 0 && value <= 1000000;
  };

  // Simulate live data updates
  useEffect(() => {
    const fetchrecentvalues = async () => {
      try {
          const response = await Biogasapi.get("/dashboard?device_id=1368");
  
          if (!response.error && response.data && response.data.length > 0) {
            const firstSensorValue = response.data[0];

            // Only proceed if we have a valid methane4 value
            if (firstSensorValue.methane4 !== null && firstSensorValue.methane4 !== undefined) {
              const newMethane4 = parseFloat(firstSensorValue.methane4);
              
              if (isValidMethaneValue(newMethane4)) {
                setMethane4(newMethane4);
                setLastValidMethane4(newMethane4);
                console.log(`Methane4 updated: ${lastValidMethane4} -> ${newMethane4}`);
              } else {
                console.warn('Invalid methane4 value received:', newMethane4);
                setMethane4(lastValidMethane4); // Keep last valid value
              }
            } else {
              console.warn('No methane4 data in response, keeping last value:', lastValidMethane4);
              setMethane4(lastValidMethane4);
            }
          }
      } catch (err) {
          console.error('Error fetching methane4 data:', err.message);
          setMethane4(lastValidMethane4); // Keep last valid value on error
      } 
  };

    fetchrecentvalues(); // Initial fetch
    const interval = setInterval(fetchrecentvalues, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Remove the problematic useEffect that was resetting the value
  // useEffect(() => {
  //   setValue(methane4);
  //   setIsPopped(true);
  //   setTimeout(() => {
  //     setIsPopped(false);
  //   }, 300);
  // }, [methane4]);
  return (
    <Card
      sx={{
        width: "100%", height:180,
        margin:0,
        marginTop:2 ,
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        boxShadow: 20,
        color: "white",
        bgcolor: "#a382c6",
      }}
    >
      <div
        style={{
          background: "#67367c", // Darker background for header
          padding: "10px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="subtitle1"><h4>Standard Flow</h4></Typography>
      </div>

      <StyledIcon>
        <Iconify icon={"Red"} width={24} height={24} />
      </StyledIcon>

      <div
        style={{
          padding: "10px",
          textAlign: "center",
          height: 150, margin: 'auto', marginBottom: 50,
          
        }}
      >
        <Typography variant="h4">
          {`${(methane4).toFixed(2)} Nm3/h`}
        </Typography>
      </div>
    </Card>
  );
};

export default Frequency;
