import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
const NewPrescs = ({ handleModal, token, id, setErrorMessage }) => {
    const { patientID } = useParams();
    const [patID, setPatID] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [medication, setMedication] = useState("");
    const [dosage, setDosage] = useState("");
    const [frequency, setFrequency] = useState("");
    const [duration, setDuration] = useState("");
    const [form, setForm] = useState("tablet");
    const [instructions, setInstructions] = useState("");  
    const [pid, setPid] = useState("");  
    
    const cleanFormData = () => {
        setPatID("");
        setDate("");
        setMedication("");
        setDosage("");
        setFrequency("");
        setDuration("");
        setForm("tablet");
        setInstructions("");
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
            "pid": pid,
            "patID": patID,
            "date": date, 
            "medication": medication,
            "frequency": frequency,
            "dosage": dosage,
            "duration": duration,
            "form": form,
            "instructions": instructions 
        }),
    
        };

        try {
        const response = await fetch(`/api/prescriptions/${patientID}`, requestOptions);

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
    <div>
        <div className="mx-auto bg-white p-6 shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Prescription</h2>
        <form onSubmit={handleCreatePatient} className="space-y-2">
        <div>
            <label className="block text-gray-700">Presc ID:</label>
            <input type="number" name="patientName" value={pid} onChange={(e) => setPid(e.target.value)} required
                   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-gray-700">Patient ID:</label>
            <input type="number" name="patientName" value={patID} onChange={(e) => setPatID(patientID)} required
                   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div>
            <label className="block text-gray-700">Date:</label>
            <input type="text" name="date" value={date} onChange={(e) => setDate(e.target.value)} required
                   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div>
            <label className="block text-gray-700">Medication:</label>
            <input type="text" name="medication" value={medication} onChange={(e) => setMedication(e.target.value)} required
                   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div>
            <label className="block text-gray-700">Dosage (e.g., 500 mg):</label>
            <input type="text" name="dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} required
                   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div>
            <label className="block text-gray-700">Frequency (e.g., twice daily):</label>
            <input type="text" name="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} required
                   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div>
            <label className="block text-gray-700">Duration (e.g., 7 days):</label>
            <input type="text" name="duration" value={duration} onChange={(e) => setDuration(e.target.value)} required
                   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div>
            <label className="block text-gray-700">Form of Medication:</label>
            <select name="form" value={form} onChange={(e) => setForm(e.target.value)} required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="tablet">Tablet</option>
              <option value="capsule">Capsule</option>
              <option value="syrup">Syrup</option>
              <option value="injection">Injection</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Special Instructions:</label>
            <textarea name="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>
          </div>


          <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
            Save Prescription
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewPrescs