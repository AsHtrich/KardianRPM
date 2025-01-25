import React, { useContext } from "react";
import { UserContext } from "../UserContext/UserContext";

const Lilo = () => {
  const [token, setToken] = useContext(UserContext);

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="text-center m-6">
      {token && (
        <button className="bg-[#111111] hover:bg-[#5A5A5A] text-white font-medium border-black border-2 text-xl px-6 py-1 rounded-full" onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
};

export default Lilo;