import React from "react";
import "./Card.css";

const Card = ({ id, title, completed, onRemove, onToggleComplete }) => {
  return (
    <div>
      <div className="cont">
        <p className="mytodo">
          <div className="innerdiv">
            <input
              type="checkbox"
              className="checkbox"
              checked={completed}
              onChange={() => onToggleComplete(id)}
            />{" "}
            <p className={completed ? "title completed" : "title"}>{title}</p>
          </div>
          <p className="bin" onClick={() => onRemove(id)}>
            remove
          </p>
        </p>
      </div>
    </div>
  );
};

export default Card;
