import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, Typography } from '@mui/material';
// components
import { useChart } from '../../../components/chart';
import Biogasapi from '../../../pages/apis/Biogasapi';

// ----------------------------------------------------------------------

export default function AppHumidityChart() {
  const [chartData, setChartData] = useState([]);
  const [currentPh3, setCurrentPh3] = useState(0);
  const [historicalData, setHistoricalData] = useState([]);

  // Fetch pH3 data
  useEffect(() => {
    const fetchPh3Data = async () => {
      try {
        const response = await Biogasapi.get("/dashboard?device_id=1368");
        
        console.log('Full API Response (pH3):', response);
        console.log('Response data length (pH3):', response.data?.length);
        
        if (!response.error && response.data && response.data.length > 0) {
          console.log('API Response Data (pH3):', response.data);
          
          const firstSensorValue = response.data[0];
          const currentPh3Value = firstSensorValue.ph3 ? parseFloat(firstSensorValue.ph3) : 0;
          setCurrentPh3(currentPh3Value);
          
          // Store all historical data
          setHistoricalData(response.data);
          
          // If we have only one data point, create additional points for visualization
          let chartDataPoints = [];
          let timeLabels = [];
          
          if (response.data.length === 1) {
            // Create multiple data points for better visualization
            const basePh3 = currentPh3Value;
            const now = new Date();
            
            // Create 10 data points over the last 30 minutes
            for (let i = 9; i >= 0; i -= 1) {
              const time = new Date(now.getTime() - i * 3 * 60 * 1000); // 3-minute intervals
              const ph3 = basePh3;
              
              chartDataPoints.push(parseFloat(ph3.toFixed(2)));
              timeLabels.push(time.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              }));
            }
          } else {
            // Use actual historical data
            const reversedData = [...response.data].reverse();
            
            chartDataPoints = reversedData.map((item, index) => {
              const ph3 = item.ph3 ? parseFloat(item.ph3) : 0;
              console.log(`Data point ${index}: ph3 = ${ph3}`);
              return ph3;
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

          console.log('Final pH3 Data Array:', chartDataPoints);
          console.log('Final Timestamps Array (pH3):', timeLabels);
          console.log('Data points count (pH3):', chartDataPoints.length);

          setChartData([
            {
              name: 'pH Level 3',
              type: 'line',
              fill: 'gradient',
              data: chartDataPoints,
            },
          ]);
        } else {
          console.log('No data received or empty response (pH3)');
        }
      } catch (err) {
        console.error('Error fetching pH3 data:', err.message);
      }
    };

    // Initial fetch
    fetchPh3Data();

    // Set up interval for real-time updates
    const interval = setInterval(fetchPh3Data, 30000); // Update every 30 seconds

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
          color: '#263238'
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
        text: 'pH Level',
        style: {
          fontSize: '12px',
          fontWeight: 600,
          color: '#263238'
        }
      },
      min: chartData[0]?.data?.length > 0 ? Math.max(0, (Math.min(...chartData[0].data) - 0.5)) : 0,
      max: chartData[0]?.data?.length > 0 ? Math.min(14, (Math.max(...chartData[0].data) + 0.5)) : 14,
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
            return `pH Level: ${y.toFixed(2)}`;
          }
          return y;
        },
      },
    },
    colors: ['#4ECDC4'], // Teal color for humidity
    stroke: {
      curve: 'smooth',
      width: 4,
      lineCap: 'round'
    },
    markers: {
      size: 8,
      colors: ['#4ECDC4'],
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
          <h4>pH Level Trend</h4>
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
            <Typography>Loading pH Level data...</Typography>
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
        <Typography variant="h6">Current: {currentPh3.toFixed(2)}</Typography>
      </div>
    </Card>
  );
} 