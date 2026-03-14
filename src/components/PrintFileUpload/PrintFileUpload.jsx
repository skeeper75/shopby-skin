import React, { useState, useRef, useCallback } from 'react';

import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

// 인쇄용 디자인 파일 허용 포맷
const ALLOWED_FORMATS = ['pdf', 'ai', 'psd', 'jpg', 'jpeg', 'png'];

// 기본 최대 파일 크기: 100MB
const DEFAULT_MAX_FILE_SIZE = 100 * 1024 * 1024;

// 파일 크기를 사람이 읽을 수 있는 문자열로 변환
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, unitIndex)).toFixed(1);

  return `${size} ${units[unitIndex]}`;
};

// 파일 확장자 추출
const getFileExtension = (fileName) => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

// 파일 포맷 검증
const isAllowedFormat = (fileName) => {
  const ext = getFileExtension(fileName);
  return ALLOWED_FORMATS.includes(ext);
};

/**
 * 인쇄용 디자인 파일 업로드 컴포넌트
 *
 * 드래그 앤 드롭 또는 클릭으로 파일을 업로드할 수 있습니다.
 * 지원 포맷: PDF, AI, PSD, JPG, PNG
 *
 * @param {Object} props
 * @param {Function} props.onFilesChange - 파일 목록이 변경될 때 호출되는 콜백
 * @param {number} props.maxSize - 최대 파일 크기 (바이트, 기본값: 100MB)
 * @param {boolean} props.multiple - 다중 파일 업로드 허용 여부 (기본값: true)
 * @param {number} props.maxFiles - 최대 파일 개수 (기본값: 10)
 * @param {string} props.className - 추가 CSS 클래스
 */
