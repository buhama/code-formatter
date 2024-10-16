'use client'

import { useState, useRef, useEffect } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { toPng } from 'html-to-image'
import { Download, Share } from 'lucide-react'
import { ToastAction } from "@/components/ui/toast"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'


interface CodeFormatterProps {
  initialCode?: string
  initialLanguage?: string
}


const CodeFormatter: React.FC<CodeFormatterProps> = ({ initialCode = '', initialLanguage = 'javascript' }) => {
  const [code, setCode] = useState(initialCode)
  const [language, setLanguage] = useState(initialLanguage)
  const previewRef = useRef<HTMLDivElement>(null)
  const [previewHeight, setPreviewHeight] = useState('auto')

  const { toast } = useToast()
  const router = useRouter();

  useEffect(() => {
    setCode(initialCode)
    setLanguage(initialLanguage)
  }, [initialCode, initialLanguage])

  useEffect(() => {
    const updatePreviewHeight = () => {
      if (previewRef.current) {
        const lineCount = code.split('\n').length;
        const baseHeight = 200;
        const lineHeight = 24; 
        const padding = 100; 
        const calculatedHeight = Math.max(baseHeight, lineCount * lineHeight + padding);
        setPreviewHeight(`${calculatedHeight}px`);
      }
    };

    updatePreviewHeight();
  }, [code]);

  const handleCopyImage = async () => {
    if (previewRef.current) {
      try {
        const dataUrl = await toPng(previewRef.current, { 
          cacheBust: true,
          height: previewRef.current.offsetHeight,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left'
          }
        })
        const link = document.createElement('a')
        link.download = 'formatted-code.png'
        link.href = dataUrl
        link.click()
      } catch (error) {
        console.error('Error generating image:', error)
      }
    }
  }

  const handleShareLink = () => {
    const data = JSON.stringify({ code, language })
    const compressedData = Buffer.from(data).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const shareUrl = `${window.location.origin}/share/${compressedData}`
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast({
          title: "Share link copied!",
          description: "The link to your code has been copied to your clipboard.",
          action: <ToastAction altText="View" onClick={() => window.open(`/share/${compressedData}`, '_blank')}>View</ToastAction>,
        })
      })
      .catch(err => {
        console.error('Could not copy text: ', err)
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with copying the share link.",
        })
      })
  }
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
                <SelectItem value="lua">Lua</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-4">
              <Button onClick={handleCopyImage} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download as Image
              </Button>
              <Button onClick={handleShareLink} className="w-full">
                <Share className="mr-2 h-4 w-4" /> Share Link
              </Button>
            </div>
          </div>
          <div
            ref={previewRef}
            className="relative overflow-hidden rounded-lg shadow-2xl"
            style={{ height: previewHeight }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-sky-500 to-orange-400 animate-gradient-x" />
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
            
            <div className="relative h-full overflow-hidden p-8 flex flex-col">
              <div className="bg-gray-800 rounded-t-lg p-2 mb-2 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-gray-400 text-sm ml-4">
                  {language}.
                  {language === 'javascript' ? 'js' :
                   language === 'python' ? 'py' :
                   language === 'lua' ? 'lua' :
                   language === 'cpp' ? 'cpp' :
                   language === 'java' ? 'java' :
                   language === 'ruby' ? 'rb' :
                   'file'}
                </div>
              </div>
              
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

export default CodeFormatter
