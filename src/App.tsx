import { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  Share2, 
  FolderOpen, 
  FileText,
  Upload,
  X,
  Zap
} from 'lucide-react';
import { useCheckin } from './features/checkin/hooks/useCheckin';
import { CheckinTable } from './features/checkin/components/CheckinTable';

const App = () => {
  const { guests, searchQuery, setSearchQuery, handleCheckin, stats, loading } = useCheckin();
  const [showDropzone, setShowDropzone] = useState(false);

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#1D1D1F] font-sans antialiased p-2 md:p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl bg-white/80 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden flex flex-col h-[90vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-white/40 border-b border-gray-200/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
            </div>
            <div className="h-4 w-px bg-gray-300 mx-1"></div>
            <h1 className="font-semibold text-[13px] flex items-center gap-2">
              <UserCheck size={14} className="text-blue-500" />
              Check-in Monitor
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowDropzone(!showDropzone)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
            >
              {showDropzone ? <X size={14} /> : <Upload size={14} />}
              {showDropzone ? 'Đóng' : 'Mở File'}
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium shadow-sm hover:bg-blue-600 active:scale-95 transition-all">
              <Share2 size={14} />
              Đồng bộ MS Share
            </button>
          </div>
        </div>

        {/* Dropzone Area */}
        {showDropzone && (
          <div className="p-4 bg-gray-50/50 border-b border-gray-200 transition-all">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-white/50 hover:border-blue-400 cursor-pointer transition-colors group">
              <FileText size={24} className="text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
              <p className="text-xs font-medium text-gray-600">Thả file Excel vào đây để khởi tạo bảng</p>
            </div>
          </div>
        )}

        {/* Main Workspace */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar */}
          <div className="w-56 border-r border-gray-200/50 bg-[#FBFBFD]/50 overflow-y-auto hidden md:block shrink-0">
            <div className="p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Tệp đang mở</p>
              <div className="space-y-1 mb-8">
                <div className="flex items-center gap-2 p-2 rounded-lg text-xs cursor-default bg-blue-50 text-blue-700 font-medium">
                   <FileText size={14} />
                   <span className="truncate">Danh_sach.xlsx</span>
                </div>
              </div>

               {/* Module Mô phỏng API POST */}
               <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                <p className="text-[10px] font-bold text-blue-500 uppercase mb-2 flex items-center gap-1">
                  <Zap size={10} /> Test API Call
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                   {/* Mock buttons could go here */}
                   <p className="col-span-2 text-[9px] text-gray-400 text-center py-2 italic">Mode: Hybrid API</p>
                </div>
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            
            {/* Search Toolbar */}
            <div className="px-5 py-3 border-b border-gray-100 flex items-center shrink-0">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="text"
                  placeholder="Tìm kiếm theo ID hoặc Tên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-100/80 border-none rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Scrollable Table */}
            {loading ? (
                 <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Đang tải dữ liệu...</div>
            ) : (
                <CheckinTable data={guests} onCheckin={handleCheckin} />
            )}

            {/* Footer */}
            <div className="px-5 py-2.5 border-t border-gray-100 bg-[#FBFBFD] flex items-center justify-between text-[10px] text-gray-400 shrink-0">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 uppercase font-bold text-gray-400">
                  <FolderOpen size={10} /> PATH: //MS-SHARE/LIVE_SYNC
                </span>
                <span className="font-medium text-blue-500">Đã tích: {stats.checkedIn}/{stats.total}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${stats.total > 0 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`}></div>
                API Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
