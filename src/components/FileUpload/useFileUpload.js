import { useState, useCallback } from 'react';

// @MX:NOTE: [AUTO] 파일 업로드 로직 - /custom/files 모의 API, 진행률 시뮬레이션
const ALLOWED_TYPES = ['application/pdf', 'application/illustrator', 'image/vnd.adobe.photoshop', 'image/jpeg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.pdf', '.ai', '.psd', '.jpg', '.jpeg', '.png'];
const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const getExtension = (filename) => {
  const idx = filename.lastIndexOf('.');
  return idx >= 0 ? filename.substring(idx).toLowerCase() : '';
};

const validateFile = (file) => {
  const ext = getExtension(file.name);
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return `${ext} 형식은 지원하지 않습니다. (PDF/AI/PSD/JPG/PNG 가능)`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `파일 크기가 ${MAX_FILE_SIZE_MB}MB를 초과합니다.`;
  }
  return null;
};

const simulateUpload = (file, onProgress) =>
  new Promise((resolve, reject) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        onProgress(100);
        resolve({
          fileKey: `file_${Date.now()}_${file.name}`,
          fileName: file.name,
          fileSize: file.size,
        });
      } else {
        onProgress(Math.floor(progress));
      }
    }, 200);
  });

const useFileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const addFiles = useCallback(async (newFiles) => {
    const validFiles = [];
    const errors = [];

    for (const file of newFiles) {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    if (validFiles.length === 0) return;

    setUploading(true);

    const uploadResults = await Promise.all(
      validFiles.map((file) => {
        const id = `${Date.now()}_${Math.random()}`;
        setFiles((prev) => [...prev, { id, name: file.name, size: file.size, progress: 0, status: 'uploading' }]);

        return simulateUpload(file, (progress) => {
          setFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, progress } : f))
          );
        }).then((result) => {
          setFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, ...result, progress: 100, status: 'done' } : f))
          );
          return result;
        }).catch(() => {
          setFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, status: 'error' } : f))
          );
        });
      })
    );

    setUploading(false);
    return uploadResults.filter(Boolean);
  }, []);

  const removeFile = useCallback((id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return { files, uploading, addFiles, removeFile };
};

export default useFileUpload;
