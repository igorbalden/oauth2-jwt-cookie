import React, { useState, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useSpinner } from '../Layout/Spinner/Spinner';
import Messages from '../Layout/Messages/Messages';

const srvUrl = process.env.REACT_APP_SERVER;

async function registerUser(credentials) {
  return await fetch(srvUrl + "/signup", {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
}

export default function SignUpForm() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const password2Ref = useRef();
  const {authObj} = useAuth();
  const [msg, setMsg] = useState();
  const [err_msg, setErr_msg] = useState();
  const [inputErr, setInputErr] = useState({});
  const err = {};
  const setSpin = useSpinner(false);

  // Validation
  function jsvalidation(dataO) {
    for (let i in dataO) {
      if (dataO[i] === '') {
        err[i] = i+ " required";
      }
    }
    if (dataO.password !== password2Ref.current.value) {
      err['password'] = "Passwords don't match!";
    }
    if (err && Object.keys(err).length !== 0) {
      setInputErr(err);
      return false;
    }
    return true;
  }
  
  // Submit
  const handleSubmit = async e => {
    e.preventDefault();
    const dataO = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password :passwordRef.current.value
    };
    if (! jsvalidation(dataO)) {
      return false;
    }
    setSpin(true);
    await registerUser(dataO)
    .then((res)=> {
      setSpin(false);
      if (res.status >= 500) {
        console.log('status', res.status);
        setMsg('');
        setErr_msg(res.statusText);
        return false;
      } else {
        return res.text();
      }
    })
    .then((resp)=> {
      console.log(resp);
      if (resp.error) {
        setMsg('');
        setErr_msg(resp.error);
        return false;
      }
      if (resp) {
        setMsg(resp);
        setErr_msg('');
        return false;
      }
    });
    return false;
  };

  const formComp = (
    (authObj?.user?.userId)
    ?
      <Navigate to="/" />
    :
      <div className="d-flex justify-content-center">
        <div className="">
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <Messages msg={msg} err_msg={err_msg} />
            <div className="mb-3">
              <label>
                <div>Name</div>
                <input type="text" name='name' 
                  ref={nameRef} />
                {inputErr.name && 
                  <div style={{color:"red"}}>{inputErr.name}</div>
                }
              </label>
            </div>

            <div className="mb-3">
              <label>
                <div>Email</div>
                <input type="text" name='email' 
                  ref={emailRef} />
                {inputErr.email && 
                  <div style={{color:"red"}}>{inputErr.email}</div>
                }
              </label>
            </div>

            <div className="mb-3">
              <label>
                <div>Password</div>
                <input type="password" name='password' 
                  ref={passwordRef} />
                {inputErr.password && 
                  <div style={{color:"red"}}>{inputErr.password}</div>
                }
              </label>
            </div>

            <div className="mb-3">
              <label>
                <div>Password Again</div>
                <input type="password" name='password2' 
                  ref={password2Ref} />
              </label>
            </div>
            <div className="mb-3">
              <button id='subut' type="submit">Submit</button>
            </div>
          </form>
          <Link to="/auth/login">Already registered?</Link>
        </div>
      </div>
  );

  return formComp;
}