import React, { useContext,useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../UserContext/UserContext';
import MyLeafletMap from '../components/Map';
const Test = () => {
    const { patientID } = useParams();
    const [token] = useContext(UserContext);
    const [patient, setPatient] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    
    useEffect(() => {
        const getTrip = async () => {
          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          };
          const response = await fetch(`/api/patients/${patientID}`, requestOptions);
    
          if (!response.ok) {
            setErrorMessage("Could not get the trip");
          } else {
            const data = await response.json();
            setPatient(data);
          }
        };
    
        if (patientID) {
          getTrip();
        }
      }, [patientID, token]);
      if (!patient) {
        return <div className=''>Loading patient data...</div>; 
      }
  return (
    <div>
        <div className=' w-full flex-row flex'>
            <div className='w-2/3 flex flex-row'>
                <div className='w-4/5 p-4 mt-4 mx-2 border rounded-3xl flex flex-col space-y-2 border-grey h-[300px]'>
                    <h1 className='text-xl font-normal'>
                    Patient Details for ID: {patientID}
                    </h1>
                    <h1 className='text-4xl font-bold'>
                        {patient.name}
                    </h1>
                    <div className='bg-green-100 text-black p-4 rounded-3xl font-semibold flex flex-col space-y-1 text-xl'>
                    <h1>
                        Ph no.: {patient.pno}
                    </h1>
                    <h1>
                        Disease description: {patient.desc}
                    </h1>
                    <h1>
                    Address: {patient.address}
                    </h1>
                    <h1>
                        Rel's Name: {patient.Relname}
                    </h1>
                    <h1>
                        Rel's no: {patient.Relpno}
                    </h1>
                    </div>
                    
                </div>
                <div className='w-1/5 p-4 mt-4 mx-2 border rounded-3xl flex flex-col space-y-2 border-grey h-[300px]'>

                </div>   
            </div>
            
            <div className="map-container w-1/3 border-black border mt-4 mx-2">
            <MyLeafletMap />
            </div>
            
        </div>
        <div className=' w-full flex flex-row rounded-3xl border-grey border px-16 space-x-8 items-center justify-between justify-items-stretch mx-2 mt-2 h-[70px]'>
            <h1 className='text-xl font-semibold'>DeviceID: {patient.deviceID}</h1>
            <h1 className='text-xl font-semibold'>Device name: XYZ</h1>
            <h1 className='text-xl font-semibold'>Battery: 80%</h1>
            <h1 className='text-xl font-semibold'>No of days used: 40d</h1>
        </div>
        <div className=' w-full flex flex-row rounded-3xl m-2 border-grey border space-x-8 items-center justify-between justify-items-stretch mx-auto h-[400px]'>
            
        </div> 
    </div>
  )
}

export default Test