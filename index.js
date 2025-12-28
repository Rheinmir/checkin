import React, { useState, useMemo } from 'react';
import { 
  Upload, 
  Search, 
  ChevronDown, 
  Share2, 
  X, 
  CheckCircle2, 
  MoreHorizontal,
  FolderOpen,
  UserCheck,
  Clock,
  Zap,
  FileText
} from 'lucide-react';

const App = () => {
  const [showDropzone, setShowDropzone] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Danh sách file bên sidebar
  const [files] = useState([
    { id: 1, name: 'Danh_sach_tong_hop.xlsx', status: 'Synced', lastEdit: 'Vừa xong' },
    { id: 2, name: 'Data_khach_hang_01.xlsx', status: 'Pending', lastEdit: '1 giờ trước' },
  ]);

  // Dữ liệu mô phỏng từ file Excel
  const [tableData, setTableData] = useState([
    { id: '1', field1: '00124', field2: 'Nguyễn Văn An', field3: 'Hà Nội', other: 'Khách mời VIP', checkedIn: true, checkinTime: '14:20:05' },
    { id: '2', field1: '00125', field2: 'Trần Thị Bình', field3: 'TP.HCM', other: 'Nhân viên', checkedIn: false, checkinTime: '--:--:--' },
    { id: '3', field1: '00126', field2: 'Lê Văn Cường', field3: 'Đà Nẵng', other: 'Đối tác', checkedIn: true, checkinTime: '15:10:32' },
    { id: '4', field1: '00127', field2: 'Phạm Minh Đức', field3: 'Cần Thơ', other: 'Khách mời', checkedIn: false, checkinTime: '--:--:--' },
    { id: '5', field1: '00128', field2: 'Hoàng Anh Em', field3: 'Hải Phòng', other: 'Khách mời', checkedIn: false, checkinTime: '--:--:--' },
    { id: '6', field1: '00129', field2: 'Đỗ Văn Giang', field3: 'Hà Nội', other: 'Nhân viên', checkedIn: false, checkinTime: '--:--:--' },
    { id: '7', field1: '00130', field2: 'Bùi Thị Hạnh', field3: 'Huế', other: 'Khách mời VIP', checkedIn: false, checkinTime: '--:--:--' },
    { id: '8', field1: '00131', field2: 'Ngô Văn Hùng', field3: 'Bình Dương', other: 'Đối tác', checkedIn: false, checkinTime: '--:--:--' },
  ]);

  // Hàm xử lý Check-in mô phỏng
  const handleCheckinRequest = (id) => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-GB', { hour12: false });
    setTableData(prev => prev.map(item => 
      item.id === id ? { ...item, checkedIn: true, checkinTime: currentTime } : item
    ));
  };

  const filteredData = useMemo(() => {
    return tableData.filter(item => 
      item.field1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.field2.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tableData, searchQuery]);

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
                {files.map(file => (
                  <div key={file.id} className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-default ${file.id === 1 ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-100'}`}>
                    <FileText size={14} />
                    <span className="truncate">{file.name}</span>
                  </div>
                ))}
              </div>

              {/* Module Mô phỏng API POST */}
              <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                <p className="text-[10px] font-bold text-blue-500 uppercase mb-2 flex items-center gap-1">
                  <Zap size={10} /> Test API Call
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {tableData.filter(i => !i.checkedIn).length > 0 ? (
                    tableData.filter(i => !i.checkedIn).slice(0, 6).map(item => (
                      <button 
                        key={item.id}
                        onClick={() => handleCheckinRequest(item.id)}
                        className="py-1 px-2 bg-gray-50 border border-gray-200 text-[10px] rounded-md hover:bg-blue-500 hover:text-white transition-all font-mono active:scale-90"
                      >
                        ID:{item.id}
                      </button>
                    ))
                  ) : (
                    <p className="col-span-2 text-[9px] text-gray-400 text-center py-2 italic">Tất cả đã check-in</p>
                  )}
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
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="sticky top-0 bg-white/95 backdrop-blur z-20 shadow-sm">
                  <tr>
                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Trường 1 (ID)</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Trường 2 (Tên)</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Trường 3 (Vùng)</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Ghi chú</th>
                    
                    {/* Sticky Columns */}
                    <th className="px-5 py-3 text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50/40 sticky right-[120px] shadow-[-2px_0_5px_rgba(0,0,0,0.02)]">
                      Trạng thái
                    </th>
                    <th className="px-5 py-3 text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50/40 sticky right-0 w-[120px] shadow-[-2px_0_5px_rgba(0,0,0,0.02)]">
                      Thời gian
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredData.length > 0 ? (
                    filteredData.map((row) => (
                      <tr key={row.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5 text-xs text-gray-500 font-mono">{row.field1}</td>
                        <td className="px-5 py-3.5 text-xs font-medium text-gray-900">{row.field2}</td>
                        <td className="px-5 py-3.5 text-xs text-gray-600">{row.field3}</td>
                        <td className="px-5 py-3.5 text-xs text-gray-400 hidden lg:table-cell italic">{row.other}</td>
                        
                        {/* Check-in Cố định */}
                        <td className="px-5 py-3.5 text-xs sticky right-[120px] bg-white group-hover:bg-gray-50/50 transition-colors border-l border-gray-100/50">
                          {row.checkedIn ? (
                            <div className="flex items-center gap-2 text-green-600 font-bold animate-in zoom-in duration-300">
                              <CheckCircle2 size={14} strokeWidth={3} /> Đã tích
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-300 italic">
                              <div className="w-3.5 h-3.5 border border-gray-200 rounded-sm"></div> Chờ...
                            </div>
                          )}
                        </td>
                        
                        {/* Thời gian Cố định */}
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
                      <td colSpan="6" className="px-5 py-10 text-center text-gray-400 text-xs italic">
                        Không tìm thấy kết quả phù hợp...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 border-t border-gray-100 bg-[#FBFBFD] flex items-center justify-between text-[10px] text-gray-400 shrink-0">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 uppercase font-bold text-gray-400">
                  <FolderOpen size={10} /> PATH: //MS-SHARE/LIVE_SYNC
                </span>
                <span className="font-medium text-blue-500">Đã tích: {tableData.filter(i => i.checkedIn).length}/{tableData.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${tableData.length > 0 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`}></div>
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