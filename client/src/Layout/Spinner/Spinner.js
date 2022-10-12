import React, { useState, useEffect } from "react";
import "./sk-fading-circle.css"

export function useSpinner() {
  const [spin, setSpin] = useState(false);
  
  useEffect(()=> {
    if (spin) {
      document.querySelector("#skSpinner").style.display = 'block';
    } else {
      document.querySelector("#skSpinner").style.display = 'none';
    }
  }, [spin]);

  return setSpin;
};

export function Spinner() {
  return (
    <div id="skSpinner">
      <div className="skFadingCircle">
        <div className="skCircle1 skCircle"></div>
        <div className="skCircle2 skCircle"></div>
        <div className="skCircle3 skCircle"></div>
        <div className="skCircle4 skCircle"></div>
        <div className="skCircle5 skCircle"></div>
        <div className="skCircle6 skCircle"></div>
        <div className="skCircle7 skCircle"></div>
        <div className="skCircle8 skCircle"></div>
        <div className="skCircle9 skCircle"></div>
        <div className="skCircle10 skCircle"></div>
        <div className="skCircle11 skCircle"></div>
        <div className="skCircle12 skCircle"></div>
      </div>
    </div>
  );
};