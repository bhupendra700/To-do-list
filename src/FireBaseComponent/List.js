import React, { useEffect } from "react";
import "../CSSComponent/main.css";
import "../CSSComponent/main-mediaQuery.css";

const List = ({ data, edit, del, toggleChecked, CheckedLoaderItemId }) => {
  return (
    <>
      <div className="list">
        <div className="list-detail">
          {CheckedLoaderItemId === data.id ? (
            <svg className="check-loader-container" height="13" width="13">
                <circle className="check-loader" cx="6.5" cy="6.5" r="5" stroke-width="1.5" fill="transparent"></circle>
            </svg>
          ) : (
            <input
              type="checkbox"
              checked={data.Checked}
              name="checkbox"
              id="check"
              onChange={() => {
                toggleChecked(data.id);
              }}
            />
          )}
          <div className="list-title">{data.Notes}</div>
          <div className="time-stamp">
            <i className="icon ri-time-line" />
            {data.time}
            <div className="done">[completed]</div>
          </div>
        </div>
        <div className="list-btn">
         {data.Checked == false && <button
            type="button"
            className="edit-btn"
            onClick={() => {
              edit(data.id);
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
