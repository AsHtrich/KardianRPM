import React, { useContext,useState, useEffect } from 'react';
import { UserContext } from '../UserContext/UserContext';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import Newpatients from '../components/Newpatients';

const Dashboard = () => {
  const Navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [token] = useContext(UserContext);
  const [patients, setPatients] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loaded, setLoaded] = useState(true);
  const [id, setId] = useState(null);

  const getPatients = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch("/api/patients", requestOptions);
    if (!response.ok) {
      setErrorMessage("Something went wrong. Couldn't load the patients");
    } else {
      const data = await response.json();
      setPatients(data);
      setLoaded(true);
    }
  };

  useEffect(() => {
    getPatients();
  }, []);

  const handleModal = () => {
    setErrorMessage(!errorMessage)
    getPatients();
    setId(null);
  };
  return (
    <div className='flex flex-col h-full'>
      <Header title="Dashboard" />
      <div className='flex'>
          {isEnrolled? (
          <div className="flex w-1/2 flex-col mt-6 mx-5">
            <h1 className='text-2xl font-semibold mx-14 pb-1'>Patient Enrollment Form:</h1>
            <div className='border border-black flex flex-col rounded-3xl h-[630px] '>
                <Newpatients
                  handleModal={handleModal}
                  token={token}
                  id={id}
                  setErrorMessage={setErrorMessage}
                />
                
            </div>   
            <div className='mt-10 mx-auto rounded-xl w-2/3 cursor-pointer border-[#5A5A5A] border-4 bg-[#e96d6d]'>       
                <div className='py-2 px-2' onClick={() => setIsEnrolled((prev) => !prev)}>                  
                  <h1 className='text-xl font-bold flex justify-center px-10'>{isEnrolled ? 'Cancel' : 'Enroll'}</h1>
                </div>
            </div>
          </div>
        ):( 
          <div className="flex w-1/2 flex-col mt-6 mx-5">
            <h1 className='text-2xl font-semibold mx-14 pb-1'>Patient's List:</h1>
            <div className=' border border-black rounded-3xl h-[630px] '>
            {loaded && patients ? (
            <div className="mx-10 mt-4 flex-col">
              <table className="w-full table-auto border-4">
                <thead>
                  <tr className="bg-gray-300">
                    <th className="p-2 text-center font-bold">Patient ID</th>
                    <th className="p-2 text-center font-bold">Name</th>
                    <th className="p-2 text-center font-bold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((pat) => (
                    <tr
                      key={pat.patID}
                      className="text-center cursor-pointer rounded-full font-semibold bg-green-100 hover:bg-gray-200 py-2 px-4"
                      onClick={() => Navigate(`/patients/${pat.patID}`)}
                    >
                      <td className="p-2 font-bold">{pat.patID}</td>
                      <td>{pat.name}</td>
                      <td>{pat.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        
        ) : (
          <p className=' font-semibold text-4xl mx-auto'>Loading...</p>
        )}
            </div>
            <div className='mt-10 mx-auto rounded-xl w-2/3 cursor-pointer border-[#5A5A5A] border-4 bg-[#e96d6d]'>       
                <div className='py-2 px-2' onClick={() => setIsEnrolled((prev) => !prev)}>                  
                  <h1 className='text-xl font-bold flex justify-center px-10'>{isEnrolled ? 'Cancel' : 'Enroll'}</h1>
                </div>
            </div>
          </div>     
        )}

       
      </div>
    </div>

  );
};

export default Dashboard;