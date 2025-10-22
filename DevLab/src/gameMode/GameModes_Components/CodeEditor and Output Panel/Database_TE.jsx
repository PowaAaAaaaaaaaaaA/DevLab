// Code Mirror
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import initSqlJs from "sql.js";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { EditorView } from "@codemirror/view";
// Animation
import Animation from "../../../assets/Lottie/OutputLottie.json";
import Lottie from "lottie-react";
import Evaluation_Popup from "../../GameModes_Popups/Evaluation_Popup";
import toast from "react-hot-toast"; 
// Utils
import { motion,AnimatePresence } from "framer-motion";
import { extractSqlKeywords } from "../../../components/Achievements Utils/Db_KeyExtract";
import { unlockAchievement } from "../../../components/Custom Hooks/UnlockAchievement";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
// Data
import useFetchUserData from "../../../components/BackEnd_Data/useFetchUserData";
import useFetchGameModeData from "../../../components/BackEnd_Data/useFetchGameModeData";
import { useGameStore } from "../../../components/OpenAI Prompts/useBugBustStore";
//
import lessonPromptDb from "../../../components/OpenAI Prompts/lessonPromptDb";



function Database_TE() {
  //Data
  const { userData } = useFetchUserData();
  const {gamemodeId} = useParams();
  // Output 
  const [outputHtml, setOutputHtml] = useState();
  const [hasRunQuery, setHasRunQuery] = useState(false);
  const [tablesHtml, setTablesHtml] = useState("");
  // utils
  const [query , setQuery] = useState("");
  const dbRef = useRef(null);

  // Zustand
  const setSubmittedCode = useGameStore((state) => state.setSubmittedCode);
  const isCorrect = useGameStore((state) => state.isCorrect);

  const [isEvaluating, setIsEvaluating] = useState(false);
const [evaluationResult, setEvaluationResult] = useState(null);
const [showPopup, setShowPopup] = useState(false);
const [description, setDescription] = useState("");
const { gameModeData, subject } = useFetchGameModeData();

  // Run Button
  const runCode =()=>{

      if (!query.trim()) {
    toast.error("Please enter your code before running.", {
      position: "top-right",
    });
    return;
  }
          try {
        setHasRunQuery(true);
const res = dbRef.current.exec(query);

if (res.length === 0) {
  // Non-SELECT queries or SELECT with no results
  setOutputHtml(`
    <div class="p-3 bg-green-100 border border-green-400 text-green-800 rounded-xl text-center font-semibold shadow-md">
      Query executed successfully <span class="font-normal">(No results returned)</span>
    </div>
  `);
  renderAllTables(); // refresh tables
  return; // exit early
}

// Only destructure if res[0] exists
const { columns, values } = res[0];
const table = `
  <div class="overflow-auto">
    <table class="table-auto border-collapse border border-gray-400 w-full text-sm">
      <thead>
        <tr class="bg-[#F8F3FF] p-3">
          ${columns.map(col => `<th class="border px-4 py-2">${col}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${values.map(row => `
          <tr>${row.map(cell => `<td class="border px-4 py-1">${cell}</td>`).join("")}</tr>
        `).join("")}
      </tbody>
    </table>
  </div>
`;
setOutputHtml(table);
renderAllTables();

    if (gamemodeId === "Lesson"){
      }else{
          // --- TAG USAGE ACHIEVEMENT ---
  const usedTags = extractSqlKeywords(query); 
  if (usedTags.length > 0) {
    unlockAchievement(userData?.uid, "Database", "tagUsed", { usedTags, isCorrect});
  }
  console.log(usedTags)
}
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

CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT,
  age INTEGER,
  course TEXT
);

CREATE TABLE enrollments (
  id INTEGER PRIMARY KEY,
  student_id INTEGER,
  subject TEXT,
  grade INTEGER
);


INSERT INTO students VALUES
  (1, 'Anna', 20, 'Computer Science'),
  (2, 'Ben', 22, 'Information Technology'),
  (3, 'Clara', 21, 'Software Engineering'),
  (4, 'David', 23, 'Information Systems'),
  (5, 'Ella', 20, 'Computer Science');

INSERT INTO enrollments VALUES
  (1, 1, 'Database Systems', 95),
  (2, 2, 'Web Development', 88),
  (3, 3, 'Operating Systems', 92),
  (4, 1, 'Web Development', 89),
  (5, 5, 'Database Systems', 85),
  (6, 4, 'Data Structures', 91),
  (7, 2, 'Networking', 90),
  (8, 3, 'Database Systems', 87),
  (9, 5, 'Programming 101', 93);
`);
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
      
      html += `<div class='mb-6'>
        <h3 class='text-lg font-semibold mb-2'>${tableName}</h3>`;

      if (result.length) {
        const { columns, values } = result[0];
        html += `<div class="overflow-auto">
          <table class="table-auto border-collapse border border-gray-400 bg-[#F8F3FF] w-full text-sm">
            <thead>
              <tr class="bg-[#F8F3FF]">
                ${columns.map(col => `<th class="border px-4 py-2">${col}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${values.map(row => `
                <tr>${row.map(cell => `<td class="border px-4 py-1">${cell}</td>`).join("")}</tr>
              `).join("")}
            </tbody>
          </table>
        </div>`;
      } else {
        // <-- show empty table if no rows yet
        html += `<div class="overflow-auto">
          <table class="table-auto border-collapse border border-gray-400 bg-[#F8F3FF] w-full text-sm">
            <thead>
              <tr><th class="border px-4 py-2 text-gray-400">Empty table</th></tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>`;
      }

      html += `</div>`;
    }

    setTablesHtml(html);
  } catch (err) {
    console.error("Error displaying tables:", err);
  }
};


  // Evaluate Button (for Lesson mode only)
const handleEvaluate = async () => {
    if (!query.trim()) {
    toast.error("Please enter your code before evaluating.", {
      position: "top-right",
    });
    return;
  }
  if (gameModeData?.blocks) {
    const paragraphs = gameModeData.blocks
      .filter((block) => block.type === "Paragraph")
      .map((block) => block.value)
      .join("\n") || "";
    setDescription(paragraphs);
  }
  setIsEvaluating(true);
  try {
    const result = await lessonPromptDb({
      receivedQuery: query,
      instruction: gameModeData.instruction,
      description,
      subject,
    });
    console.log("Database Evaluation Result:", result);
    setEvaluationResult(result);
    setShowPopup(true);
  } catch (error) {
    console.error("Error evaluating query:", error);
  } finally {
    setIsEvaluating(false);
  }
};


  return (
<>
  <div className="bg-[#191a26] w-[47%] ml-auto h-[95%] rounded-2xl flex items-center justify-center p-3 flex-col gap-3 shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]">
    <div className="flex-1 min-h-0 overflow-auto w-full rounded-3xl p-2 scrollbar-custom">
    <CodeMirror
      className="text-[1rem] "
      height="100%"
      width="100%"
      extensions={[sql(),EditorView.lineWrapping]}
      theme={tokyoNight}
      onChange={(value) => {
        setQuery(value);
        setSubmittedCode({ SQL: value }); //  Save SQL to Zustand
        }}
      />
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
  {/* EVALUATE BUTTON — only for Lesson mode */}
  {gamemodeId === "Lesson" && (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05, background: "#7e22ce" }}
      transition={{ bounceDamping: 100 }}
      onClick={handleEvaluate}
      disabled={isEvaluating}
      className={`bg-[#9333EA] text-white font-bold rounded-xl p-3 w-[45%] hover:cursor-pointer hover:drop-shadow-[0_0_6px_rgba(126,34,206,0.4)] ${
        isEvaluating ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isEvaluating ? "Evaluating..." : "EVALUATE"}
    </motion.button>
  )}

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

        <AnimatePresence>
  {showPopup && evaluationResult && (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Evaluation_Popup
        evaluationResult={evaluationResult} setShowPopup={setShowPopup}
      />
    </motion.div>
  )}
</AnimatePresence>

</>
  )
}

export default Database_TE