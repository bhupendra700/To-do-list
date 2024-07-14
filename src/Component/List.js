import React, { useEffect } from "react";
import "../CSSComponent/main.css";
import "../CSSComponent/main-mediaQuery.css";

const List = ({ data, edit, del, idx, alldata, setAlldata }) => {
  const toggleChecked = (id) => {
    const updatedData = alldata.map((item, index) => {
      if (index === id) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    setAlldata(updatedData);
  };


  return (
    <>
      <div className="list">
        <div className="list-detail">
          <input
            type="checkbox"
            checked={data.checked}
            name="checkbox"
            id="check"
            onClick={() => {
              toggleChecked(idx);
            }}
          />
          <div className="list-title">{data.data}</div>
          <div className="time-stamp">
            <i className="icon ri-time-line" />
            {data.date}
            <div className="done">[completed]</div>
          </div>
        </div>
        <div className="list-btn">
        { !data.checked && <button
            type="button"
            className="edit-btn"
            onClick={() => {
              edit(idx);
            }}
          >
            <i className="icon ri-edit-box-line" />
          </button>}
          <button
            type="button"
            className="del-btn"
            onClick={() => {
              del(data.id);
            }}
          >
            <i className="icon ri-delete-bin-line" />
          </button>
        </div>
      </div>
    </>
  );
};

export default List;
