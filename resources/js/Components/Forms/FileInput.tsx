import {ChangeEvent, forwardRef, useCallback, useImperativeHandle, useState} from "react";
import {toast} from "@/Lib/toast";
import {AlertCircle, FileIcon, UploadCloud, X} from "lucide-react";

interface Props {
    name: string
    label?: string
    accept?: string
    maxSize?: number // in MB
    maxFiles?: number
    error?: string
    value?: File | File[]
    disabled?: boolean
    multiple?: boolean
    required?: boolean
    onChange: (files: File | File[] | null) => void
    className?: string
    enableDragDrop?: boolean
    showFileList?: boolean
    hint?: string
    containerClassName?: string
    buttonLabel?: string
}

const FileInput = forwardRef(({
    name,
    label,
    accept,
    maxSize = 5,
    maxFiles = 1,
    error,
    value,
    disabled = false,
    multiple = false,
    required = false,
    onChange,
    className = '',
    enableDragDrop = false,
    showFileList = true,
    hint,
    containerClassName = '',
    buttonLabel = 'Choose File'
}: Props, ref) => {

    const [isDragging, setIsDragging] = useState(false)
    const [files, setFiles] = useState<File[]>(
        value ? (Array.isArray(value) ? value : [value]) : []
    );

    // Expose reset method via ref
    useImperativeHandle(ref, () => ({
        reset: () => {
            setFiles([])
            onChange(multiple ? [] : null)
        }
    }))

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const validateFile = (file: File): boolean => {
        if (file.size > maxSize * 1024 * 1024) {
            toast.error(`File size should not exceed ${maxSize}MB`)
            return false
        }

        if (accept) {
            const acceptedTypes = accept.split(',').map(type => type.trim())
            const fileType = file.type || `application/${file.name.split('.').pop()}`

            if (!acceptedTypes.some(type => {
                if (type.startsWith('.')) {
                    return file.name.toLowerCase().endsWith(type.toLowerCase())
                }
                if (type.endsWith('/*')) {
                    return fileType.startsWith(type.replace('/*', '/'))
                }
                return type === fileType
            })) {
                toast.error(`File type not supported. Accepted types: ${accept}`)
                return false
            }
        }

        return true
    }

    const handleFiles = (newFiles: FileList | null) => {
        if (!newFiles) return

        const validFiles: File[] = []

        for (let i = 0; i < newFiles.length; i++) {
            if (validateFile(newFiles[i])) {
                validFiles.push(newFiles[i])
            }
        }

        if (validFiles.length > 0) {
            const updatedFiles = multiple
                ? [...files, ...validFiles].slice(0, maxFiles)
                : [validFiles[0]]

            setFiles(updatedFiles)
            onChange(multiple ? updatedFiles : updatedFiles[0])
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files)
    }

    // Drag and drop handlers
    const handleDragEnter = useCallback((e: React.DragEvent) => {
        if (!enableDragDrop || disabled) return
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }, [enableDragDrop, disabled])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        if (!enableDragDrop) return
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [enableDragDrop])

    const handleDrop = useCallback((e: React.DragEvent) => {
        if (!enableDragDrop || disabled) return
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
    }, [enableDragDrop, disabled])

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)
        onChange(multiple ? newFiles : (newFiles[0] || null))
    }

    // Base container props
    const containerProps = enableDragDrop ? {
        onDragEnter: handleDragEnter,
        onDragOver: handleDragEnter,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop
    } : {}

    return (
        <div className={className}>
            {/* Label */}
            {label && (
                <label
                    htmlFor={name}
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Input Container */}
            <div
                {...containerProps}
                className={`relative rounded-lg border ${containerClassName}
                    ${enableDragDrop ? 'border-dashed' : 'border-solid'}
                    ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                    ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                    ${error ? 'border-red-300' : ''}
                `}
            >
                <div className="p-4 text-center">
                    <input
                        type="file"
                        id={name}
                        name={name}
                        accept={accept}
                        multiple={multiple}
                        disabled={disabled}
                        required={required}
                        className="hidden"
                        onChange={handleChange}
                    />

                    <label
                        htmlFor={name}
                        className={`flex flex-col items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <UploadCloud className="mb-2 h-8 w-8 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                            {isDragging ? 'Drop files here' : (
                                <>
                                    {enableDragDrop ? (
                                        <>Drag & drop or <span className="text-blue-500">{buttonLabel}</span></>
                                    ) : (
                                        <span className="text-blue-500">{buttonLabel}</span>
                                    )}
                                </>
                            )}
                        </span>
                        {(hint || accept || maxSize) && (
                            <span className="mt-1 text-xs text-gray-500">
                                {hint || (
                                    <>
                                        {multiple
                                            ? `Up to ${maxFiles} files (max ${maxSize}MB each)`
                                            : `Max file size: ${maxSize}MB`
                                        }
                                        {accept && ` • Accepted types: ${accept}`}
                                    </>
                                )}
                            </span>
                        )}
                    </label>
                </div>

                {/* File List */}
                {showFileList && files.length > 0 && (
                    <div className="mt-4 space-y-2 px-4 pb-4">
                        {files.map((file, index) => (
                            <div
                                key={`${file.name}-${index}`}
                                className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-2 text-sm"
                            >
                                <div className="flex items-center space-x-2">
                                    <FileIcon className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium text-gray-700">{file.name}</span>
                                    <span className="text-gray-500">({formatFileSize(file.size)})</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-1 flex items-center text-sm text-red-500">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    {error}
                </div>
            )}
        </div>
    )
});

export default FileInput;
