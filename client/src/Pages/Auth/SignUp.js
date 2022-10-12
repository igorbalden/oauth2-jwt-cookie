import React from 'react';
import Main from '../../Layout/Main';
import SignUpForm from '../../Forms/SignUpForm';

export default function SignUp() {

  const page = (
    <SignUpForm />
  );

  return <Main content={page} />
}