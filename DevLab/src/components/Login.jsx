
import Image from '../assets/Images/Login-bg.png';

function Login() {
    
    return (
        <div className="min-h-screen bg-[#0D1117] flex justify-center items-center">

            {/* Login Wrapper*/}
            <div className="h-[70vh] w-[70%] bg-[#25293B] rounded-4xl shadow-lg shadow-cyan-500">

            {/*Left pannel*/}
            <div className="bg-[url('../assets/Images/Login-bg.png')] bg-cover h-[100%] w-[50%] rounded-4xl flex justify-center ">
            <h1 className="self-center font-exo text-[3.5rem] text-[#F5F5F5]">DEVLAB</h1>
            </div>

            </div>



        </div>
    )
}
export default Login