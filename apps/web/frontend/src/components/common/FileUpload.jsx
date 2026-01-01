import React, { useRef } from 'react'
import { Upload, File, X } from 'lucide-react'

export const FileUpload = ({ 
  file, 
  onFileSelect, 
  onFileRemove,
  accept = '.pdf',
  label = 'Upload File',
  disabled = false 
}) => {
  const inputRef = useRef(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onFileSelect(selectedFile)
    }
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    onFileRemove()
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors
          ${file 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        {file ? (
          <div className="flex items-center justify-center gap-3">
            <File className="text-blue-600" size={24} />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              onClick={handleRemove}
              className="p-1 hover:bg-red-100 rounded-full transition-colors"
            >
              <X className="text-red-600" size={20} />
            </button>
          </div>
        ) : (
          <div>
            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-sm text-gray-600 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF files only</p>
          </div>
        )}
      </div>
    </div>
  )
}