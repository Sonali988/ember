const GROUP_COLORS: Record<string, string> = {
  verse: '#3d7eff',
  chorus: '#2ecc71',
  'pre-chorus': '#9b59b6',
  prechorus: '#9b59b6',
  bridge: '#e67e22',
  intro: '#95a5a6',
  outro: '#7f8c8d',
  tag: '#e74c3c',
  ending: '#e74c3c',
  interlude: '#16a085',
  instrumental: '#16a085',
  refrain: '#27ae60',
  title: '#f1c40f',
  blank: '#555555',
}

export function colorForGroup(name?: string): string {
  if (!name) return '#3d7eff'
  const key = name.toLowerCase().replace(/\s+\d+$/, '').trim()
  return GROUP_COLORS[key] || '#3d7eff'
}

export function inferGroup(label: string): string {
  const trimmed = label.trim()
  if (!trimmed) return 'Slide'
  return trimmed
}
