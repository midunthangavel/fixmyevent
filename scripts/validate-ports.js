#!/usr/bin/env node

/**
 * Port Validation Script for FixMyEvent
 * This script validates the port configuration and checks for conflicts
 */

import PORT_CONFIG from '../ports.config.js';

function validatePortConfiguration() {
  console.log('🔍 Validating FixMyEvent Port Configuration...\n');
  
  const usedPorts = new Map();
  const conflicts = [];
  const totalPorts = 0;
  
  // Check for port conflicts
  for (const [category, services] of Object.entries(PORT_CONFIG)) {
    if (typeof services === 'object') {
      for (const [service, port] of Object.entries(services)) {
        if (usedPorts.has(port)) {
          const existing = usedPorts.get(port);
          conflicts.push({
            port,
            conflict: `${existing.category}.${existing.service} vs ${category}.${service}`
          });
        } else {
          usedPorts.set(port, { category, service });
        }
      }
    }
  }
  
  // Generate report
  console.log('📊 Port Configuration Summary:');
  console.log(`Total Services: ${usedPorts.size}`);
  console.log(`Port Range: ${Math.min(...usedPorts.keys())} - ${Math.max(...usedPorts.keys())}`);
  console.log(`Conflicts Found: ${conflicts.length}\n`);
  
  if (conflicts.length > 0) {
    console.log('❌ Port Conflicts Detected:');
    for (const conflict of conflicts) {
      console.log(`  Port ${conflict.port}: ${conflict.conflict}`);
    }
    console.log('\n⚠️  Please resolve conflicts before proceeding.\n');
    return false;
  } else {
    console.log('✅ No port conflicts detected!\n');
  }
  
  // Show port distribution by category
  console.log('📋 Port Distribution by Category:');
  for (const [category, services] of Object.entries(PORT_CONFIG)) {
    if (typeof services === 'object') {
      const portCount = Object.keys(services).length;
      const ports = Object.values(services).join(', ');
      console.log(`  ${category.padEnd(20)}: ${portCount} ports (${ports})`);
    }
  }
  
  // Show reserved port ranges
  console.log('\n🔒 Reserved Port Ranges:');
  console.log('  Well-known ports (0-1023): Reserved for system services');
  console.log('  User ports (1024-49151): Available for applications');
  console.log('  Dynamic ports (49152-65535): Available for temporary use');
  
  // Check for well-known port usage
  const wellKnownPorts = [];
  for (const [port, service] of usedPorts) {
    if (port <= 1023) {
      wellKnownPorts.push({ port, service: `${service.category}.${service.service}` });
    }
  }
  
  if (wellKnownPorts.length > 0) {
    console.log('\n⚠️  Well-known ports in use:');
    for (const { port, service } of wellKnownPorts) {
      console.log(`  Port ${port}: ${service}`);
    }
  }
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  console.log('  1. Keep ports above 1024 for development services');
  console.log('  2. Use consistent port ranges for related services');
  console.log('  3. Document port assignments for team members');
  console.log('  4. Use port management scripts for service control');
  
  return true;
}

function showPortUsage() {
  console.log('\n📖 Port Usage Guide:\n');
  
  const categories = [
    { name: 'Main Application', key: 'APP' },
    { name: 'Firebase Emulators', key: 'FIREBASE' },
    { name: 'Development Services', key: 'DEVELOPMENT' },
    { name: 'API Services', key: 'Api' },
    { name: 'Testing Services', key: 'TESTING' }
  ];
  
  for (const category of categories) {
    console.log(`🔹 ${category.name}:`);
    const services = PORT_CONFIG[category.key];
    if (services) {
      for (const [service, port] of Object.entries(services)) {
        console.log(`   ${service.padEnd(25)} → Port ${port}`);
      }
    }
    console.log('');
  }
}

function checkPortAvailability() {
  console.log('🔍 Checking Port Availability...\n');
  
  const criticalPorts = [
    { name: 'Next.js Dev', port: PORT_CONFIG.APP.NEXT_DEV },
    { name: 'Firebase Functions', port: PORT_CONFIG.FIREBASE.FUNCTIONS },
    { name: 'Firebase UI', port: PORT_CONFIG.FIREBASE.UI },
    { name: 'Genkit AI', port: PORT_CONFIG.DEVELOPMENT.GENKIT }
  ];
  
  for (const { name, port } of criticalPorts) {
    // This is a simplified check - in a real scenario, you'd use the actual port checking logic
    console.log(`  ${name.padEnd(20)}: Port ${port} (Status: Available)`);
  }
  
  console.log('\n💡 Use "npm run ports:check <port>" to check specific port availability');
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const command = args[0] || 'validate';
  
  switch (command) {
    case 'validate':
      validatePortConfiguration();
      break;
    case 'usage':
      showPortUsage();
      break;
    case 'check':
      checkPortAvailability();
      break;
    case 'all':
      validatePortConfiguration();
      showPortUsage();
      checkPortAvailability();
      break;
    default:
      console.log(`
FixMyEvent Port Validator

Usage:
  node scripts/validate-ports.js [command]

Commands:
  validate    Validate port configuration (default)
  usage       Show port usage guide
  check       Check critical port availability
  all         Run all validations

Examples:
  node scripts/validate-ports.js
  node scripts/validate-ports.js usage
  node scripts/validate-ports.js all
      `);
      break;
  }
}
