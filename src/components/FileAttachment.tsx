// src/components/FileAttachment.tsx
import React from 'react';
import { Download, FileText, Image as ImageIcon } from 'lucide-react';

export interface FileAttachmentProps {
  fileName: string;
  fileSize: number;
  mimeType: string;
  localPath: string;
  onDownload?: (localPath: string) => void;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({
  fileName,
  fileSize,
  mimeType,
  localPath,
  onDownload,
}) => {
  const isImage = mimeType.startsWith('image/');
  const formatSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const handleDownload = () => {
    onDownload?.(localPath);
  };

  if (isImage) {
    // Inline image preview
    return (
      <div className="file-attachment file-attachment-image">
        <img
          src={`file://${localPath}`}
          alt={fileName}
          className="file-attachment-preview"
          loading="lazy"
        />
        <div className="file-attachment-overlay">
          <button
            type="button"
            className="file-attachment-download"
            onClick={handleDownload}
            aria-label={`Download ${fileName}`}
          >
            <Download size={16} />
          </button>
        </div>
      </div>
    );
  }

  const Icon = mimeType === 'application/pdf' ? FileText : ImageIcon;

  return (
    <button
      type="button"
      className="file-attachment file-attachment-generic"
      onClick={handleDownload}
      aria-label={`Download ${fileName}`}
    >
      <Icon size={24} />
      <div className="file-attachment-info">
        <div className="file-attachment-name">{fileName}</div>
        <div className="file-attachment-size">{formatSize(fileSize)}</div>
      </div>
      <Download size={16} className="file-attachment-download-icon" />
    </button>
  );
};

export default FileAttachment;
