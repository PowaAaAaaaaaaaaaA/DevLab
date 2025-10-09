import Image from '../assets/Images/Login-Image.jpg'
import { useState } from 'react'
import { auth, db } from '../Firebase/Firebase'
import { createUserWithEmailAndPassword,sendEmailVerification,signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';





function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [age, setAge] = useState("");

    const handleRegister= async (e)=>{
        e.preventDefault();
        try{
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
const user = userCredential.user;
    if (user) {
    console.log("Sending verification email to:", user.email);
    await sendEmailVerification(user);
    toast.success("Please check your email for confirmation", {
        position: "top-center",
        theme: "colored",
    });

  // Save main profile data
    await setDoc(doc(db, "Users", user.uid), {
    email: user.email,
    username: username,
    age: age,
    exp: 0,
    userLevel: 1,
    coins: 0,
    bio: "",
    isAdmin: false,
    suspend: false,
    healthPoints:3,
    lastOpenedLevel: {
        subject: "Html",
        lessonId: "Lesson1",
        levelId: "Level1",
    },});

const subjects = ["Html", "Css", "JavaScript", "Database"];
for (const subject of subjects) {
  // Create Level1 document
    await setDoc(
    doc(db, "Users", user.uid, "Progress", subject),
    {
        isActive: true, 
    });
    await setDoc(
    doc(db, "Users", user.uid, "Progress", subject,"Lessons","Lesson1"),
    {
        isActive: true, 
    });
    await setDoc(
    doc(db, "Users", user.uid, "Progress", subject, "Lessons", "Lesson1", "Levels", "Level1"),
    {
    isActive: true,
    completed:false,
    rewardClaimed: false,
    });

  // Create Stage1 document inside Stages subcollection of Level1
    await setDoc(
    doc(db,"Users",user.uid,"Progress",subject,"Lessons","Lesson1","Levels","Level1","Stages","Stage1"),
    {
    isActive: true,
    });
}
}
    await signOut(auth);
            toast.success("Registered Successfully",{
                position:"top-center",
                theme: "colored"
            })
            navigate('/Login');
        }catch(error){
            
            toast.error(error.message,{
                position:"bottom-center",
                theme: "colored"
            })
        }
    }
    return (
        <div className="min-h-screen bg-[#0D1117] flex justify-center items-center">

                {/* Register Wrapper*/}
                <div className="h-[70vh] w-[65%] bg-[#25293B] rounded-4xl shadow-lg shadow-cyan-500 flex">

                {/*Left pannel*/}
                <div className=" bg-cover bg-no-repeat h-[100%] w-[50%] rounded-4xl flex justify-center"style={{ backgroundImage: `url(${Image})` }}>
                <h1 className="self-center font-exo text-[3.5rem] font-bold text-[#F5F5F5] block">DEVLAB</h1>
                </div>
                {/*Left pannel (END)*/}
                {/*right pannel*/}
                <div className="flex w-[50%] items-center flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className='text-[#314A70] h-[25%] w-[25%] mt-[3%] mb-1'>
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            {
            }
                {/*------FORM-------*/}
                <form autocomplete="off" className='w-[100%] flex flex-col items-center p-3.5 gap-4' onSubmit={handleRegister}>
                {/*Email input*/}   
            <div className='w-[70%] flex justify-center relative '>
                    <input 
                    onChange={(e)=>setEmail(e.target.value)}
                    type="Email" 
                    name="Email" 
                    id="" placeholder='Email'  
                    autocomplete="false" 
                    className='relative bg-[#1E212F] text-[#FFFFFE] w-[100%] h-[5vh] rounded-2xl  pl-[50px] border-2 border-gray-700 focus:border-cyan-500  focus:outline-none'/>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className=' absolute h-[50%] w-[10%] text-[white] left-0 top-3 pl-[10px]'>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
            </div>
                {/*Password input*/}   
            <div className='w-[70%] flex justify-center relative  '>
                    <input 
                    onChange={(e)=>setPassword(e.target.value)}
                    type="Password" 
                    name="Password" 
                    id="" 
                    placeholder='Password' 
                    className='relative bg-[#1E212F] text-[#FFFFFE] w-[100%] h-[5vh] rounded-2xl  pl-[50px] border-2 border-gray-700 focus:border-cyan-500  focus:outline-none '/>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className=' absolute h-[50%] w-[10%] text-[white] left-0 top-3 pl-[10px]'>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
            </div>
                    {/* Confirm Password input   
                <div className='w-[70%] flex justify-center relative '>
                        <input 
                        type="Password" 
                        name="ConfirmPassowrd" 
                        id="" 
                        placeholder='Confirm Password' 
                        className='relative bg-[#1E212F] text-[#FFFFFE] w-[100%] h-[5vh] rounded-2xl  pl-[50px] border-2 border-gray-700 focus:border-cyan-500  focus:outline-none'/>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className=' absolute h-[50%] w-[10%] text-[white] left-0 top-3 pl-[10px]'>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                </div> */}
                {/*Username input*/}  
            <div className='w-[70%] flex justify-center relative'>
                    <input 
                    onChange={(e)=>setUsername(e.target.value)}
                    type="text" 
                    name="Username" 
                    id="" 
                    placeholder='Username' 
                    className='relative bg-[#1E212F] text-[#FFFFFE] w-[100%] h-[5vh] rounded-2xl  pl-[50px] border-2 border-gray-700 focus:border-cyan-500  focus:outline-none '/>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className=' absolute h-[50%] w-[10%] text-[white] left-0 top-3 pl-[10px]'>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
            </div>
                {/*Age*/}
            <div className='w-[25%] flex relative self-start ml-[15%]'>
                <input 
                onChange={(e)=>setAge(e.target.value)}
                type="number" 
                name="Age" 
                id="" 
                placeholder='Age' 
                className='relative bg-[#1E212F] text-[#FFFFFE] w-[100%] h-[5vh] rounded-2xl  pl-[50px] border-2 border-gray-700 focus:border-cyan-500  focus:outline-none '/>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=' absolute h-[50%] w-[50%] text-[white] -left-4 top-3 pl-[10px]'>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
</svg>

            </div>


            {/*Register Button*/}
            <div className='m-[2%] w-[35%]'>
                    <button 
                    onClick={(e)=>{handleRegister(e)}}
                    className='bg-[#7F5AF0] w-[100%] text-[1.2rem] rounded-4xl text-white p-4 font-bold hover:cursor-pointer hover:bg-[#6A4CD4] hover:scale-105 transition duration-300 ease-in-out hover:drop-shadow-[0_0_6px_rgba(188,168,255,0.8)]'>Register</button>
            </div>        
            {/*------FORM END-------*/}        
                </form>
            
                {/*right pannel (END)*/}
                </div>
                {/* Register Wrapper (END)*/}
                </div>
            </div>  
)
}

export default Register