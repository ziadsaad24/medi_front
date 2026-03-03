import { useState, useEffect } from "react";

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  taken: boolean;
  color: string;
}

const STORAGE_KEY = "medications-data";

// ألوان زجاجية هادئة متماشية مع التصميم الجديد
const COLORS = [
  "rgba(59, 130, 246, 0.5)", // Blue
  "rgba(16, 185, 129, 0.5)", // Emerald
  "rgba(139, 92, 246, 0.5)", // Purple
  "rgba(245, 158, 11, 0.5)", // Amber
];

export function useMedications() {
  const [medications, setMedications] = useState<Medication[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
  }, [medications]);

  const addMedication = (medication: Omit<Medication, "id" | "taken" | "color">) => {
    const newMedication: Medication = {
      ...medication,
      id: Date.now().toString(),
      taken: false,
      color: COLORS[medications.length % COLORS.length],
    };
    setMedications((prev) => [...prev, newMedication]);
  };

  const toggleMedication = (id: string) => {
    setMedications((prev) =>
      prev.map((med) => (med.id === id ? { ...med, taken: !med.taken } : med))
    );
  };

  const deleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
  };

  return { medications, addMedication, toggleMedication, deleteMedication };
}