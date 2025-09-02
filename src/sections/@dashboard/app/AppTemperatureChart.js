import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, Typography } from '@mui/material';
// components
import { useChart } from '../../../components/chart';
import Biogasapi from '../../../pages/apis/Biogasapi';

// ----------------------------------------------------------------------

export default function AppTemperatureChart() {
  const [chartData, setChartData] = useState([]);
  const [currentTemperature, setCurrentTemperature] = useState(0);
  const [historicalData, setHistoricalData] = useState([]);

  // Fetch pH4 data
  useEffect(() => {
    const fetchPh4Data = async () => {
      try {
        const response = await Biogasapi.get("/dashboard?device_id=1368");
        
        console.log('Full API Response:', response);
        console.log('Response data length:', response.data?.length);
        
        if (!response.error && response.data && response.data.length > 0) {
          console.log('API Response Data:', response.data);
          
          const firstSensorValue = response.data[0];
          const currentTemperature = (firstSensorValue.ph4 !== null && firstSensorValue.ph4 !== undefined) 
            ? parseFloat(firstSensorValue.ph4) : 0;
          
          console.log('Raw ph4 value:', firstSensorValue.ph4);
          console.log('Parsed temperature:', currentTemperature);
          
          setCurrentTemperature(currentTemperature);
          
          // Store all historical data
          setHistoricalData(response.data);
          
          // If we have only one data point, create additional points for visualization
          let chartDataPoints = [];
          let timeLabels = [];
          
          if (response.data.length === 1) {
            // Create multiple data points for better visualization
            const baseTemperature = currentTemperature;
            const now = new Date();
            
            // Create 10 data points over the last 30 minutes for better visualization
            for (let i = 9; i >= 0; i -= 1) {
              const time = new Date(now.getTime() - i * 3 * 60 * 1000); // 3-minute intervals
              // Use the current temperature for all points (since we only have one reading)
              const temperature = baseTemperature;
              
              chartDataPoints.push(parseFloat(temperature.toFixed(2)));
              timeLabels.push(time.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              }));
            }
            
            console.log('Generated chart data points:', chartDataPoints);
            console.log('Base temperature used:', baseTemperature);
          } else {
            // Use actual historical data
            const reversedData = [...response.data].reverse();
            
            chartDataPoints = reversedData.map((item, index) => {
              const temperature = item.ph4 ? parseFloat(item.ph4) : 0;
              console.log(`Data point ${index}: ph4 = ${temperature}`);
              return temperature;
            });
            
            timeLabels = reversedData.map((item, index) => {
              const date = new Date();
              const minutesAgo = (reversedData.length - 1 - index) * 3;
              date.setMinutes(date.getMinutes() - minutesAgo);
              const timeStr = date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              });
              console.log(`Timestamp ${index}: ${timeStr}`);
              return timeStr;
            });
          }

          console.log('Final Temperature Data Array:', chartDataPoints);
          console.log('Final Timestamps Array:', timeLabels);
          console.log('Data points count:', chartDataPoints.length);

          setChartData([
            {
              name: 'Temperature',
              type: 'line',
              fill: 'gradient',
              data: chartDataPoints,
            },
          ]);
        } else {
          console.log('No data received or empty response');
          console.log('Response error:', response.error);
          console.log('Response data:', response.data);
        }
      } catch (err) {
        console.error('Error fetching pH4 data:', err.message);
      }
    };

    // Initial fetch
    fetchPh4Data();

    // Set up interval for real-time updates
    const interval = setInterval(fetchPh4Data, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const chartOptions = useChart({
    plotOptions: { bar: { columnWidth: '16%' } },
    fill: { 
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.1,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.8,
        opacityTo: 0.2,
        stops: [0, 50, 100]
      }
    },
    xaxis: { 
      type: 'category',
      categories: historicalData.length > 0 ? (historicalData.length === 1 ? 
        // Generate time labels for single data point scenario
        Array.from({length: 10}, (_, i) => {
          const date = new Date();
          date.setMinutes(date.getMinutes() - (9 - i) * 3);
          return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });
        }) :
        // Use actual historical data timestamps
        historicalData.map((item, index) => {
          const date = new Date();
          const minutesAgo = (historicalData.length - 1 - index) * 3;
          date.setMinutes(date.getMinutes() - minutesAgo);
          return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });
        })
      ) : [],
      labels: {
        rotate: -45,
        rotateAlways: false,
        style: {
          fontSize: '10px',
          color: '#000'
        },
        formatter(value, opts) {
          return value;
        }
      },
      tickPlacement: 'on',
      axisBorder: {
        show: true,
        color: '#78909C',
        height: 1,
        width: '100%',
        offsetX: 0,
        offsetY: 0
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: '#78909C',
        height: 6,
        offsetX: 0,
        offsetY: 0
      }
    },
    yaxis: {
      title: {
        text: 'Temperature (°C)',
        style: {
          fontSize: '12px',
          fontWeight: 600,
          color: '#263238'
        }
      },
      min: chartData[0]?.data?.length > 0 ? Math.max(0, Math.min(...chartData[0].data) - 5) : 0,
      max: chartData[0]?.data?.length > 0 ? (Math.max(...chartData[0].data) + 5) : 50,
      labels: {
        style: {
          fontSize: '11px',
          color: '#263238'
        }
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        show: true,
        formatter(value, opts) {
          return `Time: ${value}`;
        }
      },
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `Temperature: ${y.toFixed(1)} °C`;
          }
          return y;
        },
      },
    },
    colors: ['#FF6B6B'], // Red color for temperature
    stroke: {
      curve: 'smooth',
      width: 4,
      lineCap: 'round'
    },
    markers: {
      size: 8,
      colors: ['#FF6B6B'],
      strokeColors: '#fff',
      strokeWidth: 3,
      hover: {
        size: 10,
      }
    },
    grid: {
      borderColor: '#E0E0E0',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    chart: {
      type: 'line',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      fontWeight: 600
    }
  });

  return (
    <Card
      sx={{
        width: "100%",
        height: 400,
        margin: 0,
        marginTop: 2,
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        boxShadow: 20,
        color: "white",
        bgcolor: "lightgrey",
      }}
    >
      <div
        style={{
          background: "#708090",
          padding: "10px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="subtitle1">
        {/* ({historicalData.length} data points) */}
          <h4>Temperature Trend</h4>
        </Typography>
      </div>

      <Box sx={{ p: 3, pb: 1, flex: 1 }} dir="ltr">
        {chartData.length > 0 && chartData[0].data.length > 0 ? (
          <ReactApexChart 
            type="line" 
            series={chartData} 
            options={chartOptions} 
            height={300} 
          />
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '300px',
            color: '#666'
          }}>
            <Typography>Loading temperature data...</Typography>
          </div>
        )}
      </Box>

      <div
        style={{
          background: "#708090",
          padding: "10px",
          textAlign: "center",
        }}
      >
        <Typography variant="h6">
          Current: {currentTemperature !== null && currentTemperature !== undefined 
            ? `${currentTemperature.toFixed(1)} °C` 
            : 'No data'}
        </Typography>
      </div>
    </Card>
  );
} 