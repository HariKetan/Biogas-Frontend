import { Card, Typography, styled } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Iconify from "../../../components/iconify"; // Assuming you have an Iconify component
import Biogasapi from "../../../pages/apis/Biogasapi";

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

const YCard = () => {
  const [methane2, setMethane2] = useState(0.0)
  const [value, setValue] = useState(0.5); // Initial value
  const [isPopped, setIsPopped] = useState(false);


  // Simulate live data updates
  useEffect(() => {
    const fetchrecentvalues = async () => {
      try {
          const response = await Biogasapi.get("/dashboard?device_id=1368");
  
          if (!response.error) {

            const firstSensorValue = response.data[0];

            // Update only the 'methane2' value in the state
            setMethane2(firstSensorValue.methane2 ? firstSensorValue.methane2 : 0.0);            
       //     console.log(firstSensorValue.methane2)

          }
      } catch (err) {
          console.error(err.message);
      } 
  };

    const interval = setInterval(() => {
      fetchrecentvalues();
   //   console.log(methane2)

    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Remove the problematic useEffect that was resetting the value
  // useEffect(() => {
  //   setValue(methane2);
  //   setIsPopped(true);
  //   setTimeout(() => {
  //     setIsPopped(false);
  //   }, 300);
  // }, [methane2]);
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
        color: "black ", // Font color is black
        bgcolor: "#F0E68C", // Lighter yellow background color
      }}
    >
      <div
        style={{
          background: "#ffd43b", // Darker background for header (similar to yellow)
          padding: "10px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
       }}
      >
        <Typography variant="subtitle1"><h4>TMF Voltage</h4></Typography>
      </div>

      <StyledIcon>
        <Iconify icon={"Yellow"} width={24} height={24} />
      </StyledIcon>

      <div
        style={{
          padding: "10px",
          textAlign: "center",
          height: 150, margin: 'auto', marginBottom: 50,
          
        }}
      >
        <Typography variant="h4">{`${(methane2).toFixed(2)} V`}</Typography>
      </div>
    </Card>
  );
};

export default YCard;
