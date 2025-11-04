// REACt
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
// FIREBASE
import { auth } from "./Firebase/Firebase";
import { db } from "./Firebase/Firebase";
import { doc } from "firebase/firestore";
// COMPONENTS
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./Layout/Layout";
import Dashboard from "./components/Dashboard";
import Achievements from "./components/Achievements";
import Shop from "./components/Shop";
import Settings from "./components/Settings";
import CodePlayground from "./components/CodePlayground";
import DataqueriesPlayground from "./components/DataqueriesPlayground";
// ADMIN
import AdminLogin from "./components/AdminLogin";
import AdminLayout from "./Layout/AdminLayout";
import ContentManagement from "./AdminComponents/ContentManagement";
import UserManagement from "./AdminComponents/UserManagement";
import LessonEdit from "./AdminComponents/contentManagement Components/LessonEdit";
import AddContent from "./AdminComponents/contentManagement Components/AddContent";
// DISPLAY LESSON/LEVELS PAGE
import HtmlLessons from "./Lessons/HtmlLessons";
import CssLessons from "./Lessons/CssLessons";
import JavaScriptLessons from "./Lessons/JavaScriptLessons";
import DataLessons from "./Lessons/DataLessons";

import { getDoc } from "firebase/firestore";
// GAME MODES
import GameModeRouter from "./gameMode/GameModes_Utils/GameModeRouter";
// Utils
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FullscreenLoader from "./components/FullScreenLoader";
import { loadSounds } from "./components/Custom Hooks/DevlabSoundHandler";

import NotFound from "./components/NotFound";
const queryClient = new QueryClient();


function App() {

  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setAdmin] = useState(null);

  useEffect(() => {
    loadSounds();
  }, []);


useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (!user) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      //  Block unverified users
      if (!user.emailVerified) {
        await auth.signOut();
        setUser(null);
        setLoading(false);
        return;
      }

      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      if (userData?.suspend) {
        await auth.signOut();
        toast.error("Your account is suspended.", {
          position: "bottom-center",
          theme: "colored",
        });
        setUser(null);
      } else {
        setUser(user);
        setAdmin(!!userData?.isAdmin);
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, []);







    const isLoggedIn = !!user;

  if (loading) return null;




  return (
    <>
    <FullscreenLoader/>
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={!isLoggedIn ? <LandingPage /> : <Navigate to="/Main" replace />}/>
          <Route
            path="/Login"
            element={!isLoggedIn ? <Login /> : <Navigate to="/Main" replace />}/>
          <Route
            path="/Register"
            element={!isLoggedIn ? <Register /> : <Navigate to="/Main" replace />}/>

          {/* Protected Routes */}
          <Route
            path="/Main"
            element={isLoggedIn ? <Layout /> : <Navigate to="/Login" replace />}>
            <Route index element={<Dashboard />} />
            <Route path="Lessons/Html" element={<HtmlLessons />} />
            <Route path="Lessons/Css" element={<CssLessons />} />
            <Route path="Lessons/JavaScript" element={<JavaScriptLessons />} />
            <Route path="Lessons/Database" element={<DataLessons />} />

            <Route path="Achievements" element={<Achievements />} />
            <Route path="Shop" element={<Shop />} />
            <Route path="Settings" element={<Settings />} />
          </Route>

            <Route
            path="/Main/Lessons/:subject/:lessonId/:levelId/:stageId/:gamemodeId"
            element={isLoggedIn ? <GameModeRouter /> : <Navigate to="/Login" replace />}/>

          <Route
            path="/codingPlay"
            element={
              isLoggedIn ? <CodePlayground /> : <Navigate to="/Login" replace />
            }/>
          <Route
            path="/dataPlayground"
            element={
              isLoggedIn ? (
                <DataqueriesPlayground />
              ) : (
                <Navigate to="/Login" replace />
              )
            }/>

          {/*ADmin*/}
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route
            path="/Admin"
            element={
              isLoggedIn && isAdmin ? (
                <AdminLayout />
              ) : isLoggedIn && !isAdmin ? (
                <Navigate to="/Main" replace />
              ) : (
                <Navigate to="/Login" replace />
              )
            }>
            <Route index element={<Navigate to="ContentManagement" />} />
            <Route path="ContentManagement" element={<ContentManagement />} />
            <Route path="UserManagement" element={<UserManagement />} />
          </Route>

          <Route
            path="/Admin/ContentManagement/LessonEdit/:subject/:lessonId/:levelId/:topicId"
            element={isLoggedIn && isAdmin ? <LessonEdit /> : <Login />}
          />
          <Route
            path="/Admin/ContentManagement/:subject/AddContent"
            element={isLoggedIn && isAdmin ? <AddContent /> : <Login />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
        <Toaster position="top-center" reverseOrder={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;