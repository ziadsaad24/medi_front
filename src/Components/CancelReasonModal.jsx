import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const CancelReasonModal = ({
  isOpen,
  title,
  description,
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  requireReason = true,
  initialReason = '',
  onConfirm,
  onClose,
}) => {
  const [reason, setReason] = useState(initialReason);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason(initialReason);
      setError('');
    }
  }, [isOpen, initialReason]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const trimmed = reason.trim();
    if (requireReason && !trimmed) {
      setError('سبب الإلغاء مطلوب.');
      return;
    }

    onConfirm(trimmed);
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200" dir="rtl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-lg font-black text-[#0f427d]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          {description && (
            <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">سبب الإلغاء</label>
            <textarea
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                if (error) setError('');
              }}
              rows={4}
              placeholder={requireReason ? 'اكتب سبب الإلغاء هنا...' : 'سبب الإلغاء (اختياري)'}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#0f427d]/50 focus:ring-2 focus:ring-[#0f427d]/10 resize-none"
            />
            {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:brightness-110"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelReasonModal;
