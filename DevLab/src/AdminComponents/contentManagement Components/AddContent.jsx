import React, { useEffect } from 'react'

import { useState } from 'react';
import { toast } from 'react-toastify';
import { collection,  getDocs,addDoc,setDoc,doc } from "firebase/firestore";

import { db } from "../../Firebase/Firebase";
function AddContent({subject,closePopup}) {
const [Lessons, setLessons] = useState([]);
const [selectedLesson, setSelectedLesson] = useState("");
const [selectedType, setSelectedType] = useState("FrontEnd");

// Mapping the Existing Lesson of the selected Subj
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
}// END

// This is for adding
const [title, setTitle] = useState()
const [desc, setDesc] = useState()
const [coins, setCoins] = useState();
const [exp, setExp] = useState();


const handleAdd = async () => {
    if (!title || !desc) {
    toast.error("Fill all the fields", {
      position: "top-center",
      theme: "colored",
    });
    return;
  }
     let defaultS = "";
    switch(subject){
       
        case "Html":
        defaultS = "<>";
        break;
        case "Css":
        defaultS = "#";
        break;
        case "JavaScript":
        defaultS = "{ }";
        break;
        case "Database":
        defaultS = "||||";
        break;
    }


    let lessonId = selectedLesson;
    let newLessonAdd = "";
    if (selectedLesson === "LessonAdd") {   
    const existingNums = Lessons.map((l) => {
        const match = l.id?.match(/Lesson(\d+)/);
        return match ? parseInt(match[1]) : 0;
    });
    const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1;
    newLessonAdd = `${nextNum}`;
    lessonId = `Lesson${nextNum}`;
    // Data to lesson
    try {
        const lessonDocRef = collection(db, subject);
        await setDoc(doc(lessonDocRef,lessonId), {
            Lesson: Number(newLessonAdd),
        });

        await fetchLessonsData(subject);
        setSelectedLesson(lessonId);

        toast.success("Lesson Added",{
            position:"top-center",
            theme: "colored"
        })

    } catch (error) {
        console.error("Error adding lesson:", error);
        return;
    }
}
    try {
    // Handle Add Level (whether lesson is new or selected)
    const levelCollection = collection(db, subject, lessonId, "Levels");
    const levelSnapshot = await getDocs(levelCollection);
    const levelNums = levelSnapshot.docs.map((doc) => {
        const match = doc.id.match(/Level(\d+)/i);
        return match ? parseInt(match[1]) : 0;
    });
    const nextLevelNum = levelNums.length > 0 ? Math.max(...levelNums) + 1 : 1;
    const levelId = `Level${nextLevelNum}`;

    const levelDocRef = doc(db, subject, lessonId, "Levels", levelId);

    const levelData = {
        title,
        description:desc,
        coinsReward: parseInt(coins),
        expReward: parseInt(exp),
        symbol: defaultS,
        order: nextLevelNum,};

if (subject === "JavaScript") {
    levelData.type = selectedType; 
}
await setDoc(levelDocRef, levelData);

    toast.success("Level Added",{
        position:"top-center",
        theme: "colored"})

    setTitle("");
    setDesc("");
    setCoins("");
    setExp("")
} catch (error) {
    console.error("Error adding level:", error);
}
};








useEffect(()=>{
    fetchLessonsData(subject);
},[subject])


return (
    <div className='h-auto p-2 flex flex-col w-[100%] '>
        {/*Form*/}
        <form 
          onSubmit={(e) => {
    e.preventDefault();
    handleAdd();
  }}
        action="" className='border h-[100%] w-[100%] m-auto bg-[#111827] border-[#56EBFF] rounded-2xl p-5' >
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
            {subject === "JavaScript" && (
                <div className='ml-5'>
                    <label htmlFor="" className="text-white font-exo mr-3">Type:</label>
                <select 
                onChange={(e) =>setSelectedType(e.target.value)}
                name="" id="" className="bg-[#1f2937] text-white p-2 rounded-md focus:outline-0 hover: cursor-pointer">
                    <option value="FrontEnd">Front End</option>
                    <option value="BackEnd">Back End</option>
                </select>
                </div>
            )}
            
            </div>

        <div className={`mt-4 rounded-2xl bg-[#0d13207c] p-5 border-gray-700 border flex flex-col font-exo text-white h-[82%]  ${selectedLesson ===""?"opacity-30 pointer-events-none":""}`}>
                <label className='text-2xl'>Enter the Following</label>
                <input 
                required
                onChange={(e)=>{
                    setTitle(e.target.value);
                }}
                type="text" placeholder='Title' className='border-gray-700 border m-2 p-3 rounded focus:outline-1 focus:outline-gray-400'/>
                <input
                required 
                onChange={(e)=>{
                    setDesc(e.target.value);
                }}
                type="text" placeholder='Description' className='border-gray-700 border m-2 p-3 rounded focus:outline-1 focus:outline-gray-400'/>
                <input 
                onChange={(e)=>{
                    setCoins(e.target.value);
                }}
                type="number" placeholder='Coin Reward' className='border-gray-700 border m-2 p-3 rounded focus:outline-1 focus:outline-gray-400'/>
                <input 
                onChange={(e)=>{
                    setExp(e.target.value);
                }}
                type="number" placeholder='Exp Reward' className='border-gray-700 border m-2 p-3 rounded focus:outline-1 focus:outline-gray-400'/>
                <div className='flex mt-5 p-5 justify-around w-[60%] m-auto gap-10'>
                    <button 
                    type='submit'
                    className='p-2 text-[1.2rem] rounded-xl w-[45%] bg-[#4CAF50] hover:cursor-pointer'>Add Level</button>
                    <button 
                    onClick={closePopup}
                    className='p-2 text-[1.2rem] rounded-xl w-[45%] bg-gray-700 hover:cursor-pointer'>Cancel</button>
                </div>
                
        </div>
        </form>

    </div>
)}

export default AddContent