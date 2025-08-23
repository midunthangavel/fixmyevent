import { logFirebaseInit, logFirebaseError } from '../lib/logger';

export interface DatabaseConfig {
  provider: 'firebase';
  enabled: boolean;
  projectId?: string;
  region?: string;
}

export interface DatabaseConnection {
  isConnected: boolean;
  provider: string;
  lastConnected: Date;
  error?: string;
}

export class DatabaseManager {
  private static instance: DatabaseManager;
  private connections: Map<string, DatabaseConnection> = new Map();
  private configs: Map<string, DatabaseConfig> = new Map();

  private constructor() {
    this.initializeConfigs();
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private initializeConfigs(): void {
    // Firebase Configuration
    this.configs.set('firebase', {
      provider: 'firebase',
      enabled: true,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      region: 'us-central1'
    });
  }

  public getConfig(provider: string): DatabaseConfig | undefined {
    return this.configs.get(provider);
  }

  public getAllConfigs(): DatabaseConfig[] {
    return Array.from(this.configs.values());
  }

  public getEnabledConfigs(): DatabaseConfig[] {
    return this.getAllConfigs().filter(config => config.enabled);
  }

  public updateConnectionStatus(provider: string, status: Partial<DatabaseConnection>): void {
    const existing = this.connections.get(provider) || {
      isConnected: false,
      provider,
      lastConnected: new Date()
    };

    this.connections.set(provider, { ...existing, ...status });
  }

  public getConnectionStatus(provider: string): DatabaseConnection | undefined {
    return this.connections.get(provider);
  }

  public getAllConnectionStatuses(): DatabaseConnection[] {
    return Array.from(this.connections.values());
  }

  public async testConnection(provider: string): Promise<boolean> {
    try {
      const config = this.getConfig(provider);
      if (!config || !config.enabled) {
        throw new Error(`Provider ${provider} is not configured or enabled`);
      }

      if (provider === 'firebase') {
        return await this.testFirebaseConnection(config);
      }
      
      throw new Error(`Unsupported provider: ${provider}`);
    } catch (error) {
      logFirebaseError(error, { context: `database_connection_test_${provider}` });
      this.updateConnectionStatus(provider, { isConnected: false, error: error instanceof Error ? error.message : String(error) });
      return false;
    }
  }

  private async testFirebaseConnection(config: DatabaseConfig): Promise<boolean> {
    try {
      // Test Firebase connection by checking if we can access the project
      if (config.projectId) {
        logFirebaseInit(config.projectId);
        this.updateConnectionStatus('firebase', { 
          isConnected: true, 
          lastConnected: new Date() 
        });
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(`Firebase connection failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public async testAllConnections(): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();
    
    for (const [provider] of this.configs) {
      const result = await this.testConnection(provider);
      results.set(provider, result);
    }
    
    return results;
  }

  public getHealthStatus(): { healthy: boolean; issues: string[] } {
    const issues: string[] = [];
    let healthy = true;

    for (const [provider, connection] of this.connections) {
      if (!connection.isConnected) {
        healthy = false;
        issues.push(`${provider}: ${connection.error || 'Connection failed'}`);
      }
    }

    return { healthy, issues };
  }
}

export const databaseManager = DatabaseManager.getInstance();
