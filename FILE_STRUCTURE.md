# Ember - Complete File Structure

## Project Root Files

```
ember/
├── .env.example              # Environment variables template
├── .env.local                # Local environment (not in git)
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── electron-builder.yml     # Electron build configuration
├── index.html               # HTML entry point
│
├── README.md                # Full documentation
├── SETUP.md                 # Quick setup guide
├── ARCHITECTURE.md          # Technical architecture
├── PROJECT_SUMMARY.md       # Feature overview
├── QUICK_REFERENCE.md       # Command reference
├── FILE_STRUCTURE.md        # This file
```

## Source Code Structure

```
src/
├── App.tsx                  # Root component (window router)
├── main.tsx                 # React entry point
├── index.css                # Global styles
│
├── components/              # React components
│   ├── DisplayEngine.tsx     # Main slide renderer
│   ├── DisplayEngine.css     # Display styles
│   ├── StageMonitor.tsx      # Confidence monitor
│   ├── StageMonitor.css      # Monitor styles
│   ├── OperatorPanel.tsx     # Main operator UI
│   ├── OperatorPanel.css     # Operator styles
│   ├── SlideManager.tsx      # Slide editor
│   └── SongEditor.tsx        # Song creator
│
├── pages/                   # Full-page components
│   ├── DisplayPage.tsx       # Display window page
│   └── StageMonitorPage.tsx  # Stage monitor page
│
├── store/                   # Zustand state management
│   ├── presentationStore.ts  # Presentation state
│   └── uiStore.ts           # UI state
│
├── services/                # API and utility services
│   ├── api.ts               # Axios HTTP client
│   └── fileImport.ts        # File parsing logic
│
├── types/                   # TypeScript interfaces
│   └── index.ts             # All type definitions
│
└── utils/                   # Utility functions
    ├── hotkeys.ts           # Hotkey setup
    └── formatters.ts        # String formatting
```

## Electron Layer

```
electron/
├── main.ts                  # Main Electron process
│   ├── createWindow()       # Main operator window
│   ├── createDisplayWindow()# Full-screen display
│   ├── createStageMonitorWindow() # Confidence monitor
│   ├── IPC handlers         # Electron-React communication
│   └── Global hotkeys       # System-wide shortcuts
│
└── preload.ts               # Secure IPC bridge
    ├── electronAPI.openDisplayWindow()
    ├── electronAPI.closeDisplayWindow()
    ├── electronAPI.openStageMonitor()
    ├── electronAPI.sendToDisplay()
    └── Window event listeners
```

## Backend Server

```
server/
├── index.ts                 # Express server entry
│   ├── Middleware setup     # CORS, JSON parsing
│   ├── Route registration   # All API routes
│   ├── Error handling       # Global error middleware
│   └── Graceful shutdown    # Prisma disconnect
│
└── routes/                  # API endpoint handlers
    ├── songs.ts             # Song CRUD
    │   ├── GET /
    │   ├── GET /:id
    │   ├── POST /
    │   ├── PUT /:id
    │   └── DELETE /:id
    │
    ├── serviceOrders.ts     # Service order management
    │   ├── GET /
    │   ├── POST /
    │   ├── PUT /:id
    │   └── DELETE /:id
    │
    ├── announcements.ts     # Announcement endpoints
    │   ├── GET /
    │   ├── POST /
    │   └── DELETE /:id
    │
    ├── scriptures.ts        # Scripture endpoints
    │   ├── GET /
    │   ├── POST /
    │   └── DELETE /:id
    │
    ├── media.ts             # Media file management
    │   ├── GET /
    │   ├── POST /upload
    │   └── DELETE /:id
    │
    └── import.ts            # File import handlers
        ├── POST /Ember
        └── POST /powerpoint
```

## Database Layer

```
prisma/
├── schema.prisma            # Database schema definition
│   ├── model Song           # Songs with verses/slides
│   ├── model Verse          # Song sections
│   ├── model Slide          # Display content
│   ├── model ServiceOrder   # Worship order
│   ├── model ServiceItem    # Service items
│   ├── model Announcement   # Announcements
│   ├── model Scripture      # Bible verses
│   ├── model MediaFile      # Images/videos
│   ├── model Playlist       # Song collections
│   └── model PlaylistSong   # Many-to-many
│
└── migrations/              # (Created by Prisma)
    └── migration_timestamp/ # Migration files
        ├── migration.sql    # SQL statements
        └── migration_lock.toml
```

## Configuration Files

```
Config Files:
├── package.json             # npm dependencies & scripts
├── tsconfig.json            # TypeScript compiler options
├── vite.config.ts           # Vite bundler config
├── electron-builder.yml     # Desktop build config
├── .env.local               # Local env vars (not in git)
├── .env.example             # Template for env vars
└── .gitignore               # Git ignore patterns
```

## Asset Folders (to be created)

```
assets/                     # (Optional) Project assets
├── icon.png                # App icon
├── logo.svg                # Logo
└── screenshots/            # Documentation screenshots

public/                     # (Optional) Static files
└── media/                  # Default media files
    ├── backgrounds/
    └── templates/
```

## File Statistics

```
Total Files:        40+
Total Lines:        5000+
CSS Files:          3
TypeScript Files:   20+
React Components:   6
API Routes:         6
Database Models:    10
Documentation:      6 files
```

## File Size Estimate

