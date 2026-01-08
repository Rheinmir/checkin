import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { Camera, CameraOff, QrCode, Loader2, AlertTriangle } from 'lucide-react';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export const QRScanner = ({ onScan, onClose }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);

  const startScanning = async () => {
    if (!containerRef.current || isStarting || isScanning) return;
    
    // Check if HTTPS is required (mobile browsers)
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    if (!isSecure) {
      setError('Camera yêu cầu kết nối HTTPS. Vui lòng truy cập trang web qua HTTPS.');
      return;
    }

    try {
      setError(null);
      setIsStarting(true);
      
      // Check camera permission first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        // Stop the test stream immediately
        stream.getTracks().forEach(track => track.stop());
      } catch (permErr) {
        console.error('Camera permission error:', permErr);
        if (permErr instanceof Error) {
          if (permErr.name === 'NotAllowedError') {
            setError('Bạn đã từ chối quyền camera. Vui lòng cấp quyền trong cài đặt trình duyệt và tải lại trang.');
          } else if (permErr.name === 'NotFoundError') {
            setError('Không tìm thấy camera trên thiết bị này.');
          } else {
            setError(`Lỗi camera: ${permErr.message}`);
          }
        }
        setIsStarting(false);
        return;
      }

      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanning();
        },
        () => {
          // Ignore scan errors (no QR found in frame)
        }
      );
      
      setIsScanning(true);
      setIsStarting(false);
    } catch (err) {
      console.error('QR Scanner Error:', err);
      let errorMessage = 'Không thể khởi động camera.';
      if (err instanceof Error) {
        errorMessage = `Lỗi: ${err.message}`;
      }
      setError(errorMessage);
      setIsStarting(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === Html5QrcodeScannerState.SCANNING || state === Html5QrcodeScannerState.PAUSED) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (e) {
        console.warn('Stop scanning error:', e);
      }
    }
    setIsScanning(false);
    setIsStarting(false);
  };

  // Auto-start camera when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        startScanning();
      }
    }, 300);
    
    return () => {
      clearTimeout(timer);
      stopScanning();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode size={20} className="text-blue-500" />
            <h2 className="font-semibold text-gray-800">Quét mã QR</h2>
          </div>
          <button
            onClick={() => {
              stopScanning();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            ✕
          </button>
        </div>

        {/* Scanner Area */}
        <div className="p-5">
          <div 
            ref={containerRef}
            id="qr-reader" 
            className="w-full aspect-square bg-gray-100 rounded-xl overflow-hidden relative"
          >
            {/* Loading/Starting state */}
            {isStarting && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-100 z-10">
                <Loader2 size={48} className="mb-3 animate-spin text-blue-500" />
                <p className="text-sm font-medium">Đang khởi động camera...</p>
                <p className="text-xs text-gray-400 mt-1">Vui lòng chờ và cấp quyền nếu được hỏi</p>
              </div>
            )}
            {/* Idle state - camera not started yet */}
            {!isScanning && !isStarting && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <Camera size={48} className="mb-3 opacity-50" />
                <p className="text-sm">Camera đang được khởi động...</p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-start gap-2">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Không thể truy cập camera</p>
                <p className="text-xs mt-1">{error}</p>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400 text-center mt-3">
            {isScanning ? 'Hướng camera vào mã QR để quét' : 'Đảm bảo bạn đã cấp quyền camera'}
          </p>
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-2">
          {isStarting ? (
            <button
              disabled
              className="flex-1 py-3 bg-gray-300 text-gray-500 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Loader2 size={16} className="animate-spin" />
              Đang khởi động...
            </button>
          ) : !isScanning ? (
            <button
              onClick={startScanning}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
            >
              <Camera size={16} />
              Thử lại
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
            >
              <CameraOff size={16} />
              Dừng quét
            </button>
          )}
          <button
            onClick={() => {
              stopScanning();
              onClose();
            }}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-medium text-sm transition-colors active:scale-[0.98]"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
