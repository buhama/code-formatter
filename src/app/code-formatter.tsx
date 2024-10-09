'use client'

import { useState, useRef } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { toPng } from 'html-to-image'
import { Copy, Download } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CodeFormatter() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const previewRef = useRef(null)

  const handleCopyImage = async () => {
    if (previewRef.current) {
      const dataUrl = await toPng(previewRef.current, { cacheBust: true })
      const link = document.createElement('a')
      link.download = 'formatted-code.png'
      link.href = dataUrl
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Code Formatter for Social Media</h1>
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <Textarea
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-64 font-mono bg-neutral-800 text-white border-neutral-700 focus:border-blue-500 focus:ring-blue-500"
            />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-700">
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="ruby">Ruby</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleCopyImage} className="w-full bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" /> Download as Image
            </Button>
          </div>
          <div
            ref={previewRef}
            className="relative aspect-square overflow-hidden rounded-lg shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 opacity-50 blur-2xl" />
            <div className="absolute inset-0 bg-gray-900 bg-opacity-75" />
            <div className="relative h-full overflow-hidden p-6 flex items-center justify-center">
              <SyntaxHighlighter
                language={language}
                style={atomDark}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.25rem',
                  maxHeight: '100%',
                  width: '100%',
                  overflowX: 'auto',
                  overflowY: 'auto',
                }}
                wrapLines={true}
                wrapLongLines={true}
              >
                {code || 'Paste your code to see the preview'}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}