```
src/                ~150 KB
server/             ~50 KB
electron/           ~30 KB
prisma/             ~20 KB
Config files        ~30 KB
Docs (*.md)         ~200 KB
─────────────────────────
Total                ~500 KB (without node_modules)
```

## Generation Order (How files were created)

### Phase 1: Configuration
1. `package.json` - Dependencies
2. `tsconfig.json` - TypeScript config
3. `vite.config.ts` - Build config
4. `electron-builder.yml` - Electron config

### Phase 2: Database
1. `prisma/schema.prisma` - Database schema

### Phase 3: Types & Stores
1. `src/types/index.ts` - Type definitions
2. `src/store/presentationStore.ts` - State
3. `src/store/uiStore.ts` - UI state

### Phase 4: Services
1. `src/services/api.ts` - HTTP client
2. `src/services/fileImport.ts` - Import logic
3. `src/utils/hotkeys.ts` - Hotkey helpers
4. `src/utils/formatters.ts` - Formatting helpers

### Phase 5: Backend API
1. `server/index.ts` - Express server
2. `server/routes/songs.ts`
3. `server/routes/serviceOrders.ts`
4. `server/routes/announcements.ts`
5. `server/routes/scriptures.ts`
6. `server/routes/media.ts`
7. `server/routes/import.ts`

### Phase 6: Frontend Components
1. `src/components/DisplayEngine.tsx` - Main renderer
2. `src/components/StageMonitor.tsx` - Monitor
3. `src/components/OperatorPanel.tsx` - Operator UI
4. `src/components/SlideManager.tsx` - Slide editor
5. `src/components/SongEditor.tsx` - Song creator

### Phase 7: Pages
1. `src/pages/DisplayPage.tsx` - Display window
2. `src/pages/StageMonitorPage.tsx` - Monitor window

### Phase 8: Main App
1. `src/App.tsx` - Root component
2. `src/main.tsx` - React entry
3. `index.html` - HTML entry

### Phase 9: Electron
1. `electron/main.ts` - Main process
2. `electron/preload.ts` - IPC bridge

### Phase 10: Documentation
1. `README.md` - Full docs
2. `SETUP.md` - Setup guide
3. `ARCHITECTURE.md` - Architecture
4. `PROJECT_SUMMARY.md` - Summary
5. `QUICK_REFERENCE.md` - Reference
6. `FILE_STRUCTURE.md` - This file

### Phase 11: Environment
1. `.env.local` - Local config
2. `.env.example` - Template
3. `.gitignore` - Git config

## Import Tree (Dependency Graph)

```
index.html
└── src/main.tsx
    └── src/App.tsx
        ├── src/pages/DisplayPage.tsx
        │   └── src/components/DisplayEngine.tsx
        ├── src/pages/StageMonitorPage.tsx
        │   └── src/components/StageMonitor.tsx
        └── src/components/OperatorPanel.tsx
            ├── src/components/SongEditor.tsx
            ├── src/components/SlideManager.tsx
            └── src/services/api.ts
                ├── src/services/fileImport.ts
                └── axios (npm package)

Store (Zustand)
├── src/store/presentationStore.ts
│   └── src/types/index.ts
└── src/store/uiStore.ts

Electron
└── electron/main.ts
    └── electron/preload.ts

Server
└── server/index.ts
    ├── server/routes/songs.ts
    ├── server/routes/serviceOrders.ts
    ├── server/routes/announcements.ts
    ├── server/routes/scriptures.ts
    ├── server/routes/media.ts
    └── server/routes/import.ts
```

## Hot Module Reloading (HMR) Path

During development with Vite:

```
File Change
    ↓
Vite Detects (.ts, .tsx, .css)
    ↓
Bundles Changed Module
    ↓
WebSocket Message to Browser
    ↓
React Fast Refresh
    ↓
Component Updates (preserves state)
    ↓
Visible in Browser Immediately
```

## Build Output Structure

After `npm run build`:

```
dist/                       # React build
├── index.html              # Bundled
├── assets/
│   ├── main-xxxxx.js       # Bundled JS
│   └── index-xxxxx.css     # Bundled CSS
└── vite.svg

dist-electron/              # Electron build
├── main.js                 # Bundled main process
├── preload.js              # Bundled preload
└── resources/              # App assets

Ember-1.0.0.exe  # Windows installer
```

## Version Control Structure

If using Git:

```
.git/                       # Git repository
├── objects/                # Committed files
├── refs/                   # Branch pointers
└── HEAD                    # Current branch

.gitignore                  # Files to ignore
├── node_modules/           # Dependencies
├── dist/                   # Build output
├── .env.local              # Local config
└── .DS_Store               # macOS files
```

## Development Workflow File Modification Pattern

```
Edit Source File
    ↓
src/components/OperatorPanel.tsx
    ↓
Vite detects change
    ↓
React Fast Refresh
    ↓
Component re-renders
    ↓
See live update in browser
    
(No manual refresh needed!)
```

---

**Key Takeaways:**
- Well-organized, modular structure
- Clear separation of concerns
- Scalable component hierarchy
- TypeScript everywhere for safety
- Production-ready configuration
- Comprehensive documentation

**Total Project Size**: ~500 KB source code (excluding node_modules)  
**Installation Size**: ~800 MB (with dependencies)  
**Runtime Size**: ~100 MB loaded in memory
