import { useEffect, useState, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { htmlLanguage } from "@codemirror/lang-html";
import { cssLanguage } from "@codemirror/lang-css";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import { sql } from "@codemirror/lang-sql";
import initSqlJs from "sql.js";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { db, auth } from "../Firebase/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import Animation from "../assets/Lottie/OutputLottie.json";
import { MdArrowBackIos, MdDensityMedium } from "react-icons/md";
import { goToNextGamemode } from "../gameMode/Util_Navigation";
import GameMode_Instruction_PopUp from "./GameMode_Instruction_PopUp";
import { autocompletion } from "@codemirror/autocomplete";
import { LanguageSupport } from "@codemirror/language";
import { AnimatePresence, motion } from "framer-motion";
import {
  html as beautifyHTML,
  css as beautifyCSS,
  js as beautifyJS,
} from "js-beautify";
function BugBust() {
  const navigate = useNavigate();
  const { subject, lessonId, levelId, gamemodeId, topicId } = useParams();

  // Data
  const [userDetails, setUserDetails] = useState("");
  const [levelData, setLevelData] = useState(null);
  const [lessonGamemode, setLessonGamemode] = useState(null);

  const [code, setCode] = useState("");
  const iFrame = useRef(null);
  const dbRef = useRef(null);
  const [outputHtml, setOutputHtml] = useState("");
  const [tablesHtml, setTablesHtml] = useState("");
  //Pop up
  const [levelComplete, setLevelComplete] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  // Lottie show
  const [hasRunQuery, setHasRunQuery] = useState(false);
  const [hasRunCode, setRunCode] = useState(false);

  const type = "Bug Bust";

  // Language each Subj (I remove the Auto Complete and Suggestion ng Code Mirror for this game mode)
  const languageMap = {
    Html: new LanguageSupport(htmlLanguage, [autocompletion({ override: [] })]),
    Css: new LanguageSupport(cssLanguage, [autocompletion({ override: [] })]),
    JavaScript: new LanguageSupport(javascriptLanguage, [
      autocompletion({ override: [] }),
    ]),
    DataBase: sql(),
  };
  // Getting the Level Data (Bug Bust)
  useEffect(() => {
    const fetchLevel = async () => {
      const docRef = doc(db, subject, lessonId, "Levels", levelId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setLevelData(docSnap.data());

      const gamemodeRef = doc(
        db,
        subject,
        lessonId,
        "Levels",
        levelId,
        "Topics",
        topicId,
        "Gamemodes",
        gamemodeId
      );
      const gamemodeSnap = await getDoc(gamemodeRef);
      if (gamemodeSnap.exists()) {
        setLessonGamemode(gamemodeSnap.data());
      }
    };
    fetchLevel();
  }, [subject, lessonId, levelId]);
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

  const [formattedCode, setFormattedCode] = useState("");
  useEffect(() => {
    if (!lessonGamemode || !subject) return;
    const rawCode = lessonGamemode?.preCode || "";
    switch (subject) {
      case "Html":
        setFormattedCode(beautifyHTML(rawCode, { indent_size: 2 }));
        break;
      case "Css":
        setFormattedCode(beautifyCSS(rawCode, { indent_size: 2 }));
        break;
      case "JavaScript":
        setFormattedCode(beautifyJS(rawCode, { indent_size: 2 }));
        break;
      default:
        setFormattedCode(rawCode);
    }
  }, [lessonGamemode, subject]);

  console.log(gamemodeId);
  return subject !== "DataBase" ? (
    <>
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
            buttonText="Start Challenge"
          />
        ) : null}
      </AnimatePresence>
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
                  <p className="bg-[#191C2B] p-4 rounded-xl text-white whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {formattedCode}
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
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05, background: "#7e22ce" }}
                transition={{ bounceDamping: 100 }}
                onClick={runCode}
                className="bg-[#9333EA] text-white font-bold rounded-xl p-3 w-[45%] hover:cursor-pointer hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)]"
              >
                RUN
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05, background: "#7e22ce" }}
                transition={{ bounceDamping: 100 }}
                className="bg-[#9333EA] text-white font-bold rounded-xl p-3 w-[45%] hover:cursor-pointer hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)]"
              >
                EVALUATE
              </motion.button>
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
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05, background: "#7e22ce" }}
              transition={{ bounceDamping: 100 }}
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
              className="bg-[#9333EA] text-white font-bold rounded-xl w-full py-2 hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)] cursor-pointer"
            >
              Next
            </motion.button>
          </div>
          <div>
            <p className="text-xl">
              {userDetails ? `${userDetails.coins} Coins` : "Loading..."}
            </p>
          </div>
        </div>
      </div>
      {/*Level Complete PopUp*/}
      <AnimatePresence>
        {levelComplete && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 w-[90%] max-w-md text-center">
              <h2 className="text-3xl font-bold text-[#9333EA] mb-4">
                🎉 Congratulations!
              </h2>
              <p className="text-lg text-gray-800 mb-6">
                You have completed all game modes for this level.
              </p>
            <motion.button
                whileTap={{scale:0.95}}
                whileHover={{scale:1.05}}
                transition={{bounceDamping:100}}
              onClick={() => {
                setLevelComplete(false);
                navigate("/Main"); // or navigate to next level, summary, or dashboard
              }}
              className="bg-[#9333EA] text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)] cursor-pointer ">
              Back to Main
            </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
      {/*Level Complete PopUp*/}
      <AnimatePresence>
        {levelComplete && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 w-[90%] max-w-md text-center">
              <h2 className="text-3xl font-bold text-[#9333EA] mb-4">
                🎉 Congratulations!
              </h2>
              <p className="text-lg text-gray-800 mb-6">
                You have completed all game modes for this level.
              </p>
            <motion.button
                whileTap={{scale:0.95}}
                whileHover={{scale:1.05}}
                transition={{bounceDamping:100}}
              onClick={() => {
                setLevelComplete(false);
                navigate("/Main"); // or navigate to next level, summary, or dashboard
              }}
              className="bg-[#9333EA] text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)] cursor-pointer ">
              Back to Main
            </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  ); 
}

export default BugBust;
