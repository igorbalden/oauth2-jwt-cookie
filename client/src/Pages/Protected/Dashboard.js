import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import Main from '../../Layout/Main';
import LoginForm from '../../Forms/LoginForm';

export default function Dashboard() {
  const { authObj, dispatch } = useAuth();
  const [greet, setGreet] = useState('');
  const srvUrl = process.env.REACT_APP_SERVER;

  const srvRes = useCallback(async ()=> {
    const resp = await fetch(srvUrl + '/dashboard', {
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      }
    });
    if (resp.status >= 500) {
      return false;
    }
    if (resp.status >= 400) {
      dispatch({ type: "cleanUser" });
    }
    return resp.json();
  }, [srvUrl, dispatch]);

  useEffect(()=> {
    let getGreet = async ()=> {
      let grt  = await srvRes();
      setGreet(grt.msg)
    }
    getGreet();
  }, [srvRes, authObj.user.userId]);

  const page = (
    (authObj?.user?.userId)
    ?
      <>
        <h2>Dashboard</h2>
        User: {authObj.user.userEmail}
        <p>Greet: {greet}</p>
      </>
    :
      <LoginForm />
  );

  return <Main content={page} />
}