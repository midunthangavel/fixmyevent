# FixMyEvent Port Configuration Documentation

## Overview

This document describes the comprehensive port configuration system for FixMyEvent, which has been redesigned to provide unique ports for each service and function, eliminating port conflicts and improving development workflow.

## Port Configuration Structure

The port configuration is centralized in `ports.config.js` and organized into logical categories:

### Main Application Ports
- **Next.js Dev Server**: 3000
- **Next.js Production Server**: 3001
- **Next.js Build Server**: 3002

### Firebase Emulator Ports
- **Auth**: 9099
- **Firestore**: 8080
- **Storage**: 9199
- **UI**: 4000
- **Functions**: 5001
- **Hosting**: 5000
- **PubSub**: 8085
- **DataConnect**: 8086

### Development Services
- **Genkit AI**: 11434
- **Jest Testing**: 9229
- **Playwright**: 9323
- **Storybook**: 6006
- **Cypress**: 3003

### API and Microservices
- **Main API**: 8000
- **Auth API**: 8001
- **Venue API**: 8002
- **Booking API**: 8003
- **AI API**: 8004
- **Payment API**: 8005
- **Notification API**: 8006
- **Analytics API**: 8007

### WebSocket Services
- **Main WebSocket**: 8008
- **Chat WebSocket**: 8009
- **Notification WebSocket**: 8010
- **Live Events WebSocket**: 8011

### Testing and Quality Assurance
- **Unit Tests**: 8016
- **Integration Tests**: 8017
- **E2E Tests**: 8018
- **Performance Tests**: 8019
- **Load Tests**: 8020

## Quick Start

### 1. Check Current Port Status
```bash
npm run ports:status
```

### 2. Start All Services
```bash
npm run ports:start
```

### 3. Start Specific Service
```bash
npm run ports:start next-dev
npm run ports:start functions
npm run ports:start genkit
```

### 4. Stop All Services
```bash
npm run ports:stop
```

### 5. Stop Specific Service
```bash
npm run ports:stop functions
```

### 6. Generate Port Summary
```bash
npm run ports:summary
```

### 7. Check Port Availability
```bash
npm run ports:check 3000
```

## Development Workflows

### Development Mode
```bash
# Start Next.js development server
npm run dev                    # Port 3000

# Start Firebase functions
npm run functions:dev          # Port 5001

# Start Genkit AI service
npm run genkit:dev            # Port 11434

# Start all services together
npm run dev:all
```

### Production Mode
```bash
# Build the application
npm run build

# Start production server
npm run start                 # Port 3001
```

### Firebase Emulators
```bash
# Start all emulators
npm run emulators:start

# Start only functions
npm run functions:serve       # Port 5001
```

## Port Management Script

The `scripts/manage-ports.js` script provides a comprehensive interface for managing all services:

### Features
- **Port Availability Checking**: Automatically checks if ports are available before starting services
- **Process Management**: Tracks running processes and provides graceful shutdown
- **Service Orchestration**: Can start/stop multiple services simultaneously
- **Status Monitoring**: Real-time status of all services and ports
- **Cross-platform Support**: Works on Windows, macOS, and Linux

### Usage Examples

```bash
# Start all main services
node scripts/manage-ports.js start

# Start specific service
node scripts/manage-ports.js start next-dev

# Check service status
node scripts/manage-ports.js status

# Generate documentation
node scripts/manage-ports.js summary
```

## Environment Configuration

### Environment Variables
The following environment variables are automatically configured:

```bash
# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FUNCTIONS_URL=http://localhost:5001
NEXT_PUBLIC_FIREBASE_UI_URL=http://localhost:4000

# AI Service
NEXT_PUBLIC_LOCAL_AI_BASE_URL=http://localhost:11434
```

### Configuration Files Updated
- `package.json` - Scripts with port specifications
- `firebase.json` - Emulator port configuration
- `.replit` - Replit port configuration
- `.idx/dev.nix` - Development environment ports
- `env.local.example` - Environment template
- `env.template` - Environment template

