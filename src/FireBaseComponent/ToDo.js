import React, { useContext, useEffect, useRef, useState } from "react";
import Menu from "./Menu";
import List from "./List";
import "../CSSComponent/main.css";
import "../CSSComponent/main-mediaQuery.css";
import "react-toastify/dist/ReactToastify.css";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../Component/Firebase";
import { ToastContainer, toast, Bounce } from "react-toastify";
import LoadingBar from "react-top-loading-bar";
import "react-toastify/dist/ReactToastify.css";
import UserDelete from "./UserDelete";
import { getDownloadURL, ref } from "firebase/storage";
import { Contest } from "../App";

const ToDo = ({ user }) => {
  let [menu, setMenu] = useState(false);
  const toggleMenu = () => {
    setMenu(!menu);
  };

  let { isConnected } = useContext(Contest);

  let [alldata, setAlldata] = useState([]);
  let [id, setId] = useState(0);
  let [count, setCount] = useState(0);
  let [val, setVal] = useState("");
  let [isEdit, setIsEdit] = useState(false);
  let [EditId, setEditId] = useState(0);
  let [isLoader, setIsLoader] = useState(false);

  useEffect(() => {
    setCount(alldata.length);
  }, [alldata]);

  const callToastify = (method) => {
    const message = method == "Offline" ? "You Are Offline" : method;
    toast.error(message, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
      toastId: "TODO Error",
    });
  };

  const getTime = () => {
    let date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const isAM = hours < 12;
    const ampm = isAM ? "AM" : "PM";

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strMinutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${strMinutes} ${ampm}`;
  };

  const getData = async (method) => {
    try {
      if (isConnected) {
        const collectionref = collection(
          db,
          `user/${user.uid.toString()}/Data`
        );

        const dataSnapshot = await getDocs(collectionref);

        if (!dataSnapshot.empty) {
          let arr = [];
          dataSnapshot.forEach((doc) => {
            arr.push({
              id: doc.data().id,
              Notes: doc.data().Notes,
              Checked: doc.data().Checked,
              time: doc.data().time,
            });
          });
          arr.sort((a, b) => {
            return a.id - b.id;
          });
          setAlldata([...arr]);

          setId(arr[arr.length - 1].id + 1);
        } else {
          setId(0);
          setAlldata([]);
        }

        if (method != "initial") {
          setIsLoader(false);
          setCheckedLoaderItemId(null);
        }
      } else {
        callToastify("Offline");
      }
    } catch (error) {
      callToastify(error.message);
    }
  };

  let [Name, setName] = useState("");
  let [Email, setEmail] = useState("");

  const getNameandEmail = async () => {
    try {
      if (isConnected) {
        let docref = doc(db, "user", user.uid.toString());
        let data = await getDoc(docref);
        setName(data.data().Name);
        setEmail(data.data().Email);
      } else {
        callToastify("Offline");
      }
    } catch (error) {
      callToastify(error.message);
    }
  };

  useEffect(() => {
    if (isConnected) {
      getNameandEmail();
      getData("initial");
      retriveImage();
    } else {
      callToastify("Offline");
    }
  }, [isConnected]);

  const addData = async () => {
    try {
      if (isConnected) {
        if (val != "") {
          setIsLoader(true);
          let docref = doc(
            db,
            `user/${user.uid.toString()}/Data`,
            id.toString()
          );

          await setDoc(docref, {
            id: id,
            Notes: val,
            Checked: false,
            time: getTime(),
          });

          setVal("");
          getData("addData");
        }
      } else {
        callToastify("Offline");
      }
    } catch (error) {
      setIsLoader(false);
      callToastify(error.message);
    }
  };

  const del = async (id) => {
    if (isConnected) {
      try {
        setProgress(10);
        if (isEdit) {
          setIsEdit(false);
          setVal("");
        }
        const docref = doc(
          db,
          `user/${user.uid.toString()}/Data`,
          id.toString()
        );
        setProgress(40);
        await deleteDoc(docref);
        setProgress(60);
        getData();
        setProgress(100);
      } catch (error) {
        setProgress(100);
        callToastify(error.message);
      }
    } else {
      callToastify("Offline");
    }
  };

  const edit = (id) => {
    let data = alldata.find((ele) => {
      return ele.id === id;
    });

    setVal(data.Notes);
    setIsEdit(true);

    setEditId(id);
  };

  const update = async () => {
    setIsLoader(true);
    try {
      if (isConnected) {
        if (val !== "") {
          const docref = doc(
            db,
            `user/${user.uid.toString()}/Data`,
            EditId.toString()
          );

          await updateDoc(docref, {
            Notes: val,
            time: getTime(),
          });

          await getData();
          setIsEdit(false);
          setVal("");
          setIsLoader(false);
        }
      } else {
        setIsLoader(false);
        callToastify("Offline");
      }
    } catch (error) {
      setIsLoader(false);
      callToastify(error.message);
    }
  };

  let [CheckedLoaderItemId, setCheckedLoaderItemId] = useState(null);
  const toggleChecked = async (id) => {
    if (isConnected) {
      setCheckedLoaderItemId(id);
      try {
        let docref = doc(db, `user/${user.uid.toString()}/Data`, id.toString());

        let docSnapshot = await getDoc(docref);

        await updateDoc(docref, {
          Checked: !docSnapshot.data().Checked,
        });
        getData("toggleChecked");
      } catch (error) {
        callToastify(error.message);
      }
    } else callToastify("Offline");
  };

  let [progress, setProgress] = useState(0);

  let [showDelOption, setShowDelOption] = useState(false);

  let [imageUrl, setImageUrl] = useState(null);

  const retriveImage = async () => {
    try {
      if (isConnected) {
        const user = auth.currentUser;
        const storeImageref = ref(storage, `Images/${user.uid}`);
        let url = await getDownloadURL(storeImageref);
        setImageUrl(null);
        if (url != null) {
          setImageUrl(url);
        }
      } else {
        callToastify("Offline");
      }
    } catch (error) {}
  };

  return (
    <>
      <ToastContainer />
      <section className="list-body">
        <header>
          <div className="title">To Do List</div>
          <section className="info">
            {count !== 0 ? (
              <>
                <div className="list-count">
                  <i className="icon ri-list-check-3" />
                  {count}{" "}
                </div>
              </>
            ) : null}
            <div className="menu">
              <i className="icon ri-account-circle-fill" onClick={toggleMenu} />
              {menu ? (
                <Menu
                  toggleMenu={toggleMenu}
                  Name={Name}
                  Email={Email}
                  setShowDelOption={setShowDelOption}
                  setMenu={setMenu}
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  retriveImage={retriveImage}
                  callToastify={callToastify}
                />
              ) : null}
            </div>
          </section>
          {showDelOption ? (
            <UserDelete
              setShowDelOption={setShowDelOption}
              isLoader={isLoader}
              setIsLoader={setIsLoader}
              callToastify={callToastify}
              showDelOption={showDelOption}
            />
          ) : null}
        </header>
        <LoadingBar
          color="red"
          progress={progress}
          onLoaderFinished={() => {
            setProgress(100);
          }}
          waitingTime={400}
        />
        <main>
          {alldata.length !== 0 ? (
            alldata.map((ele) => {
              return (
                <List
                  data={ele}
                  edit={edit}
                  del={del}
                  key={ele.id}
                  toggleChecked={toggleChecked}
                  CheckedLoaderItemId={CheckedLoaderItemId}
                />
              );
            })
          ) : (
            <h1 className="success">
              <q>You are Loged in</q>
            </h1>
          )}
        </main>
        <footer>
          <div className="add-container">
            <input
              type="text"
              placeholder="Enter your task"
              value={val}
              onChange={(e) => {
                setVal(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  if (isEdit) {
                    update();
                  } else {
                    addData();
                  }
                }
              }}
            />
            {isEdit ? (
              isLoader ? (
                <button type="button" className="editing-btn">
                  <svg className="loader-container" height="18" width="18">
                    <circle
                      className="loader"
                      cx="9"
                      cy="9"
                      r="7"
                      stroke-width="2"
                      fill="transparent"
                    ></circle>
                  </svg>
                </button>
              ) : (
                <button type="button" className="editing-btn" onClick={update}>
                  <i className="icon ri-pencil-fill" />
                </button>
              )
            ) : isLoader ? (
              <button type="button" className="add-btn">
                <svg className="loader-container" height="18" width="18">
                  <circle
                    className="loader"
                    cx="9"
                    cy="9"
                    r="7"
                    stroke-width="2"
                    fill="transparent"
                  ></circle>
                </svg>
              </button>
            ) : (
              <button
                type="button"
                className="add-btn"
                onClick={() => {
                  addData();
                }}
              >
                <i className="icon ri-send-plane-2-fill" />
              </button>
            )}
          </div>
        </footer>
      </section>
    </>
  );
};

export default ToDo;
