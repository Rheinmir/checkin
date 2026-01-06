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
      <table className="w-full text-left border-collapse min-w-[320px]">
        <thead className="sticky top-0 bg-white/95 backdrop-blur z-20 shadow-sm">
          <tr>
            <th className="px-2 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider">ID</th>
            <th className="px-2 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Tên</th>
            <th className="px-2 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Vùng</th>
            <th className="px-2 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Ghi chú</th>
            
            <th className="px-2 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50/40">
              <span className="hidden sm:inline">Trạng thái</span>
              <span className="sm:hidden">Tích</span>
            </th>
            <th className="px-2 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50/40 hidden xs:table-cell">
              <span className="hidden sm:inline">Thời gian</span>
              <span className="sm:hidden">Giờ</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row.id} className="group hover:bg-gray-50/50 transition-colors active:bg-blue-50/30">
                <td className="px-2 sm:px-5 py-2.5 sm:py-3.5 text-[10px] sm:text-xs text-gray-500 font-mono">{row.field1}</td>
                <td className="px-2 sm:px-5 py-2.5 sm:py-3.5 text-[10px] sm:text-xs font-medium text-gray-900 max-w-[100px] sm:max-w-none truncate">{row.field2}</td>
                <td className="px-2 sm:px-5 py-2.5 sm:py-3.5 text-[10px] sm:text-xs text-gray-600 hidden sm:table-cell">{row.field3}</td>
                <td className="px-2 sm:px-5 py-2.5 sm:py-3.5 text-[10px] sm:text-xs text-gray-400 hidden lg:table-cell italic">{row.other}</td>
                
                <td className="px-2 sm:px-5 py-2.5 sm:py-3.5 text-[10px] sm:text-xs bg-white group-hover:bg-gray-50/50 transition-colors border-l border-gray-100/50">
                  {row.checkedIn ? (
                    <div className="flex items-center gap-1 sm:gap-2 text-green-600 font-bold animate-in zoom-in duration-300">
                      <CheckCircle2 size={12} strokeWidth={3} className="sm:w-[14px] sm:h-[14px]" /> 
                      <span className="hidden sm:inline">Đã tích</span>
                      <span className="sm:hidden">✓</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => onCheckin(row.id)}
                      className="flex items-center gap-1 sm:gap-2 text-gray-300 italic hover:text-blue-500 active:text-blue-600 transition-colors py-1 -my-1"
                    >
                      <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 border border-gray-200 rounded-sm hover:border-blue-500"></div>
                      <span className="hidden sm:inline">Check-in</span>
                    </button>
                  )}
                </td>
                
                <td className="px-2 sm:px-5 py-2.5 sm:py-3.5 text-[10px] sm:text-xs font-mono text-gray-500 bg-white group-hover:bg-gray-50/50 transition-colors hidden xs:table-cell">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Clock size={10} className={`sm:w-3 sm:h-3 ${row.checkedIn ? "text-blue-400" : "text-gray-200"}`} />
                    {row.checkinTime}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-2 sm:px-5 py-8 sm:py-10 text-center text-gray-400 text-[10px] sm:text-xs italic">
                Không tìm thấy kết quả phù hợp...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
