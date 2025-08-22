
'use client';

import { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Zap, 
  Users,
  DollarSign,
  Activity,
  Lightbulb,
  Target,
  Workflow
} from 'lucide-react'

interface ProductivityMetrics {
  totalEvents: number
  activeEvents: number
  completedTasks: number
  totalTasks: number
  upcomingDeadlines: number
  budgetUtilization: number
  timeSaved: number
  efficiencyScore: number
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: any
  color: string
  action: () => void
}

export function ProductivityDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [metrics] = useState<ProductivityMetrics>({
    totalEvents: 12,
    activeEvents: 8,
    completedTasks: 156,
    totalTasks: 234,
    upcomingDeadlines: 7,
    budgetUtilization: 78,
    timeSaved: 42,
    efficiencyScore: 87
  })

  // Memoized calculations for better performance
  const taskCompletionRate = useMemo(() => 
    metrics.totalTasks > 0 ? (metrics.completedTasks / metrics.totalTasks) * 100 : 0,
    [metrics.completedTasks, metrics.totalTasks]
  )

  const getEfficiencyColor = useCallback((score: number) => {
    if (score >= 90) return 'text-emerald-600 dark:text-emerald-400'
    if (score >= 80) return 'text-blue-600 dark:text-blue-400'
    if (score >= 70) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }, [])

  const getEfficiencyBadge = useCallback((score: number) => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    if (score >= 80) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    if (score >= 70) return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }, [])

  const quickActions: QuickAction[] = useMemo(() => [
    {
      id: 'new-event',
      title: 'Create Event',
      description: 'Start planning a new event',
      icon: Calendar,
      color: 'bg-blue-500',
      action: () => console.log('Create new event')
    },
    {
      id: 'ai-suggestions',
      title: 'AI Suggestions',
      description: 'Get smart recommendations',
      icon: Lightbulb,
      color: 'bg-purple-500',
      action: () => console.log('Get AI suggestions')
    },
    {
      id: 'bulk-import',
      title: 'Bulk Import',
      description: 'Import multiple vendors',
      icon: Workflow,
      color: 'bg-green-500',
      action: () => console.log('Bulk import')
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'Deep dive into metrics',
      icon: Activity,
      color: 'bg-orange-500',
      action: () => console.log('View analytics')
    }
  ], [])

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-sm font-medium text-blue-800 dark:text-blue-200 mb-4">
          <Zap className="w-4 h-4 mr-2" />
          Productivity Hub
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Supercharge your event planning with AI-powered insights, smart automation, and real-time analytics.
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 opacity-50"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Events</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {metrics.activeEvents}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {metrics.totalEvents} total events
                </p>
              </div>
              <div className="p-3 bg-blue-500 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 opacity-50"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Task Completion</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {taskCompletionRate.toFixed(0)}%
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {metrics.completedTasks} of {metrics.totalTasks} tasks
                </p>
              </div>
              <div className="p-3 bg-emerald-500 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 opacity-50"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Budget Usage</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {metrics.budgetUtilization}%
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Optimal range: 70-85%
                </p>
              </div>
              <div className="p-3 bg-amber-500 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 opacity-50"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Efficiency Score</p>
                <p className={`text-3xl font-bold ${getEfficiencyColor(metrics.efficiencyScore)}`}>
                  {metrics.efficiencyScore}
                </p>
                <Badge className={`text-xs mt-1 ${getEfficiencyBadge(metrics.efficiencyScore)}`}>
                  {metrics.efficiencyScore >= 90 ? 'Excellent' : 
                   metrics.efficiencyScore >= 80 ? 'Good' : 
                   metrics.efficiencyScore >= 70 ? 'Fair' : 'Needs Improvement'}
                </Badge>
              </div>
              <div className="p-3 bg-purple-500 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Streamline your workflow with one-click actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all duration-200"
                onClick={action.action}
              >
                <div className={`p-3 ${action.color} rounded-lg`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-slate-500">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-fit">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Tasks
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="automation" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            Automation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest event planning actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Venue booked', time: '2 hours ago', status: 'completed' },
                    { action: 'Catering quote received', time: '4 hours ago', status: 'pending' },
                    { action: 'Guest list updated', time: '1 day ago', status: 'completed' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div>
                        <p className="font-medium">{item.action}</p>
                        <p className="text-sm text-slate-500">{item.time}</p>
                      </div>
                      <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
                <CardDescription>Track your event planning progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{taskCompletionRate.toFixed(0)}%</span>
                  </div>
                  <Progress value={taskCompletionRate} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Budget Utilization</span>
                    <span>{metrics.budgetUtilization}%</span>
                  </div>
                  <Progress value={metrics.budgetUtilization} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Vendor Confirmations</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Task Management</CardTitle>
              <CardDescription>Organize and track your event planning tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-slate-500 py-8">Task management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Deep insights into your event planning performance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-slate-500 py-8">Analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>Smart Automation</CardTitle>
              <CardDescription>Configure intelligent workflows and automations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-slate-500 py-8">Automation settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
