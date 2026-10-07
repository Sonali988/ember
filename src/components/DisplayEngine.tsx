import React, { useEffect, useState } from 'react'
import { Slide, BackgroundMedia, DetectedVerse, VerseLanguage } from '@types/index'
import './DisplayEngine.css'

interface DisplayEngineProps {
  slide: Slide | null
  isBlank: boolean
  backgroundMedia?: BackgroundMedia
  verse?: DetectedVerse | null
  verseLanguage?: VerseLanguage
}

export const DisplayEngine: React.FC<DisplayEngineProps> = ({
  slide,
  isBlank,
  backgroundMedia,
  verse,
  verseLanguage = 'en',
}) => {
  const [backgroundStyle, setBackgroundStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    if (!slide && !backgroundMedia) {
      setBackgroundStyle({ background: '#000000' })
      return
    }

    const media = backgroundMedia || slide?.backgroundColor

    if (!media) {
      setBackgroundStyle({ background: '#000000' })
      return
    }

    if (media.type === 'color') {
      setBackgroundStyle({
        background: media.value,
        opacity: media.opacity,
      })
    } else if (media.type === 'image') {
      setBackgroundStyle({
        backgroundImage: `url(${media.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: media.opacity,
      })
    } else if (media.type === 'video') {
      // Video will be handled via video element overlay
      setBackgroundStyle({
        background: '#000000',
        opacity: media.opacity,
      })
    }
  }, [slide, backgroundMedia])

  if (isBlank && !verse) {
    return <div className="display-engine blank-screen" />
  }

  if (verse) {
    const text = verseLanguage === 'hi' ? verse.textHI : verse.textEN
    const credit = verseLanguage === 'hi' ? verse.attributionHI : verse.attributionEN
    return (
      <div className="display-engine verse-stage">
        <div className="verse-motion" />
        <div className="slide-content verse-copy">
          <div className="verse-reference">{verse.reference}</div>
          <div className="slide-text">{text}</div>
          {credit && <div className="verse-credit">{credit}</div>}
        </div>
      </div>
    )
  }

  if (!slide) {
    return <div className="display-engine" style={backgroundStyle} />
  }

  return (
    <div className="display-engine" style={backgroundStyle}>
      {backgroundMedia?.type === 'video' && (
        <video
          autoPlay
          loop
          muted
          className="background-video"
          style={{ opacity: backgroundMedia.opacity }}
        >
          <source src={backgroundMedia.value} type="video/mp4" />
        </video>
      )}

      <div className="slide-content">
        <div
          className="slide-text"
          style={{
            fontFamily: slide.textStyle.fontFamily,
            fontSize: `${slide.textStyle.fontSize}px`,
            fontWeight: slide.textStyle.fontWeight,
            color: slide.textStyle.color,
            textAlign: slide.textStyle.textAlign,
            lineHeight: slide.textStyle.lineHeight,
            letterSpacing: `${slide.textStyle.letterSpacing}px`,
            animation: 'slideIn 0.5s ease-out',
          }}
        >
          {slide.content}
        </div>
      </div>
    </div>
  )
}
