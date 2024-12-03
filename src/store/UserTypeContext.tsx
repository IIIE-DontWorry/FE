import React, {createContext, useReducer, useContext} from 'react';

// State Interface
interface UserTypeState {
  role: string | null;
  accessToken: string | null;
}

interface UserTypeAction {
  type: 'SET_USER_TYPE' | 'LOGOUT';
  payload?: UserTypeState;
}

const initialState: UserTypeState = {
  role: null,
  accessToken: null,
};

// Reducer Function
const userTypeReducer = (
  state: UserTypeState,
  action: UserTypeAction,
): UserTypeState => {
  switch (action.type) {
    case 'SET_USER_TYPE':
      return {
        role: action.payload?.role || null,
        accessToken: action.payload?.accessToken || null,
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
};

// Create Context
const UserTypeContext = createContext<{
  state: UserTypeState;
  dispatch: React.Dispatch<UserTypeAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Provider Component
export const UserTypeProvider = ({children}: {children: React.ReactNode}) => {
  const [state, dispatch] = useReducer(userTypeReducer, initialState);

  return (
    <UserTypeContext.Provider value={{state, dispatch}}>
      {children}
    </UserTypeContext.Provider>
  );
};

// Custom Hook
export const useUserType = () => useContext(UserTypeContext);
