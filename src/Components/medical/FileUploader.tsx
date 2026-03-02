import React, { useRef } from "react";
import { Upload, Camera } from "lucide-react";

interface FileUploaderProps {
  onUpload: (file: { name: string; data: string }) => void;
  activeTab: string;
}

export const FileUploader = ({ onUpload, activeTab }: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload({ name: file.name, data: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      onClick={() => fileInputRef.current?.click()}
      className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer group"
    >
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
        {activeTab === "prescription" ? <Camera size={28} /> : <Upload size={28} />}
      </div>
      <p className="font-bold text-slate-700">اضغط لرفع {activeTab === "prescription" ? "صورة الروشتة" : "المستند"}</p>
      <p className="text-slate-400 text-xs mt-2">يدعم الصور وملفات PDF</p>
      <input 
        type="file" 
        ref={fileInputRef} 
        hidden 
        onChange={handleFile} 
        accept={activeTab === "pdf" ? ".pdf" : "image/*"} 
        capture={activeTab === "prescription" ? "environment" : undefined} 
      />
    </div>
  );
};