# ProPresenter Clone

A modern, feature-rich presentation software for churches and worship leaders. Built with React, Electron, Node.js, and MySQL.

## Features

### Lyrics & Slide Management
- Create and organize songs with verse/chorus structure
- Instant slide creation and switching
- Playlist and service order management
- Support for song notes and CCLI tracking

### Display Engine
- Render text over customizable backgrounds (images, videos, solid colors)
- Dual-screen support (audience display + stage confidence monitor)
- Full-screen and projector output modes
- Smooth animations and transitions

### Media Integration
- Support for motion backgrounds and still images
- Video loop support
- Layering system (text on top of media)
- GPU-accelerated playback

### Control Interface
- Intuitive operator UI for quick slide navigation
- Global hotkey support:
  - **Space / Right Arrow**: Next slide
  - **Left Arrow**: Previous slide
  - **B**: Toggle blank screen
  - **Ctrl+D**: Toggle display window
  - **Ctrl+S**: Toggle stage monitor
  - **Ctrl+M**: Focus main operator window

### Import/Export
- Import from ProPresenter (.pro)
- Import from PowerPoint (.pptx)
- Native JSON format support
- Export service orders

### Announcements & Scripture
- Announcement templates with custom styling
- Scripture database integration
- Customizable text styling and backgrounds

## Technology Stack

- **Frontend**: React 18 + TypeScript + Ant Design
- **Desktop**: Electron 27
- **Backend**: Node.js + Express
- **Database**: MySQL + Prisma ORM
- **Media**: react-player + HTML5 Video API
- **State Management**: Zustand
- **Build**: Vite + electron-builder

## Prerequisites

- Node.js 16+ and npm
- MySQL 5.7+
- Windows, macOS, or Linux

## Installation

### 1. Clone and Install Dependencies

```bash
cd pp-clone
npm install
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE propresenter;
```

Update `.env.local`:

```env
DATABASE_URL=mysql://root:password@localhost:3306/propresenter
VITE_API_URL=http://localhost:3001/api
```

### 3. Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## Development

### Start Development Environment

The project runs in three processes:

1. **React Dev Server** (Vite) on `http://localhost:5173`
2. **Electron** application (renders dev server)
3. **Node.js Backend** on `http://localhost:3001`

To start all:

```bash
npm run dev
```

Or individually:

```bash
npm run dev:vite      # Vite dev server
npm run dev:electron  # Electron app (in another terminal)
npm run server:dev    # Backend server (in another terminal)
```

### Database Management

View/edit database:

```bash
npx prisma studio
```

Create migrations:

```bash
npx prisma migrate dev --name <migration-name>
```

## Project Structure

```
pp-clone/
├── electron/              # Electron main process
│   ├── main.ts           # Main Electron app
│   └── preload.ts        # IPC bridge
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components (Operator, Display, Stage Monitor)
│   ├── services/         # API and file import services
│   ├── store/            # Zustand stores (presentation, UI state)
│   ├── types/            # TypeScript interfaces
│   └── App.tsx           # Root component
├── server/               # Node.js/Express backend
│   ├── routes/           # API routes
│   └── index.ts          # Server entry
├── prisma/
│   └── schema.prisma     # Database schema
├── vite.config.ts        # Vite configuration
└── package.json
```

## Database Schema

The application uses Prisma ORM with MySQL. Key models:

- **Song**: Store songs with verses and slides
- **Verse**: Individual verses within songs
- **Slide**: Display slides generated from songs
- **ServiceOrder**: Service/worship order
- **ServiceItem**: Items in a service order (songs, announcements, scripture)
- **Announcement**: Announcement templates
- **Scripture**: Scripture verses
- **MediaFile**: Uploaded images, videos, audio
- **Playlist**: Reusable song collections

## Building

### Desktop Application

```bash
npm run build
```

Creates distributable packages in `dist-electron/`.

### Platforms

Windows, macOS, and Linux builds supported via electron-builder. Configure in `electron-builder.yml`.

## Usage

### Basic Workflow

1. **Create/Import Songs**
   - Click "Import Song" to load .pro, .pptx, or .json files
   - Or create new songs with the "New Song" button

2. **Manage Slides**
   - Select a song from the sidebar
   - Edit slides, add backgrounds, customize text

3. **Create Service Order**
   - Add songs, announcements, scripture to a service order
   - Set display order and timing

4. **Operate**
   - Use hotkeys or buttons to navigate slides
   - Monitor stage display and notes on stage monitor
   - Blank screen for transitions (B key)

### Hotkeys

| Key | Action |
|-----|--------|
| Space / → | Next slide |
| ← | Previous slide |
| B | Toggle blank |
| Ctrl+D | Toggle display window |
| Ctrl+S | Toggle stage monitor |
| Ctrl+M | Focus main window |

## Supported File Formats

- **ProPresenter**: .pro (XML)
- **PowerPoint**: .pptx (with embedded media extraction)
- **JSON**: Custom format
- **Media**: MP4, PNG, JPG, GIF, WebP, MOV

## Environment Variables

```env
# Frontend
VITE_API_URL=http://localhost:3001/api

# Backend
PORT=3001
NODE_ENV=development
DATABASE_URL=mysql://user:pass@localhost:3306/propresenter
```

## Troubleshooting

### Database Connection Issues

- Ensure MySQL is running
- Check `DATABASE_URL` in `.env.local`
- Verify database exists: `CREATE DATABASE propresenter;`

### Blank Display Window

- Check that a second display is connected
- Use Ctrl+D to open manually
- Monitor console for errors

### Hotkey Not Working

- Ensure main window has focus
- On macOS, grant app accessibility permissions

## Features Roadmap

- [ ] Multi-language support
- [ ] Advanced video effects
- [ ] Stream output (YouTube Live, etc.)
- [ ] Remote control via mobile app
- [ ] Cloud sync and backup
- [ ] Collaboration features
- [ ] Advanced scheduling
- [ ] Custom themes and templates
- [ ] Motion graphics effects
- [ ] Captions/subtitles support

## Performance Tips

- Use GPU-accelerated video formats (H.264)
- Pre-import high-resolution images
- Use solid colors instead of complex backgrounds for better performance
- Close unnecessary applications for smoother playback

## Known Limitations

- Single operator interface (multi-operator not yet supported)
- Limited to 2-3 display outputs
- Some ProPresenter features not supported (advanced animations, etc.)

## Support & Contributing

For bugs, features, or questions, please open an issue.

## License

MIT

## Credits

Built as a modern alternative to ProPresenter for churches and worship leaders.
