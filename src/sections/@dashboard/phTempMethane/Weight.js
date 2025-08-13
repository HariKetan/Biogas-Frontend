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

const getMethaneColor = (methane) => {
  if (methane >= 80) {
    return "#red";
  }
  if (methane >= 60) {
    return "#orangered";
  }
  if (methane >= 40) {
    return "#darkorange";
  }
  if (methane >= 20) {
    return "#khaki";
  }
  return "#lightgoldenrodyellow";
};

const Weight = () => {
  const [weight,setweight] = useState(0.0)
  const [value, setValue] = useState(0.5); // Initial value
  const [isPopped, setIsPopped] = useState(false);


  // Simulate live data updates
  useEffect(() => {
    const fetchrecentvalues = async () => {
      try {
          const response = await Biogasapi.get("/dashboard");
  
          if (!response.error) {

            const firstSensorValue = response.data[0];

            // Update only the 'r' value in the state
            setweight(firstSensorValue.weight ? firstSensorValue.weight : 0.0);            
        //    console.log(firstSensorValue.r)

          }
      } catch (err) {
          console.error(err.message);
      } 
  };

    const interval = setInterval(() => {
      fetchrecentvalues();
  //    console.log(r)

    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
//    console.log(r); // You can remove or modify this line
    setValue(weight);
    setIsPopped(true);

    // Reset the popping effect after a short delay
    setTimeout(() => {
      setIsPopped(false);
    }, 300);
  }, [weight]);

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
        maxValue={100}
        minValue={0}
        height={190}
        width={290}
        value={value}
        needleTransition="easeQuadIn"
        needleTransitionDuration={1000}
        needleColor="White"
        startColor={getMethaneColor(value)}
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
        <Typography variant="h5">{`${value.toFixed(2)} KG`}</Typography>
      </div>
    </Card>
  );
};

export default Weight;
