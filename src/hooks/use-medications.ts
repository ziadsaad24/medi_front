import { useState, useEffect } from "react";
import { patientAPI } from "../services/api";

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

  const normalizeMedication = (medication: Partial<Medication> & { id?: string | number }) => ({
    id: String(medication.id ?? Date.now()),
    name: medication.name ?? "",
    dosage: medication.dosage ?? "",
    time: medication.time ? String(medication.time).slice(0, 5) : "",
    frequency: medication.frequency ?? "مرة يومياً",
    taken: Boolean(medication.taken),
    color: medication.color ?? COLORS[medications.length % COLORS.length],
  });

  useEffect(() => {
    const loadMedications = async () => {
      try {
        const response = await patientAPI.getMedications();
        const items = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.medications)
            ? response.medications
            : Array.isArray(response)
              ? response
              : [];

        if (items.length > 0) {
          setMedications(items.map((item: Medication) => normalizeMedication(item)));
          return;
        }
      } catch (error) {
        console.warn("Using local medications fallback:", error);
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      setMedications(stored ? JSON.parse(stored) : []);
    };

    loadMedications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
  }, [medications]);

  const addMedication = (medication: Omit<Medication, "id" | "taken" | "color">) => {
    const createMedication = async () => {
      const fallbackMedication: Medication = normalizeMedication({
        ...medication,
        id: Date.now().toString(),
        taken: false,
        color: COLORS[medications.length % COLORS.length],
      });

      try {
        const response = await patientAPI.addMedication(medication);
        const createdMedication = normalizeMedication(response?.data ?? response?.medication ?? response ?? fallbackMedication);
        setMedications((prev) => [...prev, createdMedication]);
      } catch (error) {
        console.warn("Medication API unavailable, saving locally:", error);
        setMedications((prev) => [...prev, fallbackMedication]);
      }
    };

    void createMedication();
  };

  const toggleMedication = (id: string) => {
    const toggle = async () => {
      const target = medications.find((med) => med.id === id);
      if (!target) return;

      try {
        await patientAPI.toggleMedication(id);
      } catch (error) {
        console.warn("Toggle medication API unavailable, updating locally:", error);
      }

      setMedications((prev) =>
        prev.map((med) => (med.id === id ? { ...med, taken: !med.taken } : med))
      );
    };

    void toggle();
  };

  const deleteMedication = (id: string) => {
    const remove = async () => {
      try {
        await patientAPI.deleteMedication(id);
      } catch (error) {
        console.warn("Delete medication API unavailable, removing locally:", error);
      }

      setMedications((prev) => prev.filter((med) => med.id !== id));
    };

    void remove();
  };

  return { medications, addMedication, toggleMedication, deleteMedication };
}
