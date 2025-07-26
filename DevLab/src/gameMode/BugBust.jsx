// Utils / Custom Hooks
import { useEffect, useState, useRef } from "react";

// Navigation (React Router)
import { useParams, Link } from "react-router-dom";
// PopUps
import GameMode_Instruction_PopUp from "./GameModes_Popups/GameMode_Instruction_PopUp";
import LevelCompleted_PopUp from "./GameModes_Popups/LevelCompleted_PopUp";
// for Animation / Icons
import Lottie from "lottie-react";
import Animation from "../assets/Lottie/OutputLottie.json";
import { AnimatePresence } from "framer-motion";
import { MdArrowBackIos, MdDensityMedium } from "react-icons/md";
// For the Text Editor
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import initSqlJs from "sql.js";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
// Components
import GameHeader from "./GameModes_Components/GameHeader";
import InstructionPanel from "./GameModes_Components/InstructionPanel";
import Html_TE from "./GameModes_Components/CodeEditor and Output Panel/Html_TE";
import GameFooter from "./GameModes_Components/GameFooter";


function BugBust({heart,gameOver,submitAttempt,roundKey}) {
  const type = "Bug Bust";
  // Navigate
  const { subject, lessonId, levelId, gamemodeId, topicId } = useParams();

  // BugBust Mode Data
  const [levelData, setLevelData] = useState(null);
  const [lessonGamemode, setLessonGamemode] = useState(null);
  // Code Mirror input/output
  const iFrame = useRef(null);
  const dbRef = useRef(null);
  const [outputHtml, setOutputHtml] = useState("");
  const [tablesHtml, setTablesHtml] = useState("");
  //Pop up
  const [levelComplete, setLevelComplete] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  // Output Panel (Lottie)
  const [hasRunQuery, setHasRunQuery] = useState(false);



  // Table for Database Subject
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
  // Display Table for Database Subject
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
        </div></div>`;
        }
      }
      setTablesHtml(html);
    } catch (err) {
      console.error("Error displaying tables:", err);
    }
  };
  // Run Button for Both (Query and Code)
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
                (row) => `<tr>${row.map((cell) => `<td class="border px-4 py-1">${cell}</td>`).join("")}</tr>`).join("")}
            </tbody>
        </table>
        </div>`;
        setOutputHtml(table);
        renderAllTables();
        submitAttempt(true)
      } catch (err) {
        setOutputHtml(
          `<span class="text-red-500 font-medium">${err.message}</span>`
        );
      }
    } else {
      // Naka Auto Bawas lang (Wala pa kasi pang check)
      submitAttempt(false);
      setRunCode(true);
      setTimeout(() => {
      const fullCode = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <style>${subject === "Css" ? code : ""}</style>
        </head>
        <body>${
          subject === "Html" || subject === "JavaScript-FrontEnd" ? code : "" }
        <script>${subject === "JavaScript-FrontEnd" ? code : ""}</script>
        </body>
        </html>`;
      const doc =
        iFrame.current.contentDocument || iFrame.current.contentWindow.document;
      doc.open();
      doc.write(fullCode);
      doc.close();
      }, 0);

    }
  };



  return subject !== "DataBase" ? (
  <>
    <div 
      key={roundKey}
      className="h-screen bg-[#0D1117] flex flex-col">
        {/* Header */}
      <GameHeader heart={heart} /> 
        {/* Content */}
        <div className="h-[83%] flex justify-around items-center p-4">
        {/* Instruction */}
      <InstructionPanel/>
        {/* Code Editor */}
      <Html_TE submitAttempt={submitAttempt}/>
        </div>
        {/* Footer */}
      <GameFooter/>
    </div>
{/*Instruction Pop Up (1st Pop Up)*/}
      <AnimatePresence>
        {showPopup ? (
          <GameMode_Instruction_PopUp
            title="Hey Dev!!"
            message={`Welcome to ${type} — a fast-paced challenge where you’ll write and run code before time runs out! . 
                Your mission:  
                🧩 Read the task  
                💻 Write your code  
                🚀 Run it before the timer hits zero!`}
            onClose={() => setShowPopup(false)}
            buttonText="Start Challenge"/>) : null}
      </AnimatePresence>
{/*Level Complete PopUp*/}
      <AnimatePresence>
        {levelComplete && (
          <LevelCompleted_PopUp
          heartsRemaining={heart}
          setLevelComplete={setLevelComplete}/>)}  
      </AnimatePresence>
      {/*GameOver PopUp (this popup when Life = 0)*/}
      <AnimatePresence>

      </AnimatePresence>
  </>
    
) : 
    /*DATABASE TAB*/
      /*DATABASE TAB*/
        /*DATABASE TAB*/
          /*DATABASE TAB*/
            /*DATABASE TAB*/
(
    <>
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
          <div
            className="h-[95%] w-[32%] bg-[#393F59] rounded-2xl flex flex-col gap-5 text-white overflow-y-scroll p-6 shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
      [&::-webkit-scrollbar-track]:bg-gray-100  
        [&::-webkit-scrollbar-thumb]:rounded-full
      dark:[&::-webkit-scrollbar-track]:bg-[#393F59]    
      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            {levelData && lessonGamemode ? (
              <>
                <h2 className="text-[2rem] font-bold text-[#E35460] font-exo text-shadow-lg text-shadow-black">
                  {levelData.order}. {lessonGamemode.title}
                </h2>
                <p className="whitespace-pre-line text-justify leading-relaxed  text-[0.9rem] ">
                  {lessonGamemode.topic}
                </p>
                <div className="mt-4 p-4 bg-[#25293B] rounded-2xl">
                  <h3 className="font-bold text-xl mb-2 font-exo text-shadow-lg text-shadow-black">
                    Instruction
                  </h3>
                  <p className="mb-2 whitespace-pre-line text-justify leading-relaxed  text-[0.9rem] ">
                    {lessonGamemode.instruction}
                  </p>
                </div>
                <div className="font-bold text-[3.2rem] w-[40%] m-auto p-3 flex flex-col justify-center items-center "></div>
              </>
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
                className="bg-[#7F5AF0] rounded-xl text-white  hover:cursor-pointer w-[30%] font-exo font-bold p-4 hover:bg-[#6A4CD4] hover:scale-101 transition duration-300 ease-in-out hover:drop-shadow-[0_0_6px_rgba(188,168,255,0.3)] "
              >
                RUN
              </button>
              <button className=" bg-[#7F5AF0] rounded-xl text-white hover:cursor-pointer w-[30%] font-exo font-bold p-4 hover:bg-[#6A4CD4] hover:scale-101 transition duration-300 ease-in-out hover:drop-shadow-[0_0_6px_rgba(188,168,255,0.3)] ">
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
            <button className=" bg-[#7F5AF0] rounded-xl text-white hover:cursor-pointer w-[100%] font-exo font-bold p-2  hover:bg-[#6A4CD4] hover:scale-101 transition duration-300 ease-in-out hover:drop-shadow-[0_0_6px_rgba(188,168,255,0.3)]">
              Next
            </button>
          </div>
          <div>
            <p className="text-white font-exo text-[1.5rem]">$999</p>
          </div>
        </div>
      </div>
{/*Instruction Pop Up (1st Pop Up)*/}
    <AnimatePresence>
      {showPopup && (
        <GameMode_Instruction_PopUp
          title="Hey Dev!!"
          message={`Welcome to ${type} — a fast-paced challenge where you’ll write and run code before time runs out! . 
    Your mission:  
🧩 Read the task  
💻 Write your code  
🚀 Run it before the timer hits zero!`}
          onClose={() => setShowPopup(false)}
          buttonText="Start Challenge"
        />
      )}
    </AnimatePresence>
{/*Level Complete PopUp*/}
      <AnimatePresence>
        {levelComplete && (
          <LevelCompleted_PopUp
          heartsRemaining={heart}
          setLevelComplete={setLevelComplete}/>)}  
      </AnimatePresence>
    </>
  ); 
}

export default BugBust;
