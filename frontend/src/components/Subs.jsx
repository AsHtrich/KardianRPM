import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext/UserContext';

const Subs = () => {
  const [users, setUsers] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(""); 
  const [selectedDoctorsList, setSelectedDoctorsList] = useState([]); 
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [token] = useContext(UserContext);

  const getUsers = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token, 
      },
    };
    const response = await fetch(`/api/users`, requestOptions);
    if (!response.ok) {
      setError("Something went wrong. Couldn't load the users");
    } else {
      const data = await response.json();
      setUsers(data);
      setLoaded(true);
    }
  };

  useEffect(() => {
    getUsers();
  }, []); 

  const handleAddDoctor = () => {
    if (!selectedDoctor) {
      setError("Please select a substitute doctor");
      return;
    }

    const doctor = users.find((user) => user.uid.toString() === selectedDoctor);
    console.log("Selected Doctor:", doctor);
    if (doctor) {
      setSelectedDoctorsList((prevList) => {
        if (!prevList.some((doc) => doc.uid === doctor.uid)) {
          return [...prevList, doctor];
        }
        return prevList;
      });
      setSuccessMessage(`${doctor.email} has been added as your substitute doctor`);
      setSelectedDoctor(""); 
      setError(""); 
    }
  };

  const handleRemoveDoctor = (doctorUid) => {
    setSelectedDoctorsList((prevList) => prevList.filter((doctor) => doctor.uid !== doctorUid));
    setSuccessMessage(""); 
  };

  return (
    
    <div className='border border-black w-[75%] flex flex-col m-1 items-center justify-center' >
      <div className="substitute-doctor-selection w-[75%] mx-auto mt-8 p-6 bg-white rounded-lg shadow-md" >

      
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Select Substitute Doctor</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      <div className="bg-gray-50 p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-medium mb-3 text-gray-700">Choose a Doctor to Cover Your Absence</h3>

        {/* Doctor selection dropdown */}
        <select
          value={selectedDoctor}
          onChange={(e) => {
            console.log("Selected value:", e.target.value); 
            setSelectedDoctor(e.target.value);
          }}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a substitute doctor</option>
          {/* Map through users and render options */}
          {users.length > 0 ? (
            users.map((user) => (
              <option key={user.uid} value={user.uid}>
                {user.email} {/* Assuming 'email' is a property in the user object */}
              </option>
            ))
          ) : (
            <option disabled>No users available</option>
          )}
        </select>

        {/* Button to add selected doctor to the list */}
        <button
          onClick={handleAddDoctor}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 focus:outline-none transition-all duration-200"
        >
          Add Doctor
        </button>
      </div>

      {/* List of selected doctors */}
      {selectedDoctorsList.length > 0 && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-medium mb-3 text-gray-700">Selected Substitute Doctors</h3>
          <ul className="space-y-4">
            {selectedDoctorsList.map((doctor) => (
              <li key={doctor.uid} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                <span className="text-gray-700 font-medium">{doctor.email}</span>
                <button
                  onClick={() => handleRemoveDoctor(doctor.uid)} // Fixing the issue here, use uid instead of id
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 focus:outline-none transition-all duration-200"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </div>
  );
};

export default Subs;
