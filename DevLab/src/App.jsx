// REACt
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
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
import LessonEdit from "./AdminComponents/LessonEdit";
import AddContent from "./AdminComponents/AddContent";
// DISPLAY LESSON/LEVELS PAGE
import HtmlLessons from "./Lessons/HtmlLessons";
import CssLessons from "./Lessons/CssLessons";
import JavaScriptLessons from "./Lessons/JavaScriptLessons";
import DataLessons from "./Lessons/DataLessons";
// LESSON PAGES
import LessonPage from "./Lessons/LessonPage";

import { getDoc } from "firebase/firestore";
// GAME MODES
import GameModeRouter from "./gameMode/GameModes_Utils/GameModeRouter";
//
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setAdmin] = useState(null);

  useEffect(() => {
    //
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);

      try {
        const userRef = doc(db, "Users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.data().isAdmin) {
          setAdmin(true);
        } else {
          setAdmin(false);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    });
    return () => unsubscribe(); // cleanup
  }, []); //

  const isLoggedIn = !!user;

  // Loading (Para Hindi bumalik sa Main Dashboard and mag stay lang sa Admin Dashboard pag nirerefresh yung webapp)
  // !! LAGYAN LOADING ANIMATION !!
  if (loading) return null;

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              !isLoggedIn ? <LandingPage /> : <Navigate to="/Main" replace />
            }
          />
          <Route
            path="/Login"
            element={!isLoggedIn ? <Login /> : <Navigate to="/Main" replace />}
          />
          <Route
            path="/Register"
            element={
              !isLoggedIn ? <Register /> : <Navigate to="/Main" replace />
            }
          />

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
            path="/Main/Lessons/:subject/:lessonId/:levelId/:topicId/:gamemodeId"
            element={<GameModeRouter />} />

          <Route
            path="/codingPlay"
            element={
              isLoggedIn ? <CodePlayground /> : <Navigate to="/Login" replace />
            }
          />
          <Route
            path="/dataPlayground"
            element={
              isLoggedIn ? (
                <DataqueriesPlayground />
              ) : (
                <Navigate to="/Login" replace />
              )
            }
          />

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
            }
          >
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
        </Routes>
        <ToastContainer />
      </QueryClientProvider>
    </>
  );
}

export default App;
