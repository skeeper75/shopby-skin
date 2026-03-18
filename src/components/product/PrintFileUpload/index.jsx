// @MX:NOTE: PrintFileUpload - 인쇄 파일 업로드 컴포넌트
// SPEC-SKIN-003 TAG-006: S3 Presigned URL 방식 파일 업로드

import React, { useState, useCallback } from 'react';
import { Field, FieldLabel } from '../ui/Field';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Chip } from '../ui/Chip';
import { Icon } from '../ui/Icon';

/**
 * PrintFileUpload Props
 */
interface PrintFileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  sendLater: boolean;
  onSendLaterChange: (checked: boolean) => void;
  maxFiles?: number;
  maxSize?: number; // MB
  allowedTypes?: string[]; // 확장자
}

/**
 * 파일 업로드 상태
 */
interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'done' | 'error';
  error?: string;
  url?: string;
}

/**
 * PrintFileUpload 컴포넌트
 */
const PrintFileUpload = ({
  files,
  onFilesChange,
  sendLater,
  onSendLaterChange,
  maxFiles = 5,
  maxSize = 100, // 100MB
  allowedTypes = ['pdf', 'ai', 'psd'],
}: PrintFileUploadProps) => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgress>>({});
  const [dragOver, setDragOver] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  /**
   * 파일 유효성 검사
   */
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // 확장자 검사
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowedTypes.includes(extension)) {
      return {
        valid: false,
        error: `허용되지 않는 파일 형식입니다. (${allowedTypes.join(', ')}만 가능)`,
      };
    }

    // 크기 검사
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return {
        valid: false,
        error: `파일 크기가 ${maxSize}MB를 초과합니다. (현재: ${fileSizeMB.toFixed(1)}MB)`,
      };
    }

    // 개수 제한 검사
    if (files.length >= maxFiles) {
      return {
        valid: false,
        error: `최대 ${maxFiles}개까지 업로드 가능합니다.`,
      };
    }

    return { valid: true };
  };

  /**
   * S3 Presigned URL 발급
   */
  const getPresignedUrl = async (file: File): Promise<{ url: string; fields: Record<string, string>; fileId: string }> => {
    // 실제 API 호출: POST /custom/files/presigned-url
    // const response = await fetch('/api/custom/files/presigned-url', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     filename: file.name,
    //     contentType: file.type,
    //   }),
    // });
    // return await response.json();

    // 목업 데이터
    return {
      url: `https://mock-s3-bucket.s3.amazonaws.com/${file.name}`,
      fields: {},
      fileId: `file-${Date.now()}`,
    };
  };

  /**
   * S3 직접 업로드
   */
  const uploadToS3 = async (file: File, presignedData: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // 진행률 추적
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: { ...prev[file.name], progress },
          }));
        }
      });

      // 완료
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve();
        } else {
          reject(new Error('업로드 실패'));
        }
      });

      // 에러
      xhr.addEventListener('error', () => {
        reject(new Error('업로드 실패'));
      });

      // 업로드 (PUT 요청)
      xhr.open('PUT', presignedData.url);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  };

  /**
   * 업로드 완료 알림
   */
  const notifyUploadComplete = async (fileId: string): Promise<void> => {
    // 실제 API 호출: POST /custom/files/complete
    // await fetch('/api/custom/files/complete', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ fileId }),
    // });
  };

  /**
   * 파일 선택 핸들러
   */
  const handleFileSelect = useCallback(async (selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles);

    for (const file of fileArray) {
      // 유효성 검사
      const validation = validateFile(file);
      if (!validation.valid) {
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: {
            file,
            progress: 0,
            status: 'error',
            error: validation.error,
          },
        }));
        continue;
      }

      // 업로드 시작
      setUploadProgress((prev) => ({
        ...prev,
        [file.name]: {
          file,
          progress: 0,
          status: 'uploading',
        },
      }));

      try {
        // Presigned URL 발급
        const presignedData = await getPresignedUrl(file);

        // S3 직접 업로드
        await uploadToS3(file, presignedData);

        // 업로드 완료 알림
        await notifyUploadComplete(presignedData.fileId);

        // 성공 상태 업데이트
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: {
            file,
            progress: 100,
            status: 'done',
            url: presignedData.url,
          },
        }));

        // 파일 목록에 추가
        onFilesChange([...files, file]);
      } catch (error) {
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: {
            file,
            progress: 0,
            status: 'error',
            error: '업로드에 실패했습니다.',
          },
        }));
      }
    }
  }, [files, onFilesChange]);

  /**
   * 드래그앤드롭 핸들러
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  };

  /**
   * 파일 제거
   */
  const handleRemoveFile = (file: File) => {
    const newFiles = files.filter((f) => f !== file);
    onFilesChange(newFiles);

    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[file.name];
      return newProgress;
    });
  };

  /**
   * 파일 미리보기
   */
  const openPreview = (file: File) => {
    setPreviewFile(file);
  };

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel>인쇄 파일</FieldLabel>

        {/* 드래그앤드롭 영역 */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? 'border-[--huni-stroke-brand] bg-[--huni-bg-brand-subtle]'
              : 'border-[--huni-stroke-default] hover:border-[--huni-stroke-brand]'
          }`}
        >
          <Icon name="upload-cloud" size={48} className="mx-auto mb-4 text-[--huni-fg-muted]" />

          <p className="text-sm text-[--huni-fg-muted] mb-2">
            파일을 드래그하거나 클릭하여 업로드하세요
          </p>

          <p className="text-xs text-[--huni-fg-muted] mb-4">
            허용 포맷: {allowedTypes.join(', ')} (최대 {maxSize}MB)
          </p>

          <label className="inline-block px-4 py-2 bg-[--huni-bg-brand] text-white rounded-md cursor-pointer hover:bg-[--huni-bg-brand-bold]">
            파일 선택
            <input
              type="file"
              className="hidden"
              multiple
              accept={allowedTypes.map((type) => `.${type}`).join(',')}
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            />
          </label>
        </div>
      </Field>

      {/* 업로드된 파일 목록 */}
      {Object.entries(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="flex items-center gap-3 p-3 bg-white border border-[--huni-stroke-default] rounded-md">
              <Icon name="file" size={20} className="text-[--huni-fg-muted]" />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{fileName}</p>

                {/* 진행률 바 */}
                {progress.status === 'uploading' && (
                  <div className="mt-1">
                    <div className="h-1 bg-[--huni-bg-muted] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[--huni-bg-brand] transition-all"
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-[--huni-fg-muted] mt-1">{progress.progress}%</p>
                  </div>
                )}

                {/* 상태 메시지 */}
                {progress.status === 'done' && (
                  <Chip variant="success" size="sm" className="mt-1">
                    업로드 완료
                  </Chip>
                )}

                {progress.status === 'error' && (
                  <p className="text-xs text-[--huni-fg-error] mt-1">{progress.error}</p>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="flex items-center gap-2">
                {progress.status === 'done' && (
                  <button
                    onClick={() => openPreview(progress.file)}
                    className="text-sm text-[--huni-fg-brand] hover:underline"
                  >
                    미리보기
                  </button>
                )}

                <button
                  onClick={() => handleRemoveFile(progress.file)}
                  className="text-sm text-[--huni-fg-error] hover:underline"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 나중에 보내기 옵션 */}
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          checked={sendLater}
          onCheckedChange={onSendLaterChange}
        />
        <span className="text-sm">나중에 파일을 보내겠습니다</span>
      </label>

      {/* 파일 미리보기 다이얼로그 */}
      {previewFile && (
        <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>파일 미리보기</DialogTitle>
            </DialogHeader>

            <div className="py-4">
              {previewFile.type === 'application/pdf' ? (
                <iframe
                  src={URL.createObjectURL(previewFile)}
                  className="w-full h-[500px] border"
                  title={previewFile.name}
                />
              ) : (
                <div className="text-center py-12 text-[--huni-fg-muted]">
                  이 파일 형식은 미리보기를 지원하지 않습니다.
                  <br />
                  다운로드 후 확인해주세요.
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 bg-[--huni-bg-brand] text-white rounded-md hover:bg-[--huni-bg-brand-bold]"
              >
                닫기
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PrintFileUpload;
