import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext/UserContext";
import ErrorMessage from "./ErrorMessage";

const Register = () => {
    // const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [,setToken] = useContext(UserContext);

    const submitRegistration = async () => {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({email: email, hashed_password: password }),
        };
    
        const response = await fetch("/api/users", requestOptions);
        const data = await response.json();
    
        if (!response.ok) {
          setErrorMessage(data.detail);
        } else {
          setToken(data.access_token);
        }
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmationPassword && password.length > 5) {
          submitRegistration();
        } else {
          setErrorMessage(
            "Ensure that the passwords match and greater than 5 characters"
          );
        }
      };
    
    return (
        <div className="border rounded-md w-[550px] items-center justify-center border-black bg-[#5A5A5A]">
            <form className="container p-10 flex flex-col" onSubmit={handleSubmit}>
                <h1 className="font-bold text-center text-white text-3xl">Register</h1>
                <div className="p-5">
                    <label className="block mb-2 text-xl font-medium text-white">
                        Email Address
                    </label>
                    <div >
                        <input 
                        type="email" 
                        placeholder="Enter email" 
                        value={email} 
                        onChange={ (e) => setEmail(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        required
                        />
                    </div>
                </div>
                <div className="px-5">
                    <label className="block mb-2 text-xl font-medium text-white">
                        Password
                    </label>
                    <div >
                        <input 
                        type="password" 
                        placeholder="Enter password" 
                        value={password} 
                        onChange={ (e) => setPassword(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        required
                        />
                    </div>
                </div>
                <div className="p-5">
                    <label className="block mb-2 text-xl font-medium text-white">
                        Confirm Password
                    </label>
                    <div >
                        <input 
                        type="password" 
                        placeholder="Enter password again" 
                        value={confirmationPassword} 
                        onChange={ (e) => setConfirmationPassword(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        required
                        />
                    </div>
                </div>
                <ErrorMessage message={errorMessage} />
                <br />
                <button type="submit" className="w-full text-white bg-[#FF7B08] font-bold rounded-lg block text-xl px-5 py-2.5 text-center ">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register  