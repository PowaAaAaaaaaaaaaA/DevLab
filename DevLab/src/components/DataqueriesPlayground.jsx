// Database Querying Playground 
import React, { useEffect, useRef, useState } from "react";
import initSqlJs from "sql.js";
import CodeMirror from '@uiw/react-codemirror';
import { sql } from "@codemirror/lang-sql";
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';

function DataqueriesPlayground() {
const dbRef = useRef(null);
const [query, setQuery] = useState("SELECT users.name, orders.item FROM users JOIN orders ON users.id = orders.user_id;");
const [outputHtml, setOutputHtml] = useState("Write a query and click Run.");
const [tablesHtml, setTablesHtml] = useState("");

useEffect(() => {
    initSqlJs({
    locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/${file}`,
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

const renderAllTables = () => {
    if (!dbRef.current) return;
    try {
    const tables = dbRef.current.exec("SELECT name FROM sqlite_master WHERE type='table';");
    if (!tables.length) return;

    let html = "";
    for (const table of tables[0].values) {
        const tableName = table[0];
        const result = dbRef.current.exec(`SELECT * FROM ${tableName}`);
        if (result.length) {
        const { columns, values } = result[0];
        html += `<div class='mb-6'><h3 class='text-lg font-semibold mb-2'>${tableName}</h3>`;
        html += `<div class="overflow-auto">
            <table class="table-auto border-collapse border border-gray-400 w-full text-sm">
            <thead>
                <tr class="bg-gray-200">
                ${columns.map(col => `<th class="border px-4 py-2">${col}</th>`).join("")}
                </tr>
            </thead>
            <tbody>
                ${values.map(row => `
                <tr>${row.map(cell => `<td class="border px-4 py-1">${cell}</td>`).join("")}</tr>
                `).join("")}
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
    const res = dbRef.current.exec(query);
    if (res.length === 0) {
        setOutputHtml("✅ Query executed successfully. No results.");
        renderAllTables();
        return;
    }
    const { columns, values } = res[0];
    const table = `
        <div class="overflow-auto">
        <table class="table-auto border-collapse border border-gray-400 w-full text-sm">
            <thead>
            <tr class="bg-gray-100">
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
    setOutputHtml(table);
    renderAllTables();
    } catch (err) {
    setOutputHtml(`<span class="text-red-500 font-medium">${err.message}</span>`);
    }
};
return (
<div className="flex bg-[#16161A] h-screen  flex-col gap-3 p-4 overflow-hidden">
    <h1 className="text-[1.9rem] font-bold font-exo text-white p-8">DEVLAB</h1>
    <div className="flex w-[100%] h-[100%] gap-10">
    <div className="flex flex-col w-[60%] h-[80%] gap-4">
        <div className=" h-[30%] overflow-scroll overflow-x-hidden p-4 bg-[#1A1B26] shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)] rounded-2xl">
            <h2 className="text-xl font-semibold mb-2">Database Tables</h2>
            <div dangerouslySetInnerHTML={{ __html: tablesHtml }} />
        </div>
        <div className="w-[100%] h-[100%] bg-[#1A1B26] shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)] rounded-2xl flex flex-col p-4 justify-between">
            <CodeMirror
                value={query}
                height="450px"
                theme={tokyoNight}
                extensions={[sql()]}
                onChange={(value) => setQuery(value)}/>
            <button onClick={runQuery} className="ml-auto px-4 py-2 bg-[#9333EA] rounded-xl text-white hover:bg-purple-700 hover:cursor-pointer w-[15%]">Run Query</button>
        </div>
    </div>
        <div
            className="bg-[#1A1B26] h-[80%] w-[37%] p-4 text-2xl text-white font-exo rounded-3xl  shadow-[0_5px_10px_rgba(147,_51,_234,_0.7)]"
            dangerouslySetInnerHTML={{ __html: outputHtml }}/>
    </div>
</div>
)}

export default DataqueriesPlayground