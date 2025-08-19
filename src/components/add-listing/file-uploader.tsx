
'use client';

import { useState, useCallback } from 'react';
import { useDropzone, FileRejection, DropEvent } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
}

export function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
    const newFiles = [...files, ...acceptedFiles];
    setFiles(newFiles);
    onFileSelect(newFiles);

    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  }, [files, onFileSelect]);

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    onFileSelect(newFiles);
    URL.revokeObjectURL(previews[index]); // Clean up memory
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div>
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-input hover:border-primary/50'
            }`}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Upload className="w-8 h-8" />
            {isDragActive ? (
                <p>Drop the files here ...</p>
            ) : (
                <p>Drag & drop some files here, or click to select files</p>
            )}
            <p className="text-xs">PNG, JPG, GIF up to 5MB</p>
            </div>
      </div>

      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group aspect-square">
              <Image
                src={preview}
                alt={`Preview ${index}`}
                width={150}
                height={150}
                onLoad={() => { /* URL.revokeObjectURL(preview) is handled in removeFile now */ }}
                className="w-full h-full object-cover rounded-lg"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                    e.stopPropagation(); // prevent opening file dialog
                    removeFile(index)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
