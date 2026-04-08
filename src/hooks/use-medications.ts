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

// ألوان زجاجية هادئة متماشية مع التصميم الجديد
const COLORS = [
  "rgba(59, 130, 246, 0.5)", // Blue
  "rgba(16, 185, 129, 0.5)", // Emerald
  "rgba(139, 92, 246, 0.5)", // Purple
  "rgba(245, 158, 11, 0.5)", // Amber
];

export function useMedications() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const extractMedicationList = (response: any): Medication[] => {
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.medications)) return response.medications;
    if (Array.isArray(response)) return response;
    return [];
  };

  const extractMedicationItem = (response: any): Partial<Medication> => {
    return response?.data ?? response?.medication ?? response;
  };

  const normalizeMedication = (medication: Partial<Medication> & { id?: string | number }) => ({
    id: String(medication.id ?? Date.now()),
    name: medication.name ?? "",
    dosage: medication.dosage ?? "",
    time: medication.time ? String(medication.time).slice(0, 5) : "",
    frequency: medication.frequency ?? "",
    taken: Boolean(medication.taken),
    color: medication.color ?? COLORS[medications.length % COLORS.length],
  });

  useEffect(() => {
    const loadMedications = async () => {
      setIsLoading(true);
      try {
        const response = await patientAPI.getMedications();
        const items = extractMedicationList(response);

        setMedications(items.map((item: Medication) => normalizeMedication(item)));
      } catch (error) {
        console.warn("Unable to load medications from API:", error);
        setMedications([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMedications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addMedication = (medication: Omit<Medication, "id" | "taken" | "color">) => {
    const createMedication = async () => {
      try {
        const payload = {
          ...medication,
          // Keep UI free of this text while still satisfying backend required field.
          frequency: medication.frequency?.trim() ? medication.frequency : "مرة يومياً",
        };

        const response = await patientAPI.addMedication(payload);
        const createdMedication = normalizeMedication(extractMedicationItem(response));
        setMedications((prev) => [...prev, createdMedication]);
      } catch (error) {
        console.warn("Unable to add medication to API:", (error as any)?.response?.data || error);
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
        setMedications((prev) =>
          prev.map((med) => (med.id === id ? { ...med, taken: !med.taken } : med))
        );
      } catch (error) {
        console.warn("Unable to toggle medication on API:", error);
      }
    };

    void toggle();
  };

  const deleteMedication = (id: string) => {
    const remove = async () => {
      try {
        await patientAPI.deleteMedication(id);
        setMedications((prev) => prev.filter((med) => med.id !== id));
      } catch (error) {
        console.warn("Unable to delete medication on API:", error);
      }
    };

    void remove();
  };

  return { medications, isLoading, addMedication, toggleMedication, deleteMedication };
}
