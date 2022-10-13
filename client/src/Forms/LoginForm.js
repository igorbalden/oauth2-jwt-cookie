import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useSpinner } from '../Layout/Spinner/Spinner';
import Messages from '../Layout/Messages/Messages';
import Google from "../img/google.png";

const srvUrl = process.env.REACT_APP_SERVER;

const google = ()=> {
  window.open("http://localhost:5000/auth/google", "_self");
};

async function loginUser(loginData) {
  return await fetch(srvUrl + '/login', {
    method: 'post',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      email: loginData.email,
      password: loginData.password
    })
  });
};

export default function LoginForm() {
  const [email, setEmail] = useState("u1@host.lo");
  const [password, setPassword] = useState("123456");
  const [msg, setMsg] = useState('');
  const [err_msg, setErr_msg] = useState('');
  const { dispatch } = useAuth();
  const setSpin = useSpinner(false);
  const [searchParams] = useSearchParams('');

  const makeAuth = useCallback((user)=> {
    return dispatch({
      type: "setUser", payload: {
        user: user,
      }
    })
  }, [dispatch]);

  useEffect(()=> {
    const userId = searchParams.get(('userId'));
    const userEmail = searchParams.get(('userEmail'));
    if (userId && userEmail) {
      makeAuth({id: userId, email: userEmail});
    }
  }, [makeAuth, searchParams]);
  
  const handleSubmit = async e => {
    setSpin(true);
    e.preventDefault();
    await loginUser({
      email,
      password
    })
    .then(res => {
      setSpin(false);
      if (res.status >= 500) {
        setMsg('');
        setErr_msg(res.statusText);
        return false;
        // return res.text().then(text => {throw new Error(text)});
      } else {
        return res.json();
      }
    })
    .then(resp => {
      // Error 4xx. resp.error is my msg added in backend
      if (resp.error) {
        setMsg('');
        setErr_msg(resp.error);
        return false;
      }
      if (resp) {
        const user = resp.user;
        makeAuth(user);
      }
    })
    .catch(err => {
      console.log(err);
    });
    return false;
  };

  const formComp = (
    <div className="d-flex justify-content-center">
      <div className="">
        <h1>Please Log In</h1>
        <form onSubmit={handleSubmit}>
          <Messages msg={msg} err_msg={err_msg} />
          <div className="loginButton google" onClick={google}>
            <img src={Google} alt="" className="icon" />
            Google
          </div>
          <div className="mb-3">
            <label>
              <div>Email</div>
              <input type="text"
                value={email} onChange={e => setEmail(e.target.value)} />
            </label>
          </div>
          <div className="mb-3">
            <label>
              <div>Password</div>
              <input type="password"
                value={password} onChange={e => setPassword(e.target.value)} />
            </label>
          </div>
          <div className="mb-3">
            <button id='subut' type="submit">Submit</button>
          </div>
        </form>
        <Link to="/auth/signup">Don't have an account?</Link>
      </div>
    </div>
  );

  return formComp;
}