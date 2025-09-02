import React, { useState, useEffect } from "react";
import { Card, Typography, styled } from "@mui/material";
import ReactSpeedometer from "react-d3-speedometer";
import Biogasapi from "../../../pages/apis/Biogasapi";
import Iconify from "../../../components/iconify"; // Assuming you have an Iconify component

const StyledIcon = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(10),
  height: theme.spacing(10),
  justifyContent: "center",
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary,
  backgroundImage: (theme) =>
    `linear-gradient(135deg, ${theme.alpha(theme.palette.primary.dark, 0)} 0%, ${theme.alpha(
      theme.palette.primary.dark,
      0.24
    )} 100%)`,
}));

const Temp = () => {
 const [ph4, setPh4] = useState(0.0)
  const [displayPh4, setDisplayPh4] = useState(0.0) // Smooth display value
  const [lastValidPh4, setLastValidPh4] = useState(0.0) // Store last valid value
  const [isPopped, setIsPopped] = useState(false);

  // Function to check if temperature change is significant enough to update
  const isSignificantChange = (newPh4, currentPh4) => {
    const changeThreshold = 0.1; // Only update if change is more than 0.1 degrees
    return Math.abs(newPh4 - currentPh4) > changeThreshold;
  };

  // Function to validate if the value is reasonable (for temperature, not pH)
  const isValidPh4Value = (value) => {
    return value !== null && value !== undefined && !isNaN(value) && value >= -50 && value <= 200;
  };

  // Simulate live data updates
  useEffect(() => {
    const fetchrecentvalues = async () => {
      try {
          const response = await Biogasapi.get("/dashboard?device_id=1368");
  
          if (!response.error && response.data && response.data.length > 0) {
            const firstSensorValue = response.data[0];
            
            // Only proceed if we have a valid pH4 value
            if (firstSensorValue.ph4 !== null && firstSensorValue.ph4 !== undefined) {
              const newPh4 = parseFloat(firstSensorValue.ph4);
              
              // Validate the new value is reasonable
              if (isValidPh4Value(newPh4)) {
                // Only update if the change is significant OR if we don't have a valid last value
                if (lastValidPh4 === 0.0 || isSignificantChange(newPh4, lastValidPh4)) {
                  setPh4(newPh4);
                  setLastValidPh4(newPh4);
                  console.log(`Temperature updated: ${lastValidPh4} -> ${newPh4}`);
                }
              } else {
                console.warn('Invalid temperature value received:', newPh4);
              }
            } else {
              console.warn('No temperature data in response, keeping last value:', lastValidPh4);
            }
          }
      } catch (err) {
          console.error('Error fetching temperature data:', err.message);
          // Keep last valid value on error
      } 
  };

    fetchrecentvalues(); // Initial fetch
    const interval = setInterval(fetchrecentvalues, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []); // Remove ph4 dependency to prevent loops

  // Smooth the display value to prevent rapid switching
  useEffect(() => {
    if (Math.abs(displayPh4 - ph4) > 0.05) {
      // Smooth transition to new pH4 value
      const timer = setTimeout(() => {
        setDisplayPh4(ph4);
      }, 500); // 500ms delay for smooth transition
      
      return () => clearTimeout(timer);
    }
  }, [ph4, displayPh4]);

  // Remove the problematic useEffect that was resetting the value
  // useEffect(() => {
  //   setValue(ph4);
  //   setIsPopped(true);
  //   setTimeout(() => {
  //     setIsPopped(false);
  //   }, 300);
  // }, [ph4]);

  return (
    <Card
      sx={{
        width: "100%",
        height: 350,
        margin:0,
        marginTop:2 ,display: "flex",
        flexDirection: "column",
        textAlign: "center",
        boxShadow: 20,
        color: "white",
        bgcolor: "lightgrey", // Dark background color
      }}
    >
      <div
        style={{
          background: "#708090",   
          padding: "10px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

        }}
      >
        <Typography variant="h6">Temperature</Typography>
      </div>

      <StyledIcon>
        <Iconify icon={"Red"} width={24} height={24} />
      </StyledIcon>

      <ReactSpeedometer
        maxValue={150}
        minValue={0}
        height={190}
        width={290}
        value={displayPh4} // Use smooth display pH4 instead of raw pH4
        needleTransition="easeQuadIn"
        needleTransitionDuration={2000} // Slower transition for smoother movement
        needleColor="White"
        startColor="red"
        endColor="blue"   
        segments={10} 
        segmentColors={["red", "orangered", "darkorange", "orange", "yellow", "lightgreen", "green", "lightblue", "blue", "darkblue"]}
        hideText={1}
        valueTextFontSize="0" 
      />


      <div
        style={{
          background: "#708090",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <Typography variant="h5">{`${(displayPh4).toFixed(2)} °C`}</Typography>
      </div>
    </Card>
  );
};

export default Temp;
