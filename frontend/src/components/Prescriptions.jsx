import NewPrescs from './NewPrescs';
import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext/UserContext';
import { useNavigate, useParams } from 'react-router-dom';

const Prescriptions = () => {
  const { patientID } = useParams();
  const navigate = useNavigate();
  const [token] = useContext(UserContext);
  const [prescs, setPrescs] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loaded, setLoaded] = useState(true);
  const [id, setId] = useState(null);

  const getPrescs = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(`/api/prescriptions/${patientID}`, requestOptions);
    if (!response.ok) {
      setErrorMessage("Something went wrong. Couldn't load the prescs");
    } else {
      const data = await response.json();
      setPrescs(data);
      setLoaded(true);
    }
  };

  useEffect(() => {
    getPrescs();
  }, []);

  const handleModal = () => {
    setErrorMessage(!errorMessage);
    getPrescs();
    setId(null);
  };

  return (
    <div className="border border-black w-full flex m-1 p-8 relative">
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Back
      </button>

      {/* Left Component: Form */}
      <div className="w-1/2 p-8">
        <NewPrescs
          handleModal={handleModal}
          token={token}
          id={id}
          setErrorMessage={setErrorMessage}
        />
      </div>

      {/* Right Component: Previous Prescriptions */}
      <div className="w-1/2 mx-auto  p-8 shadow-md rounded-md overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Previous Prescriptions</h2>
        {loaded && prescs ? (
          <div className="mx-10 flex bg-gray-100 justify-center mt-4 flex-col relative rounded-xl m-2 h-[650px] overflow-y-auto">
          {/* Timeline Line */}
          <div className="absolute top-0 left-5 h-screen border-l-4 border-gray-300"></div>
        
          {prescs.map((pat, index) => (
            <div
              key={pat.patID}
              className="mb-8 ml-10 relative"
            >
              {/* Branch line connecting to the main timeline */}
              <div className="absolute -left-6 top-2 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-300"></div>
        
              {/* Prescription card */}
              <div className="p-4 rounded-lg w-4/5 bg-green-100 shadow-md">
                <div className="text-lg font-bold mb-2">Date: {pat.date}</div>
                <div className="text-lg mb-2">Medication: {pat.medication}</div>
                <div className="text-lg mb-2">Duration: {pat.duration}</div>
                <div className="text-lg">Instructions: {pat.instructions}</div>
              </div>
            </div>
          ))}
        </div>
        
        
        
        ) : (
          <p className="text-gray-500">No previous prescriptions.</p>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;
