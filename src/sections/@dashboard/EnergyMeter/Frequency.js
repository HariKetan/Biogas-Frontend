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
  const [value, setValue] = useState(0.5); // Initial value
  const [isPopped, setIsPopped] = useState(false);


  // Simulate live data updates
  useEffect(() => {
    const fetchrecentvalues = async () => {
      try {
          const response = await Biogasapi.get("/dashboard?device_id=1368");
  
          if (!response.error) {

            const firstSensorValue = response.data[0];

            // Update only the 'methane4' value in the state
            setMethane4(firstSensorValue.methane4 ? firstSensorValue.methane4 : 0.0);            
        //    console.log(firstSensorValue.methane4)

          }
      } catch (err) {
          console.error(err.message);
      } 
  };

    const interval = setInterval(() => {
      fetchrecentvalues();
  //    console.log(methane4)

    }, 3000); // Update every 3 seconds

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
