/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PlusCircle } from 'lucide-react'
import { toast } from 'sonner'

import http from '~/utils/http'
import { LINKS } from '~/constants/links'

import { env } from '~/configs/env'
import { CODE_SUCCESS } from '~/constants'

export default function AvatarUpload({ avatarUrl, isLoading }: { avatarUrl?: string; isLoading: boolean }) {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null)
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(avatarUrl ?? null)

  const handleUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (isLoading) return

    setSelectedFile(file)
    setPreviewAvatar(URL.createObjectURL(file))
  }

  const confirmUploadAvatar = async () => {
    if (!selectedFile) return

    const formData = new FormData()
    formData.append('image', selectedFile)

    const res = await http.post<{ avatarUrl: string }>(LINKS.update_avatar, {
      body: formData,
      baseUrl: '/api',
      headers: {},
    })

    if (!CODE_SUCCESS.includes(res.code)) {
      toast.error(res.message || 'Upload avatar failed')
      return
    }

    setCurrentAvatar(res.data?.avatarUrl ?? null)

    setPreviewAvatar(null)
    setSelectedFile(null)
    const fullAvatarUrl = `${env.SOCKET_URL}${res.data?.avatarUrl ?? ''}`
    localStorage.setItem('user_avatar', fullAvatarUrl)
    toast.success('Avatar updated successfully!')
    router.refresh()
  }

  const cancelPreview = () => {
    setPreviewAvatar(null)
    setSelectedFile(null)
  }
  useEffect(() => {
    setCurrentAvatar(avatarUrl ?? null)
  }, [avatarUrl])
  return (
    <div className='ring-primary-system bg-background-primary relative aspect-square h-32 w-32 rounded-full ring-2'>
      <input
        type='file'
        accept='image/*'
        className='absolute inset-0 z-10 cursor-pointer opacity-0'
        onChange={handleUploadAvatar}
      />

      {previewAvatar ? (
        <Image
          src={previewAvatar}
          alt='avatar preview'
          width={500}
          height={500}
          className='pointer-events-none size-full rounded-full object-cover'
        />
      ) : currentAvatar ? (
        <img
          src={`${env.SOCKET_URL}${currentAvatar}`}
          alt='avatar'
          width={500}
          height={500}
          loading='lazy'
          className='pointer-events-none size-full rounded-full object-cover'
        />
      ) : (
        <span className='pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400'>
          <PlusCircle size={32} />
        </span>
      )}

      {previewAvatar && (
        <div className='absolute top-[110%] left-1/2 mt-2 flex -translate-x-1/2 gap-2'>
          <button
            onClick={confirmUploadAvatar}
            className='bg-primary-system rounded px-3 py-1 text-sm text-white shadow'
          >
            Confirm
          </button>
          <button onClick={cancelPreview} className='rounded bg-gray-400 px-3 py-1 text-sm text-white shadow'>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
