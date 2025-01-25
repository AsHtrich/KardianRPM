import React, { useContext,useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../UserContext/UserContext';
import MyLeafletMap from '../components/Map';
import Prescriptions from '../components/Prescriptions';
import Emergency from '../components/Emergency';
import Subs from '../components/Subs';
import { useNavigate } from 'react-router-dom';
import Files from '../components/Files';
import AlertChart from '../components/AlertChart';
import Graphs from '../components/Graphs'
const Data = () => {
    const { patientID } = useParams();
    const Navigate = useNavigate();
    const [token] = useContext(UserContext);
    const [patient, setPatient] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [activeComponent, setActiveComponent] = useState('Default');
    
    const renderActiveComponent = () => {
      switch (activeComponent) {
        case 'Component1':
          return <Prescriptions />;
        case 'Component2':
          return <Files />;
        case 'Component3':
          return <Emergency />;
        case 'Component4':
          return <Subs />;
        default:
          return <Graphs/>;
      }
    };

    const handleButtonClick = (component) => {
      setActiveComponent(prev => (prev === component ? 'Default' : component));
    };

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
            setErrorMessage("Could not get the patients");
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
    <div className="flex flex-row h-full">
      {/* left */}
      {renderActiveComponent()}
      {/* right */}
      <div className="w-[25%] ">
        {/* right-top */}
        <div className='h-[70%] rounded-xl m-1 p-1 flex flex-col '>
          <div className='p-2 border border-black rounded-3xl flex flex-col border-grey'>
            <h1 className='text-md underline underline-offset-2 font-medium'>
              Patient Details for ID: {patientID}
            </h1>
            <h1 className='text-2xl font-bold'>
                {patient.name}
            </h1>
            <div className='bg-green-100 text-black p-2 rounded-3xl font-semibold flex flex-col text-lg'>
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
          <div className='flex flex-col rounded-3xl border-black border items-start p-2 mx-1 mt-2'>
            <h1 className='text-xl font-semibold'>DeviceID: {patient.deviceID}</h1>
            <h1 className='text-xl font-semibold'>Device name: XYZ</h1>
            <h1 className='text-xl font-semibold'>Battery: 80%</h1>
            <h1 className='text-xl font-semibold'>No of days used: 40d</h1>
          </div>
          <div className='flex flex-col my-auto'>
            <button className='cursor-pointer rounded-lg border border-black mx-2 mt-2 p-2 font-semibold text-lg' onClick={() => Navigate(`/prescriptions/${patientID}`)}>
              {activeComponent === 'Component1' ? 'Cancel' : 'Add Prescriptions'}
            </button>
            <button className='cursor-pointer rounded-lg border border-black mx-2 mt-2 p-2 font-semibold text-lg' onClick={() => handleButtonClick('Component2')}>
              {activeComponent === 'Component2' ? 'Cancel' : 'Request/View Test Results'}
            </button>
            <button className='cursor-pointer rounded-lg border border-black mx-2 mt-2 p-2 font-semibold text-lg' onClick={() => handleButtonClick('Component3')}>
               {activeComponent === 'Component3' ? 'Cancel' : 'Contact Emergency Services '}
            </button>
            <button className='cursor-pointer rounded-lg border border-black mx-2 mt-2 p-2 font-semibold text-lg' onClick={() => handleButtonClick('Component4')}>
              {activeComponent === 'Component4' ? 'Cancel' : 'Assign substitutes '}
            </button>
          </div>
        </div>
        {/* right-bottom */}
        <div className='h-[30%] justify-center p-2'>
          <div className=' border-black border'>
            <MyLeafletMap />
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default Data