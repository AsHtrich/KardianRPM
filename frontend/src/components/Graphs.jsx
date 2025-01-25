import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Charts from './Charts';
import HR from './HR';
import SPO2 from './Spo2';
const Graphs = () => {
  return (
    <div className='border border-black w-[75%] flex flex-col m-1'>
      <div className='h-1/3 border border-black'>
      <Charts></Charts>
      </div>
      <div className='h-1/3 border border-black'>
      <HR></HR>
      </div>
      <div className='h-1/3 border border-black'>
      <SPO2></SPO2>
      </div>
      
    </div>
  )
}

export default Graphs