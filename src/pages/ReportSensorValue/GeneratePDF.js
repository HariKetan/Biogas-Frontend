import JSPDF from "jspdf";
import "jspdf-autotable";
// Date Fns is used to format the dates we receive
// from our API call

// define a generatePDF function that accepts a sensorvalues argument
const GeneratePDF = (sensorvalues,startDate,endDate) => {
  // initialize jsPDF
  const doc = new JSPDF();

  // define the columns we wan and their titles
  const tableColumn = ["Device_Id", "R", "Y", "B", "Frequency","Ph","Temp","Weight","Time"];
  // define an empty array of rows
  const tableRows = [];
  // for each sensorvalue pass all its data into an array
  sensorvalues.forEach(sensorvalue => {
    // const dateWithinRange = new Date(sensorvalue.utime) >= new Date(startDate) && new Date(sensorvalue.utime) <= new Date(endDate);
    const dateString = sensorvalue.dtime;

    if (!dateString) {
      // Handle the case where dateString is null or undefined
      return;
    }
  
    const [day, month, yearTime] = dateString.split('/');
  
    if (!day || !month || !yearTime) {
      // Handle the case where day, month, or yearTime is null or undefined
      console.error("Invalid date format:", dateString);
      return;
    }
  
    const [year, time] = yearTime.split(' ');
  
    if (!year || !time) {
      // Handle the case where year or time is null or undefined
      console.error("Invalid date format:", dateString);
      return;
    }
  
    const [hour, minute, second] = time.split(':');
  
    if (!hour || !minute || !second) {
      // Handle the case where hour, minute, or second is null or undefined
      console.error("Invalid time format:", time);
      return;
    }
  // Assuming the year is in the format YY
    const fullYear = parseInt(year,10) + 2000;
    const dateOnly = `${fullYear}-${month}-${day}`
    // const dateOnly = dateObject.toISOString().split('T')[0]

    if(!endDate && dateOnly === startDate)
    {
        const sensorvalueData = [
          sensorvalue.device_id || "",
          sensorvalue.r || "",
          sensorvalue.y || "" ,
          sensorvalue.b || "",
          sensorvalue.frequency || "",
          sensorvalue.ph || "",
          sensorvalue.temperature || "",
          sensorvalue.weight || "",
          sensorvalue.dtime || "",
        ];
        tableRows.push(sensorvalueData);
      }
    else if(dateOnly >= startDate && dateOnly <= endDate ){
        const sensorvalueData = [
          sensorvalue.device_id || "",
          sensorvalue.r || "",
          sensorvalue.y || "" ,
          sensorvalue.b || "",
          sensorvalue.frequency || "",
          sensorvalue.ph || "",
          sensorvalue.temperature || "",
          sensorvalue.weight || "",
          sensorvalue.dtime || "",
        ];
        tableRows.push(sensorvalueData);
      }
    }
    

    
      // called date-fns to format the date on the sensorvalue
  
    // push each tickcet's info into a row
  );


  // startY is basically margin-top
  doc.autoTable(tableColumn, tableRows);
  const date = Date().split(" ");
  // we use a date string to generate our filename.
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
  // sensorvalue title. and margin-top + margin-left
  // doc.text("REPORT", 1, 15);
  // we define the name of our PDF file.
  doc.save(`${dateStr}.pdf`);
};

export default GeneratePDF;