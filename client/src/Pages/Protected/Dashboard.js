import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import Main from '../../Layout/Main';
import LoginForm from '../../Forms/LoginForm';

export default function Dashboard() {
  const { authObj } = useAuth();
  const [greet, setGreet] = useState('');
  const srvUrl = process.env.REACT_APP_SERVER;

  const srvRes = useCallback(async ()=> {
    const resp = await fetch(srvUrl + '/dashboard', {
      mode: 'cors',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + authObj.token
      }
    });
    return resp.json();
  }, [authObj.token, srvUrl]);

  useEffect(()=> {
    let getGreet = async ()=> {
      let grt  = await srvRes();
      setGreet(grt.msg)
    }
    getGreet();
  }, [srvRes]);

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