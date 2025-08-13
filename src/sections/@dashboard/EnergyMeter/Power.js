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

const Power = () => {
  const [power, setpower] = useState(0.0)
  const [value, setValue] = useState(0.5); // Initial value
  const [isPopped, setIsPopped] = useState(false);


  // Simulate live data updates
  useEffect(() => {
    const fetchrecentvalues = async () => {
      try {
          const response = await Biogasapi.get("/dashboard");
  
          if (!response.error) {

            const firstSensorValue = response.data[0];

            // Update only the power value in the state
            // Using 'b' field as power since power field is not present in JSON
            setpower(firstSensorValue.b ? firstSensorValue.b : 0.0);            
        //    console.log(firstSensorValue.b)

          }
      } catch (err) {
          console.error(err.message);
      } 
  };

    const interval = setInterval(() => {
      fetchrecentvalues();
  //    console.log(power)

    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
//    console.log(power); // You can remove or modify this line
    setValue(power);
    setIsPopped(true);

    // Reset the popping effect after a short delay
    setTimeout(() => {
      setIsPopped(false);
    }, 300);
  }, [power]);
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
        color: "black", // Same black font color as BCard
        bgcolor: "#74c0fc", // Same blue background as BCard
      }}
    >
      <div
        style={{
          background: "#3498db", // Same darker blue header as BCard
          padding: "10px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="subtitle1"><h4>Blue Phase</h4></Typography>
      </div>

      <StyledIcon>
        <Iconify icon={"Blue"} width={24} height={24} />
      </StyledIcon>

      <div
        style={{
          padding: "10px",
          textAlign: "center",
          height: 150, margin: 'auto', marginBottom: 50,
          
        }}
      >
        <Typography variant="h4">
          {`${(value).toFixed(2)} V`}
        </Typography>
      </div>
    </Card>
  );
};

export default Power; 