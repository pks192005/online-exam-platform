# Windows Setup Guide

## Transferring the Project to Windows

Since this project was built on Linux, here's how to transfer it to your Windows machine:

### Method 1: Direct Download (Recommended)

If you have access to download the files:

1. Download the entire `z-vsme` folder
2. Copy it to your desired location (e.g., `D:\zproject\z-vsme`)
3. Follow the Quick Start Guide

### Method 2: Using Git

1. Initialize a git repository in the project:
   ```bash
   cd ~/z-vsme
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Push to GitHub/GitLab (if you have an account)

3. Clone on Windows:
   ```cmd
   cd D:\zproject
   git clone YOUR_REPO_URL z-vsme
   ```

### Method 3: Manual File Transfer

1. Compress the project on Linux:
   ```bash
   cd ~
   tar -czf z-vsme.tar.gz z-vsme/
   ```

2. Transfer the file to Windows using:
   - USB drive
   - Cloud storage (Google Drive, Dropbox, etc.)
   - Network share
   - SCP/SFTP

3. Extract on Windows using 7-Zip or WinRAR

## Windows-Specific Setup

### 1. Install Required Software

#### Docker Desktop
1. Download from: https://www.docker.com/products/docker-desktop
2. Run the installer
3. Restart your computer if prompted
4. Start Docker Desktop
5. Wait for Docker to fully start (green icon in system tray)

#### Optional: Git for Windows
- Download from: https://git-scm.com/download/win
- Useful for version control

#### Optional: Visual Studio Code
- Download from: https://code.visualstudio.com/
- Great for editing code

### 2. Configure Line Endings (Important!)

Windows uses different line endings (CRLF) than Linux (LF). To avoid issues:

#### Option A: Using Git
If you cloned via Git, configure it:
```cmd
git config --global core.autocrlf false
```

#### Option B: Manual Fix
If you copied files directly, you may need to convert line endings:
1. Open files in VS Code
2. Click on "CRLF" or "LF" in the bottom right
3. Select "LF" for all files

### 3. Update File Paths

The project uses Unix-style paths. Docker handles this automatically, but if you run without Docker:

In `backend/.env`:
```env
# No changes needed - Docker handles paths
```

In `frontend/.env.local`:
```env
# No changes needed - Docker handles paths
```

### 4. Windows Firewall

You may need to allow Docker through Windows Firewall:
1. Open Windows Security
2. Go to Firewall & network protection
3. Click "Allow an app through firewall"
4. Find "Docker Desktop" and ensure it's checked

### 5. Port Conflicts

Check if ports are available:
```cmd
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :27017
```

If ports are in use, either:
- Stop the conflicting application
- Change ports in `docker-compose.yml`

## Running on Windows

### Using Docker (Recommended)

1. Open Command Prompt or PowerShell as Administrator
2. Navigate to project:
   ```cmd
   cd D:\zproject\z-vsme
   ```
3. Start services:
   ```cmd
   docker-compose up -d
   ```
4. Access at http://localhost:3000

### Using PowerShell

PowerShell commands are the same as CMD:
```powershell
cd D:\zproject\z-vsme
docker-compose up -d
docker-compose logs -f
docker-compose down
```

### Using Git Bash

If you installed Git for Windows:
```bash
cd /d/zproject/z-vsme
docker-compose up -d
```

## Running Without Docker (Advanced)

If you prefer to run without Docker:

### Prerequisites
1. Install Node.js 22+ from https://nodejs.org/
2. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community

### Backend Setup
```cmd
cd D:\zproject\z-vsme\backend
npm install
npm run start:dev
```

### Frontend Setup
```cmd
cd D:\zproject\z-vsme\frontend
npm install
npm run dev
```

### MongoDB Setup
1. Start MongoDB service:
   ```cmd
   net start MongoDB
   ```
2. Or run manually:
   ```cmd
   "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
   ```

## Windows-Specific Tips

### 1. Path Separators
- Windows uses backslash `\`
- Docker and Node.js work with both `/` and `\`
- Use forward slash `/` in code for cross-platform compatibility

### 2. Environment Variables
Set environment variables in Windows:
```cmd
set MONGODB_URI=mongodb://localhost:27017/exam-management
```

Or use PowerShell:
```powershell
$env:MONGODB_URI="mongodb://localhost:27017/exam-management"
```

### 3. File Permissions
Windows doesn't have the same permission system as Linux. Docker handles this automatically.

### 4. Case Sensitivity
Windows file system is case-insensitive, but the code may be case-sensitive. Be careful with:
- Import statements
- File names
- Environment variable names

## Troubleshooting Windows Issues

### Docker Desktop Won't Start
1. Enable Hyper-V in Windows Features
2. Enable WSL 2 (Windows Subsystem for Linux)
3. Update Windows to latest version
4. Restart computer

### WSL 2 Installation
If Docker requires WSL 2:
```cmd
wsl --install
wsl --set-default-version 2
```

### Permission Denied Errors
Run Command Prompt or PowerShell as Administrator:
1. Right-click on Command Prompt
2. Select "Run as administrator"

### Port Already in Use
Find and kill the process:
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### MongoDB Connection Issues
1. Check if MongoDB container is running:
   ```cmd
   docker ps
   ```
2. Check MongoDB logs:
   ```cmd
   docker-compose logs mongodb
   ```

### Node Modules Issues
If you get module errors:
```cmd
cd backend
rmdir /s /q node_modules
npm install

cd ..\frontend
rmdir /s /q node_modules
npm install
```

## Development on Windows

### Recommended Tools

1. **Visual Studio Code**
   - Install extensions: ESLint, Prettier, Docker
   - Open project: `code D:\zproject\z-vsme`

2. **Windows Terminal**
   - Better than Command Prompt
   - Download from Microsoft Store

3. **Postman**
   - For API testing
   - Download from https://www.postman.com/

4. **MongoDB Compass**
   - GUI for MongoDB
   - Download from https://www.mongodb.com/products/compass

### Hot Reload

Both frontend and backend support hot reload:
- Backend: Changes auto-reload in dev mode
- Frontend: Changes auto-reload with Next.js

### Debugging

#### Backend (NestJS)
Add to VS Code `launch.json`:
```json
{
  "type": "node",
  "request": "attach",
  "name": "Attach to Backend",
  "port": 9229,
  "restart": true
}
```

#### Frontend (Next.js)
Use browser DevTools or VS Code debugger

## Performance Tips

1. **Use WSL 2** for better Docker performance
2. **Exclude from Windows Defender**:
   - Add `node_modules` folders to exclusions
   - Add Docker data directory
3. **Allocate more resources** to Docker Desktop:
   - Settings → Resources
   - Increase CPU and Memory

## Next Steps

1. Follow QUICK_START.md for first-time setup
2. Read README.md for detailed documentation
3. Check PROJECT_SUMMARY.md for architecture overview
4. Start building additional features!

## Getting Help

If you encounter issues:
1. Check Docker Desktop logs
2. Check application logs: `docker-compose logs -f`
3. Verify all environment variables are set
4. Ensure Docker Desktop is running
5. Try restarting Docker Desktop
6. Restart your computer if all else fails
