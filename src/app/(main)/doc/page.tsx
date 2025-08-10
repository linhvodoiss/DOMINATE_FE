'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { useEffect, useState } from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select'

const versions = Array.from({ length: 20 }, (_, versionIdx) => ({
  versionId: versionIdx + 1,
  versionName: `Version ${versionIdx + 1}.0`,
  categories: Array.from({ length: 12 }, (_, catIdx) => ({
    categoryId: versionIdx * 10 + catIdx,
    categoryName: `Category ${catIdx + 1}`,
    docs: Array.from({ length: 4 }, (_, docIdx) => ({
      docId: versionIdx * 100 + catIdx * 10 + docIdx,
      docName: `Tài liệu ${docIdx + 1}`,
      content:
        'Đây là nội dung rất dài. '.repeat(100) +
        `\n\n(Version ${versionIdx + 1}, Category ${catIdx + 1}, Doc ${docIdx + 1})`,
    })),
  })),
}))

export default function DocPage() {
  const [selectedVersionId, setSelectedVersionId] = useState(versions[0].versionId)
  const selectedVersion = versions.find(v => v.versionId === selectedVersionId)!
  const [selectedDoc, setSelectedDoc] = useState<null | { docId: number; docName: string; content: string }>(null)
  useEffect(() => {
    document.body.classList.add('doc-page')
    return () => {
      document.body.classList.remove('doc-page')
    }
  }, [])

  return (
    <>
      {/* Sidebar - fixed height & sticky */}
      <aside className='border-primary-system fixed top-22 h-screen w-72 shrink-0 overflow-y-auto rounded px-4 pt-6 pb-6'>
        {/* Version Select */}
        <div className='mb-5'>
          <Select
            value={String(selectedVersionId)}
            onValueChange={val => {
              setSelectedVersionId(Number(val))
              setSelectedDoc(null)
            }}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select version' />
            </SelectTrigger>
            <SelectContent>
              {versions.map(v => (
                <SelectItem key={v.versionId} value={String(v.versionId)}>
                  {v.versionName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Accordion */}
        <Accordion.Root type='single' collapsible className='space-y-3'>
          {selectedVersion.categories.map(cat => (
            <Accordion.Item key={cat.categoryId} value={String(cat.categoryId)}>
              <Accordion.Header>
                <Accordion.Trigger className='w-full px-2 py-2 text-left'>{cat.categoryName}</Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className='space-y-1 px-4 py-2'>
                {cat.docs.map(doc => (
                  <div
                    key={doc.docId}
                    onClick={() => setSelectedDoc(doc)}
                    className={`cursor-pointer px-2 py-1 text-sm ${selectedDoc?.docId === doc.docId ? '' : ''}`}
                  >
                    {doc.docName}
                  </div>
                ))}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </aside>

      {/* Main content */}
      <div className='ml-72 px-6 py-6'>
        {selectedDoc ? (
          <article className='prose max-w-full'>
            <h1>{selectedDoc.docName}</h1>
            <p>{selectedDoc.content}</p>
          </article>
        ) : (
          <div className='mt-20 text-center'>
            <p>Chọn một tài liệu để hiển thị nội dung</p>
          </div>
        )}
      </div>
    </>
  )
}
