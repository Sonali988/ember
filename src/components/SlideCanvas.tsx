import React from 'react'
import { Slide } from '../types/index'

interface SlideCanvasProps {
  slide: Slide | null
  blank?: boolean
  size?: 'thumb' | 'preview'
}

export const SlideCanvas: React.FC<SlideCanvasProps> = ({
  slide,
  blank = false,
  size = 'thumb',
}) => {
  if (blank) {
    return <div className={`slide-canvas ${size} is-blank`} />
  }

  if (!slide) {
    return (
      <div className={`slide-canvas ${size} is-empty`}>
        <span>No slide</span>
      </div>
    )
  }

  return (
    <div className={`slide-canvas ${size}`}>
      <div
        className="slide-canvas-text"
        style={{
          fontFamily: slide.textStyle.fontFamily,
          color: slide.textStyle.color,
          textAlign: slide.textStyle.textAlign,
        }}
      >
        {slide.content}
      </div>
    </div>
  )
}
