// src/components/KidToolbar.tsx
import { useEditor } from 'tldraw'
import { useState } from 'react'

export default function KidToolbar() {
  const editor = useEditor()
  const [tool, setTool] = useState<'draw' | 'erase'>('draw')

  const useTool = (t: 'draw' | 'erase') => {
    setTool(t)
    editor.setCurrentTool(t)
  }

  const screenshot = async () => {
    const svgElement = document.querySelector('svg')
    if (!svgElement) return

    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svgElement)
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'drawing.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-4 z-50">
      <button
        className={`w-16 h-16 rounded-full text-3xl shadow ${tool === 'draw' ? 'bg-yellow-300' : 'bg-white'}`}
        onClick={() => useTool('draw')}
      >🖌️</button>

      <button
        className={`w-16 h-16 rounded-full text-3xl shadow ${tool === 'erase' ? 'bg-yellow-300' : 'bg-white'}`}
        onClick={() => useTool('erase')}
      >🩹</button>

      <button
        className="w-16 h-16 rounded-full text-2xl shadow bg-white"
        onClick={screenshot}
      >📸</button>
    </div>
  )
}
