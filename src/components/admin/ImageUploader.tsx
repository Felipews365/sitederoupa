'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Star, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export interface UploadedImage {
  url: string
  alt_text: string
  is_primary: boolean
  sort_order: number
}

interface ImageUploaderProps {
  images: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      // 1. Obter signed URL
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // 2. Fazer upload direto para o Supabase Storage
      const uploadRes = await fetch(data.signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!uploadRes.ok) throw new Error('Falha no upload')

      return data.publicUrl as string
    } catch (err) {
      console.error('Upload error:', err)
      return null
    }
  }

  const handleFiles = async (files: FileList) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (validFiles.length === 0) {
      toast.error('Selecione apenas imagens (JPG, PNG, WEBP)')
      return
    }
    if (images.length + validFiles.length > 8) {
      toast.error('Máximo de 8 imagens por produto')
      return
    }

    setUploading(true)
    const newImages: UploadedImage[] = []

    for (const file of validFiles) {
      const url = await uploadFile(file)
      if (url) {
        newImages.push({
          url,
          alt_text: '',
          is_primary: images.length === 0 && newImages.length === 0,
          sort_order: images.length + newImages.length,
        })
      } else {
        toast.error(`Falha ao enviar ${file.name}`)
      }
    }

    onChange([...images, ...newImages])
    setUploading(false)
    if (newImages.length > 0) toast.success(`${newImages.length} imagem(ns) enviada(s)!`)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files)
  }

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index).map((img, i) => ({
      ...img,
      sort_order: i,
      is_primary: i === 0,
    }))
    onChange(updated)
  }

  const setPrimary = (index: number) => {
    onChange(
      images.map((img, i) => ({ ...img, is_primary: i === index }))
    )
  }

  return (
    <div>
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Enviando imagens...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              Clique ou arraste as imagens aqui
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WEBP · Máximo 8 imagens · 5MB cada
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {/* Preview de imagens */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-4">
          {images.map((img, i) => (
            <div key={img.url} className="relative group aspect-square rounded-lg overflow-hidden bg-muted border-2 border-border">
              <Image src={img.url} alt={img.alt_text || `Imagem ${i + 1}`} fill className="object-cover" />

              {/* Primary badge */}
              {img.is_primary && (
                <div className="absolute top-1 left-1 bg-accent text-white rounded-full p-0.5">
                  <Star className="w-2.5 h-2.5 fill-white" />
                </div>
              )}

              {/* Actions on hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {!img.is_primary && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setPrimary(i) }}
                    className="bg-white/90 rounded-full p-1 hover:bg-white transition-colors"
                    title="Definir como principal"
                  >
                    <Star className="w-3 h-3 text-accent" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(i) }}
                  className="bg-white/90 rounded-full p-1 hover:bg-white transition-colors"
                  title="Remover"
                >
                  <X className="w-3 h-3 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-muted-foreground mt-2">
          ★ = imagem principal (aparece na listagem) · Passe o mouse para alterar
        </p>
      )}
    </div>
  )
}
