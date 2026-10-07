import React, { useMemo } from 'react'
import { Song, Slide } from '@types/index'
import { colorForGroup } from '@utils/groups'
import { SlideCanvas } from './SlideCanvas'

interface SlideManagerProps {
  song: Song
  previewSlideId?: string | null
  liveSlideId?: string | null
  onSelect: (slide: Slide) => void
  onGoLive: (slide: Slide) => void
}

interface SlideGroup {
  name: string
  color: string
  slides: Slide[]
}

function groupSlides(slides: Slide[]): SlideGroup[] {
  const groups: SlideGroup[] = []
  slides.forEach((slide) => {
    const name = slide.group || slide.title || 'Slides'
    const last = groups[groups.length - 1]
    if (last && last.name === name) {
      last.slides.push(slide)
      return
    }
    groups.push({
      name,
      color: slide.groupColor || colorForGroup(name),
      slides: [slide],
    })
  })
  return groups
}

export const SlideManager: React.FC<SlideManagerProps> = ({
  song,
  previewSlideId,
  liveSlideId,
  onSelect,
  onGoLive,
}) => {
  const groups = useMemo(() => groupSlides(song.slides || []), [song.slides])

  if (!song.slides?.length) {
    return (
      <div className="slide-grid-empty">
        This presentation has no slides yet.
      </div>
    )
  }

  return (
    <div className="slide-groups">
      {groups.map((group) => (
        <section key={group.name} className="slide-group">
          <header className="slide-group-header" style={{ background: group.color }}>
            {group.name}
          </header>
          <div className="slide-grid">
            {group.slides.map((slide) => {
              const isLive = liveSlideId === slide.id
              const isPreview = previewSlideId === slide.id
              return (
                <button
                  key={slide.id}
                  type="button"
                  title="Click to go live. Right-click to cue Preview."
                  className={`slide-card ${isLive ? 'is-live' : ''} ${isPreview ? 'is-preview' : ''}`}
                  onClick={(e) => {
                    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
                      onSelect(slide)
                      return
                    }
                    onGoLive(slide)
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    onSelect(slide)
                  }}
                >
                  <SlideCanvas slide={slide} size="thumb" />
                  {(isLive || isPreview) && (
                    <span className={`slide-card-flag ${isLive ? 'live' : 'preview'}`}>
                      {isLive ? 'LIVE' : 'PREV'}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
