import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FileText, Calendar, User, Download, ClipboardCheck, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { patientAPI } from "../services/api";

const toArray = (value: any) => {
  if (Array.isArray(value)) return value;
  return [];
};

const normalizeRecord = (item: any) => {
  const attachment =
    item?.attachment ||
    item?.file ||
    (Array.isArray(item?.attachments) ? item.attachments[0] : null) ||
    null;

  const fileUrl = attachment?.file_url || attachment?.url || attachment?.public_url || null;

  return {
    id: String(item?.id || item?.record_id || ""),
    createdAt: item?.created_at || item?.createdAt || new Date().toISOString(),
    notes: item?.notes || item?.clinical_notes || "",
    files: fileUrl
      ? [
          {
            id: String(attachment?.id || item?.id || "file"),
            name: attachment?.original_name || attachment?.name || "medical-file",
            data: fileUrl,
            type: (attachment?.mime_type || "").includes("pdf") ? "pdf" : item?.category || "file",
          },
        ]
      : [],
  };
};

export default function ViewRecordPage() {
  const { recordId, token } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isPublicView = Boolean(token);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        if (token) {
          const response = await patientAPI.getPublicPatientRecordsByToken(token);
          const payload = response?.data || response || {};
          const list = toArray(payload?.records || payload?.data?.records || payload?.timeline || []);

          if (isMounted) {
            setData({
              mode: "public",
              patient: payload?.patient || payload?.data?.patient || null,
              records: list.map(normalizeRecord),
            });
          }
          return;
        }

        if (recordId) {
          const response = await patientAPI.getMedicalRecord(recordId);
          const payload = response?.data || response || {};

          if (isMounted) {
            setData({
              mode: "private",
              patient: null,
              records: [normalizeRecord(payload)],
            });
          }
        }
      } catch (err: any) {
        if (!isMounted) return;
        const status = err?.response?.status;
        if (status === 404) {
          setError("السجل غير موجود أو الرابط غير صالح.");
        } else if (status === 410) {
          setError("رابط السجل غير نشط أو منتهي الصلاحية.");
        } else {
          setError("تعذر تحميل السجل الطبي حالياً.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [recordId, token]);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold">جاري تحميل السجل الطبي...</div>;
  if (error) return <div className="h-screen flex items-center justify-center font-bold text-rose-600">{error}</div>;

  const records = data?.records || [];
  const firstRecord = records[0] || null;

  if (!firstRecord && !isPublicView) {
    return <div className="h-screen flex items-center justify-center font-bold">لا يوجد بيانات للسجل المطلوب.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6" dir="rtl">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <User size={30} />
          </div>
          <div className="text-right">
            <h1 className="text-xl font-black text-slate-900">ملف طبي رقمي</h1>
            <p className="text-slate-400 text-sm flex items-center gap-1"><Calendar size={14}/> {new Date(firstRecord?.createdAt || Date.now()).toLocaleDateString('ar-EG')}</p>
            {isPublicView && data?.patient?.name && (
              <p className="text-slate-500 text-xs mt-1">المريض: {data.patient.name}</p>
            )}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-sm font-bold text-right">
          هذه الصفحة للعرض فقط (View-Only) عبر الرابط أو QR. التعديل والحذف متاحان فقط من صفحة سجلاتي الطبية.
        </div>

        {user && !isPublicView && (
          <div className="flex justify-end">
            <Link
              to="/patient/home"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-bold"
            >
              <Home size={16} />
              العودة للرئيسية
            </Link>
          </div>
        )}

        {firstRecord?.notes && (
          <div className="space-y-3 text-right">
            <h3 className="font-bold text-slate-800 pr-2 flex items-center gap-2 flex-row-reverse"><ClipboardCheck size={18} className="text-blue-500"/> الملاحظات الطبية</h3>
            <div className="bg-blue-600 text-white p-6 rounded-[2rem] shadow-lg leading-relaxed shadow-blue-200">
              {firstRecord.notes}
            </div>
          </div>
        )}

        <div className="space-y-4 text-right">
          <h3 className="font-bold text-slate-800 pr-2">المرفقات والملفات ({records.reduce((acc: number, rec: any) => acc + (rec.files?.length || 0), 0)})</h3>
          {records.map((rec: any) =>
            rec.files.map((file: any) => (
              <div key={`${rec.id}-${file.id}`} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group">
                <div className="flex items-center gap-4 flex-row-reverse">
                   <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                      {file.type === 'pdf' ? <FileText className="text-slate-400" size={24} /> : <img src={file.data} className="w-full h-full object-cover" alt="" />}
                   </div>
                   <div className="text-right">
                      <p className="font-bold text-slate-700">{file.name}</p>
                      <p className="text-xs text-slate-400 uppercase">{file.type}</p>
                   </div>
                </div>
                <a href={file.data} download={file.name} className="p-3 bg-slate-50 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                  <Download size={20} />
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}