# ProPresenter Clone - Quick Reference

## Installation (5 minutes)

```bash
# 1. Navigate to project
cd c:\Users\Sonali\coding\pp-clone

# 2. Install dependencies
npm install

# 3. Create database
mysql -u root -p
> CREATE DATABASE propresenter;
> EXIT

# 4. Setup database
npx prisma generate
npx prisma migrate dev --name init
```

## Running Development

Open **3 Terminal Windows**:

```bash
# Terminal 1 - Frontend (Vite)
npm run dev:vite
# Wait for "Local: http://localhost:5173/"

# Terminal 2 - Backend (Express)
npm run server:dev
# Wait for "✓ Server running on http://localhost:3001"

# Terminal 3 - Electron (Desktop App)
npm run dev:electron
# Opens 3 windows: Operator, DevTools, ready for display
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` or `→` | Next slide |
| `←` | Previous slide |
| `B` | Blank/unblank |
| `Ctrl+D` | Toggle display window |
| `Ctrl+S` | Toggle stage monitor |
| `Ctrl+M` | Focus main window |
| `End` | Clear screen |
| `F12` | Open dev tools |

## Common Commands

```bash
# Start development (all 3 in one, from separate terminals)
npm run dev:vite        # Terminal 1
npm run server:dev      # Terminal 2  
npm run dev:electron    # Terminal 3

# Build for production
npm run build           # Creates .exe for Windows

# Database management
npx prisma studio      # Open visual database editor
npx prisma migrate reset  # Reset database (deletes data!)

# Generate new migration
npx prisma migrate dev --name add_new_feature
```

## File Structure Quick Map

```
src/
├── components/         # UI pieces (DisplayEngine, OperatorPanel, etc.)
├── pages/             # Full-page views (DisplayPage, StageMonitorPage)
├── store/             # State management (Zustand)
├── services/          # API calls, file import
├── types/             # TypeScript interfaces
└── utils/             # Helpers (hotkeys, formatters)

server/
└── routes/            # API endpoints

electron/
├── main.ts            # Window management
└── preload.ts         # IPC bridge

prisma/
└── schema.prisma      # Database definition
```

## Windows in Development

1. **Main Window** (Operator)
   - URL: http://localhost:5173?window=main
   - Where you control everything
   - Song library on left, slide controls, previews

2. **Display Window** 
   - URL: http://localhost:5173?window=display
   - Full-screen presentation output
   - Shows audience display

3. **Stage Monitor**
   - URL: http://localhost:5173?window=stage-monitor
   - Confidence monitor
   - Current slide, next slide, timer, notes

## Create Your First Song

1. Click "New Song" button
2. Fill in:
   - Title: e.g., "Amazing Grace"
   - Artist: e.g., "John Newton"
   - Lyrics: Paste verse/chorus, separate with blank lines
3. Click "Save Song"
4. Select from sidebar and click "Play"
5. Use arrow keys to navigate slides

## Import Existing Presentations

1. Click "Import Song" button
2. Select file:
   - `.pro` (ProPresenter)
   - `.pptx` (PowerPoint)
   - `.json` (JSON format)
3. Songs appear in sidebar

## Troubleshooting

### Port already in use
```bash
# Find process using port 5173
netstat -ano | findstr :5173
# Kill it
taskkill /PID <PID> /F
```

### Database connection error
```bash
# Check MySQL is running
mysql -u root -p
# Verify .env.local has correct DATABASE_URL
# Check database exists
mysql -u root -p -e "SHOW DATABASES;"
```

### Display window won't open
- Connect second monitor, or
- Manually drag window to different position
- Check console (F12) for errors

### Import file fails
- Ensure correct file format (.pro, .pptx, .json)
- Check console for specific error message
- Validate file isn't corrupted

### Electron won't start
```bash
npm install electron --save-dev
npm run dev:electron
```

## Database Queries (via Prisma Studio)

```bash
# Open visual database editor
npx prisma studio

# Then navigate to http://localhost:5555
# Browse/edit data visually
```

## Building for Distribution

```bash
# Clean build
rm -r dist dist-electron node_modules
npm install

# Build
npm run build

# Creates: dist-electron/ProPresenter Clone-1.0.0.exe
```

## Environment Variables

```env
# .env.local file

# Frontend
VITE_API_URL=http://localhost:3001/api

# Backend
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=mysql://root:PASSWORD@localhost:3306/propresenter
```

## Key Components

### DisplayEngine.tsx
- Renders slides with backgrounds
- Handles videos, images, colors
- Smooth animations

### OperatorPanel.tsx
- Main control interface
- Song selection, slide navigation
- Playback controls

### StageMonitor.tsx
- Confidence monitor view
- Current/next slide, timer, notes

### SongEditor.tsx
- Create/edit songs
- Manage lyrics

### SlideManager.tsx
- Slide CRUD operations
- Text styling

## API Endpoints (Backend)

```
GET  /api/songs              # Get all songs
POST /api/songs              # Create song
GET  /api/songs/:id          # Get song by ID
PUT  /api/songs/:id          # Update song
DEL  /api/songs/:id          # Delete song

GET  /api/announcements      # Get announcements
POST /api/announcements      # Create announcement

GET  /api/scriptures         # Get scriptures
POST /api/scriptures         # Create scripture

GET  /api/service-orders     # Get service orders
POST /api/service-orders     # Create service order

GET  /api/media              # List media files
POST /api/media/upload       # Upload media

POST /api/import/propresenter # Import .pro file
POST /api/import/powerpoint   # Import .pptx file
```

## Git Commands (if using version control)

```bash
# Initial setup
git init
git add .
git commit -m "Initial ProPresenter clone"

# Make changes
git add src/components/SomeFile.tsx
git commit -m "Add new feature"

# View history
git log
```

## Performance Tips

1. Use H.264 video (best hardware support)
2. Pre-resize large images
3. Close other apps during presentation
4. Use solid colors instead of video if laggy
5. Monitor CPU usage in Task Manager

## Deployment Checklist

- [ ] Test on target machines
- [ ] Verify database connection on production server
- [ ] Set NODE_ENV=production
- [ ] Build optimized production bundle
- [ ] Test all hotkeys work
- [ ] Verify multi-monitor detection
- [ ] Test file import functionality
- [ ] Backup database before deployment

## Documentation Files

- **README.md** - Full feature docs
- **SETUP.md** - Detailed setup guide  
- **ARCHITECTURE.md** - Technical architecture
- **PROJECT_SUMMARY.md** - Feature overview
- **QUICK_REFERENCE.md** - This file!

## Support Resources

1. **Console Errors**: Press F12 in main window
2. **Database Issues**: Run `npx prisma studio`
3. **Build Issues**: Delete node_modules and `npm install` again
4. **Cannot Debug**: Use `npm run dev:electron` to start fresh

## Development Workflow

```
1. Make code changes
2. Save file (hot-reload works in Vite)
3. View changes in browser automatically
4. If major changes: restart Electron
5. Test across all 3 windows
6. Commit to git when working
```

## Next: Customization Ideas

- [ ] Add custom theme colors
- [ ] Create announcement templates
- [ ] Set up verse templates
- [ ] Configure service order preferences
- [ ] Add stage monitor customization
- [ ] Create hotkey profiles

---

**Start here**: `SETUP.md` for step-by-step installation  
**Go deeper**: `ARCHITECTURE.md` for technical details  
**Full docs**: `README.md` for everything

Happy presenting! 🎉
