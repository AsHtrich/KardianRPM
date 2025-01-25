import React, { useEffect, useState } from "react";
import axios from "axios";

const Files = () => {
  const [files, setFiles] = useState([]);
  const [report, setReport] = useState(""); 
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("/api/files");
        setFiles(response.data.files);
      } catch (err) {
        setError("Error fetching files");
      }
    };
    fetchFiles();
  }, []);

  const handleDownload = (filename) => {
    const downloadUrl = `http://localhost:8000/api/files/download/${filename}`;
    window.open(downloadUrl, "_blank");
  };

  const handleRequestSubmit = async () => {
    if (report.trim()) {
      try {
        await axios.post("/api/reports", { report });
        setReport("");  // Clear the textarea after submission
        setSuccessMessage("Report request sent successfully");
        setError("");  // Clear any previous error message
      } catch (error) {
        setError("Error sending report request");
        setSuccessMessage("");  // Clear any previous success message
      }
    }
  };

  return (
    <div className="border border-black w-[75%] flex flex-col m-1 items-center justify-center">
       <div className="file-list  max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Patient Health Reports</h2>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      <div className="grid grid-cols-2 gap-8">
        {/* Available Files Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-medium mb-3 text-gray-700">Available Reports</h3>
          {files.length > 0 ? (
            <ul className="space-y-4">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                  <span className="text-gray-700 font-medium">{file}</span>
                  <button
                    onClick={() => handleDownload(file)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 focus:outline-none transition-all duration-200"
                  >
                    Download
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No files available</p>
          )}
        </div>

        {/* Request Report Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-medium mb-3 text-gray-700">Request a Health Report</h3>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Request specific health report details from the patient..."
            value={report}
            onChange={(e) => setReport(e.target.value)}  
          />
          <button
            onClick={handleRequestSubmit}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 focus:outline-none transition-all duration-200"
          >
            Send Request
          </button>
        </div>
      </div>
    </div> 
    </div>
    
  );
};

export default Files;
