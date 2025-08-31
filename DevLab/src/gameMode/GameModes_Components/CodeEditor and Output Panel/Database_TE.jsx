// for the Text Editor
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import initSqlJs from "sql.js";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
// Utils
import { useEffect, useState, useRef } from "react";
// Animation
import { motion } from "framer-motion";
import Animation from "../../../assets/Lottie/OutputLottie.json";
import Lottie from "lottie-react";

function Database_TE() {

  const [outputHtml, setOutputHtml] = useState();
  const [hasRunQuery, setHasRunQuery] = useState(false);
  const [tablesHtml, setTablesHtml] = useState("");
  const [query , setQuery] = useState("");
  const dbRef = useRef(null);

  const runCode =()=>{
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
  }

// Data Base (Data sa Table)
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

  return (
<>
  <div className="bg-[#191a26] w-[47%] ml-auto h-[95%] rounded-2xl flex items-center justify-center p-3 flex-col gap-3 shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]">
    <div className="flex-1 min-h-0 overflow-auto w-full rounded-3xl p-2">
    <CodeMirror
      className="text-[1rem] "
      height="100%"
      width="100%"
      extensions={[sql()]}
      theme={tokyoNight}
      onChange={(value) => setQuery(value)}/>
    </div>
    <div className="w-full flex justify-around">
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        transition={{ bounceDamping: 100 }}
        onClick={runCode}
        className="bg-[#9333EA] text-white font-bold rounded-xl p-3 w-[45%] hover:cursor-pointer hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)] ">
        RUN
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        transition={{ bounceDamping: 100 }}
        className=" bg-[#9333EA] text-white font-bold rounded-xl p-3 w-[45%] hover:cursor-pointer hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)]">
        EVALUATE
      </motion.button>
    </div>
  </div>
        <div className="h-[100%] w-[47%] ml-auto p-4 flex flex-col justify-center gap-7">
          {/*Table*/}
          <div className="border-amber-50 w-[100%] h-[45%] border overflow-scroll overflow-x-hidden rounded-l-3xl rounded-bl-3xl rounded-xl p-3 bg-[#F8F3FF] scrollbar-custom">
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
              <div className="w-full h-full flex items-center flex-col justify-center bg-[#F8F3FF] rounded-l-3xl rounded-bl-3xl scrollbar-custom">
                <Lottie
                  animationData={Animation}
                  loop={true}
                  className="w-[70%] h-[70%]"
                />
                <p className="text-[0.8rem] text-center ">
                  YOUR CODE RESULTS WILL APPEAR HERE WHEN YOU RUN YOUR PROJECT
                </p>
              </div>
            )}
          </div>
        </div>
</>
  )
}

export default Database_TE