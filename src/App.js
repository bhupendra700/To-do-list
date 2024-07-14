import ToDo from "./Component/ToDo";
import ToDo1 from "./FireBaseComponent/ToDo";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./CSSComponent/main.css";
import "./CSSComponent/main-mediaQuery.css";
import { createContext, useEffect, useState } from "react";
import Login from "./Component/Login";
import Signup from "./Component/Signup";
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Component/Firebase";

const Contest = createContext();
function App() {
  useEffect(() => {
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
      });
    } catch (error) {
      alert(error.message);
    }
  }, []);

  const [random, setRandom] = useState(Math.floor(Math.random() * 10000000));

  let [user, setUser] = useState(null);

  let [isConnected, setIsConnected] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsConnected(navigator.onLine);
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.addEventListener("offline", updateOnlineStatus);
    };
  });
  return (
    <Contest.Provider value={{ random, setUser, isConnected }}>
      <Router>
        <Routes>
          {user ? (
            <>
              <Route exact path={"/"} element={<ToDo1 user={user} />} />
            </>
          ) : (
            <>
              <Route exact path={"/"} element={<ToDo />} />
              <Route exact path={"/login"} element={<Login />} />
              <Route exact path={"/signup"} element={<Signup />} />
            </>
          )}
        </Routes>
      </Router>
    </Contest.Provider>
  );
}

export default App;
export { Contest };
