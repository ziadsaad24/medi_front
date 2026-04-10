import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { patientAPI } from "../services/api";

const toArray = (value: any) => {
  if (Array.isArray(value)) return value;
  return [];
};

const toDataUrlFile = (fileData: { name: string; data: string }) => {
  if (!fileData?.data || !fileData?.name) return null;

  const matches = String(fileData.data).match(/^data:(.*?);base64,(.*)$/);
  if (!matches) return null;

  const mime = matches[1] || "application/octet-stream";
  const base64 = matches[2] || "";
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new File([bytes], fileData.name, { type: mime });
};

const normalizeRecord = (item: any) => {
  const normalizeMedications = (record: any) => {
    const candidates =
      record?.medications ||
      record?.prescription_items ||
      record?.prescriptionItems ||
      record?.prescription?.items ||
      record?.data?.prescription?.items ||
      [];

    const list = Array.isArray(candidates) ? candidates : [];

    return list.map((med: any, index: number) => ({
      id: String(med?.id || med?.medication_id || index + 1),
      medicationName: med?.medicationName || med?.medication_name || med?.name || 'دواء',
      dosage: med?.dosage || '',
      frequency: med?.frequency || '',
      duration: med?.duration || '',
      instructions: med?.instructions || '',
    }));
  };

  const attachment =
    item?.attachment ||
    item?.file ||
    (Array.isArray(item?.attachments) ? item.attachments[0] : null) ||
    null;

  const fileUrl = attachment?.file_url || attachment?.url || attachment?.public_url || null;
  const fileName = attachment?.original_name || attachment?.name || "medical-file";
  const mimeType = attachment?.mime_type || attachment?.type || "";
  const source = item?.source || item?.entry_source || "patient_upload";
  const diagnosis = item?.diagnosis || item?.medical_diagnosis || "";
  const chiefComplaint = item?.chief_complaint || item?.chiefComplaint || "";
  const clinicalNotes = item?.clinical_notes || item?.clinicalNotes || "";
  const instructions = item?.instructions || item?.doctor_instructions || "";
  const visitDate = item?.visit_date || item?.visitDate || "";
  const doctorName =
    item?.doctor_name ||
    item?.doctorName ||
    item?.doctor?.name ||
    null;
  const medicationsCount = Number(item?.medications_count || item?.medicationsCount || 0);
  const medications = normalizeMedications(item);

  return {
    id: String(item?.id || item?.record_id || ""),
    createdAt: item?.created_at || item?.createdAt || new Date().toISOString(),
    notes: item?.notes || clinicalNotes || "",
    source,
    doctorName,
    diagnosis,
    chiefComplaint,
    clinicalNotes,
    instructions,
    visitDate,
    medicationsCount: medications.length > 0 ? medications.length : medicationsCount,
    medications,
    files: fileUrl
      ? [
          {
            id: String(attachment?.id || item?.id || "file"),
            name: fileName,
            data: fileUrl,
            type: mimeType.includes("pdf") ? "pdf" : item?.category || "file",
          },
        ]
      : [],
  };
};

export const useMedicalRecords = () => {
  const authContext = useContext(AuthContext) as any;
  const userId = authContext?.user?.id;

  const [files, setFiles] = useState<any[]>([]);
  const [notes, setNotes] = useState("");
  const [records, setRecords] = useState<any[]>([]);

  const addFile = (fileData: { name: string; data: string }, type: string) => {
    const newFile = {
      id: Math.random().toString(36).substr(2, 9),
      ...fileData,
      type,
      date: new Date().toLocaleDateString('ar-EG')
    };
    // Keep exactly one attachment; a new upload replaces the previous one.
    setFiles([newFile]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const saveRecord = async () => {
    if (!userId) {
      throw new Error("User is not authenticated");
    }

    const firstFile = files[0] || null;
    const formData = new FormData();

    if (firstFile) {
      const fileObj = toDataUrlFile({ name: firstFile.name, data: firstFile.data });
      if (fileObj) {
        formData.append("file", fileObj);
      }
      if (firstFile?.type) {
        formData.append("category", firstFile.type);
      }
    }

    if (notes.trim()) {
      formData.append("notes", notes.trim());
    }

    const response = await patientAPI.createMedicalRecord(formData);
    const payload = response?.data || response || {};
    let share = payload?.share || {};

    if (!share?.token) {
      try {
        const rotateResponse = await patientAPI.rotateMedicalRecordsShareToken();
        const rotatePayload = rotateResponse?.data || rotateResponse || {};
        share = {
          token: rotatePayload?.token,
          qr_view_url: rotatePayload?.qr_view_url,
          expires_at: rotatePayload?.expires_at,
        };
      } catch {
        // Keep record creation success even if token rotation fails.
      }
    }

    const createdRecord = normalizeRecord(payload);
    setRecords((prev) => [createdRecord, ...prev.filter((r) => String(r.id) !== String(createdRecord.id))]);

    setFiles([]);
    setNotes("");

    const tokenFromApiUrl = (() => {
      const apiUrl = String(share?.qr_view_url || "");
      const match = apiUrl.match(/\/public\/patients\/([^/]+)\/medical-records/i);
      return match?.[1] || null;
    })();

    const token = share?.token || tokenFromApiUrl || null;
    if (token) {
      try {
        localStorage.setItem('medical_records_share_token', token);
      } catch {
        // Ignore storage failures and continue.
      }
    }
    const qrUrl = token ? `${window.location.origin}/recorded/public/${token}` : share?.qr_view_url || null;

    return {
      id: createdRecord.id,
      token,
      qrUrl,
    };
  };

  const refreshRecords = async (params: any = { page: 1, per_page: 50 }) => {
    const response = await patientAPI.getMedicalRecords(params);
    const list =
      toArray(response?.data) ||
      toArray(response?.data?.data) ||
      toArray(response?.records) ||
      [];

    const normalized = list.map(normalizeRecord).sort((a: any, b: any) => {
      const at = new Date(a?.createdAt || 0).getTime() || 0;
      const bt = new Date(b?.createdAt || 0).getTime() || 0;
      return bt - at;
    });

    setRecords(normalized);
    return normalized;
  };

  const getUserRecords = () => {
    return records;
  };

  const deleteRecordById = async (recordId: string) => {
    try {
      await patientAPI.deleteMedicalRecord(recordId);
      setRecords((prev) => prev.filter((r) => String(r.id) !== String(recordId)));
      return true;
    } catch {
      return false;
    }
  };

  const getLatestRecordId = () => {
    return records[0]?.id || null;
  };

  return {
    files,
    notes,
    setNotes,
    addFile,
    removeFile,
    saveRecord,
    getLatestRecordId,
    getUserRecords,
    refreshRecords,
    deleteRecordById,
  };
};