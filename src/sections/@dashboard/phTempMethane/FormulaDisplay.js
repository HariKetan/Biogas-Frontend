import React from "react";
import { Card, Typography, Box } from "@mui/material";

const FormulaDisplay = () => {
  return (
    <Card
      sx={{
        width: "100%",
        height: 150,
        margin: 0,
        marginTop: 2,
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        boxShadow: 20,
        color: "black",
        bgcolor: "lightgrey",
      }}
    >
      <Box
        sx={{
          padding: "20px",
          textAlign: "center",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "15px",
        }}
      >
        {/* Headings Row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            gap: "10px",
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              flex: 1, 
              color: "#333", 
              fontWeight: "bold",
              margin: "0 5px",
            }}
          >
            Carbon Credits
          </Typography>
          
          {/* <Box sx={{ flex: "0 0 auto", width: "40px" }}></Box> */}
          
          <Typography 
            variant="h6" 
            sx={{ 
              flex: 1, 
              color: "#333", 
              fontWeight: "bold",
              margin: "0 5px",
            }}
          >
            Methane Gas
          </Typography>
          
          {/* <Box sx={{ flex: "0 0 auto", width: "40px" }}></Box> */}
          
          <Typography 
            variant="h6" 
            sx={{ 
              flex: 1, 
              color: "#333", 
              fontWeight: "bold",
              margin: "0 5px",
            }}
          >
            Total Output
          </Typography>
        </Box>

        {/* Formula Row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            gap: "10px",
          }}
        >
          {/* First bracket */}
          <Box
            sx={{
              flex: 1,
              height: "60px",
              border: "3px solid #333",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
              margin: "0 5px",
            }}
          >
            <Typography variant="h6" sx={{ color: "#666", fontWeight: "bold" }}>
              Input 1
            </Typography>
          </Box>

          {/* Plus sign */}
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: "bold", 
              color: "#333",
              margin: "0 10px",
              flex: "0 0 auto",
            }}
          >
            +
          </Typography>

          {/* Second bracket */}
          <Box
            sx={{
              flex: 1,
              height: "60px",
              border: "3px solid #333",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
              margin: "0 5px",
            }}
          >
            <Typography variant="h6" sx={{ color: "#666", fontWeight: "bold" }}>
              Input 2
            </Typography>
          </Box>

          {/* Equals sign */}
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: "bold", 
              color: "#333",
              margin: "0 10px",
              flex: "0 0 auto",
            }}
          >
            =
          </Typography>

          {/* Result bracket */}
          <Box
            sx={{
              flex: 1,
              height: "60px",
              border: "3px solid #333",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
              margin: "0 5px",
            }}
          >
            <Typography variant="h6" sx={{ color: "#666", fontWeight: "bold" }}>
              Result
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default FormulaDisplay; 