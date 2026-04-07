import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

export const useMedicalRecords = () => {
  const authContext = useContext(AuthContext) as any;
  const userId = authContext?.user?.id;

  const [files, setFiles] = useState<any[]>([]);
  const [notes, setNotes] = useState("");

  const addFile = (fileData: { name: string; data: string }, type: string) => {
    const newFile = {
      id: Math.random().toString(36).substr(2, 9),
      ...fileData,
      type,
      date: new Date().toLocaleDateString('ar-EG')
    };
    setFiles(prev => [...prev, newFile]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const saveRecord = () => {
    const recordId = userId ? `REC-${userId}-${Math.random().toString(36).substr(2, 9)}` : "REC-" + Math.random().toString(36).substr(2, 9);
    const data = { files, notes, createdAt: new Date().toISOString(), userId };
    localStorage.setItem(recordId, JSON.stringify(data));
    return recordId;
  };

  return { files, notes, setNotes, addFile, removeFile, saveRecord };
};