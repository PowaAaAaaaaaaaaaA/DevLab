// Lesson Page for Css

import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowBackIos } from "react-icons/md";
import CodeMirror from '@uiw/react-codemirror';
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { MdDensityMedium } from "react-icons/md";
import { css } from '@codemirror/lang-css';

function LessonPage() {

const { lessonId, levelId } = useParams();
const [levelData, setLevelData] = useState(null);
const [code, setCode] =useState("<!--Hello world-->")
const iFrame = useRef(null);

useEffect(() => {
    const fetchLevel = async () => {
    try {
        const docRef = doc(db, "Css", lessonId, `Levels`, levelId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
        setLevelData(docSnap.data());
        } else {
        console.log("No level");
        }
    } catch (err) {
        console.error("Error fetching level:", err);
    }
    };

    fetchLevel();
}, [lessonId, levelId]);

const runCode = () => {
    const fullCode = 
    `<!DOCTYPE html>
    <html lang="en">
    <head>
    <style>
    ${code}
    </style>
    </head>
    <body>
    ${levelData.preHtml}
    </body>
    </html>`;
// Display code in the DIV MODOFAKA
    const iframe =  iFrame.current;
    if (iframe) {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(fullCode);
    doc.close();
    }
};
useEffect(() => {
if (levelData) {
    const timeout = setTimeout(() => {
    runCode();
}, 400); // delay after data is available

    return () => clearTimeout(timeout); // cleanup
    }
}, [levelData]); // runs only when levelData is loaded



return (
    <>
<div className='h-screen bg-[#0D1117] flex flex-col'>
    {/*Header*/}
    <div className=' border-white flex justify-between h-[10%] p-3'>
    <div className=' flex items-center p-3'>
        <Link to={'/Main'} className='text-[3rem] text-white'><MdArrowBackIos /></Link>
        <h1 className='text-[2.5rem] font-exo font-bold text-white'>DEVLAB</h1>
    </div>
    <div>
        <div>IMG</div>
    </div>
    </div>
    {/*Contents*/}
    <div className='h-[83%] flex justify-around items-center p-4'>
    {/*instruction Panel*/}
    <div className='h-[95%] w-[32%] rounded-2xl bg-[#393F59]  shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]'>
        {levelData ? (
            <div className='p-8 text-white'>
            <h2 className='text-2xl font-bold mb-2 font-exo text-[2.5rem]'>{levelData.order}. {levelData.title}</h2>
            <p className='w-[90%]'>{levelData.instruction}</p>
            </div>
        ) : (
            <p>Loading...</p>
        )}
    </div>
    {/*Coding Panel*/}
    <div className='bg-[#191a26] h-[95%] w-[32%] rounded-2xl flex items-center justify-center flex-col p- shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]'>
        <CodeMirror
            className='text-xl '
            value={code}
            height="650px"
            width='604px'
            extensions={[css()]}
            theme={tokyoNight}
            onChange={(value) => setCode(value)}/>

            <div className='w-[100%] flex justify-around'> 
                <button onClick={runCode} className="bg-[#9333EA] rounded-xl text-white hover:bg-purple-700 hover:cursor-pointer w-[30%] font-exo font-bold p-4 ">RUN</button>
                <button  className=" bg-[#9333EA] rounded-xl text-white hover:bg-purple-700 hover:cursor-pointer w-[30%] font-exo font-bold p-4 ">EVALUATE</button>
            </div>
    </div>
    {/*Output Panel*/}
    <div className='bg-[#D9D9D9] h-[95%] w-[32%] rounded-2xl  shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]'>
        <iframe
            title="output"
            ref={iFrame}
            className="w-full h-full rounded-3xl"
            sandbox="allow-scripts allow-same-origin allow-modals"/>
    </div>
    </div>
    {/*Footer*/}
    <div className=' border-2 border-t-white h-[7%] w-[100%] flex justify-between p-4 items-center'>
        <div className='flex items-center gap-4'>
            <MdDensityMedium className='text-[2.3rem] text-white'/>
        <div className='font-exo font-bold'>
            <p className='text-white '> {levelData ? `${levelData.order}. ${levelData.title}` : "Loading..."}</p>
            <p className='text-[#58D28F]'>100xp</p>
        </div>
        </div>
        <div className='w-[10%]'>
            <button  className=" bg-[#9333EA] rounded-xl text-white hover:bg-purple-700 hover:cursor-pointer w-[100%] font-exo font-bold p-2 ">Next</button>
        </div>
        <div>
            <p className='text-white font-exo text-[1.5rem]'>$999</p>
        </div>
    </div>
</div>
    
    </>
  )
}

export default LessonPage