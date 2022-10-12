import React, { useEffect, useState } from 'react';
import Main from '../Layout/Main';
import { useAuth } from '../context/authContext';
import jwt_decode from 'jwt-decode';

export default function Home(props) {
  const {authObj} = useAuth();
  const [expDate, setExpDate] = useState('');

  useEffect(()=> {
    const token = localStorage.getItem('Token');
    const tokData = token ? jwt_decode(token) : '';
    setExpDate(new Date(
        1000 * (tokData?.exp ?? '')
      ).toISOString()
    );
  }, []);

  const page = (
    (!authObj) 
    ?
      "Loading..."
    :
      <>
        <h2>Homepage</h2>
        {JSON.stringify(authObj)}
        {/* Show token expiration datetime, using useEffect */}
        <p id='atxt'>Exp: {expDate}</p>
      </>
  );

  return <Main content={page} />
}