import React from "react";
import { Navigation } from "./Navigation/Navigation";
import { Spinner } from './Spinner/Spinner';


export default function Main(props) {

  return (
    <>
      <Navigation />
      <div className='container'>
        <Spinner />
        {props.content}
      </div>
    </>
  );
};