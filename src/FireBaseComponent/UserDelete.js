import React, { useContext, useEffect, useState } from "react";
import { auth, db, storage } from "../Component/Firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { deleteUser, OAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Contest } from "../App";
import { deleteObject, ref } from "firebase/storage";
import {
  EmailAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";

const UserDelete = ({
  setShowDelOption,
  isLoader,
  setIsLoader,
  callToastify,
  showDelOption,
}) => {
  const [providerId, setproviderId] = useState(null);

  const { isConnected } = useContext(Contest);

  const [Password, setPassword] = useState("");

  const navigate = useNavigate();

  const { setUser } = useContext(Contest);

  const deleteAccount = async (e) => {
    e.preventDefault()
    if (isConnected) {
      try {
        setIsLoader(true);
        const user = auth.currentUser;
        if (user) {
          if (providerId === "password") {
            const credential = EmailAuthProvider.credential(user.email, Password);
            await reauthenticateWithCredential(user, credential);
          } else {
            let provider;
            if(providerId === GoogleAuthProvider.PROVIDER_ID){
              provider = new GoogleAuthProvider();
            }else if(providerId === GithubAuthProvider.PROVIDER_ID){
              provider = new GithubAuthProvider();
            }else{ //(providerId === OAuthProvider.PROVIDER_ID)
              provider = new OAuthProvider("apple.com")
            }
            await reauthenticateWithPopup(user , provider)
          }

          const docref = doc(db, "user", user.uid);
          const subCollectref = collection(db,`user/${user.uid.toString()}/Data`
          );
          const subCollectSnapShot = await getDocs(subCollectref);

          if (!subCollectSnapShot.empty) {
            subCollectSnapShot.forEach(async (doc) => {
              await deleteDoc(doc.ref);
            });
          }

          await deleteDoc(docref);
          await deleteUser(user);

          const storageref = ref(storage, `Images/${user.uid}`);
          await deleteObject(storageref);

          setUser(null);
          setIsLoader(false);
          navigate("/");
        }
      } catch (error) {
        console.error("Error during account deletion: ", error);
        setIsLoader(false);
        callToastify(error.message);
      }
    } else {
      callToastify("Offline");
    }
  };

  useEffect(() => {
    if (showDelOption) {
      const user = auth.currentUser;
      setproviderId(user.providerData[0].providerId);
    }
  }, [showDelOption]);

  return (
    <>
      <section className="del-popup">
        <form className="popup" onSubmit={deleteAccount}>
          <div className="del-warn">
            <span>
              Are you sure want to <q>Delete</q> your account
            </span>
            <ul>
              <li>All data will be erased</li>
              <li>You will lose your account</li>
              <li>You can't use full features of website</li>
            </ul>
          </div>
          {providerId === "password" && (
            <div className="popup-pwd-box">
              <label htmlFor="popup-pwd"><i className="ri-lock-password-fill"></i></label>
              <input
                id="popup-pwd"
                type="password"
                placeholder="Enter Password"
                value={Password}
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          )}
          <div className="popup-btn">
            <button className="yes-btn" type="submit">
              {isLoader ? (
                <svg
                  className="loader-container del-loader"
                  height="18"
                  width="18"
                >
                  <circle
                    className="loader"
                    cx="9"
                    cy="9"
                    r="7"
                    stroke-width="2"
                    fill="transparent"
                  ></circle>
                </svg>
              ) : (
                "Yes"
              )}
            </button>
            <button
              type="button"
              className="no-btn"
              onClick={() => {
                setShowDelOption(false);
                setIsLoader(false);
              }}
            >
              No
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default UserDelete;
