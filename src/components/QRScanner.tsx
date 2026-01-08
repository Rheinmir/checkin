import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, QrCode } from 'lucide-react';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export const QRScanner = ({ onScan, onClose }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanning = async () => {
    if (!containerRef.current) return;
    
    try {
      setError(null);
      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
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
    } catch (err) {
      console.error('QR Scanner Error:', err);
      setError('Không thể truy cập camera. Vui lòng cấp quyền camera.');
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        // Ignore stop errors
      }
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
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
            {!isScanning && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <Camera size={48} className="mb-3 opacity-50" />
                <p className="text-sm">Nhấn nút bên dưới để bắt đầu quét</p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-center gap-2">
              <CameraOff size={16} />
              {error}
            </div>
          )}

          <p className="text-xs text-gray-400 text-center mt-3">
            Hướng camera vào mã QR để quét
          </p>
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-2">
          {!isScanning ? (
            <button
              onClick={startScanning}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
            >
              <Camera size={16} />
              Bắt đầu quét
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
