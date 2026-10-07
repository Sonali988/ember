import { Song, Slide, TextStyle } from '../types/index'
import { colorForGroup } from '@utils/groups'

const textStyle: TextStyle = {
  fontFamily: 'Arial',
  fontSize: 48,
  fontWeight: 'normal',
  color: '#FFFFFF',
  textAlign: 'center',
  lineHeight: 1.25,
  letterSpacing: 0,
}

function slide(
  id: string,
  group: string,
  content: string,
  order: number,
  title?: string
): Slide {
  return {
    id,
    title: title || group,
    content,
    group,
    groupColor: colorForGroup(group),
    textStyle,
    order,
  }
}

export const sampleLibrary: Song[] = [
  {
    id: 'sample-amazing-grace',
    title: 'Amazing Grace',
    artist: 'John Newton',
    ccli: '22025',
    verses: [],
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    slides: [
      slide('ag-v1a', 'Verse 1', 'Amazing grace, how sweet the sound\nThat saved a wretch like me', 0),
      slide('ag-v1b', 'Verse 1', 'I once was lost, but now am found\nWas blind, but now I see', 1),
      slide('ag-v2a', 'Verse 2', "'Twas grace that taught my heart to fear\nAnd grace my fears relieved", 2),
      slide('ag-v2b', 'Verse 2', 'How precious did that grace appear\nThe hour I first believed', 3),
      slide('ag-v3a', 'Verse 3', 'Through many dangers, toils and snares\nI have already come', 4),
      slide('ag-v3b', 'Verse 3', "'Tis grace hath brought me safe thus far\nAnd grace will lead me home", 5),
      slide('ag-v4a', 'Verse 4', 'When we\'ve been there ten thousand years\nBright shining as the sun', 6),
      slide('ag-v4b', 'Verse 4', "We've no less days to sing God's praise\nThan when we first begun", 7),
    ],
  },
  {
    id: 'sample-how-great',
    title: 'How Great Thou Art',
    artist: 'Stuart K. Hine',
    ccli: '14181',
    verses: [],
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    slides: [
      slide('hg-v1a', 'Verse 1', 'O Lord my God, when I in awesome wonder\nConsider all the worlds Thy hands have made', 0),
      slide('hg-v1b', 'Verse 1', 'I see the stars, I hear the rolling thunder\nThy power throughout the universe displayed', 1),
      slide('hg-c1', 'Chorus', 'Then sings my soul, my Savior God, to Thee\nHow great Thou art, how great Thou art', 2),
      slide('hg-c2', 'Chorus', 'Then sings my soul, my Savior God, to Thee\nHow great Thou art, how great Thou art', 3),
      slide('hg-v2a', 'Verse 2', 'And when I think that God, His Son not sparing\nSent Him to die, I scarce can take it in', 4),
      slide('hg-v2b', 'Verse 2', 'That on the cross, my burden gladly bearing\nHe bled and died to take away my sin', 5),
      slide('hg-c3', 'Chorus', 'Then sings my soul, my Savior God, to Thee\nHow great Thou art, how great Thou art', 6),
      slide('hg-c4', 'Chorus', 'Then sings my soul, my Savior God, to Thee\nHow great Thou art, how great Thou art', 7),
    ],
  },
]
