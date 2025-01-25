import React, { useState } from 'react';
import {FaTh,FaArrowCircleRight,FaArrowCircleLeft,FaUserAlt,FaRegChartBar,FaDatabase, FaThList} from "react-icons/fa";
import { NavLink } from 'react-router-dom';

const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const menuItem = [
        { path: "/", name: "Dashboard", icon: <FaTh /> },
        { path: "/stream", name: "Stream", icon: <FaDatabase /> },
        { path: "/graphs", name: "Graphs", icon: <FaRegChartBar /> },
        { path: "/trips", name: "All Trips", icon: <FaThList /> },
        { path: "/about", name: "About", icon: <FaUserAlt /> },
    ];

    return (
        <div className="flex container h-screen overflow-hidden relative">
            <div style={{ width: isOpen ? "220px" : "70px" }} className="bg-[#111111] text-[#EBEBEB]  border-[#ffffff]">
                <div className="flex items-center py-5 px-1">
                    <img src='' alt='RPMv2' className={`h-20 ${isOpen ? "block" : "hidden"}`} />
                </div>
                {menuItem.map((item, index) => (
                    <NavLink to={item.path} key={index} className="flex items-center gap-4 p-4 mb-3 text-[#EBEBEB] hover:bg-[#ffffff] hover:text-black" activeClassName="bg-[#ffffff] text-black">
                        <div className="text-2xl">{item.icon}</div>
                        <div className={`${isOpen ? "block" : "hidden"} text-xl`}>{item.name}</div>
                    </NavLink>
                ))}
                <div className={`p-4 flex items-center justify-center text-4xl cursor-pointer`} onClick={toggle}>
                {isOpen ? <FaArrowCircleLeft  /> : <FaArrowCircleRight />}
                </div>
            </div>
            <main className="w-full h-full">{children}</main>
        </div>
    );
};

export default Sidebar;
