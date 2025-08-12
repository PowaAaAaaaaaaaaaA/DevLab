import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { auth } from '../Firebase/Firebase';
import { useNavigate } from 'react-router-dom';

import AdminNavbar from '../AdminComponents/AdminNavbar';

function AdminLayout() {


  


  return (
    <div className='h-screen w-screen bg-[#0D1117] flex p-5'>
        {/*NavBar*/}
      <AdminNavbar/>
        {/*Content*/}
      <div className=' w-[100%] h-[100%] bg-[#25293B] p-4 rounded-4xl shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]'>
        <Outlet/>

      </div>

    </div>
  )
}

export default AdminLayout