# ProPresenter Clone - Architecture

## Overview

This is a three-tier application:

1. **Electron Desktop App** (Presentation Layer)
2. **React Frontend** (UI Layer)
3. **Node.js Backend** (Business Logic & Data Layer)

## Architecture Diagram

```
┌─────────────────────────────────────┐
│     Electron Main Process           │
│  (Window Management, IPC)           │
└──────────────┬──────────────────────┘
               │
      ┌────────┼────────┐
      │        │        │
      v        v        v
┌──────────┬──────────┬─────────────┐
│  Operator│ Display  │Stage Monitor│
│ Window   │ Window   │  Window     │
│(Main UI) │(Full-scr)│(Confidence) │
└────┬─────┴────┬─────┴──────┬──────┘
     │          │            │
     └──────────┼────────────┘
                │
         ┌──────v───────┐
         │ React App    │
         │ (Vite Dev)   │
         └──────┬───────┘
                │
         ┌──────v──────────────┐
         │ Zustand Store       │
         │ (State Management)  │
         └──────┬──────────────┘
                │
         ┌──────v──────────────────┐
         │ API Service Layer       │
         │ (HTTP / Axios)          │
         └──────┬──────────────────┘
                │
         ┌──────v──────────────┐
         │ Node.js Backend     │
         │ (Express Server)    │
         └──────┬──────────────┘
                │
         ┌──────v──────────────┐
         │ Prisma ORM          │
         │ Database Access     │
         └──────┬──────────────┘
                │
         ┌──────v──────────────┐
         │ MySQL Database      │
         │ (Persistent Data)   │
         └─────────────────────┘
```

## Component Architecture

### Electron Layer

**Files**: `electron/main.ts`, `electron/preload.ts`

Responsibilities:
- Window creation and management
- Multi-display detection and handling
- IPC (Inter-Process Communication) between renderer and main process
- Global hotkey registration
- File system access
- Display output management

Key Features:
- Manages 3 windows: Main (operator), Display (full-screen), Stage Monitor
- Automatic multi-monitor detection
- IPC bridge for secure communication

### Frontend - React Layer

**Files**: `src/pages/`, `src/components/`

#### Pages
- **DisplayPage**: Full-screen audience display
- **OperatorPanel**: Main operator control interface
- **StageMonitorPage**: Confidence monitor with notes & next slide

#### Key Components
- **DisplayEngine**: Renders slides with backgrounds (images, videos, colors)
- **StageMonitor**: Shows current/next slide, timer, notes
- **OperatorPanel**: Song selection, slide navigation, playback controls
- **SlideManager**: Slide editing interface
- **SongEditor**: Create/edit songs with lyrics

### State Management - Zustand

**Files**: `src/store/`

#### Stores
- **presentationStore**: 
  - Current slide, song, service order
  - Playback state (play/pause/blank)
  - Navigation functions
  
- **uiStore**:
  - Window type detection
  - Sidebar state
  - Selected items for UI context

Benefits:
- Lightweight and performant
- No context provider boilerplate
- Direct state mutations possible
- DevTools support

### API Service Layer

**Files**: `src/services/api.ts`, `src/services/fileImport.ts`

#### API Service
- Centralized HTTP client (Axios)
- CRUD operations for all resources
- File import/export operations

#### File Import Service
- ProPresenter (.pro) XML parsing
- PowerPoint (.pptx) extraction and parsing
- JSON import support
- Slide generation from lyrics

### Backend - Express Server

**Files**: `server/index.ts`, `server/routes/`

#### Routes
- `/api/songs` - Song CRUD
- `/api/service-orders` - Service order management
- `/api/announcements` - Announcement templates
- `/api/scriptures` - Scripture database
- `/api/media` - Media file management
- `/api/import` - File import handlers

#### Database Layer
- Prisma ORM for type-safe database access
- Auto-generated database migrations
- Connection pooling

### Database Layer

**Files**: `prisma/schema.prisma`

#### Models
- **Song**: Contains verses and slides
- **Verse**: Individual song sections
- **Slide**: Display content unit
- **ServiceOrder**: Worship service structure
- **ServiceItem**: Links songs/announcements to service
- **Announcement**: Temporary display messages
- **Scripture**: Bible verse data
- **MediaFile**: Uploaded images/videos
- **Playlist**: Reusable song collections

