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
  const [value, setValue] = useState(0.5); // Initial value
  const [isPopped, setIsPopped] = useState(false);


  // Simulate live data updates
  useEffect(() => {
    const fetchrecentvalues = async () => {
      try {
          const response = await Biogasapi.get("/dashboard?device_id=1368");
  
          if (!response.error) {

            const firstSensorValue = response.data[0];

            // Update only the 'methane3' value in the state
            setMethane3(firstSensorValue.methane3 ? firstSensorValue.methane3 : 0.0);            
        //    console.log(firstSensorValue.methane3)

          }
      } catch (err) {
          console.error(err.message);
      } 
  };

    const interval = setInterval(() => {
      fetchrecentvalues();
  //    console.log(methane3)

    }, 3000); // Update every 3 seconds

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
