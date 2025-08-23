# FixMyEvent Port Configuration System

## 🚀 Quick Start

### Setup (Choose your platform)
```bash
# Linux/macOS
npm run ports:setup

# Windows
npm run ports:setup:win
```

### Basic Usage
```bash
# Check status of all services
npm run ports:status

# Start all services
npm run ports:start

# Stop all services
npm run ports:stop

# Start specific service
npm run ports:start next-dev
npm run ports:start functions
npm run ports:start genkit
```

## 📋 Port Assignments

| Service | Port | Description |
|---------|------|-------------|
| **Next.js Dev** | 3000 | Main development server |
| **Next.js Start** | 3001 | Production server |
| **Firebase Functions** | 5001 | Backend functions |
| **Firebase UI** | 4000 | Emulator dashboard |
| **Firebase Auth** | 9099 | Authentication emulator |
| **Firebase Firestore** | 8080 | Database emulator |
| **Firebase Storage** | 9199 | Storage emulator |
| **Genkit AI** | 11434 | AI service |

## 🔧 Available Commands

### Port Management
- `npm run ports:start` - Start all services
- `npm run ports:stop` - Stop all services
- `npm run ports:status` - Show service status
- `npm run ports:summary` - Generate ports summary
- `npm run ports:validate` - Validate configuration

### Development
- `npm run dev` - Start Next.js dev server (port 3000)
- `npm run dev:all` - Start all development services
- `npm run functions:dev` - Start Firebase functions (port 5001)
- `npm run genkit:dev` - Start AI service (port 11434)

### Firebase
- `npm run emulators:start` - Start all Firebase emulators
- `npm run functions:serve` - Start functions emulator

## 📁 Key Files

- `ports.config.js` - Central port configuration
- `scripts/manage-ports.js` - Port management script
- `scripts/validate-ports.js` - Port validation script
- `PORTS_DOCUMENTATION.md` - Complete documentation
- `PORTS_SUMMARY.md` - Generated port summary

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Check what's using a port
npm run ports:check 3000

# Kill process (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process (macOS/Linux)
lsof -ti:3000 | xargs kill -9
```

### Service Won't Start
1. Check port availability: `npm run ports:status`
2. Verify dependencies are running
3. Check service logs
4. Ensure environment variables are set

## 📚 Documentation

- **Complete Guide**: `PORTS_DOCUMENTATION.md`
- **Port Summary**: `PORTS_SUMMARY.md`
- **Configuration**: `ports.config.js`

## 🎯 Benefits

✅ **No Port Conflicts** - Each service has a unique port  
✅ **Easy Management** - Simple commands to start/stop services  
✅ **Cross-platform** - Works on Windows, macOS, and Linux  
✅ **Automated Setup** - One-command setup and validation  
✅ **Comprehensive** - Covers all services and functions  
✅ **Well Documented** - Complete usage instructions  

---

**Need Help?** Run `npm run ports:status` to see current service status!
