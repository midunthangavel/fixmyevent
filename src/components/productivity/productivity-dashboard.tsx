'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Calendar, Users, DollarSign, Clock, Sparkles, Zap, Bell, Upload, CheckCircle, TrendingUp, Target, Rocket } from 'lucide-react'
import { EventTemplates } from './event-templates'
import { SmartTaskAutomation } from './smart-task-automation'
import { SmartNotifications } from './smart-notifications'
import { BulkOperations } from './bulk-operations'

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

  const taskCompletionRate = metrics.totalTasks > 0 ? (metrics.completedTasks / metrics.totalTasks) * 100 : 0

  const getEfficiencyColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getEfficiencyBadge = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800'
    if (score >= 80) return 'bg-blue-100 text-blue-800'
    if (score >= 70) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Productivity Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Supercharge your event planning with AI-powered tools, smart automation, and intelligent insights.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Events</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {metrics.activeEvents}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-slate-500">
                {metrics.totalEvents} total events
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Task Progress</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {Math.round(taskCompletionRate)}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Progress value={taskCompletionRate} className="h-2" />
              <p className="text-xs text-slate-500 mt-1">
                {metrics.completedTasks} of {metrics.totalTasks} tasks
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Budget Used</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {metrics.budgetUtilization}%
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="mt-2">
              <Progress value={metrics.budgetUtilization} className="h-2" />
              <p className="text-xs text-slate-500">
                {metrics.budgetUtilization >= 80 ? 'Monitor spending' : 'On track'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Efficiency Score</p>
                <p className={`text-2xl font-bold ${getEfficiencyColor(metrics.efficiencyScore)}`}>
                  {metrics.efficiencyScore}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <Badge className={getEfficiencyBadge(metrics.efficiencyScore)}>
                {metrics.efficiencyScore >= 90 ? 'Excellent' : 
                 metrics.efficiencyScore >= 80 ? 'Good' : 
                 metrics.efficiencyScore >= 70 ? 'Fair' : 'Needs Improvement'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-purple-500" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Jump to the most common productivity tasks and tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => setActiveTab('templates')}
            >
              <Sparkles className="h-6 w-6 text-blue-500" />
              <span className="text-sm">Event Templates</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => setActiveTab('tasks')}
            >
              <Target className="h-6 w-6 text-green-500" />
              <span className="text-sm">AI Tasks</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="h-6 w-6 text-yellow-500" />
              <span className="text-sm">Smart Alerts</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => setActiveTab('bulk')}
            >
              <Upload className="h-6 w-6 text-purple-500" />
              <span className="text-sm">Bulk Operations</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="tasks">AI Tasks</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                AI Insights & Recommendations
              </CardTitle>
              <CardDescription>
                Intelligent suggestions to improve your event planning efficiency.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-200">
                        Efficiency Opportunity
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        You have 7 upcoming deadlines. Consider using AI task automation to prioritize and schedule reminders automatically.
                      </p>
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setActiveTab('tasks')}
                      >
                        Set Up AI Tasks
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-green-200">
                        Time Saved This Month
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Your productivity tools have saved you approximately {metrics.timeSaved} hours this month compared to manual planning.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                        Budget Alert
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        You've used {metrics.budgetUtilization}% of your total budget. Consider reviewing expenses and setting up budget alerts.
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="mt-2"
                        onClick={() => setActiveTab('notifications')}
                      >
                        Configure Alerts
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-500" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest updates and actions from your productivity tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">AI generated 12 tasks for Wedding Event</p>
                    <p className="text-xs text-slate-500">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <Bell className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Budget alert: 80% threshold reached</p>
                    <p className="text-xs text-slate-500">4 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <Upload className="h-4 w-4 text-purple-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Successfully imported 150 guest records</p>
                    <p className="text-xs text-slate-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <EventTemplates />
        </TabsContent>

        <TabsContent value="tasks">
          <SmartTaskAutomation />
        </TabsContent>

        <TabsContent value="notifications">
          <SmartNotifications />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkOperations />
        </TabsContent>
      </Tabs>
    </div>
  )
}
