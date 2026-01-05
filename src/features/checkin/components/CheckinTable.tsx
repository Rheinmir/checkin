import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import type { Guest } from '../types';

interface CheckinTableProps {
  data: Guest[];
  onCheckin: (id: string) => void;
}

export const CheckinTable: React.FC<CheckinTableProps> = ({ data, onCheckin }) => {
  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead className="sticky top-0 bg-white/95 backdrop-blur z-20 shadow-sm">
          <tr>
            <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">ID</th>
            <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Tên</th>
            <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Vùng</th>
            <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Ghi chú</th>
            
            <th className="px-5 py-3 text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50/40 sticky right-[120px] shadow-[-2px_0_5px_rgba(0,0,0,0.02)]">
              Trạng thái
            </th>
            <th className="px-5 py-3 text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50/40 sticky right-0 w-[120px] shadow-[-2px_0_5px_rgba(0,0,0,0.02)]">
              Thời gian
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3.5 text-xs text-gray-500 font-mono">{row.field1}</td>
                <td className="px-5 py-3.5 text-xs font-medium text-gray-900">{row.field2}</td>
                <td className="px-5 py-3.5 text-xs text-gray-600">{row.field3}</td>
                <td className="px-5 py-3.5 text-xs text-gray-400 hidden lg:table-cell italic">{row.other}</td>
                
                <td className="px-5 py-3.5 text-xs sticky right-[120px] bg-white group-hover:bg-gray-50/50 transition-colors border-l border-gray-100/50">
                  {row.checkedIn ? (
                    <div className="flex items-center gap-2 text-green-600 font-bold animate-in zoom-in duration-300">
                      <CheckCircle2 size={14} strokeWidth={3} /> Đã tích
                    </div>
                  ) : (
                    <button 
                      onClick={() => onCheckin(row.id)}
                      className="flex items-center gap-2 text-gray-300 italic hover:text-blue-500 transition-colors"
                    >
                      <div className="w-3.5 h-3.5 border border-gray-200 rounded-sm hover:border-blue-500"></div> Check-in
                    </button>
                  )}
                </td>
                
                <td className="px-5 py-3.5 text-xs font-mono text-gray-500 sticky right-0 bg-white group-hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className={row.checkedIn ? "text-blue-400" : "text-gray-200"} />
                    {row.checkinTime}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-xs italic">
                Không tìm thấy kết quả phù hợp...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
