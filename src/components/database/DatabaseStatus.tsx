'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Database, 
  RefreshCw,
  Play,
  Square,
  Settings
} from 'lucide-react';
import { databaseManager } from '@/config/database';
import { databaseInitializer } from '@/lib/database-init';

interface DatabaseStatus {
  provider: string;
  isConnected: boolean;
  lastConnected: Date;
  error?: string;
}

interface InitializationStatus {
  initialized: boolean;
  collections: string[];
  sampleDataCount: number;
  lastInitialized?: Date;
}

export default function DatabaseStatus() {
  const [connectionStatuses, setConnectionStatuses] = useState<DatabaseStatus[]>([]);
  const [initStatus, setInitStatus] = useState<InitializationStatus | null>(null);
  const [healthStatus, setHealthStatus] = useState<{ healthy: boolean; issues: string[] }>({ healthy: true, issues: [] });
  const [loading, setLoading] = useState(false);
  const [emulatorStatus, setEmulatorStatus] = useState<'running' | 'stopped' | 'unknown'>('unknown');

  useEffect(() => {
    loadDatabaseStatus();
    checkEmulatorStatus();
  }, []);

  const loadDatabaseStatus = async () => {
    try {
      setLoading(true);
      
      // Get connection statuses
      const statuses = databaseManager.getAllConnectionStatuses();
      setConnectionStatuses(statuses);

      // Get health status
      const health = databaseManager.getHealthStatus();
      setHealthStatus(health);

      // Get initialization status
      try {
        const init = await databaseInitializer.getInitializationStatus();
        setInitStatus(init);
      } catch (error) {
        console.warn('Could not get initialization status:', error);
      }
    } catch (error) {
      console.error('Error loading database status:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEmulatorStatus = async () => {
    try {
      const response = await fetch('http://localhost:4000');
      setEmulatorStatus(response.ok ? 'running' : 'stopped');
    } catch {
      setEmulatorStatus('stopped');
    }
  };

  const testConnections = async () => {
    try {
      setLoading(true);
      await databaseManager.testAllConnections();
      await loadDatabaseStatus();
    } catch (error) {
      console.error('Error testing connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeDatabase = async () => {
    try {
      setLoading(true);
      await databaseInitializer.initialize();
      await loadDatabaseStatus();
    } catch (error) {
      console.error('Error initializing database:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetDatabase = async () => {
    if (confirm('Are you sure you want to reset the database? This will delete all data!')) {
      try {
        setLoading(true);
        await databaseInitializer.resetDatabase();
        await loadDatabaseStatus();
      } catch (error) {
        console.error('Error resetting database:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusIcon = (isConnected: boolean) => {
    return isConnected ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusBadge = (isConnected: boolean) => {
    return isConnected ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Connected
      </Badge>
    ) : (
      <Badge variant="destructive">
        Disconnected
      </Badge>
    );
  };

  const getEmulatorBadge = () => {
    switch (emulatorStatus) {
      case 'running':
        return <Badge variant="default" className="bg-green-100 text-green-800">Running</Badge>;
      case 'stopped':
        return <Badge variant="destructive">Stopped</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Database Status</h2>
          <p className="text-muted-foreground">
            Monitor and manage your database connections and health
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={testConnections}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={initializeDatabase}
            disabled={loading}
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            Initialize
          </Button>
        </div>
      </div>

      {/* Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Overall Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Database Health</span>
                <span className="text-sm text-muted-foreground">
                  {healthStatus.healthy ? 'Healthy' : 'Issues Detected'}
                </span>
              </div>
              <Progress 
                value={healthStatus.healthy ? 100 : 0} 
                className="h-2"
              />
            </div>
            {healthStatus.healthy ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : (
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            )}
          </div>
          
          {healthStatus.issues.length > 0 && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Issues found:</strong>
                <ul className="mt-2 list-disc list-inside">
                  {healthStatus.issues.map((issue, index) => (
                    <li key={index} className="text-sm">{issue}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
          <CardDescription>
            Current status of all database connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectionStatuses.map((status) => (
              <div key={status.provider} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status.isConnected)}
                  <div>
                    <p className="font-medium capitalize">{status.provider}</p>
                    <p className="text-sm text-muted-foreground">
                      Last connected: {status.lastConnected.toLocaleString()}
                    </p>
                    {status.error && (
                      <p className="text-sm text-red-600">{status.error}</p>
                    )}
                  </div>
                </div>
                {getStatusBadge(status.isConnected)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emulator Status */}
      <Card>
        <CardHeader>
          <CardTitle>Development Environment</CardTitle>
          <CardDescription>
            Firebase emulator status and controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Firebase Emulators</p>
              <p className="text-sm text-muted-foreground">
                Local development database
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getEmulatorBadge()}
              <Button
                onClick={checkEmulatorStatus}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Emulator URLs:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• Firestore: <code className="bg-background px-1 rounded">localhost:8080</code></p>
              <p>• Storage: <code className="bg-background px-1 rounded">localhost:9199</code></p>
              <p>• Auth: <code className="bg-background px-1 rounded">localhost:9099</code></p>
              <p>• UI: <code className="bg-background px-1 rounded">localhost:4000</code></p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Initialization Status */}
      {initStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Database Initialization</CardTitle>
            <CardDescription>
              Status of database setup and sample data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Status:</span>
                {initStatus.initialized ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Initialized
                  </Badge>
                ) : (
                  <Badge variant="secondary">Not Initialized</Badge>
                )}
              </div>
              
              {initStatus.initialized && (
                <>
                  <div className="flex items-center justify-between">
                    <span>Collections:</span>
                    <span className="text-sm text-muted-foreground">
                      {initStatus.collections.length} active
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Sample Data:</span>
                    <span className="text-sm text-muted-foreground">
                      {initStatus.sampleDataCount} documents
                    </span>
                  </div>
                  
                  {initStatus.lastInitialized && (
                    <div className="flex items-center justify-between">
                      <span>Last Initialized:</span>
                      <span className="text-sm text-muted-foreground">
                        {initStatus.lastInitialized.toLocaleString()}
                      </span>
                    </div>
                  )}
                </>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={initializeDatabase}
                  disabled={loading || initStatus.initialized}
                  size="sm"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Initialize
                </Button>
                {initStatus.initialized && (
                  <Button
                    onClick={resetDatabase}
                    disabled={loading}
                    variant="destructive"
                    size="sm"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common database management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => window.open('http://localhost:4000', '_blank')}
              variant="outline"
              className="h-20 flex-col gap-2"
            >
              <Database className="h-6 w-6" />
              <span>Emulator UI</span>
            </Button>
            
            <Button
              onClick={() => window.open('https://console.firebase.google.com', '_blank')}
              variant="outline"
              className="h-20 flex-col gap-2"
            >
              <Settings className="h-6 w-6" />
              <span>Firebase Console</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
