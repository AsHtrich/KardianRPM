import React, { useEffect, useState } from "react";

const Newpatients = ({ handleModal, token, id, setErrorMessage }) => {
  const [patID, setPatID] = useState("");
  const [patName, setpatName] = useState("");
  const [patEmail, setpatEmail] = useState("");
  const [docID, setdocID] = useState("");
  const [deviceID, setdeviceID] = useState("");
  const [address, setaddr] = useState("");
  const [patNo, setpatNo] = useState("");
  const [relNo, setrelNo] = useState("");
  const [relName, setrelName] = useState("");
  const [desc, setdesc] = useState("");
  const [age, setage] = useState("");



  const cleanFormData = () => {
        setPatID("");
        setpatName("");
        setpatEmail("");
        setdocID("");
        setdeviceID("");
        setaddr("");
        setpatNo("");
        setrelName("");
        setrelNo("");
        setdesc("");
        setage("");
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        "docID": 0,
        "name": patName,
        "docID": docID,
        "pno": patNo,
        "address": address,
        "deviceID": deviceID,
        "patID": patID,
        "email": patEmail,
        'Relname':relName,
        'Relpno':relNo ,
        'desc':desc,
        'age':age

      }),
      };

    try {
      const response = await fetch("/api/patients", requestOptions);

      if (!response.ok) {
        setErrorMessage("Something went wrong when creating a trip.");
      } else {
        cleanFormData();
        handleModal();
      }
    } catch (error) {
      setErrorMessage("An error occurred while creating a trip.");
     
    }
  };

  return (
    <div className="">
      <div className="mx-10 mt-4 flex-col">
        <div className="my-4 rounded-xl h-[600px] border-[#5A5A5A] border-4 bg-green-100 p-6">
          <form className="grid grid-cols-2 gap-4">

          <div className="flex flex-col">
            <label className="text-sm font-medium">Name</label>
            <input type="text" className="p-2 border border-gray-300 rounded" placeholder="Enter name" value={patName}
                  onChange={(e) => setpatName(e.target.value)}  required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium">Age</label>
            <input type="text" className="p-2 border border-gray-300 rounded" placeholder="Enter age" value={age}
                  onChange={(e) => setage(e.target.value)}  required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium">PID</label>
            <input type="tel" className="p-2 border border-gray-300 rounded" value={patID}
                      onChange={(e) => setPatID(e.target.value)}  placeholder="Enter patient ID" />
          </div>
          
          <div className="flex flex-col">
        <label className="text-sm font-medium">Email</label>
        <input type="email" className="p-2 border border-gray-300 rounded"  value={patEmail}
                  onChange={(e) => setpatEmail(e.target.value)}  placeholder="Enter email" />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium">Phone Number</label>
        <input type="tel" className="p-2 border border-gray-300 rounded" value={patNo}
                  onChange={(e) => setpatNo(e.target.value)} placeholder="Enter phone number" />
      </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium">Relative's Name</label>
            <input type="text" className="p-2 border border-gray-300 rounded" placeholder="Enter relatives name" value={relName}
                  onChange={(e) => setrelName(e.target.value)}  required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium">Relative's number</label>
            <input type="text" className="p-2 border border-gray-300 rounded" placeholder="Enter relatives number" value={relNo}
                  onChange={(e) => setrelNo(e.target.value)}  required />
          </div>

        <div className="flex flex-col col-span-2">
        <label className="text-sm font-medium">Address</label>
        <input type="text" className="w-full p-2 border border-gray-300 rounded" value={address}
                  onChange={(e) => setaddr(e.target.value)} placeholder="Enter address" />
      </div>
          
        
      <div className="flex flex-col">
        <label className="text-sm font-medium">Sensor ID</label>
        <input type="text" className="p-2 border border-gray-300 rounded"value={deviceID}
                  onChange={(e) => setdeviceID(e.target.value)}  placeholder="Enter sensor ID" />
      </div>


      <div className="flex flex-col">
        <label className="text-sm font-medium">Doctor Assigned</label>
        <input type="text" className="p-2 border border-gray-300 rounded" value={docID}
                  onChange={(e) => setdocID(e.target.value)}  placeholder="Enter doctor's name" />
      </div>

      <div className="flex flex-col col-span-2">
        <label className="text-sm font-medium">Disease Description</label>
        <input type="text" className="w-full p-2 border border-gray-300 rounded" value={desc}
                  onChange={(e) => setdesc(e.target.value)} placeholder="Enter disease description" />
      </div>
          </form>
        
        
        <footer className=" mt-4 flex flex-row items-centre justify-center">
          <button className="px-8 py-4 mt-4 mx-4 bg-black font-semibold text-white rounded-full " onClick={handleCreatePatient}>
              Create
          </button>        
         
        </footer>
      </div>
    </div>
    </div>
  );
};

export default Newpatients;