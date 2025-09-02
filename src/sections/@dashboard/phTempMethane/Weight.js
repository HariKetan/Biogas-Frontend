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

const getWeightColor = (weight) => {
  if (weight >= 80) {
    return "#red";
  }
  if (weight >= 60) {
    return "#orangered";
  }
  if (weight >= 40) {
    return "#darkorange";
  }
  if (weight >= 20) {
    return "#khaki";
  }
  return "#lightgoldenrodyellow";
};

const Weight = () => {
  const [weight, setWeight] = useState(0.0)
  const [displayWeight, setDisplayWeight] = useState(0.0) // Smooth display value
  const [lastValidWeight, setLastValidWeight] = useState(0.0) // Store last valid value
  const [isPopped, setIsPopped] = useState(false);

  // Function to check if weight change is significant enough to update
  const isSignificantChange = (newWeight, currentWeight) => {
    const changeThreshold = 0.1; // Only update if change is more than 0.1 kg
    return Math.abs(newWeight - currentWeight) > changeThreshold;
  };

  // Function to validate if the value is reasonable
  const isValidWeightValue = (value) => {
    return value !== null && value !== undefined && !isNaN(value) && value >= 0 && value <= 10000; // Assuming max 10 tons
  };

  // Simulate live data updates
  useEffect(() => {
    const fetchrecentvalues = async () => {
      try {
          const response = await Biogasapi.get("/dashboard?device_id=1368");
  
          if (!response.error && response.data && response.data.length > 0) {
            const firstSensorValue = response.data[0];
            
            // Only proceed if we have a valid weight value
            if (firstSensorValue.weight !== null && firstSensorValue.weight !== undefined) {
              const newWeight = parseFloat(firstSensorValue.weight);
              
              // Validate the new value is reasonable
              if (isValidWeightValue(newWeight)) {
                // Only update if the change is significant OR if we don't have a valid last value
                if (lastValidWeight === 0.0 || isSignificantChange(newWeight, lastValidWeight)) {
                  setWeight(newWeight);
                  setLastValidWeight(newWeight);
                  console.log(`Weight updated: ${lastValidWeight} -> ${newWeight}`);
                }
              } else {
                console.warn('Invalid weight value received:', newWeight);
              }
            } else {
              console.warn('No weight data in response, keeping last value:', lastValidWeight);
            }
          }
      } catch (err) {
          console.error('Error fetching weight data:', err.message);
          // Keep last valid value on error
      } 
  };

    fetchrecentvalues(); // Initial fetch
    const interval = setInterval(fetchrecentvalues, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []); // Remove weight dependency to prevent loops

  // Smooth the display value to prevent rapid switching
  useEffect(() => {
    if (Math.abs(displayWeight - weight) > 0.05) {
      // Smooth transition to new weight value
      const timer = setTimeout(() => {
        setDisplayWeight(weight);
      }, 500); // 500ms delay for smooth transition
      
      return () => clearTimeout(timer);
    }
  }, [weight, displayWeight]);

  // Remove the problematic useEffect that was resetting the value
  // useEffect(() => {
  //   setValue(weight);
  //   setIsPopped(true);
  //   setTimeout(() => {
  //     setIsPopped(false);
  //   }, 300);
  // }, [weight]);

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
        <Typography variant="subtitle1"><h4>Weight</h4></Typography>
      </div>

      <StyledIcon>
        <Iconify icon={"MethaneIcon"} width={24} height={24} />
      </StyledIcon>

      <ReactSpeedometer
        maxValue={1000}
        minValue={0}
        height={190}
        width={290}
        value={displayWeight} // Use smooth display weight instead of raw weight
        needleTransition="easeQuadIn"
        needleTransitionDuration={2000} // Slower transition for smoother movement
        needleColor="White"
        startColor={getWeightColor(displayWeight)}
        endColor="#red"   
        segments={10} 
        segmentColors={[
          "#0000FF", // Blue
          "#0000CC", // Medium Blue
          "#000099", // Dark Blue
          "#0066CC", // Sky Blue
          "#0099CC", // Blue Cyan
          "#00CCFF", // Light Blue
          "#00FF66", // Turquoise
          "#00FF99", // Medium Aquamarine
          "green", // Medium Spring Green
          "darkgreen", // Green
        ]}
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
        <Typography variant="h5">{`${displayWeight.toFixed(2)} KG`}</Typography>
      </div>
    </Card>
  );
};

export default Weight;
