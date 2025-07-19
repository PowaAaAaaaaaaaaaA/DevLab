import { useEffect, useState, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { sql } from "@codemirror/lang-sql";
import initSqlJs from "sql.js";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { db, auth } from "../Firebase/Firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { useParams, Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import Animation from "../assets/Lottie/OutputLottie.json";
import { MdArrowBackIos, MdDensityMedium } from "react-icons/md";
import { goToNextGamemode } from "../gameMode/Util_Navigation";
import GameMode_Instruction_PopUp from "./GameMode_Instruction_PopUp";

function CodeRush() {
  const { subject, lessonId, levelId, topicId, gamemodeId } = useParams();
  const navigate = useNavigate();


  // Data
  const [levelData, setLevelData] = useState(null);
  const [lessonGamemode, setLessonGamemode] = useState(null);
  const [userDetails, setUserDetails] = useState("");

  const [code, setCode] = useState("");
  const iFrame = useRef(null);
  const dbRef = useRef(null);
  const [outputHtml, setOutputHtml] = useState("");
  const [tablesHtml, setTablesHtml] = useState("");

  //Pop up
  const [levelComplete, setLevelComplete] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  // Code Rush Timer
  const [timer, setTimer] = useState(null);
  // Lottie show 
  const [hasRunCode, setRunCode] = useState(false);
  const [hasRunQuery, setHasRunQuery] = useState(false);

  // Langunage each Subj
  const languageMap = {
    Html: html(),
    Css: css(),
    JavaScript: javascript(),
    DataBase: sql(),
  };

  // Getting the Level Data (CodeRush)
  useEffect(() => {
    const fetchLevel = async () => {
      const docRef = doc(db, subject, lessonId, "Levels", levelId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setLevelData(docSnap.data());

      const gamemodeRef = doc( db, subject, lessonId, "Levels", levelId, "Topics", topicId, "Gamemodes", gamemodeId);
      const gamemodeSnap = await getDoc(gamemodeRef);
      if (gamemodeSnap.exists()) {
        setLessonGamemode(gamemodeSnap.data());
        const gamemodeData = gamemodeSnap.data();
        setTimer(gamemodeData.timer);
      }
    };
    fetchLevel();
  }, [subject, lessonId, levelId]);
  //
  // Data Base (Subject)  Table
  useEffect(() => {
    if (subject === "DataBase") {
      initSqlJs({
        locateFile: (file) =>
          `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/${file}`,
      }).then((SQL) => {
        const db = new SQL.Database();
        db.run(`
        CREATE TABLE users (id INTEGER, name TEXT);
        CREATE TABLE orders (id INTEGER, user_id INTEGER, item TEXT);

        INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie')
                                ,(4, 'Jhon'), (5, 'Sahur'), (6, 'Dongskie')
                                ,(7, 'Barlo'), (8, 'Mirana'), (9, 'Meeps');
        INSERT INTO orders VALUES (1, 1, 'Laptop'), (2, 2, 'Phone'), (3, 1, 'Tablet')
                                , (4, 1, 'Shabu'), (5, 2, 'Dildo'), (6, 1, 'Mouse')
                                , (7, 1, 'Laptop'), (8, 2, 'Phone'), (9, 1, 'Tablet');`);
        dbRef.current = db;
        renderAllTables();
      });
    }
  }, [subject]);
  // Table display
  const renderAllTables = () => {
    if (!dbRef.current) return;
    try {
      const tables = dbRef.current.exec(
        "SELECT name FROM sqlite_master WHERE type='table';"
      );
      if (!tables.length) return;
      let html = "";
      for (const table of tables[0].values) {
        const tableName = table[0];
        const result = dbRef.current.exec(`SELECT * FROM ${tableName}`);
        if (result.length) {
          const { columns, values } = result[0];
          html += `<div class='mb-6 '><h3 class='text-lg font-semibold mb-2 '>${tableName}</h3>`;
          html += `<div class="overflow-auto ">
            <table class="table-auto border-collapse border border-gray-400 bg-[#F8F3FF] w-full text-sm">
            <thead>
                <tr class="bg-[#F8F3FF]">
                ${columns
                  .map((col) => `<th class="border px-4 py-2">${col}</th>`)
                  .join("")}
                </tr>
            </thead>
            <tbody>
                ${values.map(
                    (row) => `<tr>${row.map((cell) => `<td class="border px-4 py-1">${cell}</td>`)
                  .join("")}</tr>`).join("")}
            </tbody>
            </table>
        </div></div>`;
        }
      }
      setTablesHtml(html);
    } catch (err) {
      console.error("Error displaying tables:", err);
    }
  };
  // Data Base (Subject(END))

  // Run Code (Dynammic)
  const runCode = () => {
    if (subject === "DataBase") {
      try {
        setHasRunQuery(true);
        const res = dbRef.current.exec(query);
        if (res.length === 0) {
          setOutputHtml("Query executed successfully. No results.");
          renderAllTables();
          return;
        }
        const { columns, values } = res[0];
        const table = `
        <div class="overflow-auto ">
        <table class="table-auto border-collapse border border-gray-400 w-full text-sm ">
            <thead>
            <tr class="bg-[#F8F3FF] p-3">   
                ${columns
                  .map((col) => `<th class="border px-4 py-2">${col}</th>`)
                  .join("")}
            </tr>
            </thead>
            <tbody>
            ${values
              .map(
                (row) => `
                <tr>${row
                  .map((cell) => `<td class="border px-4 py-1">${cell}</td>`)
                  .join("")}</tr>
            `
              )
              .join("")}
            </tbody>
        </table>
        </div>`;
        setOutputHtml(table);
        renderAllTables();
      } catch (err) {
        setOutputHtml(
          `<span class="text-red-500 font-medium">${err.message}</span>`
        );
      }
    } else {
      setRunCode(true);
      const fullCode = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <style>${subject === "Css" ? code : ""}</style>
        </head>
        <body>${
          subject === "Html" || subject === "JavaScript-FrontEnd" ? code : ""
        }
        <script>${subject === "JavaScript-FrontEnd" ? code : ""}</script>
        </body>
        </html>`;
      const doc =
        iFrame.current.contentDocument || iFrame.current.contentWindow.document;
      doc.open();
      doc.write(fullCode);
      doc.close();
    }
  };

  // Getting the User Info
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const getUser = doc(db, "Users", user.uid);
        const userSnap = await getDoc(getUser);
        if (userSnap.exists()) setUserDetails(userSnap.data());
      }
    });
  }, []);
  // Timer Funtion
  useEffect(() => {
    if (!showPopup) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            // Here when Time ran outt
            console.log("Time's up!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [showPopup, timer]);

  console.log(gamemodeId);
  return subject !== "DataBase" ? (
    <>
      {showPopup && (
        <GameMode_Instruction_PopUp
          title="Hey Dev!!"
          message={`Welcome to **CodeRush** — a fast-paced challenge where you’ll write and run code before time runs out! . 
    Your mission:  
🧩 Read the task  
💻 Write your code  
🚀 Run it before the timer hits zero!`}
          onClose={() => setShowPopup(false)}
          buttonText="Start Challenge"
        />
      )}
      <div className="h-screen bg-[#0D1117] flex flex-col">
        {/* Header */}
        <div className="flex justify-between h-[10%] p-3">
          <div className="flex items-center p-3">
            <Link to="/Main" className="text-[3rem] text-white">
              <MdArrowBackIos />
            </Link>
            <h1 className="text-[2.5rem] font-exo font-bold text-white">
              DEVLAB
            </h1>
          </div>
          <div>IMG</div>
        </div>

        {/* Content */}
        <div className="h-[83%] flex justify-around items-center p-4">
          {/* Instruction */}
          <div
            className="h-[95%] w-[32%] bg-[#393F59] rounded-2xl flex flex-col gap-5 text-white overflow-y-scroll p-6 shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
      [&::-webkit-scrollbar-track]:bg-gray-100  
        [&::-webkit-scrollbar-thumb]:rounded-full
      dark:[&::-webkit-scrollbar-track]:bg-[#393F59]    
      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
          >
            {levelData && lessonGamemode ? (
              <>
                <h2 className="text-[2rem] font-bold text-[#E35460] font-exo text-shadow-lg text-shadow-black">
                  {levelData.order}. {lessonGamemode.title}
                </h2>
                <p className="whitespace-pre-line text-justify leading-relaxed  text-[0.9rem] ">
                  {lessonGamemode.topic}
                </p>
                <div className="mt-4 p-4 bg-[#25293B] rounded-2xl flex flex-col gap-3">
                  <h3 className="font-bold text-xl mb-2 font-exo text-shadow-lg text-shadow-black">
                    Instruction
                  </h3>
                  <p className="mb-2 whitespace-pre-line text-justify leading-relaxed  text-[0.9rem] ">
                    {lessonGamemode.instruction}
                  </p>
                  <p className="bg-[#191C2B] p-3 rounded-xl text-white overflow-auto whitespace-pre-wrap">
                    {lessonGamemode.preCode}
                  </p>
                </div>
                <div className="font-bold text-[3.2rem] w-[40%] m-auto p-3 flex flex-col justify-center items-center ">
                  <p className="font-exo text-shadow-lg text-shadow-black text-[1.5rem]">
                    Time:
                  </p>
                  <p className="text-[#E35460] ">
                    {String(Math.floor(timer / 60)).padStart(2, "0")}:
                    {String(timer % 60).padStart(2, "0")}
                  </p>
                </div>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          {/* Code Editor */}
          <div className="bg-[#191a26] h-[95%] w-[32%] rounded-2xl flex flex-col gap-3 items-center p-3 shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]">
            <CodeMirror
              value={code}
              onChange={(val) => setCode(val)}
              height="640px"
              width="600px"
              extensions={[languageMap[subject] || html()]}
              theme={tokyoNight}
            />
            <div className="flex justify-around w-full">
              <button
                onClick={runCode}
                className="bg-[#9333EA] text-white font-bold rounded-xl p-3 w-[45%] hover:cursor-pointer"
              >
                RUN
              </button>
              <button className="bg-[#9333EA] text-white font-bold rounded-xl p-3 w-[45%]">
                EVALUATE
              </button>
            </div>
          </div>
          {/* Output */}
          <div className="h-[95%] w-[32%] rounded-2xl p-2 bg-[#F8F3FF] shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]">
            {hasRunCode ? (
              <iframe
                ref={iFrame}
                title="output"
                className="w-full h-full rounded-xl"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="w-full h-full flex items-center flex-col">
                <Lottie
                  animationData={Animation}
                  loop={true}
                  className="w-[70%] h-[70%]"
                />
                <p className="text-[0.8rem]">
                  YOUR CODE RESULTS WILL APPEAR HERE WHEN YOU RUN YOUR PROJECT
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="h-[7%] border-t-white border-t-2 px-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <MdDensityMedium className="text-2xl" />
            <div>
              <p>
                {levelData
                  ? `${levelData.order}. ${levelData.title}`
                  : "Loading..."}
              </p>
              <p className="text-[#58D28F]">
                {levelData ? `${levelData.expReward}xp` : ""}
              </p>
            </div>
          </div>
          <div className="w-[10%]">
            <button
              onClick={() =>
                goToNextGamemode({
                  subject,
                  lessonId,
                  levelId,
                  topicId,
                  gamemodeId,
                  navigate,
                  // THis OnComplete is for when it clicked and no more game modes it will pop up Congratualate (Wala pang validationg kung tama mga pinag cocode nung user)
                  onComplete: () => setLevelComplete(true),
                })
              }
              className="bg-[#9333EA] text-white font-bold rounded-xl w-full py-2"
            >
              Next
            </button>
          </div>
          <div>
            <p className="text-xl">
              {userDetails ? `${userDetails.coins} Coins` : "Loading..."}
            </p>
          </div>
        </div>
      </div>
      {levelComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-[90%] max-w-md text-center">
            <h2 className="text-3xl font-bold text-[#9333EA] mb-4">
              🎉 Congratulations!
            </h2>
            <p className="text-lg text-gray-800 mb-6">
              You have completed all game modes for this level.
            </p>
            <button
              onClick={() => {
                setLevelComplete(false);
                navigate("/Main"); // or navigate to next level, summary, or dashboard
              }}
              className="bg-[#9333EA] text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700"
            >
              Back to Main
            </button>
          </div>
        </div>
      )}
    </>
  ) : (
    <>
      {showPopup && (
        <GameMode_Instruction_PopUp
          title="Hey Dev!!"
          message={`Welcome to **CodeRush** — a fast-paced challenge where you’ll write and run code before time runs out! . 
    Your mission:  
🧩 Read the task  
💻 Write your code  
🚀 Run it before the timer hits zero!`}
          onClose={() => setShowPopup(false)}
          buttonText="Start Challenge"
        />
      )}
      <div className="h-screen bg-[#0D1117] flex flex-col">
        {/*Header*/}
        <div className=" border-white flex justify-between h-[10%] p-3">
          <div className=" flex items-center p-3">
            <Link to={"/Main"} className="text-[3rem] text-white">
              <MdArrowBackIos />
            </Link>
            <h1 className="text-[2.5rem] font-exo font-bold text-white">
              DEVLAB
            </h1>
          </div>
          <div>
            <div>IMG</div>
          </div>
        </div>
        {/*Contents*/}
        <div className="h-[83%] flex justify-around items-center p-4">
          {/*Instruction*/}
          <div className="h-[95%] w-[32%] rounded-2xl bg-[#393F59]  shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]">
            {levelData ? (
              <div className="p-8 text-white">
                <h2 className="text-2xl font-bold mb-2 font-exo text-[2.5rem]">
                  {levelData.order}. {levelData.title}
                </h2>
                <p className="w-[90%]">{levelData.instruction}</p>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          {/*Coding Panel*/}
          <div className="bg-[#191a26] h-[95%] w-[32%] rounded-2xl flex items-center justify-center flex-col p- shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]">
            <CodeMirror
              className="text-xl "
              value={code}
              height="650px"
              width="604px"
              extensions={[sql()]}
              theme={tokyoNight}
              onChange={(value) => setQuery(value)}
            />
            <div className="w-[100%] flex justify-around">
              <button
                onClick={runCode}
                className="bg-[#9333EA] rounded-xl text-white hover:bg-purple-700 hover:cursor-pointer w-[30%] font-exo font-bold p-4 "
              >
                RUN
              </button>
              <button className=" bg-[#9333EA] rounded-xl text-white hover:bg-purple-700 hover:cursor-pointer w-[30%] font-exo font-bold p-4 ">
                EVALUATE
              </button>
            </div>
          </div>
          <div className="h-[100%] w-[30%] p-4 flex flex-col justify-center gap-7">
            {/*Table*/}
            <div className="border-amber-50 w-[100%] h-[45%] border overflow-scroll overflow-x-hidden rounded-3xl p-3 bg-[#F8F3FF]">
              <div
                dangerouslySetInnerHTML={{ __html: tablesHtml }}
                className="text-black font-exo"
              ></div>
            </div>
            {/*OUTPUT TABLEE!!!*/}
            <div className="w-[100%] h-[45%]">
              {hasRunQuery ? (
                <div
                  className="text-2xl font-exo w-full h-full overflow-auto text-black  bg-[#F8F3FF] rounded-3xl p-3 "
                  dangerouslySetInnerHTML={{ __html: outputHtml }}
                ></div>
              ) : (
                <div className="w-full h-full flex items-center flex-col justify-center bg-[#F8F3FF] rounded-3xl">
                  <Lottie
                    animationData={Animation}
                    loop={true}
                    className="w-[70%] h-[70%]"
                  />
                  <p className="text-[0.8rem]">
                    YOUR CODE RESULTS WILL APPEAR HERE WHEN YOU RUN YOUR PROJECT
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/*Footer*/}
        <div className=" border-2 border-t-white h-[7%] w-[100%] flex justify-between p-4 items-center">
          <div className="flex items-center gap-4">
            <MdDensityMedium className="text-[2.3rem] text-white" />
            <div className="font-exo font-bold">
              <p className="text-white ">
                {" "}
                {levelData
                  ? `${levelData.order}. ${levelData.title}`
                  : "Loading..."}
              </p>
              <p className="text-[#58D28F]">100xp</p>
            </div>
          </div>
          <div className="w-[10%]">
            <button className=" bg-[#9333EA] rounded-xl text-white hover:bg-purple-700 hover:cursor-pointer w-[100%] font-exo font-bold p-2 ">
              Next
            </button>
          </div>
          <div>
            <p className="text-white font-exo text-[1.5rem]">$999</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CodeRush;
