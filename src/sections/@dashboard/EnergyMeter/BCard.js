import { Card, Typography, styled } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Iconify from "../../../components/iconify";
import Biogasapi from "../../../pages/apis/Biogasapi";

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
    `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
      theme.palette.primary.dark,
      0.24
    )} 100%)`,
}));

const BCard = () => {
  const [methane3, setMethane3] = useState(0.0)
  const [lastValidMethane3, setLastValidMethane3] = useState(0.0)
  const [value, setValue] = useState(0.5); // Initial value
  const [isPopped, setIsPopped] = useState(false);

  // Function to validate if the value is reasonable
  const isValidMethaneValue = (value) => {
    return value !== null && value !== undefined && !isNaN(value) && value >= 0 && value <= 1000000;
  };

  // Simulate live data updates
  useEffect(() => {
    const fetchrecentvalues = async () => {
      try {
          const response = await Biogasapi.get("/dashboard?device_id=1368");
  
          if (!response.error && response.data && response.data.length > 0) {
            const firstSensorValue = response.data[0];

            // Only proceed if we have a valid methane3 value
            if (firstSensorValue.methane3 !== null && firstSensorValue.methane3 !== undefined) {
              const newMethane3 = parseFloat(firstSensorValue.methane3);
              
              if (isValidMethaneValue(newMethane3)) {
                setMethane3(newMethane3);
                setLastValidMethane3(newMethane3);
                console.log(`Methane3 updated: ${lastValidMethane3} -> ${newMethane3}`);
              } else {
                console.warn('Invalid methane3 value received:', newMethane3);
                setMethane3(lastValidMethane3); // Keep last valid value
              }
            } else {
              console.warn('No methane3 data in response, keeping last value:', lastValidMethane3);
              setMethane3(lastValidMethane3);
            }
          }
      } catch (err) {
          console.error('Error fetching methane3 data:', err.message);
          setMethane3(lastValidMethane3); // Keep last valid value on error
      } 
  };

    fetchrecentvalues(); // Initial fetch
    const interval = setInterval(fetchrecentvalues, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Remove the problematic useEffect that was resetting the value
  // useEffect(() => {
  //   setValue(methane3);
  //   setIsPopped(true);
  //   setTimeout(() => {
  //     setIsPopped(false);
  //   }, 300);
  // }, [methane3]);
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
        color: "black",
        bgcolor: "#74c0fc", 
      }}
    >
      <div
        style={{
          background: "#3498db", 
          padding: "10px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="subtitle1"><h4>Standard Velocity</h4></Typography>
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
        <Typography variant="h4">{`${(methane3).toFixed(2)} Nm/s`}</Typography>
      </div>
    </Card>
  );
};

export default BCard;
