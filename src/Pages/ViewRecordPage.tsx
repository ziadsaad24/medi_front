import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, Calendar, User, Download, ClipboardCheck } from "lucide-react";

export default function ViewRecordPage() {
  const { recordId } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem(recordId || "");
    if (stored) setData(JSON.parse(stored));
  }, [recordId]);

  if (!data) return <div className="h-screen flex items-center justify-center font-bold">جاري تحميل السجل الطبي...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6" dir="rtl">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <User size={30} />
          </div>
          <div className="text-right">
            <h1 className="text-xl font-black text-slate-900">ملف طبي رقمي</h1>
            <p className="text-slate-400 text-sm flex items-center gap-1"><Calendar size={14}/> {new Date(data.createdAt).toLocaleDateString('ar-EG')}</p>
          </div>
        </div>

        {data.notes && (
          <div className="space-y-3 text-right">
            <h3 className="font-bold text-slate-800 pr-2 flex items-center gap-2 flex-row-reverse"><ClipboardCheck size={18} className="text-blue-500"/> الملاحظات الطبية</h3>
            <div className="bg-blue-600 text-white p-6 rounded-[2rem] shadow-lg leading-relaxed shadow-blue-200">
              {data.notes}
            </div>
          </div>
        )}

        <div className="space-y-4 text-right">
          <h3 className="font-bold text-slate-800 pr-2">المرفقات والملفات ({data.files.length})</h3>
          {data.files.map((file: any) => (
            <div key={file.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group">
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
          ))}
        </div>
      </div>
    </div>
  );
}