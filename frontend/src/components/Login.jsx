import React, { useState, useContext } from "react";
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../UserContext/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);

  const submitLogin = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify(
        `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`
      ),
    };

    const response = await fetch("/api/token", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.detail);
    } else {
      setToken(data.access_token);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };

  return (
    <div className="container border rounded-md w-[550px] items-center justify-center border-black bg-[#5A5A5A]">
      <form className="container p-10 flex flex-col" onSubmit={handleSubmit}>
        <h1 className="font-bold text-center text-white text-3xl">Login</h1>
        <div className="pt-5 px-5">
          <label className="block mb-2 text-xl font-medium text-white">Email Address</label>
          <div >
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
              required
            />
          </div>
        </div>
        <div className="p-5">
          <label className="block mb-2 text-xl font-medium text-white">Password</label>
          <div className="control">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
              required
            />
          </div>
        </div>
        <ErrorMessage message={errorMessage} />
        <br />
        <button className="w-full text-white bg-[#FF7B08] font-bold rounded-lg block text-xl px-5 py-2.5 text-center" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;