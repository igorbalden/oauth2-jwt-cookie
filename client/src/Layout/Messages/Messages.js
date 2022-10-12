import React from 'react';
import "./Messages.css";

export default function Messages(props) {

  return (
    <div id="msg-container">
      <div>
        <div id="msg">{props.msg}</div>
      </div>
      <div>
        <div id="errMsg">{props.err_msg}</div>
      </div>
    </div>
  );
};
