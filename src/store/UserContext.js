import React, {createContext, useState, useContext} from 'react';

// Context 생성
const UserContext = createContext();

// Provider 컴포넌트
export const UserProvider = ({children}) => {
 const [userType, setUserType] = useState(null);
 const [protectorData, setProtectorData] = useState(null);
 const [caregiverData, setCaregiverData] = useState(null);
 const [acquaintanceData, setAcquaintanceData] = useState(null);

 return (
   <UserContext.Provider 
     value={{
       userType,
       setUserType,
       protectorData,
       caregiverData,
       acquaintanceData,
       setProtectorData,
       setCaregiverData,
       setAcquaintanceData,
     }}
   >
     {children}
   </UserContext.Provider>
 );
};

// Custom Hook
export const useUser = () => {
 const context = useContext(UserContext);
 if (!context) {
   throw new Error('useUser must be used within a UserProvider');
 }
 return context;
};