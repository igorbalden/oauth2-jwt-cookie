import React, { useReducer } from "react";
import { createContext, useContext } from 'react';

// Initial state object in createContect 
export const AuthContext = createContext({
  authObj: {
    user: {userId: null, userEmail: null}, 
    token: null
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
    token: null
  };
  const luser = JSON.parse(localStorage.getItem('AuthUser'));
  if (luser) {
    stored = {
      user: {
        userId: luser.user.userId,
        userEmail: luser.user.userEmail
      },
      token: localStorage.getItem('Token')
    };
  }
  return stored;
}

export const AuthState = (props)=> {
  const [authObj, dispatch] = useReducer(reducer, getAuthObj());

  function reducer(authObj, action) {
    switch (action.type) {
      case 'cleanUser':
        localStorage.removeItem('Token');
        localStorage.removeItem('AuthUser');
        const cuser = {
          userId: null,
          userEmail: null
        };
        return {...authObj, user: cuser, token: null};

      case 'setUser':
        const token = action.payload.token;
        const user = {
          userId: action.payload.user.userId,
          userEmail: action.payload.user.userEmail
        };
        localStorage.setItem('AuthUser', JSON.stringify({user: user}));
        localStorage.setItem('Token', token);
        return {...authObj, user: user, token: token};

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
