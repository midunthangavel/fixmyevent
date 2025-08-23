#!/usr/bin/env node

/**
 * Port Management Script for FixMyEvent
 * This script helps manage all the different services and their assigned ports
 */

import { execSync, spawn } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

// Import port configuration
import PORT_CONFIG from '../ports.config.js';

class PortManager {
  constructor() {
    this.processes = new Map();
    this.portStatus = new Map();
  }

  /**
   * Check if a port is available
   */
  async checkPort(port) {
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);
      
      const platform = process.platform;
      let command;
      
      if (platform === 'win32') {
        command = `netstat -an | findstr :${port}`;
      } else {
        command = `lsof -i :${port}`;
      }
      
      try {
        await execAsync(command);
        return false; // Port is in use
      } catch {
        return true; // Port is available
      }
    } catch (error) {
      console.error(`Error checking port ${port}:`, error.message);
      return false;
    }
  }

  /**
   * Start a specific service
   */
  async startService(serviceName, port) {
    try {
      console.log(`Starting ${serviceName} on port ${port}...`);
      
      let command, args;
      
      switch (serviceName.toLowerCase()) {
        case 'next-dev':
          command = 'npm';
          args = ['run', 'dev'];
          break;
        case 'next-start':
          command = 'npm';
          args = ['run', 'start'];
          break;
        case 'functions':
          command = 'npm';
          args = ['run', 'dev'];
          break;
        case 'genkit':
          command = 'npm';
          args = ['run', 'genkit:dev'];
          break;
        case 'firebase-emulators':
          command = 'firebase';
          args = ['emulators:start'];
          break;
        default:
          console.error(`Unknown service: ${serviceName}`);
          return false;
      }
      
      const process = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        cwd: serviceName === 'functions' ? './functions' : './'
      });
      
      this.processes.set(serviceName, process);
      
      process.on('error', (error) => {
        console.error(`Error starting ${serviceName}:`, error.message);
      });
      
      process.on('exit', (code) => {
        console.log(`${serviceName} exited with code ${code}`);
        this.processes.delete(serviceName);
      });
      
      return true;
    } catch (error) {
      console.error(`Failed to start ${serviceName}:`, error.message);
      return false;
    }
  }

  /**
   * Stop a specific service
   */
  stopService(serviceName) {
    const process = this.processes.get(serviceName);
    if (process) {
      console.log(`Stopping ${serviceName}...`);
      process.kill('SIGTERM');
      this.processes.delete(serviceName);
      return true;
    }
    return false;
  }

  /**
   * Stop all services
   */
  stopAllServices() {
    console.log('Stopping all services...');
    for (const [serviceName, process] of this.processes) {
      console.log(`Stopping ${serviceName}...`);
      process.kill('SIGTERM');
    }
    this.processes.clear();
  }

  /**
   * Start all main services
   */
  async startAllServices() {
    console.log('Starting all main services...');
    
    const services = [
      { name: 'next-dev', port: PORT_CONFIG.APP.NEXT_DEV },
      { name: 'functions', port: PORT_CONFIG.FIREBASE.FUNCTIONS },
      { name: 'genkit', port: PORT_CONFIG.DEVELOPMENT.GENKIT }
    ];
    
    for (const service of services) {
      const isAvailable = await this.checkPort(service.port);
      if (isAvailable) {
        await this.startService(service.name, service.port);
      } else {
        console.warn(`Port ${service.port} is already in use for ${service.name}`);
      }
    }
  }

  /**
   * Show status of all services
   */
  async showStatus() {
    console.log('\n=== FixMyEvent Service Status ===\n');
    
    const services = [
      { name: 'Next.js Dev', port: PORT_CONFIG.APP.NEXT_DEV, url: `http://localhost:${PORT_CONFIG.APP.NEXT_DEV}` },
      { name: 'Next.js Start', port: PORT_CONFIG.APP.NEXT_START, url: `http://localhost:${PORT_CONFIG.APP.NEXT_START}` },
      { name: 'Firebase Functions', port: PORT_CONFIG.FIREBASE.FUNCTIONS, url: `http://localhost:${PORT_CONFIG.FIREBASE.FUNCTIONS}` },
      { name: 'Firebase Auth', port: PORT_CONFIG.FIREBASE.AUTH, url: `http://localhost:${PORT_CONFIG.FIREBASE.AUTH}` },
      { name: 'Firebase Firestore', port: PORT_CONFIG.FIREBASE.FIRESTORE, url: `http://localhost:${PORT_CONFIG.FIREBASE.FIRESTORE}` },
      { name: 'Firebase Storage', port: PORT_CONFIG.FIREBASE.STORAGE, url: `http://localhost:${PORT_CONFIG.FIREBASE.STORAGE}` },
      { name: 'Firebase UI', port: PORT_CONFIG.FIREBASE.UI, url: `http://localhost:${PORT_CONFIG.FIREBASE.UI}` },
      { name: 'Genkit AI', port: PORT_CONFIG.DEVELOPMENT.GENKIT, url: `http://localhost:${PORT_CONFIG.DEVELOPMENT.GENKIT}` }
    ];
    
    for (const service of services) {
      const isAvailable = await this.checkPort(service.port);
      const status = isAvailable ? '🟢 Available' : '🔴 In Use';
      const processStatus = this.processes.has(service.name.toLowerCase().replace(/\s+/g, '-')) ? '🟢 Running' : '⚪ Stopped';
      
      console.log(`${service.name.padEnd(20)} | Port: ${service.port.toString().padStart(4)} | Status: ${status} | Process: ${processStatus}`);
      if (!isAvailable) {
        console.log(`  └─ URL: ${service.url}`);
      }
    }
    
    console.log('\n=== Running Processes ===');
    if (this.processes.size === 0) {
      console.log('No services are currently running.');
    } else {
      for (const [serviceName, process] of this.processes) {
        console.log(`🟢 ${serviceName} (PID: ${process.pid})`);
      }
    }
  }

  /**
   * Generate a ports summary file
   */
  generatePortsSummary() {
    const summary = {
      timestamp: new Date().toISOString(),
      totalPorts: 0,
      services: {},
      conflicts: []
    };
    
    for (const [category, services] of Object.entries(PORT_CONFIG)) {
      if (typeof services === 'object') {
        summary.services[category] = {};
        for (const [service, port] of Object.entries(services)) {
          summary.services[category][service] = port;
          summary.totalPorts++;
        }
      }
    }
    
    const summaryPath = join(__dirname, '..', 'PORTS_SUMMARY.md');
    let markdown = `# FixMyEvent Port Configuration Summary\n\n`;
    markdown += `Generated on: ${summary.timestamp}\n\n`;
    markdown += `Total Ports: ${summary.totalPorts}\n\n`;
    
    for (const [category, services] of Object.entries(summary.services)) {
      markdown += `## ${category}\n\n`;
      for (const [service, port] of Object.entries(services)) {
        markdown += `- **${service}**: \`${port}\`\n`;
      }
      markdown += '\n';
    }
    
    writeFileSync(summaryPath, markdown);
    console.log(`Ports summary generated: ${summaryPath}`);
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const portManager = new PortManager();
  
  try {
    switch (command) {
      case 'start':
        if (args[1]) {
          await portManager.startService(args[1], args[2]);
        } else {
          await portManager.startAllServices();
        }
        break;
        
      case 'stop':
        if (args[1]) {
          portManager.stopService(args[1]);
        } else {
          portManager.stopAllServices();
        }
        break;
        
      case 'status':
        await portManager.showStatus();
        break;
        
      case 'summary':
        portManager.generatePortsSummary();
        break;
        
      case 'check':
        const port = parseInt(args[1]);
        if (isNaN(port)) {
          console.error('Please provide a valid port number');
          process.exit(1);
        }
        const isAvailable = await portManager.checkPort(port);
        console.log(`Port ${port} is ${isAvailable ? 'available' : 'in use'}`);
        break;
        
      default:
        console.log(`
FixMyEvent Port Manager

Usage:
  npm run ports:start [service]     Start all services or a specific service
  npm run ports:stop [service]      Stop all services or a specific service
  npm run ports:status              Show status of all services
  npm run ports:summary             Generate ports summary
  npm run ports:check <port>        Check if a specific port is available

Available services:
  - next-dev (port ${PORT_CONFIG.APP.NEXT_DEV})
  - functions (port ${PORT_CONFIG.FIREBASE.FUNCTIONS})
  - genkit (port ${PORT_CONFIG.DEVELOPMENT.GENKIT})
  - firebase-emulators

Examples:
  npm run ports:start               # Start all services
  npm run ports:start next-dev      # Start Next.js dev server
  npm run ports:stop functions      # Stop Firebase functions
  npm run ports:check 3000          # Check if port 3000 is available
        `);
        break;
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
  
  // Keep the process alive if starting services
  if (command === 'start' && !args[1]) {
    process.on('SIGINT', () => {
      console.log('\nShutting down...');
      portManager.stopAllServices();
      process.exit(0);
    });
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
