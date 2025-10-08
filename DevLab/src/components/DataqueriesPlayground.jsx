// Database Querying Playground
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import initSqlJs from "sql.js";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import Lottie from "lottie-react";
import Animation from "../assets/Lottie/OutputLottie.json";
import { motion,AnimatePresence } from "framer-motion";

import DBPlaygroundEval_Popup from "../gameMode/GameModes_Popups/DbPlaygroundEval_PopUp"
import dbPlaygroundEval from "./OpenAI Prompts/dbPlaygroundEval";

function DataqueriesPlayground() {
  const navigate = useNavigate();
  const dbRef = useRef(null);
  const [query, setQuery] = useState(
    "SELECT users.name, orders.item FROM users JOIN orders ON users.id = orders.user_id;"
  );
  const [outputHtml, setOutputHtml] = useState();
  const [tablesHtml, setTablesHtml] = useState("");
  const [hasRunQuery, setHasRunQuery] = useState(false);

  const [evaluationResult, setEvaluationResult] = useState(null);
  const [showEvalPopup, setShowEvalPopup] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
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
  }, []);
  // Display the Table
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
            <table class="table-auto border-collapse border border-gray-400 bg-[#1A1B26] w-full text-sm">
            <thead>
                <tr class="bg-[#1A1B26]">
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

  const runQuery = () => {
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
  };

  // EVAL
  const handleEvaluateSQL = async () => {
    setIsEvaluating(true);
    try {
      const result = await dbPlaygroundEval({ sql: query });

      console.log(result); // { queryFeedback, queryImprovement }
      setEvaluationResult(result);
      setShowEvalPopup(true);
    } catch (error) {
      console.error("Error evaluating SQL:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="flex bg-[#16161A] h-screen  flex-col gap-3 p-4 overflow-hidden">
      <div className="text-5xl font-exo font-bold p-10 text-white">
        <span className="cursor-pointer" onClick={() => navigate("/main")}>
          DEVLAB
        </span>
      </div>
      <div className="flex w-[100%] h-[100%] gap-10">
        <div className="flex flex-col w-[60%] h-[80%] gap-4">
          <div className=" h-[30%] overflow-scroll overflow-x-hidden p-4 bg-[#1A1B26] shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)] rounded-2xl scrollbar-custom">
            <h2 className="text-[1.5rem] font-semibold mb-2 text-white font-exo">
              Database Tables
            </h2>
            <div
              dangerouslySetInnerHTML={{ __html: tablesHtml }}
              className="text-white"
            />
          </div>
          <div className="px-4 w-full flex flex-col flex-1 min-h-0 gap-3 rounded-3xl p-3 bg-[#1A1B26] shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]">
            <div className="flex-1 min-h-0 overflow-auto">
              <CodeMirror
                value={query}
                height="100%"
                theme={tokyoNight}
                extensions={[sql()]}
                onChange={(value) => setQuery(value)}
              />
            </div>
            <motion.div className="flex justify-end gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05, background: "#7e22ce" }}
                transition={{ bounceDamping: 100 }}
                onClick={handleEvaluateSQL}
                disabled={isEvaluating}
                className="px-4 py-2 bg-[#7e22ce] rounded-xl text-white cursor-pointer w-[15%] hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)]"
              >
                {isEvaluating ? "Evaluating..." : "EVALUATE"}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05, background: "#9333EA" }}
                transition={{ bounceDamping: 100 }}
                onClick={runQuery}
                className="px-4 py-2 bg-[#9333EA] rounded-xl text-white cursor-pointer w-[15%] hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)]"
              >
                Run Query
              </motion.button>
            </motion.div>
          </div>
        </div>
        {/*Output Panel*/}

        <div className="bg-[#F8F3FF] h-[80%] w-[37%] text-2xl p-4 text-white font-exo rounded-3xl  shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]">
          {!hasRunQuery ? (
            <div className=" flex items-center justify-center w-full h-full flex-col">
              <Lottie
                animationData={Animation}
                loop={true}
                className="w-[60%] h-[60%]"
              />
              <p className="text-gray-700 font-bold w-[75%] text-[0.95rem]">
                YOUR CODE RESULTS WILL APPEAR HERE WHEN YOU RUN YOUR PROJECT
              </p>
            </div>
          ) : (
            <div
              className="text-2xl font-exo w-full h-full overflow-auto text-black "
              dangerouslySetInnerHTML={{ __html: outputHtml }}
            />
          )}
        </div>
      </div>


<AnimatePresence>
  {showEvalPopup && evaluationResult && (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <DBPlaygroundEval_Popup
        evaluationResult={evaluationResult}
        setShowEvalPopup={setShowEvalPopup}
      />
    </motion.div>
  )}
</AnimatePresence>



    </div>
  );
}

export default DataqueriesPlayground;
