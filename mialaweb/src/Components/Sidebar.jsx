import React from 'react'
import Frame from '../assets/Images/mialaLogo.png'
import { TbChartPieFilled } from "react-icons/tb";
import { FiShoppingBag } from "react-icons/fi";
import { FiArchive } from "react-icons/fi";
import { RiWallet3Line } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

function Sidebar({ setActivePage, activePage }) {

    const menuItems = [
        { id: "overview", label: "Overview", icon: <TbChartPieFilled /> },
        { id: "product-management", label: "Product Management", icon: <FiShoppingBag /> },
        { id: "fees", label: "Fees", icon: <FiArchive /> },
        { id: "agents", label: "Agents", icon: <FaUsers /> },
        { id: "settings", label: "Settings", icon: <IoSettingsOutline /> },
      ];
      

  return (
    <aside className='bg-gray-100 h-screen w-[25%] flex flex-col justify-between py-2 pt-5 pl-5 border-r border-gray-300'>
        <img src={Frame} alt="" className='w-[78px] h-[28px] mx-auto mt-7'/>
        <div className=' text-black space-y-1 flex flex-col'>
            <div className={`flex items-center space-x-3  hover:bg-red-300 rounded-md p-2 hover:cursor-pointer hover:w-52 group`}>
                <TbChartPieFilled className=' text-black text-[20px] group-hover:text-gray-700'/>
                <h2 className=' group-hover:text-gray-700 text-[15px]'>Overview</h2>
            </div>

            <div className='flex items-center space-x-3  hover:bg-rose-300 rounded-md p-2 hover:cursor-pointer hover:w-52 group'>
                <FiShoppingBag
                className=' text-black text-[20px] group-hover:text-gray-700'/>
                <h2 className=' group-hover:text-gray-700 text-[15px]'>Product Management</h2>
            </div>

            <div className={`flex items-center space-x-3  hover:bg-rose-300 rounded-md p-2 hover:cursor-pointer hover:w-52 group`}>
                <FiArchive
                className=' text-black text-[20px] group-hover:text-gray-700'/>
                <h2 className=' group-hover:text-gray-700 text-[15px]'>Delivery</h2>
            </div>

            <div className={`flex items-center space-x-3  hover:bg-rose-300 rounded-md p-2 hover:cursor-pointer hover:w-52 group`}>
                <RiWallet3Line 
                className='text-black text-[20px] group-hover:text-gray-700'/>
                <h2 className=' group-hover:text-gray-700 text-[15px]'>Fees</h2>
            </div>

            <div className={`flex items-center space-x-3  hover:bg-rose-300 rounded-md p-2 hover:cursor-pointer hover:w-52 group`}>
                <FaUsers 
                className='text-black text-[20px] group-hover:text-gray-700'/>
                <h2 className='group-hover:text-gray-700 text-[15px]'>Agents</h2>
            </div>

            <div className={`flex items-center space-x-3  hover:bg-rose-300 rounded-md p-2 hover:cursor-pointer hover:w-52 group`}>
                <IoSettingsOutline
                className='text-black text-[20px] group-hover:text-gray-700'/>
                <h2 className='group-hover:text-gray-700 text-[15px]'>Settings</h2>
            </div>

        </div>

            <div className='flex items-center space-x-1 hover:cursor-pointer '>
                <CgProfile />
                <h2 className='text-[13px]'>Admin</h2>
            </div>
    </aside>
  )
}

export default Sidebar;