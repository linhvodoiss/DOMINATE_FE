import { Copy, Check } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { toast } from 'sonner'
import { useState } from 'react'

export default function CopyableText({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    toast.success(`${label} copied!`)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className='flex items-center gap-2'>
      <span className='font-semibold'>{label}:</span> {value}
      <Button variant='ghost' size='icon' onClick={handleCopy}>
        {copied ? <Check className='h-4 w-4 text-green-600' /> : <Copy className='h-4 w-4' />}
      </Button>
    </div>
  )
}
