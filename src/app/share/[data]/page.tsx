'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import CodeFormatter from '@/app/code-formatter'

interface SharePageProps {
  params: {
    data: string
  }
}

const SharePage: React.FC<SharePageProps> = ({ params }) => {
  const { data } = params
  const pathname = usePathname()

  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')

  useEffect(() => {
    if (data) {
      try {
        const base64String = pathname.split('/').pop() || ''

        const jsonString = Buffer.from(base64String, 'base64').toString('utf8');
        if (jsonString) {
          const parsedData = JSON.parse(jsonString)
          setCode(parsedData.code)
          setLanguage(parsedData.language)
        } else {
          console.error('Could not decompress data')
        }
      } catch (error) {
        console.error('Error decoding data:', error)
      }
    }
  }, [data, pathname])

  return (
    <CodeFormatter initialCode={code} initialLanguage={language} />
  )
}

export default SharePage
