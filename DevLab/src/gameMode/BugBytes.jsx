    import React from 'react';
    import { useNavigate, useParams } from 'react-router-dom';
    import { collection, getDocs } from 'firebase/firestore';
    import { db } from '../Firebase/Firebase';
    import { goToNextGamemode } from './Util_Navigation';
    function BugBytes() {

        const { subject, lessonId, levelId, gamemodeId } = useParams();
        const navigate = useNavigate();


    console.log(gamemodeId)
    return (
        <div>
        {/* Your code rush content */}
        <button
        onClick={()=>{
            goToNextGamemode({ subject, lessonId, levelId, gamemodeId, navigate });
        }}
        className='hover:cursor-pointer border'>BB</button>
        <h1>Bug Bytes</h1>
        </div>
    );
    }

    export default BugBytes