## Port Conflict Resolution

### Automatic Port Checking
The port management system automatically checks for port conflicts before starting services.

### Port Validation
```bash
# Validate all port assignments
node -e "import('./ports.config.js').then(c => console.log(c.validatePorts()))"
```

### Common Port Conflicts
- **Port 3000**: Often used by other Next.js applications
- **Port 8080**: Commonly used by other development servers
- **Port 5000**: Used by various development tools

## Service Dependencies

### Service Startup Order
1. **Database Services** (Firebase Emulators)
2. **Backend Services** (Functions, AI)
3. **Frontend Services** (Next.js)

### Health Checks
Each service includes health check endpoints:
- **Next.js**: `http://localhost:3000/api/health`
- **Functions**: `http://localhost:5001/health`
- **Genkit**: `http://localhost:11434/health`

## Troubleshooting

### Port Already in Use
```bash
# Check what's using a port
npm run ports:check 3000

# Kill process using port (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process using port (macOS/Linux)
lsof -ti:3000 | xargs kill -9
```

### Service Won't Start
1. Check if required ports are available
2. Verify service dependencies are running
3. Check service logs for errors
4. Ensure environment variables are set

### Performance Issues
- Use `npm run ports:status` to monitor service health
- Check for port conflicts
- Verify no duplicate services are running

## Best Practices

### Development
1. **Use Port Management Scripts**: Always use the provided scripts for starting/stopping services
2. **Check Port Status**: Verify port availability before starting services
3. **Monitor Services**: Use status commands to monitor running services
4. **Graceful Shutdown**: Use stop commands instead of force-killing processes

### Production
1. **Port Isolation**: Ensure production services use different ports than development
2. **Health Monitoring**: Implement health checks for all services
3. **Port Documentation**: Maintain clear documentation of port assignments
4. **Security**: Restrict access to development ports in production

### Team Development
1. **Port Coordination**: Coordinate port usage with team members
2. **Documentation**: Keep port assignments documented and updated
3. **Conflict Resolution**: Use port management tools to resolve conflicts
4. **Standardization**: Use consistent port assignments across environments

## Migration Guide

### From Old Configuration
If you're migrating from the old port configuration:

1. **Backup Current Setup**: Save your current working configuration
2. **Install New Dependencies**: Ensure all required packages are installed
3. **Update Scripts**: Replace old scripts with new port management commands
4. **Test Services**: Verify all services start correctly with new ports
5. **Update Documentation**: Update team documentation with new port assignments

### Environment Variables
Update your `.env.local` file with new port configurations:

```bash
# Old configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# New configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FUNCTIONS_URL=http://localhost:5001
NEXT_PUBLIC_FIREBASE_UI_URL=http://localhost:4000
```

## Future Enhancements

### Planned Features
- **Dynamic Port Assignment**: Automatic port selection based on availability
- **Port Monitoring Dashboard**: Web-based interface for port management
- **Service Discovery**: Automatic service detection and port assignment
- **Load Balancing**: Port-based load balancing for multiple instances
- **Health Monitoring**: Advanced health checks and alerting

### Extensibility
The port configuration system is designed to be easily extensible:
- Add new services by updating `ports.config.js`
- Create custom port management scripts
- Integrate with CI/CD pipelines
- Support for containerized environments

## Support and Maintenance

### Getting Help
- **Documentation**: Check this document first
- **Scripts**: Use built-in help commands
- **Status**: Check service status for troubleshooting
- **Logs**: Review service logs for error details

### Contributing
To contribute to the port configuration system:
1. Update `ports.config.js` with new services
2. Add corresponding scripts to `package.json`
3. Update documentation
4. Test port conflicts and validation
5. Submit pull request with changes

### Maintenance
- **Regular Updates**: Keep port assignments current
- **Conflict Resolution**: Resolve port conflicts promptly
- **Documentation**: Maintain accurate documentation
- **Testing**: Regular testing of port management scripts

---

*This documentation is automatically generated and should be updated when port configurations change.*