// @MX:NOTE: [AUTO] [PrintFileUpload] 인쇄 파일 업로드 컴포넌트 - 드래그앤드롭, 파일 검증(100MB, PDF/AI/PSD/JPG/PNG), 진행률 표시
const PrintFileUpload = ({
  onFilesChange,
  maxSize = DEFAULT_MAX_FILE_SIZE,
  multiple = true,
  maxFiles = 10,
  className,
}) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);
  const inputRef = useRef(null);
  const dragCounterRef = useRef(0);

  // 파일 검증
  const validateFiles = useCallback(
    (newFiles) => {
      const validationErrors = [];
      const validFiles = [];

      for (const file of newFiles) {
        // 포맷 검증
        if (!isAllowedFormat(file.name)) {
          const ext = getFileExtension(file.name);
          validationErrors.push(
            `"${file.name}": .${ext || '(확장자 없음)'} 형식은 지원하지 않습니다. (지원 포맷: ${ALLOWED_FORMATS.map((f) => `.${f.toUpperCase()}`).join(', ')})`
          );
          continue;
        }

        // 파일 크기 검증
        if (file.size > maxSize) {
          validationErrors.push(
            `"${file.name}": 파일 크기(${formatFileSize(file.size)})가 최대 허용 크기(${formatFileSize(maxSize)})를 초과합니다.`
          );
          continue;
        }

        // 중복 파일 검증
        const isDuplicate = files.some(
          (existingFile) => existingFile.file.name === file.name && existingFile.file.size === file.size
        );
        if (isDuplicate) {
          validationErrors.push(`"${file.name}": 이미 업로드된 파일입니다.`);
          continue;
        }

        validFiles.push(file);
      }

      // 최대 파일 개수 검증
      const totalCount = files.length + validFiles.length;
      if (totalCount > maxFiles) {
        const allowedCount = maxFiles - files.length;
        validationErrors.push(`최대 ${maxFiles}개까지 업로드 가능합니다. (현재 ${files.length}개 업로드됨)`);
        validFiles.splice(allowedCount);
      }

      return { validFiles, validationErrors };
    },
    [files, maxSize, maxFiles]
  );

  // 업로드 진행률 시뮬레이션 (실제 API 연동 시 교체)
  const simulateUploadProgress = useCallback((fileId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress((prev) => ({
          ...prev,
          [fileId]: { percent: 100, status: 'complete' },
        }));
      } else {
        setUploadProgress((prev) => ({
          ...prev,
          [fileId]: { percent: Math.min(progress, 99), status: 'uploading' },
        }));
      }
    }, 200 + Math.random() * 300);

    return interval;
  }, []);

  // 파일 추가 처리
  const handleFilesAdd = useCallback(
    (newFiles) => {
      const fileArray = Array.from(newFiles);
      const { validFiles, validationErrors } = validateFiles(fileArray);

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        // 3초 후 에러 메시지 자동 제거
        setTimeout(() => setErrors([]), 5000);
      }

      if (validFiles.length === 0) return;

      const newFileEntries = validFiles.map((file) => {
        const fileId = `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        return {
          id: fileId,
          file,
          name: file.name,
          size: file.size,
          extension: getFileExtension(file.name),
        };
      });

      // 업로드 진행률 시작
      const intervals = {};
      for (const entry of newFileEntries) {
        intervals[entry.id] = simulateUploadProgress(entry.id);
      }

      setFiles((prev) => {
        const updated = [...prev, ...newFileEntries];
        onFilesChange?.(updated);
        return updated;
      });
    },
    [validateFiles, simulateUploadProgress, onFilesChange]
  );

  // 파일 제거
  const handleFileRemove = useCallback(
    (fileId) => {
      setFiles((prev) => {
        const updated = prev.filter((f) => f.id !== fileId);
        onFilesChange?.(updated);
        return updated;
      });
      setUploadProgress((prev) => {
        const updated = { ...prev };
        delete updated[fileId];
        return updated;
      });
    },
    [onFilesChange]
  );

  // 드래그 이벤트 핸들러
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (dragCounterRef.current === 1) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current = 0;
      setIsDragging(false);

      const { files: droppedFiles } = e.dataTransfer;
      if (droppedFiles?.length > 0) {
        handleFilesAdd(droppedFiles);
      }
    },
    [handleFilesAdd]
  );

  // input change 핸들러
  const handleInputChange = useCallback(
    (e) => {
      const { files: selectedFiles } = e.target;
      if (selectedFiles?.length > 0) {
        handleFilesAdd(selectedFiles);
      }
      // input 값 초기화 (같은 파일 재선택 가능하도록)
      e.target.value = '';
    },
    [handleFilesAdd]
  );

  // accept 속성을 위한 MIME 타입 매핑
  const acceptString = ALLOWED_FORMATS.map((fmt) => {
    const mimeMap = {
      pdf: '.pdf',
      ai: '.ai',
      psd: '.psd',
      jpg: '.jpg',
      jpeg: '.jpeg',
      png: '.png',
    };
    return mimeMap[fmt] || `.${fmt}`;
  }).join(',');

  // 업로드 진행 상태 계산
  const getProgressInfo = (fileId) => {
    const progress = uploadProgress[fileId];
    if (!progress) return { percent: 0, status: 'pending' };
    return progress;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* 드롭 존 */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-label="파일 업로드 영역. 클릭하거나 파일을 드래그하여 업로드하세요."
      >
        {/* 업로드 아이콘 */}
        <svg
          className={cn(
            'mx-auto h-12 w-12 transition-colors duration-200',
            isDragging ? 'text-primary' : 'text-gray-400'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>

        <p className="mt-3 text-sm text-gray-600">
          {isDragging ? (
            <span className="text-primary font-semibold">여기에 파일을 놓으세요</span>
          ) : (
            <>
              인쇄용 디자인 파일을 드래그하거나{' '}
              <span className="text-primary font-medium underline underline-offset-2">클릭</span>하여 업로드
            </>
          )}
        </p>

        <p className="mt-1 text-xs text-gray-500">최대 {formatFileSize(maxSize)} / 파일당</p>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={acceptString}
          multiple={multiple}
          onChange={handleInputChange}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {/* 지원 포맷 뱃지 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500">지원 포맷:</span>
        {ALLOWED_FORMATS.filter((fmt) => fmt !== 'jpeg').map((format) => (
          <Badge key={format} variant="secondary" className="text-[10px] px-1.5 py-0.5">
            .{format.toUpperCase()}
          </Badge>
        ))}
      </div>

      {/* 에러 메시지 */}
      {errors.length > 0 && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 space-y-1" role="alert">
          {errors.map((error, index) => (
            <p key={index} className="text-xs text-destructive flex items-start gap-1.5">
              <svg
                className="h-3.5 w-3.5 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <span>{error}</span>
            </p>
          ))}
        </div>
      )}

      {/* 업로드된 파일 목록 */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-medium">
            업로드된 파일 ({files.length}/{maxFiles})
          </p>
          <ul className="space-y-2" role="list" aria-label="업로드된 파일 목록">
            {files.map((fileEntry) => {
              const { percent, status } = getProgressInfo(fileEntry.id);
              const isUploading = status === 'uploading';
              const isComplete = status === 'complete';

              return (
                <li
                  key={fileEntry.id}
                  className="flex items-center gap-3 rounded-md border bg-white p-3 shadow-sm"
                >
                  {/* 파일 아이콘 */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gray-100">
                    <span className="text-[10px] font-bold uppercase text-gray-500">
                      {fileEntry.extension}
                    </span>
                  </div>

                  {/* 파일 정보 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{fileEntry.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(fileEntry.size)}</p>

                    {/* 진행률 바 */}
                    {(isUploading || (isComplete && percent === 100)) && (
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-300',
                            isComplete ? 'bg-green-500' : 'bg-primary'
                          )}
                          style={{ width: `${percent}%` }}
                          role="progressbar"
                          aria-valuenow={Math.round(percent)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${fileEntry.name} 업로드 진행률`}
                        />
                      </div>
                    )}
                  </div>

                  {/* 상태 표시 및 삭제 버튼 */}
                  <div className="shrink-0 flex items-center gap-2">
                    {isUploading && (
                      <span className="text-xs text-gray-400">{Math.round(percent)}%</span>
                    )}
                    {isComplete && (
                      <svg
                        className="h-4 w-4 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-label="업로드 완료"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileRemove(fileEntry.id);
                      }}
                      aria-label={`${fileEntry.name} 삭제`}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

PrintFileUpload.displayName = 'PrintFileUpload';

export default PrintFileUpload;
