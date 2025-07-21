    import { useParams } from 'react-router-dom';
    import CodeRush from '../gameMode/CodeRush';
    import BrainBytes from '../gameMode/BrainBytes';
    import LessonPage from '../Lessons/LessonPage';
    import BugBust from '../gameMode/BugBust'
    import CodeCrafter from './CodeCrafter';

    // Game Mode Layout
    const GameModeRouter = () => {
        const { gamemodeId } = useParams();

        const components = {
        CodeRush: <CodeRush />,
        BrainBytes: <BrainBytes />,
        BugBust: <BugBust/>,
        Lesson: <LessonPage />,
        CodeCrafter: <CodeCrafter/>

        };

        return components[gamemodeId] || <div>Game Mode Not Found</div>;
    };

    export default GameModeRouter;