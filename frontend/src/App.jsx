import React, { useEffect,useContext, useState } from "react";
import Register from "./components/Register";
import { UserContext } from "./UserContext/UserContext";
import Login from "./components/Login";
import './style/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from "./pages/Dashboard";
import Data from "./pages/Data";
import Charts from "./components/Charts";
import Test from "./components/Test";
import Prescriptions from "./components/Prescriptions";
import Files from "./components/Files";
import Subs from "./components/Subs";
import AlertChart from "./components/AlertChart";
import Alerts from "./components/Alerts";
const App = () => {
  const [token] = useContext(UserContext);
  const [isLogin, setIsLogin] = useState(true);

  const getWelcomeMessage = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
      const response = await fetch("/api", requestOptions);
      const data = await response.json();
  
      if (!response.ok) {
        console.log("API request failed:");
      } else {
        console.log(data)
      }
  };
  useEffect(()=> {
    getWelcomeMessage();
  }, []);
  return (
        <div className="h-full w-full items-center justify-center">
          {!token ? (
              <div className="flex h-full my-0 flex-row items-center justify-center">
                <div className="p-11">
                  {isLogin ? (
                    <div>
                      <Login />
                      <button className="w-full text-white bg-[#111111] font-bold block text-xl px-5 py-2.5 text-center " onClick={() => setIsLogin(false)}>Go to Register</button>
                    </div>
                  ) : (
                    <div>
                      <Register />
                      <button className="w-full text-white bg-[#111111] font-bold block text-xl px-5 py-2.5 text-center " onClick={() => setIsLogin(true)}>Go to Login</button>
                    </div>
                  )}
                </div>
              </div>
          ) : ( 
            <div className="flex flex-row ">
              <BrowserRouter>
              <Sidebar>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/patients/:patientID" element={<Data />} />
                  <Route path="/prescriptions/:patientID" element={<Prescriptions />} />
                  <Route path="/alerts/:alertId" element={<AlertChart />} />
                  <Route path="/alerts" element={<Alerts/>} />
                  <Route path="/graphs" element={<Charts/>} />
                  <Route path="/trips" element={<Test/>} />
                  <Route path="/alarms" element={<Subs/>} />
                  <Route path="/about" element={<Files />} />
                </Routes>
              </Sidebar>
            </BrowserRouter>  
            </div> 
          )}
        </div>
  );
};

export default App;