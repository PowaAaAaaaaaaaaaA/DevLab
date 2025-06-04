
import Image from '../assets/Images/Login-Image.jpg';

function Login() {
    
    return (
        <div className="min-h-screen bg-[#0D1117] flex justify-center items-center">

            {/* Login Wrapper*/}
            <div className="h-[70vh] w-[65%] bg-[#25293B] rounded-4xl shadow-lg shadow-cyan-500 flex">

            {/*Left pannel*/}
            <div className=" bg-cover bg-no-repeat h-[100%] w-[50%] rounded-4xl flex justify-center"style={{ backgroundImage: `url(${Image})` }}>
            <h1 className="self-center font-exo text-[3.5rem] font-bold text-[#F5F5F5] block">DEVLAB</h1>
            </div>

            {/*right pannel*/}
            <div className="flex w-[50%] items-center flex-col">

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className='text-[#314A70] h-[40%] w-[40%] mt-[3%] mb-1'>
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
        

            <form className='w-[100%] flex flex-col items-center p-3.5'>


        <div className='w-[70%] flex justify-center relative'>
                <input type="text" name="" id="" placeholder='Username' className='relative bg-[#1E212F] text-[#FFFFFE] w-[100%] h-[5vh] rounded-2xl  pl-[50px] '/>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className=' absolute h-[50%] w-[10%] text-[white] left-0 top-3 pl-[10px]'>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
        </div>
        <div className='w-[70%] flex justify-center relative m-[3%]'>
                <input type="Password" name="" id="" placeholder='Password' className='relative bg-[#1E212F] text-[#FFFFFE] w-[100%] h-[5vh] rounded-2xl  pl-[50px] '/>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className=' absolute h-[50%] w-[10%] text-[white] left-0 top-3 pl-[10px]'>
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
        </div>
        <div  className='m-[2%]'>
            <input type="checkbox" name="remember" id="" className='hover: cursor-pointer'/>
            <label htmlFor="remember" className='text-white pl-1 '>Remember Me</label>
        </div>
        <div className='m-[2%] w-[35%]'>
            <button className='bg-[#7F5AF0] w-[100%] text-[1.2rem] rounded-4xl text-white p-4 font-bold hover:cursor-pointer'>Login</button>
        </div>                
            </form>

        <div className='text-white'>
            <p>Dont have an account? <span className='text-blue-200 hover:cursor-pointer'>Register here</span></p>
        </div>

            </div>

            </div>



        </div>  
    )
}
export default Login