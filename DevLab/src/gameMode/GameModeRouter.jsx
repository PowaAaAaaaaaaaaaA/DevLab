    import { useParams } from 'react-router-dom';
    import CodeRush from '../gameMode/CodeRush';
    import BrainBytes from '../gameMode/BrainBytes';
    import LessonPage from '../Lessons/LessonPage';

    // Game Mode Layout
    const GameModeRouter = () => {
        const { gamemodeId } = useParams();

        const components = {
        CodeRush: <CodeRush />,
        BrainBytes: <BrainBytes />,
        Lesson: <LessonPage />

        };

        return components[gamemodeId] || <div>Game Mode Not Found</div>;
    };

    export default GameModeRouter;