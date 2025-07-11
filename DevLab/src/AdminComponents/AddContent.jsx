import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HiChevronLeft } from "react-icons/hi2";
import { useState } from 'react';
import { collection, doc, getDocs } from "firebase/firestore";

import { db } from "../Firebase/Firebase";
function AddContent({subject,closePopup}) {


const [Lessons, setLessons] = useState([]);
const [selectedLesson, setSelectedLesson] = useState("");


const fetchLessonsData = async(subject)=>{
    try{
        const subjDb = collection(db,subject);
        const subjDocs = await getDocs(subjDb);
    const lessons =subjDocs.docs.map(doc=>({
        id: doc.id,
        ...doc.data()
    }));
    setLessons(lessons)
    }catch(error){
        console.log(error)
    }
}
useEffect(()=>{
    fetchLessonsData(subject);
},[subject])

console.log(selectedLesson);

return (
    <div className='h-[100%] p-2 flex flex-col w-[100%] '>
        {/*Form*/}
        <form action="" className='border h-[100%] w-[100%] m-auto bg-[#111827] border-[#56EBFF] rounded-2xl p-5'>
            <div className='border h-[15%] flex items-center pl-10 rounded-2xl border-gray-700 bg-[#0d13207c] text-[1.3rem] font-exo'>
                <label className="text-white font-exo mr-3">Lesson: </label>
            <select
                className="bg-[#1f2937] text-white p-2 rounded-md focus:outline-0 hover: cursor-pointer"
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}>
                <option value="">-- Select Lesson --</option>
            {Lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                {lesson.title || lesson.id}
                </option>))}
                <option value="LessonAdd">Add Lesson</option>
            </select>
            </div>

        <div className={`mt-4 rounded-2xl bg-[#0d13207c] p-5 border-gray-700 border flex flex-col font-exo text-white h-[82%]  ${selectedLesson ===""?"opacity-30 pointer-events-none":""}`}>
            
    
            
                <label className='text-2xl'>Enter the Following</label>
                <input type="text" placeholder='Title' className='border-gray-700 border m-2 p-3 rounded focus:outline-1 focus:outline-gray-400'/>
                <input type="text" placeholder='Description' className='border-gray-700 border m-2 p-3 rounded focus:outline-1 focus:outline-gray-400'/>
                <input type="number" placeholder='Coin Reward' className='border-gray-700 border m-2 p-3 rounded focus:outline-1 focus:outline-gray-400'/>
                
                <div className='flex mt-5 p-5 justify-around w-[60%] m-auto gap-10'>
                    <button className='p-2 text-[1.2rem] rounded-xl w-[45%] bg-[#4CAF50] hover:cursor-pointer'>Add Level</button>
                    <button 
                    onClick={closePopup}
                    className='p-2 text-[1.2rem] rounded-xl w-[45%] bg-gray-700 hover:cursor-pointer'>Cancel</button>
                </div>
                
        </div>
        </form>

    </div>
)}

export default AddContent