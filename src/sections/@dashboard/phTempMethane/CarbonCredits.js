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

const CarbonCredits = () => {
  const [carbonCredits, setCarbonCredits] = useState(0.0)

  // Simulate live data updates
  useEffect(() => {
    const fetchrecentvalues = async () => {
      try {
          const response = await Biogasapi.get("/dashboard");
  
          if (!response.error) {

            const firstSensorValue = response.data[0];

            // Calculate carbon credits based on available data
            // Using weight as a base and applying a conversion factor
            // You can modify this calculation based on your specific requirements
            const baseValue = firstSensorValue.weight ? firstSensorValue.weight : 0.0;
            const calculatedCredits = baseValue * 2.5; // Example conversion factor
            setCarbonCredits(calculatedCredits);            
        //    console.log(calculatedCredits)

          }
      } catch (err) {
          console.error(err.message);
      } 
  };

    const interval = setInterval(() => {
      fetchrecentvalues();
  //    console.log(carbonCredits)

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
          Carbon Credits:
        </Typography>
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: "bold", 
            color: "black",
            fontSize: "2.5rem"
          }}
        >
          {carbonCredits.toFixed(2)}
        </Typography>
        {/* <Typography variant="h2" style={{ color: "black", fontWeight: "bold" }}>
          Credits
        </Typography> */}
      </div>
    </Card>
  );
};

export default CarbonCredits; 