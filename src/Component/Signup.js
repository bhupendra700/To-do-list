import React, { useContext, useState } from "react";
import "../CSSComponent/loginSignup.css";
import "../CSSComponent/loginSignup-mediaQuery.css";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./Firebase";
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";
import { Contest } from "../App";

const Signup = () => {
  const navigate = useNavigate();

  let [Name, setName] = useState("");
  let [Email, setEmail] = useState("");
  let [Password, setPassword] = useState("");
  let [isSignUp, setIsSignUp] = useState(false); //this is for Loader

  let {isConnected} = useContext(Contest)

  const commonSignup = async (method) => {
    try {
      if(isConnected){
        if (method === "createuserwithEmail&Password") {
          await createUserWithEmailAndPassword(auth, Email, Password);
  
          const user = auth.currentUser;
          let docref = doc(db, "user", user.uid);
  
          await setDoc(docref, {
            Name: Name,
            Email: Email,
          });
        } else {
          if (method === "google") {
            const googleProvider = new GoogleAuthProvider();
            await signInWithPopup(auth, googleProvider);
          } else {
            const githubProvider = new GithubAuthProvider();
            await signInWithPopup(auth, githubProvider);
          }
  
          const user = auth.currentUser;
          let docref = doc(db, "user", user.uid);
  
          await setDoc(docref, {
            Email: user.email,
          });
  
        }
        
        navigate('/')
        setIsSignUp(false);
      }else{
        toast.error("You Are Offline", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
          toastId: "SignUp Error",
        });
      }
    } catch (error) {
      setIsSignUp(false);
      toast.error(error.message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        toastId: "SignUp Error",
      });
    }
  };

  const SignUp = async (e) => {
    setIsSignUp(true);
    e.preventDefault();
    commonSignup("createuserwithEmail&Password");
  };

  const signUpwithGoogle = async () => {
    commonSignup("google");
  };

  const signUpwithGithub = async () => {
    commonSignup("github");
  };

  return (
    <>
      <ToastContainer />
      <div className="login-signup-box">
        <div className="main-form">
          <section className="usergreet">
            <div className="signup-greet-box ">
              <h1>Hello, Friend!</h1>
              <p>
                Have an account?
                <br />
                Login with your personal details to use of all site feature
              </p>
              <button
                type="button"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Log in
              </button>
            </div>
          </section>
          <section className="forms">
            <button
              type="button"
              className="close-btn"
              onClick={() => {
                navigate("/");
              }}
            >
              <i className="ri-close-large-line" />
            </button>
            <div className="chng-form">
              <button
                type="button"
                className="login-form"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Log in
              </button>
              <button type="button" className="signup-form hover-chngbtn">
                Sign up
              </button>
            </div>
            <form
              className="signup-box hide-form"
              autoComplete="on"
              onSubmit={(e) => {
                SignUp(e);
              }}
            >
              <div className="signup-name-box">
                <label htmlFor="signup-username">
                  <i className="ri-user-3-fill" />
                </label>
                <input
                  type="text"
                  id="signup-username"
                  placeholder="Name"
                  required
                  value={Name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div className="signup-email-box">
                <label htmlFor="signup-email">
                  <i className="ri-mail-fill" />
                </label>
                <input
                  type="email"
                  id="signup-email"
                  placeholder="Email"
                  required
                  value={Email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="signup-password-box">
                <label htmlFor="signup-pwd">
                  <i className="ri-lock-password-fill" />
                </label>
                <input
                  type="password"
                  id="signup-pwd"
                  placeholder="Password"
                  required
                  value={Password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <button type="submit" className="signup-submit-btn">
                {isSignUp ? <svg className="form-loader-container del-loader" height="18" width="18">
                                      <circle className="form-loader" cx="9" cy="9" r="7" stroke-width="2" fill="transparent"></circle>
                                    </svg> : "Sign up"}
              </button>
              <div className="mtd">
                <div className="or">
                  <div className="line" />
                  <span>or</span>
                  <div className="line" />
                </div>
                <div className="mtd-btn">
                  <button
                    className="google-btn"
                    type="button"
                    onClick={signUpwithGoogle}
                  >
                    <i className="ri-google-fill" /> Continue with Google
                  </button>
                  <button
                    className="github-btn"
                    type="button"
                    onClick={signUpwithGithub}
                  >
                    <i className="ri-github-fill" /> Continue with Github
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
};

export default Signup;
