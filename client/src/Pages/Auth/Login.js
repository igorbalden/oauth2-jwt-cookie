import React from 'react';
import { Navigate } from 'react-router-dom';
import Main from '../../Layout/Main';
import LoginForm from '../../Forms/LoginForm';
import { useAuth } from '../../context/authContext';

export default function Login() {
  const { authObj } = useAuth();

  const page = (
    (authObj?.user?.userId)
    ?
      <Navigate to="/" />
    :
      <LoginForm />
  );

  return <Main content={page} />
}