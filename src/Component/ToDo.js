import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import List from "./List";
import "../CSSComponent/main.css";
import "../CSSComponent/main-mediaQuery.css";

const ToDo = () => {
  let [menu, setMenu] = useState(false);

  const toggleMenu = () => {
    setMenu(!menu);
  };

  let [alldata, setAlldata] = useState([]);
  let [id, setId] = useState(0);
  let [count, setCount] = useState(0);
  let [val, setVal] = useState("");
  let [isEdit, setIsEdit] = useState(false);
  let [isEditId, setIsEditId] = useState(0);

  const addData = () => {
    let formatedtime = getTime();

    let obj = { id: id, data: val, date: formatedtime, checked: false };

    if (val !== "") {
      if (alldata.length !== 0) {
        if (obj.data !== alldata[alldata.length - 1].data) {
          setAlldata([...alldata, obj]);
        }
      } else {
        setAlldata([...alldata, obj]);
      }
    }

    setId(id + 1);
    setVal("");
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

  useEffect(() => {
    setCount(alldata.length);
  }, [alldata]);

  const del = (id) => {
    if (isEdit === true) {
      setIsEdit(false);
      setVal("");
    }

    setAlldata(
      alldata.filter((ele) => {
        return ele.id != id;
      })
    );
  };

  const edit = (id) => {
    setVal(alldata[id].data);
    setIsEdit(true);
    setIsEditId(id);
  };

  const update = () => {
    if (val !== "") {
      let formatedtime = getTime();
      alldata[isEditId].data = val;
      alldata[isEditId].date = formatedtime;
      setIsEdit(false);
      setVal("");
    }
  };
  
  return (
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
            {menu ? <Menu toggleMenu={toggleMenu} /> : null}
          </div>
        </section>
      </header>
      <main>
        {alldata.length !== 0 ? (
          alldata.map((ele, idx) => {
            return (
              <List
                data={ele}
                edit={edit}
                del={del}
                key={ele.id}
                idx={idx}
                alldata={alldata}
                setAlldata={setAlldata}
              />
            );
          })
        ) : (
          <h1 className="warn">
            <q>Login to save your data</q>
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
            <button type="button" className="editing-btn" onClick={update}>
              <i className="icon ri-pencil-fill" />
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
  );
};

export default ToDo;
