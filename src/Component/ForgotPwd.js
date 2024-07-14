import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./Firebase";
import { Bounce, toast } from "react-toastify";

const ForgotPwd = ({ setShowForgot, toastifyfun }) => {
  let [Email, setEmail] = useState("");

  let [showloader, setShowLoader] = useState(false);

  let [message, setMessage] = useState(false);

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      setShowLoader(true);
      await sendPasswordResetEmail(auth, Email);
      toastifyfun("success", "Email Send SuccessFully");
      setShowLoader(false);
      setEmail("")
      setMessage(true)
    } catch (error) {
      setShowLoader(false);
      toastifyfun("error", error.message);
    }
  };

  return (
    <>
      <section className="forget-pwd-container">
        <form
          className="forget-pwd-form"
          autoComplete="off"
          onSubmit={(e) => {
            resetPassword(e);
          }}
        >
          <button
            type="button"
            className="close-forget-btn"
            onClick={() => {
              setShowForgot();
            }}
          >
            <i className="ri-close-large-line" />
          </button>
          <div className="forget-email-box">
            <label htmlFor="forget-email-input">
              <i className="ri-mail-fill" />
            </label>
            <input
              type="Email"
              placeholder="Enter your Email"
              id="forget-email-input"
              required
              onChange={(e) => {
                if(message){
                    setMessage(false);
                }
                setEmail(e.target.value);
              }}
              value={Email}
            />
          </div>
          {showloader ? (
            <button className="forget-btn">
              <svg className="form-loader-container" height="18" width="18">
                <circle
                  className="form-loader"
                  cx="9"
                  cy="9"
                  r="7"
                  stroke-width="2"
                  fill="transparent"
                ></circle>
              </svg>
            </button>
          ) : (
            <button type="submit" className="forget-btn">
              Send Email
            </button>
          )}
          <div className="forget-text">
            {message ? (
              <p className="success-text">
                <q>
                  Successfully sent email to your Email ID click on the link to
                  reset your password
                </q>
              </p>
            ) : (
                <p className="bydefault-text">
                  <q>
                    We will send email to your Email ID click on the link to reset
                    your password
                  </q>
                </p>
              ) }
          </div>
        </form>
      </section>
    </>
  );
};

export default ForgotPwd;
