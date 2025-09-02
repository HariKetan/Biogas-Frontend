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

const getPhColor = (ph) => {
  if (ph >= 12) {
    return "#red";
  }
  if (ph >= 10) {
    return "#orangered";
  }
  if (ph >= 8) {
    return "#darkorange";
  }
  if (ph >= 6) {
    return "#khaki";
  }
  return "#lightgoldenrodyellow";
};

const PhComponent = () => {
   const [ph3, setPh3] = useState(0.0)
  const [displayPh3, setDisplayPh3] = useState(0.0) // Smooth display value
  const [lastValidPh3, setLastValidPh3] = useState(0.0) // Store last valid value
  const [isPopped, setIsPopped] = useState(false);

  // Function to check if pH3 change is significant enough to update
  const isSignificantChange = (newPh3, currentPh3) => {
    const changeThreshold = 0.1; // Only update if change is more than 0.1 pH
    return Math.abs(newPh3 - currentPh3) > changeThreshold;
  };

  // Function to validate if the value is reasonable
  const isValidPh3Value = (value) => {
    return value !== null && value !== undefined && !isNaN(value) && value >= 0 && value <= 14;
  };

  // Simulate live data updates
  useEffect(() => {
    const fetchrecentvalues = async () => {
      try {
          const response = await Biogasapi.get("/dashboard?device_id=1368");
  
          if (!response.error && response.data && response.data.length > 0) {
            const firstSensorValue = response.data[0];
            
            // Only proceed if we have a valid pH3 value
            if (firstSensorValue.ph3 !== null && firstSensorValue.ph3 !== undefined) {
              const newPh3 = parseFloat(firstSensorValue.ph3);
              
              // Validate the new value is reasonable
              if (isValidPh3Value(newPh3)) {
                // Only update if the change is significant OR if we don't have a valid last value
                if (lastValidPh3 === 0.0 || isSignificantChange(newPh3, lastValidPh3)) {
                  setPh3(newPh3);
                  setLastValidPh3(newPh3);
                  console.log(`pH3 updated: ${lastValidPh3} -> ${newPh3}`);
                }
              } else {
                console.warn('Invalid pH3 value received:', newPh3);
              }
            } else {
              console.warn('No pH3 data in response, keeping last value:', lastValidPh3);
            }
          }
      } catch (err) {
          console.error('Error fetching pH3 data:', err.message);
          // Keep last valid value on error
      } 
  };

    fetchrecentvalues(); // Initial fetch
    const interval = setInterval(fetchrecentvalues, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []); // Remove ph3 dependency to prevent loops

  // Smooth the display value to prevent rapid switching
  useEffect(() => {
    if (Math.abs(displayPh3 - ph3) > 0.05) {
      // Smooth transition to new pH3 value
      const timer = setTimeout(() => {
        setDisplayPh3(ph3);
      }, 500); // 500ms delay for smooth transition
      
      return () => clearTimeout(timer);
    }
  }, [ph3, displayPh3]);

  // Remove the problematic useEffect that was resetting the value
  // useEffect(() => {
  //   setValue(ph3);
  //   setIsPopped(true);
  //   setTimeout(() => {
  //     setIsPopped(false);
  //   }, 300);
  // }, [ph3]);

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
        <Typography variant="subtitle1"><h4>pH Level</h4></Typography>
      </div>

      <StyledIcon>
        <Iconify icon={"PhIcon"} width={24} height={24} />
      </StyledIcon>

      <ReactSpeedometer
        maxValue={14}
        minValue={0}
        height={190}
        width={290}
        value={displayPh3} // Use smooth display pH3 instead of raw pH3
        needleTransition="easeQuadIn"
        needleTransitionDuration={2000} // Slower transition for smoother movement
        needleColor="White"
        startColor={getPhColor(displayPh3)}
        endColor="#red"   
        segments={10} 
        segmentColors={[ "#FFD700", // Gold
        "#FFD300", // Dark Goldenrod
        "#FFC800", // Goldenrod
        "#FFBF00", // Dark Orange
        "#FFA500", // Orange
        "#FF8C00", // Dark Orange
        "#FF7F50", // Coral
        "#FF6347", // Tomato
        "#FF4500", // Red-Orange
        "#DC143C", // Crimson
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
        <Typography variant="h5">{`${displayPh3.toFixed(2)} pH`}</Typography>
      </div>
    </Card>
  );
};

export default PhComponent;
