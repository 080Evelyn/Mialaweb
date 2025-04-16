import React from 'react'
import { FaAngleDown } from "react-icons/fa6";
import NotificationPanel from './NotificationPanel';
import Frame from '../assets/Images/Frame.png'

function OverView() {
  return (
    <div className='flex gap-4 w-full'>
        <div className="w-[75%] flex flex-col space-y-4 bg-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">OverView</h2>

                <div className='flex items-center space-x-1'>
                    <h2 className="text-gray-600 font-medium">Today</h2>
                    <FaAngleDown />
                </div>
            </div>

            <div className="flex items-center justify-center">
                <img src={Frame} alt="" />
            </div>
        </div>


        <NotificationPanel />
    </div>
  )
}

export default OverView;