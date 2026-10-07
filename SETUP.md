# ProPresenter Clone - Quick Setup Guide

## 1. Prerequisites

Install these first:
- **Node.js 16+**: https://nodejs.org/
- **MySQL 5.7+**: https://dev.mysql.com/downloads/mysql/
- **Git**: https://git-scm.com/ (optional)

## 2. Initial Setup

### Clone/Create Project

```bash
# If you have git
cd c:\Users\Sonali\coding\pp-clone

# All files are already created
```

### Install Dependencies

```bash
npm install
```

This will install ~500 packages. Takes 2-5 minutes.

## 3. Database Setup

### Create Database

Open MySQL command line or use MySQL Workbench:

```sql
CREATE DATABASE propresenter;
```

### Configure Environment

Edit `.env.local`:

```env
DATABASE_URL=mysql://root:PASSWORD@localhost:3306/propresenter
VITE_API_URL=http://localhost:3001/api
PORT=3001
NODE_ENV=development
```

Replace `PASSWORD` with your MySQL root password.

### Run Migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

This creates all tables. You'll see:
```
✓ Generated Prisma Client
✓ Run migrations
✓ 10 tables created
```

## 4. Start Development

### Terminal 1 - Frontend (Vite Dev Server)

```bash
npm run dev:vite
```

Wait for:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### Terminal 2 - Backend (Express Server)

```bash
npm run server:dev
```

Wait for:
```
✓ Server running on http://localhost:3001
```

### Terminal 3 - Electron App

```bash
npm run dev:electron
```

This opens 3 windows:
1. **Main Window** - Operator control (http://localhost:5173?window=main)
2. **DevTools** - Debugging console
3. You can press `Ctrl+D` to open Display window
4. Press `Ctrl+S` to open Stage Monitor

## 5. Test It

### Create Your First Song

1. In Main Window, click **"New Song"**
2. Enter:
   - Title: "Amazing Grace"
   - Artist: "John Newton"
   - Lyrics: Paste any hymn or song lyrics
3. Click **Save**

### Play It

1. Select the song from left sidebar
2. Click **Play** button (or press Space)
3. Press **Right Arrow** to next slide
4. Press **B** to blank screen

### View on Display

1. Press **Ctrl+D** to open Display window (on 2nd monitor if available)
2. See your lyrics rendered full-screen
3. Stage Monitor shows on another window with timer + next slide

## 6. Import Real Content

### ProPresenter Files (.pro)

1. Click **"Import Song"**
2. Select a `.pro` file
3. Songs and slides auto-import

### PowerPoint Files (.pptx)

1. Click **"Import Song"**
2. Select a `.pptx` file
3. Each slide becomes a presentation slide

### JSON Files

```json
[
  {
    "title": "Song Name",
    "artist": "Artist",
    "slides": [
      {
        "title": "Slide 1",
        "content": "Slide text here",
        "textStyle": {
          "fontSize": 48,
          "color": "#FFFFFF"
        }
      }
    ]
  }
]
```

## 7. Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Space** | Next slide |
| **→** | Next slide |
| **←** | Previous slide |
| **B** | Blank/Unblank screen |
| **Ctrl+D** | Toggle Display window |
| **Ctrl+S** | Toggle Stage Monitor |
| **Ctrl+M** | Focus Main window |

## 8. Multi-Monitor Setup

The app auto-detects monitors:

- **Display 1** (Main): Operator control
- **Display 2** (if available): Full-screen audience display
- **Display 3** (if available): Stage confidence monitor

To test on single monitor:
1. Main Window on your primary display
2. Drag Display/Stage Monitor windows around
3. Or open DevTools to simulate multi-monitor

## 9. Database Management

### View Data

```bash
npx prisma studio
```

Opens http://localhost:5555 with visual database editor.

### Reset Database

```bash
npx prisma migrate reset
```

⚠️ **Warning**: Deletes all data. Useful for development/testing.

### Create Backup

```bash
# mysqldump -u root -p propresenter > backup.sql
```

### Restore Backup

```bash
# mysql -u root -p propresenter < backup.sql
```

## 10. Troubleshooting

### Port Already in Use

If you get "Port 5173 already in use":

```bash
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Database Connection Failed

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Fix**:
- Is MySQL running? Start MySQL service
- Check `DATABASE_URL` in `.env.local`
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Electron Won't Start

```
Error: Cannot find module 'electron'
```

**Fix**:
```bash
npm install electron --save-dev
```

### Display Window Blank

- Check that a 2nd monitor is connected
- Or manually drag the window to a different position
- Check console for errors: **Ctrl+Shift+I** in main window

### Import File Not Working

- Ensure file format is .pro, .pptx, or .json
- For .pro/.pptx files, they must be valid ProPresenter/PowerPoint files
- Check console for specific errors

## 11. Production Build

### Build Desktop App

```bash
npm run build
```

Creates installer in `dist-electron/`:
- Windows: `.exe` installer
- macOS: `.dmg`
- Linux: `.AppImage`

### Build Web Only

```bash
npx vite build
```

Creates optimized build in `dist/` folder.

## 12. Next Steps

- [ ] Customize theme colors in Ant Design
- [ ] Add custom backgrounds and logos
- [ ] Import your existing presentation files
- [ ] Set up service orders for multiple songs
- [ ] Configure stage monitor for your layout
- [ ] Add announcements and scripture verses
- [ ] Create hotkey profiles for different uses

## Performance Tips

- Use hardware video codecs (H.264) for best performance
- Pre-import and resize large images
- Close other applications for smoother playback
- Use solid colors instead of video backgrounds if experiencing lag

## Need Help?

- Check `README.md` for full documentation
- View `ARCHITECTURE.md` for technical details
- Check browser console (**F12**) for errors
- Prisma errors usually indicate database issues

---

**Enjoy your ProPresenter Clone!** 🎉

Questions? Issues? Check the GitHub discussions or create an issue.
