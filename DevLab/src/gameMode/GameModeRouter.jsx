import { useParams } from 'react-router-dom';
import CodeRush from '../gameMode/CodeRush';
import BugBytes from '../gameMode/BugBytes';


const GameModeRouter = () => {
    const { gamemodeId } = useParams();

    const components = {
    CodeRush: <CodeRush />,
    BugBytes: <BugBytes />,
    // add more here
    };

    return components[gamemodeId] || <div>404 Game Mode Not Found</div>;
};

export default GameModeRouter;