import { useState } from 'react'
import Sidebar from './Components/Sidebar'
import './index.css'
import { IoIosSearch } from "react-icons/io";
import { FaSlidersH } from "react-icons/fa";
import Overview from './Components/OverView'
import ProductManagement from './Components/ProductManagement'
import Fees from './Components/Fees'
import Agents from './Components/Agents'
import Settings from './Components/Settings'


function App() {
  const [activePage, setActivePage] = useState("overview");

  
  const renderContent = () => {
    switch (activePage) {
      case "overview":
        return <Overview />;
      case "product-management":
        return <ProductManagement />;
      case "fees":
        return <Fees />;
      case "agents":
        return <Agents />;
      case "settings":
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar setActivePage={setActivePage} activePage={activePage}/>

      
      <div className="flex flex-col w-full">

        <div className='flex items-center bg-white w-full h-16 border-b border-gray-300'>

          <div className='pl-6'>
            <ul className='flex items-center space-x-2 '>
              <li className='hover:cursor-pointer hover:text-gray-400'>Dashboards</li>
              <li className='hover:cursor-pointer hover:text-gray-400'>/</li>
              <li className='hover:cursor-pointer hover:text-gray-400'>Home</li>
            </ul>
          </div>
          
          <div className='w-[500px] p-1 ml-20'>
            <div className='flex bg-gray-200 px-2 py-2 rounded-xl space-x-1 justify-center items-center'>
              <div className=' p-1'>
                <IoIosSearch  className='text-[20px] text-gray-500'/>
              </div>
              <input type="text" className='outline-0 flex-1' placeholder='Search'/>

              <FaSlidersH className='text-gray-500 text-[15px]'/>
            </div>
          </div>
      
        </div>

        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>

    </div>
      
  )
}

export default App
