// src/App.tsx
import 'tldraw/tldraw.css'
import { Editor, Tldraw } from 'tldraw'
import { useRef } from 'react'
import html2canvas from 'html2canvas'

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return

    const data = new DataTransfer()
    data.items.add(file)

    const event = new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      dataTransfer: data,
    })

    document.querySelector('.tl-canvas')?.dispatchEvent(event)
  }

  const screenshot = async () => {
    const svgElement = document.querySelector('svg')
    if (!svgElement) return

    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svgElement)
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width * 2
      canvas.height = img.height * 2
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)

      const pngUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = pngUrl
      link.download = 'drawing.png'
      link.click()
    }

    img.src = url
  }

  return (
    <div ref={canvasRef} style={{ position: 'fixed', inset: 0 }}>
      <Tldraw autoFocus />

      <div style={buttonPanelStyle}>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleUpload}
          style={{ display: 'none' }}
        />

        <button onClick={() => inputRef.current?.click()} style={fancyButton}>
          <img src="blue.png" alt="upload" style={iconStyle} />
          <span>Upload Image</span>
        </button>

        <button onClick={screenshot} style={fancyButton}>
          <img src="red.png" alt="screenshot" style={iconStyle} />
          <span>Save as PNG</span>
        </button>
      </div>
    </div>
  )
}

const buttonPanelStyle: React.CSSProperties = {
  position: 'absolute',
  left: 20,
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  zIndex: 100,
}

const fancyButton: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: '12px',
  border: 'none',
  background: 'white',
  color: '#333',
  fontWeight: 'bold',
  fontSize: '14px',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease-in-out',
  width: '160px',
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}

const iconStyle: React.CSSProperties = {
  width: '20px',
  height: '20px',
  objectFit: 'contain',
}