## Data Flow

### Playing a Song

1. **User selects song** in OperatorPanel
2. **presentationStore.setCurrentSong()** updates Zustand
3. **First slide** automatically loads into displayState
4. **Window.electronAPI.sendToDisplay()** sends data to Display window via IPC
5. **DisplayPage receives update** via IPC listener
6. **DisplayEngine renders** the slide with background media

### Navigating Slides

1. **User presses hotkey** (Right Arrow / Space)
2. **OperatorPanel hotkey handler** calls nextSlide()
3. **presentationStore.nextSlide()** updates displayState.currentSlide
4. **React re-renders** DisplayEngine with new slide
5. **CSS animation** fades in new content

### Creating Service Order

1. **User adds songs** to service order in UI
2. **ServiceOrder created** in MySQL via Express API
3. **ID stored** in presentationStore
4. **Items sync** automatically across all windows

## Communication Patterns

### React State → Display Windows

```
Main Window         Display Window
    │                    │
    └─ setCurrentSlide ──┴─ displayUpdate IPC
    
    └─ IPC invoke ──────┬─ Listen onDisplayUpdate
```

### User Input → State Changes

```
User Input
    │
    ├─ Hotkey Event
    ├─ Button Click
    └─ Form Submit
         │
         └─ Store Action (presentationStore.nextSlide)
              │
              └─ State Update (Zustand)
                   │
                   └─ Component Re-render
                        │
                        └─ Send to Display
```

### File Import Flow

```
User selects file
    │
    ├─ FileImportService.importFile()
    │   ├─ Parse XML/PPTX
    │   └─ Generate Slides
    │
    ├─ API POST /import
    │   ├─ Prisma create Song
    │   └─ Prisma create Slides
    │
    └─ setState() in Zustand
         │
         └─ UI Updates
```

## Performance Optimizations

### Frontend
- Memoized components with React.memo
- Zustand selector pattern to prevent unnecessary re-renders
- Lazy loading of song lists
- CSS animations instead of JS animations

### Backend
- Connection pooling via Prisma
- Database indexes on frequently queried fields
- JSON response compression
- Pagination for large lists

### Display Engine
- GPU-accelerated CSS transforms
- Hardware video decoding (HTML5 video)
- Efficient background rendering
- Minimal DOM updates

## Security Considerations

### Context Isolation
- Electron IPC uses context isolation
- Preload bridge exposes only necessary APIs
- No direct Node.js access from renderer

### Input Validation
- Backend validates all inputs
- SQL injection prevention via Prisma parameterized queries
- File upload validation (type, size)

### Data Protection
- Environment variables for sensitive config
- No secrets in version control (.gitignore)
- CORS enabled for API access

## Scalability

### Current Limitations
- Single operator (no multi-operator sync)
- Local MySQL only (no distributed DB)
- Limited to 2-3 display outputs

### Future Improvements
- WebSocket for real-time sync
- Support for multiple operators
- Cloud database integration
- Remote operator capabilities

## Testing Strategy

### Unit Tests
- Zustand store mutations
- Utility functions (formatTime, etc.)
- API service methods

### Integration Tests
- API endpoint responses
- Database operations via Prisma
- File import workflows

### E2E Tests
- Full song creation → display workflow
- Multi-window communication
- Hotkey functionality

## Deployment

### Development
- Vite dev server with hot reload
- Electron with dev tools
- Express dev server with nodemon

### Production
- Bundled React app (Vite build)
- Electron app distributed via electron-builder
- Backend deployed to production server
- MySQL hosted on production database

## Technology Decisions

| Layer | Technology | Why |
|-------|-----------|-----|
| Desktop | Electron | Cross-platform, proven for apps |
| Frontend | React + TS | Type-safe, component-based UI |
| State | Zustand | Lightweight, simple, performant |
| Styling | Ant Design | Professional UI, accessibility |
| Backend | Express | Simple, middleware-friendly |
| Database | MySQL + Prisma | Type-safe ORM, migrations |
| Build | Vite | Fast, modern, optimized |
| IPC | Electron IPC | Secure, efficient communication |

## Future Architecture Enhancements

1. **Service Workers** for offline support
2. **IndexedDB** for local caching
3. **WebRTC** for multi-operator sync
4. **Streaming** via RTMP/HLS
5. **Plugin System** for extensibility
