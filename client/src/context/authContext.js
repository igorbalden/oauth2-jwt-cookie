import React, { useReducer } from "react";
import { createContext, useContext } from 'react';

// Initial state object in createContect 
export const AuthContext = createContext({
  authObj: {
    user: {userId: null, userEmail: null}, 
  }
});

export function useAuth() {
  return useContext(AuthContext);
};

function getAuthObj() {
  let stored = {
    user: {
      userId: null,
      userEmail: null
    },
  };
  const luser = JSON.parse(localStorage.getItem('AuthUser'));
  if (luser) {
    stored = {
      user: {
        userId: luser.user.userId,
        userEmail: luser.user.userEmail
      },
    };
  }
  return stored;
}

export const AuthState = (props)=> {
  const [authObj, dispatch] = useReducer(reducer, getAuthObj());

  function reducer(authObj, action) {
    switch (action.type) {
      case 'cleanUser':
        localStorage.removeItem('AuthUser');
        const cuser = {
          userId: null,
          userEmail: null
        };
        return {...authObj, user: cuser};

      case 'setUser':
        const user = {
          userId: action.payload.user.id,
          userEmail: action.payload.user.email
        };
        localStorage.setItem('AuthUser', JSON.stringify({user: user}));
        return {...authObj, user: user};

      case 'getAuth':
        authObj = getAuthObj();
        return authObj;

      default:
        return authObj;
    }
  }

  return (
    <AuthContext.Provider value={
      { authObj, dispatch } 
    }>
      {props.children}
    </AuthContext.Provider>
  );  
};
