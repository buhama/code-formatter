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

  // Add this new function to calculate the container size
  const getContainerSize = () => {
    const lineCount = code.split('\n').length;
    if (lineCount <= 5) return 'h-auto min-h-[200px]';
    if (lineCount <= 10) return 'h-auto min-h-[300px]';
    if (lineCount <= 20) return 'h-auto min-h-[400px]';
    return 'h-auto min-h-[500px] max-h-[800px]';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Code Formatter</h1>
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <Textarea
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-64 font-mono text-white focus:border-blue-500 focus:ring-blue-500"
            />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger >
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="ruby">Ruby</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleCopyImage} className="w-full">
              <Download className="mr-2 h-4 w-4" /> Download as Image
            </Button>
          </div>
          <div
            ref={previewRef}
            className={`relative overflow-hidden rounded-lg shadow-2xl ${getContainerSize()}`}
          >
            {/* Updated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-sky-500 to-orange-400 animate-gradient-x" />
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
            
            {/* Window-like container */}
            <div className="relative h-full overflow-hidden p-8 flex flex-col">
              {/* Window header */}
              <div className="bg-gray-800 rounded-t-lg p-2 mb-2 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-gray-400 text-sm ml-4">{language}.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'file'}</div>
              </div>
              
              {/* Code content */}
              <div className="flex-grow bg-gray-900 rounded-b-lg overflow-hidden">
                <SyntaxHighlighter
                  language={language}
                  style={atomDark}
                  customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    borderRadius: '0 0 0.5rem 0.5rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.25rem',
                    height: '100%',
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
    </div>
  )
}