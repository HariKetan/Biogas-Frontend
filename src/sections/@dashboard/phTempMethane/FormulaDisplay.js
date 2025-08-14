import React, { useEffect, useState } from "react";
import { Card } from "@mui/material";
import Biogasapi from "../../../pages/apis/Biogasapi";

const FormulaDisplay = () => {
  const [methane5, setMethane5] = useState(0);
  const [methane6, setMethane6] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await Biogasapi.get("/dashboard?device_id=1368");
        if (!res.error && Array.isArray(res.data) && res.data.length > 0) {
          const row = res.data[0];
          if (isMounted) {
            setMethane5(Number(row.methane5 || 0));
            setMethane6(Number(row.methane6 || 0));
          }
        }
      } catch (e) {
        // keep defaults on error
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const result = methane5 + methane6;

  const renderBox = (value, label) => (
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
        {typeof value === "number" ? value.toFixed(2) : value}
      </div>
      <div style={{ fontSize: "0.9rem", color: "#333" }}>{label}</div>
    </div>
  );

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
            Total {">"} 100
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
            Total {"<"} 100
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
              {methane5}
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
              {methane6}
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
                {result}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FormulaDisplay; 