import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Chartss = () => {
    const [data, setData] = useState([]);
    const [isLive, setIsLive] = useState(true);  // Controls whether the chart is live or paused
    const streamReaderRef = useRef(null);  // Reference to the stream reader
    const MAX_POINTS = 20;  // Number of recent points to display

    useEffect(() => {
        let shouldFetch = true;

        // Function to fetch stream data
        const fetchStream = async () => {
            try {
                const response = await fetch("/api/stream_predictions");
                console.log(response)
                if (!response.ok || !response.body) {
                    console.error("Failed to fetch stream");
                    return;
                }
        
                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");

                let shouldContinue = true; // Control the loop
        
                while (shouldContinue) {
                    // Read the stream in chunks
                    const { done, value } = await reader.read();
        
                    if (done) {
                        console.log("Stream ended");
                        break;
                    }
        
                    const textChunk = decoder.decode(value, { stream: true });
                    console.log("Received chunk:", textChunk);
        
                    // Process predictions line by line
                    const lines = textChunk.split("\n").filter(line => line.includes("Prediction:"));
        
                    lines.forEach(line => {
                        const prediction = parseFloat(line.replace("Prediction: ", "").trim());
                        const adjustedPrediction = prediction + (Math.random() - 0.5) * 0.1;
        
                        // Create new data point
                        const newDataPoint = {
                            timestamp: new Date().toLocaleTimeString(),
                            value: adjustedPrediction
                        };
        
                        // Update state if live
                        if (isLive) {
                            setData(prevData => {
                                const updatedData = [...prevData, newDataPoint];
                                return updatedData.slice(-MAX_POINTS);
                            });
                        }
                    });
                }
        
                // Close the reader when the loop ends
                reader.releaseLock();
            } catch (error) {
                console.error("Error while fetching stream:", error);
            }
        };
        

        // Start the stream if isLive is true
        if (isLive) {
            shouldFetch = true;
            fetchStream();
        }

        // Cleanup function to stop fetching
        return () => {
            shouldFetch = false;
            // Cancel the stream reader if it exists
            if (streamReaderRef.current) {
                streamReaderRef.current.cancel();
                streamReaderRef.current = null;
            }
        };

    }, [isLive]);  // Re-run when isLive changes

    const toggleLive = () => {
        setIsLive(prevState => !prevState);  // Toggle the live state
    };

    return (
        <div style={{ width: '100%', height: 400 }}>
            <h2>Live Predictions</h2>
            <button 
                onClick={toggleLive} 
                style={{
                    padding: '10px 20px', 
                    backgroundColor: isLive ? 'red' : 'green', 
                    color: 'white', 
                    marginBottom: '10px'
                }}
            >
                {isLive ? 'Pause' : 'Resume Live'}
            </button>
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
                        domain={[-1.5, 1.5]}  // Corrected the Y-axis domain
                        label={{ value: 'Prediction', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chartss;
