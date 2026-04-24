import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function UploadZone({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFiles(files[0]);
    }
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      await handleFiles(files[0]);
    }
  };

  const handleFiles = async (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    setIsUploading(true);
    try {
      await onUpload(file);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`upload-zone ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isUploading && fileInputRef.current.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      {isUploading ? (
        <div className="upload-status">
          <Loader2 className="spinner" size={32} />
          <p>Uploading screenshot...</p>
        </div>
      ) : (
        <div className="upload-prompt">
          <div className="icon-stack">
            <Upload className="upload-icon" size={24} />
            <ImageIcon className="image-icon" size={32} />
          </div>
          <h3>Drop screenshot or tap to upload</h3>
          <p>Supports PNG, JPG, WEBP</p>
        </div>
      )}

      <style>{`
        .upload-zone {
          border: 2px dashed var(--color-border);
          background: var(--color-bg-warm);
          border-radius: var(--radius-card);
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .upload-zone.dragging {
          border-color: var(--color-accent);
          background: rgba(0, 117, 222, 0.04);
          transform: scale(1.02);
        }
        .upload-zone.uploading {
          cursor: default;
        }
        .upload-prompt, .upload-status {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-8);
          text-align: center;
        }
        .icon-stack {
          position: relative;
          margin-bottom: var(--space-8);
        }
        .image-icon { color: var(--color-text-muted); }
        .upload-icon {
          position: absolute;
          top: -10px;
          right: -10px;
          color: var(--color-accent);
          background: white;
          border-radius: 50%;
        }
        .upload-zone h3 {
          font-size: 16px;
          font-weight: 600;
        }
        .upload-zone p {
          font-size: 14px;
          color: var(--color-text-muted);
        }
        .spinner {
          animation: spin 1s linear infinite;
          color: var(--color-accent);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
