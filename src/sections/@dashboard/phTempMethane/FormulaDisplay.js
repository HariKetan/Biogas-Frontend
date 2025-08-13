import React from "react";
import { Card } from "@mui/material";

const FormulaDisplay = () => {
  return (
    <Card
      sx={{
        width: "100%",
        height: 200,
        margin: 0,
        marginTop: 2,
        display: "grid",
        gridTemplateRows: "1fr 1fr",
        textAlign: "center",
        boxShadow: 20,
        color: "black",
        bgcolor: "lightgrey",
      }}
    >
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          display: "grid",
          gridTemplateRows: "1fr 1fr",
          // gap: "15px",
          height: "100%",
        }}
      >
        {/* Headings Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            alignItems: "center",
            width: "100%",
            gap: "60px",
          }}
        >
          <div 
            style={{ 
              color: "#333", 
              fontWeight: "bold",
              margin: "0 5px",
              display: "grid",
              placeItems: "center",
              fontSize: "1.25rem",
            }}
          >
            Total {'>'} 100
          </div>
          
          <div 
            style={{ 
              color: "#333", 
              fontWeight: "bold",
              margin: "0 5px",
              display: "grid",
              placeItems: "center",
              fontSize: "1.25rem",
            }}
          >
            Total {'<'} 100
          </div>
          
          <div 
            style={{ 
              color: "#333", 
              fontWeight: "bold",
              margin: "0 5px",
              display: "grid",
              placeItems: "center",
              fontSize: "1.25rem",
            }}
          >
            Total
          </div>
        </div>

        {/* Formula Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr auto 1fr",
            alignItems: "center",
            width: "100%",
            gap: "10px",
          }}
        >
          {/* First bracket */}
          <div
            style={{
              height: "60px",
              display: "grid",
              placeItems: "center",
              margin: "0 5px",
              border: "2px solid #333",
              borderRadius: "8px",
            }}
          >
            <div style={{ color: "#000", fontWeight: "bold", fontSize: "2.125rem" }}>
              Input 1
            </div>
          </div>

          {/* Plus sign */}
          <div 
            style={{ 
              fontWeight: "bold", 
              color: "#333",
              margin: "0 10px",
              display: "grid",
              placeItems: "center",
              fontSize: "3rem",
            }}
          >
            +
          </div>

          {/* Second bracket */}
          <div
            style={{
              height: "60px",
              display: "grid",
              placeItems: "center",
              margin: "0 5px",
              border: "2px solid #333",
              borderRadius: "8px",
            }}
          >
            <div style={{ color: "#000", fontWeight: "bold", fontSize: "2.125rem" }}>
              Input 2
            </div>
          </div>

          {/* Equals sign */}
          <div 
            style={{ 
              fontWeight: "bold", 
              color: "#333",
              margin: "0 10px",
              display: "grid",
              placeItems: "center",
              fontSize: "3rem",
            }}
          >
            =
          </div>

          {/* Result bracket */}
          <div
            style={{
              height: "60px",
              display: "grid",
              placeItems: "center",
              margin: "0 5px",
              border: "2px solid #333",
              borderRadius: "8px",
            }}
          >
            <div style={{ color: "#000", fontWeight: "bold", fontSize: "2.125rem" }}>
              Result
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FormulaDisplay; 