// src/components/FileUpload.tsx
import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  onUploadComplete?: (fileUrl: string, filename: string) => void;
  className?: string;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
}

/**
 * File upload component with drag-and-drop support
 */
const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onUploadComplete,
  className = '',
  disabled = false,
  accept = '*/*',
  maxSize = 10 * 1024 * 1024, // 10MB default
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError(null);

    // Check file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    if (onFileSelect) {
      onFileSelect(file);
    }

    // Simulate file upload to public URL
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate a mock public URL (in real app, this would be an actual upload)
      const fileUrl = `https://public.example.com/files/${Date.now()}_${file.name}`;
      const filename = file.name;

      if (onUploadComplete) {
        onUploadComplete(fileUrl, filename);
      }
    } catch (err) {
      setError('Failed to upload file');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (file) {
        handleFileSelect(file);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file) {
        handleFileSelect(file);
      }
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`file-upload ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging 
            ? 'border-primary bg-primary/10' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${uploading ? 'border-primary bg-primary/5' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-gray-600 mb-1">
              {isDragging ? 'Drop file here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">
              {accept !== '*/*' && `${accept} • `}
              Max size: {formatFileSize(maxSize)}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
