import React, { useEffect } from 'react'
import { Form, Input, Button, message } from 'antd'
import { Song, Verse } from '../types/index'
import { v4 as uuidv4 } from 'uuid'
import { apiService } from '@services/api'
import { colorForGroup } from '@utils/groups'

interface SongEditorProps {
  song?: Song
  onSave: (song: Song) => void
}

function parseLyrics(raw: string): Verse[] {
  return raw
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, idx) => {
      const lines = block.split('\n')
      const header = lines[0].trim()
      const headerMatch = header.match(
        /^(verse|chorus|bridge|pre-?chorus|intro|outro|tag|ending)\s*\d*$/i
      )
      const rawType = (headerMatch?.[1] || '').toLowerCase().replace('prechorus', 'pre-chorus')
      const typeMap: Record<string, Verse['type']> = {
        verse: 'verse',
        chorus: 'chorus',
        bridge: 'bridge',
        'pre-chorus': 'pre-chorus',
        outro: 'outro',
        intro: 'verse',
        tag: 'outro',
        ending: 'outro',
      }
      const type = typeMap[rawType] || (idx % 2 === 0 ? 'verse' : 'chorus')
      const content = headerMatch ? lines.slice(1).join('\n').trim() || header : block
      return {
        id: uuidv4(),
        type,
        number: idx + 1,
        content,
      }
    })
}

export const SongEditor: React.FC<SongEditorProps> = ({ song, onSave }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (song) {
      form.setFieldsValue({
        title: song.title,
        artist: song.artist,
        ccli: song.ccli,
        verses: song.verses.map((v) => v.content).join('\n\n') || song.slides.map((s) => s.content).join('\n\n'),
      })
    }
  }, [song, form])

  const handleSave = async (values: { title: string; artist?: string; ccli?: string; verses: string }) => {
    const verses = parseLyrics(values.verses)
    const newSong: Song = {
      id: song?.id || uuidv4(),
      title: values.title,
      artist: values.artist,
      ccli: values.ccli,
      verses,
      slides: verses.map((verse, idx) => {
        const group = `${verse.type.charAt(0).toUpperCase()}${verse.type.slice(1)} ${verse.number || ''}`.trim()
        return {
          id: uuidv4(),
          title: group,
          content: verse.content,
          group,
          groupColor: colorForGroup(group),
          textStyle: {
            fontFamily: 'Arial',
            fontSize: 48,
            fontWeight: 'normal',
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: 1.25,
            letterSpacing: 0,
          },
          order: idx,
        }
      }),
      order: song?.order || 0,
      createdAt: song?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    try {
      await apiService.createSong(newSong)
    } catch {
      // Keep the presentation local if the API is unavailable.
    }

    message.success('Presentation saved')
    onSave(newSong)
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleSave}>
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Please enter a title' }]}
      >
        <Input placeholder="Presentation title" />
      </Form.Item>

      <Form.Item name="artist" label="Artist">
        <Input placeholder="Artist name" />
      </Form.Item>

      <Form.Item name="ccli" label="CCLI Number">
        <Input placeholder="CCLI number" />
      </Form.Item>

      <Form.Item
        name="verses"
        label="Lyrics (separate slides with a blank line)"
        rules={[{ required: true, message: 'Please enter lyrics' }]}
      >
        <Input.TextArea
          rows={12}
          placeholder={'Verse 1\nAmazing grace, how sweet the sound\nThat saved a wretch like me\n\nChorus\n...'}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Save Presentation
        </Button>
      </Form.Item>
    </Form>
  )
}
