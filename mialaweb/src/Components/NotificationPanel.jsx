import React from 'react'
import Notification from '../assets/Images/Notification.png'

function NotificationPanel() {
  return (
    <div className="w-[25%] h-full border-l border-gray-300">
        <img src={Notification} alt="" className="w-full h-full object-contain rounded-lg"/>
    </div>
  )
}

export default NotificationPanel;