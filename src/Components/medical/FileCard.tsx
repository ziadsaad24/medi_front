import { X, FileText, ImageIcon } from "lucide-react";

export const FileCard = ({ file, onRemove }: { file: any; onRemove: (id: string) => void }) => (
  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
      {file.type === 'pdf' ? <FileText className="text-red-500" /> : <img src={file.data} className="object-cover w-full h-full" alt="" />}
    </div>
    <div className="flex-1 min-w-0 text-right">
      <p className="text-sm font-bold truncate text-slate-800">{file.name}</p>
      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{file.type}</p>
    </div>
    <button onClick={() => onRemove(file.id)} className="text-slate-300 hover:text-red-500 p-1">
      <X size={18} />
    </button>
  </div>
);