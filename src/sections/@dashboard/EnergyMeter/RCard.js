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

const RCard = () => {
  const [methane1, setMethane1] = useState(0.0)
  const [lastValidMethane1, setLastValidMethane1] = useState(0.0)
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

            // Only proceed if we have a valid methane1 value
            if (firstSensorValue.methane1 !== null && firstSensorValue.methane1 !== undefined) {
              const newMethane1 = parseFloat(firstSensorValue.methane1);
              
              if (isValidMethaneValue(newMethane1)) {
                setMethane1(newMethane1);
                setLastValidMethane1(newMethane1);
                console.log(`Methane1 updated: ${lastValidMethane1} -> ${newMethane1}`);
              } else {
                console.warn('Invalid methane1 value received:', newMethane1);
                setMethane1(lastValidMethane1); // Keep last valid value
              }
            } else {
              console.warn('No methane1 data in response, keeping last value:', lastValidMethane1);
              setMethane1(lastValidMethane1);
            }
          }
      } catch (err) {
          console.error('Error fetching methane1 data:', err.message);
          setMethane1(lastValidMethane1); // Keep last valid value on error
      } 
  };

    fetchrecentvalues(); // Initial fetch
    const interval = setInterval(fetchrecentvalues, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Remove the problematic useEffect that was resetting the value
  // useEffect(() => {
  //   setValue(methane1);
  //   setIsPopped(true);
  //   setTimeout(() => {
  //     setIsPopped(false);
  //   }, 300);
  // }, [methane1]);

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
        bgcolor: "#DC4C64", // Smooth dark red background
      }}
    >
      <div
        style={{
          background: "#cc0000", // Darker background for header
          padding: "10px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
         }}
      >
        <Typography variant="subtitle1"><h4>Medium Temperature</h4></Typography>
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
          {`${(methane1).toFixed(2)} °C`}
        </Typography>
      </div>
    </Card>
  );
};

export default RCard;
