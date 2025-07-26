// Utils / CustomHooks
import { useEffect, useState, useRef } from "react";

//Navigation (React Router)
import { useParams, Link } from "react-router-dom";
// for Animation / Icons
import Lottie from "lottie-react";
import Animation from "../assets/Lottie/OutputLottie.json";
import { motion } from "framer-motion";
import { MdArrowBackIos, MdDensityMedium } from "react-icons/md";
// for the Text Editor
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import initSqlJs from "sql.js";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
// Components
import GameHeader from "../gameMode/GameModes_Components/GameHeader";
import InstructionPanel from "../gameMode/GameModes_Components/InstructionPanel";
import GameFooter from "../gameMode/GameModes_Components/GameFooter";
import Html_TE from "../gameMode/GameModes_Components/CodeEditor and Output Panel/Html_TE";
import Css_TE from "../gameMode/GameModes_Components/CodeEditor and Output Panel/Css_TE";


function LessonPage() {
  // Navigate
  const { subject, lessonId, levelId, topicId, gamemodeId } = useParams();
  // Level Datas will be remove soon
  const [levelData, setLevelData] = useState(null);
  // For the Code Mirror Input/Output
  const dbRef = useRef(null);
  const [outputHtml, setOutputHtml] = useState("");
  const [hasRunQuery, setHasRunQuery] = useState(false);
  const [tablesHtml, setTablesHtml] = useState("");



  // Data Base (Data sa Table)
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
  // Display Table for Database Subj
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
      setTimeout(() => {
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
          iFrame.current.contentDocument ||
          iFrame.current.contentWindow.document;
        doc.open();
        doc.write(fullCode);
        doc.close();
      }, 0);
    }
  };


  return subject !== "DataBase" ? (
    <div className="h-screen bg-[#0D1117] flex flex-col">
      {/* Header */}
        <GameHeader/>
      {/* Content */}
      <div className="h-[83%] flex justify-around items-center p-4">
        {/* Instruction */}
          <InstructionPanel/>
        {/* Code Editor and Output Panel */}
          {subject === "Html" && ( <Html_TE/>)}
          {subject === "Css" && ( <Css_TE/>)}       
      </div>
      {/* Footer */}
        <GameFooter/>
    </div>
  ) : 
    /*DATABASE TAB*/
      /*DATABASE TAB*/
        /*DATABASE TAB*/
          /*DATABASE TAB*/
            /*DATABASE TAB*/  
  (
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
              <h2 className="text-2xl font-bold mb-2 font-exo text-[2.5rem] text-shadow-lg text-shadow-black ">
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
            onChange={(value) => setQuery(value)}/>
          <div className="w-[100%] flex justify-around">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ bounceDamping: 100 }}
              onClick={runCode}
              className="bg-[#9333EA] rounded-xl text-white hover:bg-purple-700 hover:cursor-pointer w-[30%] font-exo font-bold p-4 ">
              RUN
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ bounceDamping: 100 }}
              className=" bg-[#9333EA] rounded-xl text-white hover:bg-purple-700 hover:cursor-pointer w-[30%] font-exo font-bold p-4 ">
              EVALUATE
            </motion.button>
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
  );
}

export default LessonPage;
