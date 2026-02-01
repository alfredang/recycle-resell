"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { X, Upload, Loader2, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface UploadedImage {
  url: string
  key: string
}

interface ImageUploadProps {
  images: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  maxImages?: number
}

export function ImageUpload({
  images,
  onChange,
  maxImages = 10,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`)
        return
      }

      setIsUploading(true)
      setUploadProgress(0)

      const uploadedImages: UploadedImage[] = []
      const totalFiles = acceptedFiles.length

      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i]

        try {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Upload failed")
          }

          const data = await response.json()
          uploadedImages.push(data)

          setUploadProgress(((i + 1) / totalFiles) * 100)
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : `Failed to upload ${file.name}`
          )
        }
      }

      onChange([...images, ...uploadedImages])
      setIsUploading(false)
      setUploadProgress(0)
    },
    [images, maxImages, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/gif": [],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: isUploading || images.length >= maxImages,
  })

  const removeImage = async (index: number) => {
    const imageToRemove = images[index]

    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageToRemove.url }),
      })
    } catch {
      // Ignore delete errors
    }

    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [removed] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, removed)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary",
          (isUploading || images.length >= maxImages) &&
            "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Uploading... {Math.round(uploadProgress)}%
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? "Drop images here..."
                : "Drag & drop images or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground">
              JPEG, PNG, WebP or GIF. Max 5MB each.
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={image.key}
              className="relative aspect-square group rounded-lg overflow-hidden border"
            >
              <Image
                src={image.url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="150px"
              />

              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                  Primary
                </div>
              )}

              {/* Actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index > 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveImage(index, 0)}
                  >
                    <GripVertical className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Count */}
      <p className="text-xs text-muted-foreground text-center">
        {images.length} of {maxImages} images
      </p>
    </div>
  )
}
