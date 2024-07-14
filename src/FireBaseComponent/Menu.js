import React, { useContext, useEffect, useRef, useState } from "react";
import "../CSSComponent/main.css";
import "../CSSComponent/main-mediaQuery.css";
import { signOut } from "firebase/auth";
import { auth, db, storage } from "../Component/Firebase";
import user from "../Image/user.png";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { Contest } from "../App";
import { doc, getDoc } from "firebase/firestore";

const Menu = ({
  toggleMenu,
  Name,
  Email,
  setShowDelOption,
  imageUrl,
  setImageUrl,
  callToastify,
}) => {
  const inputFileref = useRef();

  let { isConnected } = useContext(Contest);

  let [userLoader, setUserLoader] = useState(false);

  let [Image, setImage] = useState(null);

  const uploadImage = (e) => {
    if (isConnected) {
      setUserLoader(true);
      setImage(e.target.files[0]);
      inputFileref.current.value = null;
    } else {
      callToastify("Offline");
      inputFileref.current.value = null;
    }
  };

  const storeImage = async () => {
    if (Image) {
      if (isConnected) {
        try {
          const user = auth.currentUser;
          const storeImageref = ref(storage, `Images/${user.uid}`);
          await uploadBytes(storeImageref, Image);
          const url = await getDownloadURL(storeImageref);

          setImage(null);
          setImageUrl(url);
          setUserLoader(false);
        } catch (error) {
          callToastify(error.message);
        }
      } else callToastify("Offline");
    }
  };

  useEffect(() => {
    if (Image) {
      storeImage();
    }
  }, [Image]);

  const deleteImage = async () => {
    if (isConnected) {
      try {
        setUserLoader(true);
        const user = auth.currentUser;
        const storeImageref = ref(storage, `Images/${user.uid}`);

        await deleteObject(storeImageref);
        setUserLoader(false);
        setImageUrl(null);
      } catch (error) {
        setUserLoader(false);
        callToastify(error.message);
      }
    } else {
      callToastify("Offline");
    }
  };

  return (
    <div className="menu-container">
      <button
        className="menu-container-close-btn"
        onClick={() => {
          toggleMenu();
        }}
      >
        <i className="ri-close-large-line" />
      </button>
      <div className="user-img-container">
        <div
          className={userLoader ? `userimage userimage-loader` : `userimage`}
        >
          <input
            type="file"
            id="get-img"
            accept="image/*"
            onChange={uploadImage}
            ref={inputFileref}
          />
          <div className="image">
            {imageUrl == null ? (
              <img src={user} alt={"User Image"} />
            ) : (
              <img src={imageUrl} key={imageUrl} alt="userimage" />
            )}
            {imageUrl != null && (
              <div className="image-edit-container">
                <label htmlFor="get-img" className="edit-image-btn">
                  <i className="icon ri-pencil-fill" />
                </label>
                <button
                  type="button"
                  className="del-image-btn"
                  onClick={deleteImage}
                >
                  <i className="icon ri-delete-bin-fill" />
                </button>
              </div>
            )}
          </div>
          {imageUrl == null && !userLoader && (
            <label htmlFor="get-img" className="img-btn">
              <i className="icon ri-pencil-fill" />
            </label>
          )}
        </div>
      </div>
      <div className="user-detail">
        {Name && <div className="name">{Name}</div>}
        {Email && <div className="email">{Email}</div>}
      </div>
      <div className="menu-btn">
        <button
          type="button"
          className="menu-out"
          onClick={() => {
            signOut(auth);
            toggleMenu();
          }}
        >
          Log out
        </button>
        <button
          type="button"
          className="delete-account"
          onClick={() => {
            setShowDelOption(true);
            toggleMenu();
          }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Menu;
