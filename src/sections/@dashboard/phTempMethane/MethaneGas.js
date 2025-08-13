import React, { useState, useEffect } from "react";
import { Card, Typography, styled } from "@mui/material";
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

const MethaneGas = () => {
  const [methaneGas, setMethaneGas] = useState(0.0)

  // Simulate live data updates
  useEffect(() => {
    const fetchrecentvalues = async () => {
      try {
          const response = await Biogasapi.get("/dashboard");
  
          if (!response.error) {

            const firstSensorValue = response.data[0];

            // Get methane gas value from sensor data
            // You can modify this based on your specific sensor data structure
            const methaneValue = firstSensorValue.methane ? firstSensorValue.methane : 0.0;
            setMethaneGas(methaneValue);            
        //    console.log(methaneValue)

          }
      } catch (err) {
          console.error(err.message);
      } 
  };

    const interval = setInterval(() => {
      fetchrecentvalues();
  //    console.log(methaneGas)

    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      sx={{
        width: "100%",
        height: 150,
        margin:0,
        marginTop:2 ,
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        boxShadow: 20,
        color: "black",
        bgcolor: "lightgrey", // Dark background color
      }}
    >
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          flex: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <Typography variant="h2" style={{ color: "black", fontWeight: "bold" }}>
          Methane Gas:
        </Typography>
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: "bold", 
            color: "black",
            fontSize: "2.5rem"
          }}
        >
          {methaneGas.toFixed(2)}
        </Typography>
        <Typography variant="h2" style={{ color: "black", fontWeight: "bold" }}>
          %
        </Typography>
      </div>
    </Card>
  );
};

export default MethaneGas; 