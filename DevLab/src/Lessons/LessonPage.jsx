// Lesson Page for HTMl

import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db,auth } from '../Firebase/Firebase';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowBackIos } from "react-icons/md";
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';

import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { MdDensityMedium } from "react-icons/md";

function LessonPage() {

  const { lessonId, levelId } = useParams();
  const [levelData, setLevelData] = useState(null);
  const [code, setCode] =useState("<!--Hello world-->")
  const iFrame = useRef(null);

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const docRef = doc(db, "Html", lessonId, `Levels`, levelId);
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
    </head>
    <body>
    ${code}
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

// Exp and Coins
  const addExp = async (userId, amount, coinsAmmount) => {
  const userRef = doc(db, 'Users', userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    let newExp = (userData.exp || 0) + amount;
    let newLevel = userData.level || 1;
    let newCoins = userData.coins + coinsAmmount;

    if (newExp >= 100) {
      const levelsGained = Math.floor(newExp / 100);
      newLevel += levelsGained;
      newExp = newExp % 100;
    }
    // Update the Firebase (Coins and EXP)
    await updateDoc(userRef, {
      exp: newExp,
      level: newLevel,
      coins: newCoins
    });

    console.log(`User leveled up to ${newLevel} with ${newExp} EXP`);
  }
};
const onNextClick = async () => {
  const user = auth.currentUser;
  if (!user || !levelData) return;

  const expReward = levelData.expReward;
  const coinsReward = levelData.coinsReward;
  await addExp(user.uid, expReward, coinsReward);

  // Optional: Navigate to next level
  console.log("Next level logic here...");
};
// Getting the User Details to
  const [userDetails, setUserDetails] = useState("")
  useEffect(()=>{
    const fetchUserData = async ()=>{
      auth.onAuthStateChanged (async (user)=>{
        if(user){
          const getUser = doc(db, "Users", user.uid);
          const userSnap = await getDoc(getUser);
          if (userSnap.exists){
            setUserDetails(userSnap.data());
          }
        }
      });
    };
    fetchUserData();
  },[]);


  
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
              extensions={[html()]}
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
            <p className='text-[#58D28F]'>{levelData ? `${levelData.expReward}xp`: "Loading..."}</p>
          </div>
        </div>
        <div className='w-[10%]'>
          <button  
          onClick={onNextClick}
          className=" bg-[#9333EA] rounded-xl text-white hover:bg-purple-700 hover:cursor-pointer w-[100%] font-exo font-bold p-2 ">Next</button>
        </div>
        <div>
          <p className='text-white font-exo text-[1.5rem]'>{userDetails? `${userDetails.coins} Coins` : "Loading..."}</p>
        </div>
    </div>
  </div>
    
    </>
  )
}

export default LessonPage