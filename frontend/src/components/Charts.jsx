import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Charts = () => {
    const [data, setData] = useState([]);
    const [isLive, setIsLive] = useState(true);  // Controls whether the chart is live or paused
    const MAX_POINTS = 40;  // Number of recent points to display
    const Navigate = useNavigate();

    // Function to add noise (random variation) to the prediction value
    const addNoise = (value) => {
        const noise = (Math.random() - 0.5) * 0.1; // Random noise between -0.05 and 0.05
        return value + noise;
    };

    useEffect(() => {
        let eventSource;

        // Function to start listening to the server stream
        const startStream = () => {
            eventSource = new EventSource("http://localhost:8000/stream");  // Adjust to your backend endpoint

            eventSource.onmessage = (event) => {
                const newPrediction = JSON.parse(event.data); // Assuming the prediction is sent as JSON

                const noisyValue = addNoise(newPrediction.prediction);  // Add noise to the prediction value

                const newDataPoint = {
                    timestamp: new Date().toLocaleTimeString(),
                    value: noisyValue  // Use the noisy value
                };

                // Only update data if the graph is live
                if (isLive) {
                    setData(prevData => {
                        const updatedData = [...prevData, newDataPoint];
                        return updatedData.slice(-MAX_POINTS); // Keep only the latest MAX_POINTS
                    });
                }
            };

            eventSource.onerror = () => {
                console.error("Error in event source stream");
                eventSource.close();
            };
        };

        if (isLive) {
            startStream();
        }

        // Cleanup on component unmount or when the stream is paused
        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };

    }, [isLive]);  // Re-run the effect when the `isLive` state changes

    const toggleLive = () => {
        setIsLive(prevState => !prevState);  // Toggle live/pause state
    };

    return (
        <div className='w-[100%] h-[280px] flex flex-row'>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis 
                        dataKey="timestamp" 
                        label={{ value: 'Time', position: 'insideBottomRight', offset: -5 }}
                        tick={{ fontSize: 12 }}
                        minTickGap={20}
                    />
                    <YAxis 
                        domain={[-1.5, 1.5]}    // Automatically adjust Y-axis range
                        label={{ value: 'Anamolies', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" dot={false} />
                </LineChart>
            </ResponsiveContainer>
            <div className='w-[3%] h-full'>
                <button 
                    onClick={toggleLive} 
                    className='rounded-full text-black font-extrabold px-2 py-1 ml-1 mt-2'
                    style={{ 
                        backgroundColor: isLive ? 'red' : 'green', 
                        color: 'white', 
                        
                    }}
                >
                    {isLive ? 'O' : 'O'}
                </button>
                <button 
                    onClick={() => Navigate(`/alerts/5`)}
                    className='rounded-full text-black font-extrabold px-2 py-1 ml-1 mt-2'
                    style={{ 
                        backgroundColor:'blue', 
                        color: 'white', 
                        
                    }}
                >
                    {isLive ? 'O' : 'O'}
                </button>
            </div>
        </div>
    );
};

export default Charts;
