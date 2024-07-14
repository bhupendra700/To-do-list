import React, { useContext, useState } from "react";
import "../CSSComponent/loginSignup.css";
import "../CSSComponent/loginSignup-mediaQuery.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "./Firebase";
import { doc, setDoc } from "firebase/firestore";
import { Contest } from "../App";
import ForgotPwd from "./ForgotPwd";

const Login = () => {
  const navigate = useNavigate();

  let { isConnected } = useContext(Contest);

  let [Email, setEmail] = useState("");
  let [Password, setPassword] = useState("");

  let [isLogin, setIsLogin] = useState(false);

  const toastifyfun = (state , message)=>{
    if(state == "success"){
      toast.success('SuccessFully Send Email', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        toastId:"Success"
        });
    }else{
      const msg = message == "Offline" ? "You are Offline" : message
      toast.error(msg , {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        toastId: "Error",
      });
    }
  }
  const commonLogin = async (method) => {
    try {
      if (isConnected) {
        if (method === "loginwithemail&password") {
          await signInWithEmailAndPassword(auth, Email, Password);
        } else {
          if (method === "google") {
            const googleProvider = new GoogleAuthProvider();
            await signInWithPopup(auth, googleProvider);
          } else if (method === "github") {
            const githubProvider = new GithubAuthProvider();
            await signInWithPopup(auth, githubProvider);
          } else {
            const appleProvider = new OAuthProvider("apple.com");
            await signInWithPopup(auth, appleProvider);
          }
          const user = auth.currentUser;
          let docref = doc(db, "user", user.uid);

          await setDoc(docref, {
            Email: user.email,
          });
        }
        setIsLogin(false);
        navigate("/");
      } else {
        setIsLogin(false);
        toastifyfun("error" , "Offline")
      }
    } catch (error) {
      setIsLogin(false);
      toastifyfun("error" , error.message)
    }
  };

  const LogIn = async (e) => {
    setIsLogin(true);
    e.preventDefault();
    commonLogin("loginwithemail&password");
  };

  const loginwithgoogle = async () => {
    commonLogin("google");
  };

  const loginwithgithub = async () => {
    commonLogin("github");
  };

  const loginwithapple = async () => {
    commonLogin("apple");
  };

  let [showForgot, setShowForgot] = useState(false);
  return (
    <>
      <ToastContainer />
      <div className="login-signup-box">
        <div className="main-form">
          <section className="usergreet">
            <div className="signup-greet-box ">
              <h1>Hello, Friend!</h1>
              <p>
                Don't have account?
                <br />
                Create it with your personal details to use of all site feature
              </p>
              <button
                type="button"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Sign Up
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
              <button type="button" className="login-form hover-chngbtn">
                Log in
              </button>
              <button
                type="button"
                className="signup-form"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Sign up
              </button>
            </div>
            <form
              className="login-box"
              autoComplete="on"
              onSubmit={(e) => {
                LogIn(e);
              }}
            >
              <div className="login-email-box">
                <label htmlFor="login-email">
                  <i className="ri-mail-fill" />
                </label>
                <input
                  type="email"
                  id="login-email"
                  placeholder="Email"
                  required
                  value={Email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="login-password-box">
                <label htmlFor="login-pwd">
                  <i className="ri-lock-password-fill" />
                </label>
                <input
                  type="password"
                  id="login-pwd"
                  placeholder="Password"
                  required
                  value={Password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <a
                href="forgotpassword"
                className="forgot-pwd"
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgot(true)
                }}
              >
                Forgot Password?
              </a>
              <button type="submit" className="login-submit-btn">
                {isLogin ? (
                  <svg
                    className="form-loader-container del-loader"
                    height="18"
                    width="18"
                  >
                    <circle
                      className="form-loader"
                      cx="9"
                      cy="9"
                      r="7"
                      stroke-width="2"
                      fill="transparent"
                    ></circle>
                  </svg>
                ) : (
                  "Login"
                )}
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
                    onClick={loginwithgoogle}
                  >
                    <i className="ri-google-fill" /> Continue with Google
                  </button>
                  <button
                    className="github-btn"
                    type="button"
                    onClick={loginwithgithub}
                  >
                    <i className="ri-github-fill" /> Continue with Github
                  </button>
                  <button
                    className="apple-btn"
                    type="button"
                    onClick={loginwithapple}
                  >
                    <i className="ri-apple-fill" /> Continue with Apple
                  </button>
                </div>
              </div>
            </form>
          </section>
          {showForgot && <ForgotPwd setShowForgot={setShowForgot} toastifyfun={toastifyfun}/>}
        </div>
      </div>
    </>
  );
};

export default Login;
