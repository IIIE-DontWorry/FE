import React, {createContext, useState, useContext} from 'react';

// 사용자 타입 정의
type UserType = '보호자' | '간병인' | '지인' | null;

// 각 사용자 타입별 데이터 인터페이스
interface ProtectorData {
  protectorName: string;
  protectorPhone: string;
  protectorAddress: string;
  relationship: string;
  patientName: string;
  patientAge: string;
  disease: string;
  hospital: string;
  patientAddress: string;
}

interface CaregiverData {
  name: string;
  phone: string;
  workplace: string;
  matchingCode: string;
}

interface AcquaintanceData {
  name: string;
  matchingCode: string;
  relationship: string;
}

// Context 타입 확장
interface UserContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  protectorData: ProtectorData | null;
  caregiverData: CaregiverData | null;
  acquaintanceData: AcquaintanceData | null;
  setProtectorData: (data: ProtectorData) => void;
  setCaregiverData: (data: CaregiverData) => void;
  setAcquaintanceData: (data: AcquaintanceData) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [protectorData, setProtectorData] = useState<ProtectorData | null>(null);
  const [caregiverData, setCaregiverData] = useState<CaregiverData | null>(null);
  const [acquaintanceData, setAcquaintanceData] = useState<AcquaintanceData | null>(null);

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

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export type {ProtectorData, CaregiverData, AcquaintanceData};