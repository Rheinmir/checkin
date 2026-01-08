import { useState, useRef, useCallback } from 'react';
import { 
  UserCheck, 
  Search, 
  Share2, 
  FolderOpen, 
  FileText,
  Upload,
  X,
  Zap,
  Download,
  ScanLine
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useCheckin } from './features/checkin/hooks/useCheckin';
import { CheckinTable } from './features/checkin/components/CheckinTable';
import { QRScanner } from './components/QRScanner';
import type { Guest } from './features/checkin/types';

const App = () => {
  const { guests, searchQuery, setSearchQuery, handleCheckin, stats, loading, setGuests } = useCheckin();
  const [showDropzone, setShowDropzone] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle QR scan result - search for the scanned ID and check-in
  const handleQRScan = useCallback((scannedData: string) => {
    // Try to find guest by ID (field1) or name (field2)
    const guest = guests.find(
      g => g.field1.toLowerCase() === scannedData.toLowerCase() ||
           g.field2.toLowerCase() === scannedData.toLowerCase() ||
           g.id === scannedData
    );
    
    if (guest) {
      if (!guest.checkedIn) {
        handleCheckin(guest.id);
        alert(`✓ Check-in thành công: ${guest.field2}`);
      } else {
        alert(`⚠ ${guest.field2} đã check-in rồi!`);
      }
    } else {
      alert(`✕ Không tìm thấy khách với mã: ${scannedData}`);
    }
    setShowQRScanner(false);
  }, [guests, handleCheckin]);

  const processExcelFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);
        
        // Map Excel data to Guest format
        const guests: Guest[] = jsonData.map((row, index) => {
          const keys = Object.keys(row);
          return {
            id: String(index + 1),
            field1: String(row[keys[0]] || ''),
            field2: String(row[keys[1]] || ''),
            field3: String(row[keys[2]] || ''),
            other: String(row[keys[3]] || ''),
            checkedIn: false,
            checkinTime: '--:--:--'
          };
        });
        
        setGuests(guests);
        setUploadedFileName(file.name);
        setShowDropzone(false);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Không thể đọc file Excel. Vui lòng kiểm tra định dạng file.');
      }
    };
    reader.readAsArrayBuffer(file);
  }, [setGuests]);

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      processExcelFile(file);
    } else {
      alert('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
    }
  }, [processExcelFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const handleDownload = useCallback(() => {
    if (guests.length === 0) {
      alert('Không có dữ liệu để tải về!');
      return;
    }
    
    // Prepare data for Excel
    const exportData = guests.map(g => ({
      'ID': g.field1,
      'Tên': g.field2,
      'Vùng': g.field3,
      'Ghi chú': g.other,
      'Trạng thái': g.checkedIn ? 'Đã check-in' : 'Chưa check-in',
      'Thời gian': g.checkinTime
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách');
    
    // Generate filename with timestamp
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `checkin_${timestamp}.xlsx`);
  }, [guests]);

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#1D1D1F] font-sans antialiased p-1 sm:p-2 md:p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl bg-white/80 backdrop-blur-2xl rounded-xl sm:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden flex flex-col h-[98vh] sm:h-[95vh] md:h-[90vh]">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-5 py-2 sm:py-3 bg-white/40 border-b border-gray-200/50 shrink-0 gap-2 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
            </div>
            <div className="hidden sm:block h-4 w-px bg-gray-300 mx-1"></div>
            <h1 className="font-semibold text-[12px] sm:text-[13px] flex items-center gap-1.5 sm:gap-2">
              <UserCheck size={14} className="text-blue-500" />
              Check-in
            </h1>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setShowDropzone(!showDropzone)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
            >
              {showDropzone ? <X size={12} /> : <Upload size={12} />}
              <span className="hidden xs:inline">{showDropzone ? 'Đóng' : 'Mở File'}</span>
              <span className="xs:hidden">{showDropzone ? 'X' : 'File'}</span>
            </button>
            <button 
              onClick={handleDownload}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium bg-green-500 text-white border border-green-600 hover:bg-green-600 transition-all shadow-sm active:scale-95"
            >
              <Download size={12} />
              <span className="hidden xs:inline">Tải về</span>
              <span className="xs:hidden">↓</span>
            </button>
            <button 
              onClick={() => setShowQRScanner(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium bg-purple-500 text-white border border-purple-600 hover:bg-purple-600 transition-all shadow-sm active:scale-95"
            >
              <ScanLine size={12} />
              <span className="hidden xs:inline">Quét QR</span>
              <span className="xs:hidden">QR</span>
            </button>
            <button className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-blue-500 text-white rounded-lg text-[11px] sm:text-xs font-medium shadow-sm hover:bg-blue-600 active:scale-95 transition-all">
              <Share2 size={12} />
              <span className="hidden sm:inline">Đồng bộ MS Share</span>
              <span className="sm:hidden">Sync</span>
            </button>
          </div>
        </div>

        {/* Dropzone Area */}
        {showDropzone && (
          <div className="p-2 sm:p-4 bg-gray-50/50 border-b border-gray-200 transition-all">
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50/50' 
                  : 'border-gray-300 bg-white/50 hover:border-blue-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              <FileText size={20} className={`mb-2 transition-colors ${isDragging ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'}`} />
              <p className="text-[11px] sm:text-xs font-medium text-gray-600 text-center">
                {isDragging ? 'Thả file vào đây!' : 'Kéo thả hoặc click chọn file Excel'}
              </p>
              {uploadedFileName && (
                <p className="text-[10px] sm:text-xs text-green-600 mt-2 truncate max-w-full">File: {uploadedFileName}</p>
              )}
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
            <div className="px-2 sm:px-5 py-2 sm:py-3 border-b border-gray-100 flex items-center shrink-0">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-2 sm:left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 sm:pl-8 pr-2 sm:pr-3 py-1.5 bg-gray-100/80 border-none rounded-lg text-[11px] sm:text-xs outline-none focus:ring-2 focus:ring-blue-100 transition-all"
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
            <div className="px-2 sm:px-5 py-2 sm:py-2.5 border-t border-gray-100 bg-[#FBFBFD] flex items-center justify-between text-[9px] sm:text-[10px] text-gray-400 shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="hidden sm:flex items-center gap-1 uppercase font-bold text-gray-400">
                  <FolderOpen size={10} /> PATH: //MS-SHARE/LIVE_SYNC
                </span>
                <span className="font-medium text-blue-500">✓ {stats.checkedIn}/{stats.total}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${stats.total > 0 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`}></div>
                <span className="hidden sm:inline">API Active</span>
                <span className="sm:hidden">OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner 
          onScan={handleQRScan}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
};

export default App;
