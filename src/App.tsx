// src/App.tsx
import 'tldraw/tldraw.css'
import { useEditor, Tldraw, AssetRecordType  } from 'tldraw'
// import { useRef } from 'react'
import { useState, useRef,  } from 'react';


export function GoBackButton() {


  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <>
      <button
        style={{
          position: 'absolute',
          top: '2px',
          left: '685px',
          zIndex: 1000,
          padding: '8px 16px',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onClick={handleGoBack}
      >
        <img src="yellow.png" alt="upload" style={{ width: '30px', height: '30px', marginRight: '4px' }} />
        Done Designing
      </button>
    </>
  )
}

export function UploadImageButton() {
  const editor = useEditor()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, etc.)')
      return
    }

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
try{
    const img = new Image()
    img.src = base64
    
    img.onload = () => {
      const assetId = AssetRecordType.createId()
      
      editor.createAssets([
        {
          id: assetId,
          type: 'image',
          typeName: 'asset',
          props: {
            name: file.name,
            src: base64, // Use base64 data URL instead of blob URL
            w: img.width,
            h: img.height,
            mimeType: file.type,
            isAnimated: false,
          },
          meta: {},
        }
      ])

        // Then create the shape using the asset
        editor.createShape({
          type: 'image',
          x: 100, // Default X position
          y: 100, // Default Y position
          props: {
            assetId: assetId, // Reference the created asset
            w: img.width,
            h: img.height,
          },
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      // Reset the input to allow uploading the same file again
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <button
        style={{
          position: 'absolute',
          top: '2px',
          left: '520px',
          zIndex: 1000,
          padding: '8px 16px',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <img src="red.png" alt="upload" style={{ width: '30px', height: '30px', marginRight: '4px' }} />
        Upload Image
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </>
  )
}

function ExportCanvasButton() {
  const editor = useEditor();
  
  const handleExport = async () => {
    try {
      if (!editor) throw new Error('Editor not initialized');
      
      const shapeIds = editor.getCurrentPageShapeIds();
      if (shapeIds.size === 0) throw new Error('No shapes to export');
      
      const { blob } = await editor.toImage([...shapeIds], {
        format: 'png',
        background: false,
        scale: 2
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `drawing-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Export error:', error);
      throw error; // This will be caught by ErrorBoundary
    }
  };

  return (
    <button
      style={{
        position: 'absolute',
        top: '2px',
        left: '350px',
        zIndex: 1000,
        padding: '8px 16px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '2px'
      }}
      onClick={handleExport}
    >
      <img src="blue.png" alt="export" style={{ width: '30px', height: '30px', marginRight: '4px' }} />
      Export Drawing
    </button>
  );
}



export default function App() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      {/* <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ExportCanvasButton />
      </ErrorBoundary> */}
      
      <Tldraw autoFocus>
        <ExportCanvasButton /> {/* Also works inside Tldraw component */}
        <UploadImageButton />
        <GoBackButton />
      </Tldraw>
    </div>
  );
}