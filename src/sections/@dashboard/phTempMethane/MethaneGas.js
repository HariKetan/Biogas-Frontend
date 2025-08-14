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
  const [isMounted, setIsMounted] = useState(true);
    // Simulate live data updates
  useEffect(() => {
  const fetchData = async () => {
      try {
        const res = await Biogasapi.get("/dashboard?device_id=1368");
        if (!res.error && Array.isArray(res.data) && res.data.length > 0) {
          const row = res.data[0];
          // Fixed formula: calculate average of methane5 and methane6
          const avgMethane = row.methane5+row.methane6
          setMethaneGas(avgMethane);
        }
      } catch (e) {
        // keep defaults on error
      }
    };

    const interval = setInterval(() => {
      fetchData();
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
          {methaneGas}
        </Typography>
        <Typography variant="h2" style={{ color: "black", fontWeight: "bold" }}>
          
        </Typography>
      </div>
    </Card>
  );
};

export default MethaneGas; 