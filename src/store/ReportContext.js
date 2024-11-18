import React, {createContext, useState, useContext} from 'react';

// Context 생성
const ReportContext = createContext();

// Provider 생성
export const ReportProvider = ({children}) => {
  const [reports, setReports] = useState([]); // 보고서 데이터 상태

  // 보고서 추가 함수
  const addReport = newReport => {
    setReports(prevReports => [...prevReports, {...newReport, id: Date.now()}]);
  };

  // 보고서 수정 함수
  const updateReport = updatedReport => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === updatedReport.id ? updatedReport : report,
      ),
    );
  };

  // 보고서 삭제 함수
  const deleteReport = id => {
    setReports(prevReports => prevReports.filter(report => report.id !== id));
  };

  // 보고서 데이터 Context 값
  const value = {
    reports,
    addReport,
    updateReport,
    deleteReport,
  };

  return (
    <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
  );
};

// Custom Hook for using ReportContext
export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};
