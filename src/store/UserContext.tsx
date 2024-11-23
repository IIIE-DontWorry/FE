import React, {createContext, useState, useContext} from 'react';

type UserType = '보호자' | '간병인' | '지인' | null;

interface UserContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [userType, setUserType] = useState<UserType>(null);

  return (
    <UserContext.Provider value={{userType, setUserType}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};