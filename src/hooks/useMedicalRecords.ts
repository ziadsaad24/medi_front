import { useState } from "react";

export const useMedicalRecords = () => {
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
    const recordId = "REC-" + Math.random().toString(36).substr(2, 9);
    const data = { files, notes, createdAt: new Date().toISOString() };
    localStorage.setItem(recordId, JSON.stringify(data));
    return recordId;
  };

  return { files, notes, setNotes, addFile, removeFile, saveRecord };
};