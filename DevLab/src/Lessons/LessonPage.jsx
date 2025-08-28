//Navigation (React Router)
import { useParams } from "react-router-dom";
// Components
import GameHeader from "../gameMode/GameModes_Components/GameHeader";
import InstructionPanel from "../gameMode/GameModes_Components/InstructionPanel";
import GameFooter from "../gameMode/GameModes_Components/GameFooter";
import Html_TE from "../gameMode/GameModes_Components/CodeEditor and Output Panel/Html_TE";
import Css_TE from "../gameMode/GameModes_Components/CodeEditor and Output Panel/Css_TE";
import JavaScript_TE from "../gameMode/GameModes_Components/CodeEditor and Output Panel/JavaScript_TE";
import Database_TE from "../gameMode/GameModes_Components/CodeEditor and Output Panel/Database_TE";


function LessonPage() {
  // Navigate
  const { subject,  } = useParams();


  return subject !== "Database" ? (
    <div className="h-screen bg-[#0D1117] flex flex-col">
      {/* Header */}
        <GameHeader/>
      {/* Content */}
      <div className="h-[83%] flex justify-around items-center p-4">
        {/* Instruction */}
        <InstructionPanel/>
        {/* Code Editor and Output Panel */}
          {subject === "Html" && ( <Html_TE />)}
          {subject === "Css" && ( <Css_TE/>)}   
          {subject === "JavaScript" && ( <JavaScript_TE/>)}    
          {subject === "Database" && ( <Database_TE/>)}   
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
        <GameHeader/>
      {/*Contents*/}
      <div className="h-[83%] flex justify-around items-center p-4">
        {/*Instruction*/}
          <InstructionPanel/>
        {/*Coding Panel*/}
          <Database_TE/>
      </div>
      {/*Footer*/}
        <GameFooter/>
    </div>
  );
}

export default LessonPage;
