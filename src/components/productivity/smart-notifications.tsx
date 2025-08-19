'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Calendar, Bell, Clock, AlertTriangle, CheckCircle, Settings, Zap, Smartphone, Mail, MessageSquare } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface SmartNotification {
  id: string
  title: string
  message: string
  type: 'reminder' | 'deadline' | 'follow-up' | 'update' | 'alert'
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'sent' | 'dismissed'
  targetDate: Date
  sentDate?: Date
  channels: NotificationChannel[]
  eventId?: string
  taskId?: string
  vendorId?: string
  isAutomated: boolean
  aiGenerated: boolean
  context: string
  tags: string[]
}

interface NotificationChannel {
  type: 'email' | 'sms' | 'push' | 'in-app'
  enabled: boolean
  template: string
  timing: 'immediate' | '15min' | '1hour' | '1day' | '1week'
}

interface NotificationRule {
  id: string
  name: string
  description: string
  trigger: 'deadline' | 'milestone' | 'vendor-response' | 'budget-threshold' | 'weather-alert'
  conditions: string[]
  actions: string[]
  isActive: boolean
  priority: 'low' | 'medium' | 'high'
}

const defaultNotificationRules: NotificationRule[] = [
  {
    id: 'deadline-reminder',
    name: 'Deadline Reminders',
    description: 'Send reminders before important deadlines',
    trigger: 'deadline',
    conditions: ['Task due within 24 hours', 'Task due within 1 week'],
    actions: ['Send email reminder', 'Send push notification'],
    isActive: true,
    priority: 'high'
  },
  {
    id: 'vendor-followup',
    name: 'Vendor Follow-ups',
    description: 'Automatically follow up with vendors after initial contact',
    trigger: 'vendor-response',
    conditions: ['No response within 48 hours', 'No response within 1 week'],
    actions: ['Send follow-up email', 'Schedule phone call reminder'],
    isActive: true,
    priority: 'medium'
  },
  {
    id: 'budget-alerts',
    name: 'Budget Threshold Alerts',
    description: 'Notify when spending approaches budget limits',
    trigger: 'budget-threshold',
    conditions: ['80% of budget spent', '90% of budget spent'],
    actions: ['Send budget alert', 'Schedule budget review meeting'],
    isActive: true,
    priority: 'high'
  },
  {
    id: 'weather-alerts',
    name: 'Weather Alerts',
    description: 'Alert for outdoor events with weather concerns',
    trigger: 'weather-alert',
    conditions: ['Rain forecast within 24 hours', 'High winds forecast'],
    actions: ['Send weather alert', 'Suggest backup plan'],
    isActive: true,
    priority: 'critical'
  }
]

export function SmartNotifications() {
  const [notifications, setNotifications] = useState<SmartNotification[]>([])
  const [rules, setRules] = useState<NotificationRule[]>(defaultNotificationRules)
  const [settings, setSettings] = useState({
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    inAppEnabled: true,
    quietHours: { start: '22:00', end: '08:00' },
    timezone: 'local',
    language: 'en'
  })
  const [selectedType, setSelectedType] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter notifications based on current filters
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || notification.type === selectedType
    const matchesPriority = selectedPriority === 'all' || notification.priority === selectedPriority
    return matchesSearch && matchesType && matchesPriority
  })

  // Generate sample notifications for demonstration
  useEffect(() => {
    const sampleNotifications: SmartNotification[] = [
      {
        id: '1',
        title: 'Venue Booking Deadline',
        message: 'Your venue booking deadline is approaching in 3 days. Don\'t miss out on your preferred date!',
        type: 'deadline',
        priority: 'high',
        status: 'pending',
        targetDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        channels: [
          { type: 'email', enabled: true, template: 'deadline-reminder', timing: '1day' },
          { type: 'push', enabled: true, template: 'deadline-reminder', timing: '1day' }
        ],
        eventId: 'event_123',
        taskId: 'task_456',
        isAutomated: true,
        aiGenerated: true,
        context: 'venue-booking',
        tags: ['deadline', 'venue', 'high-priority']
      },
      {
        id: '2',
        title: 'Vendor Follow-up Required',
        message: 'Photographer hasn\'t responded to your inquiry. Consider sending a follow-up message.',
        type: 'follow-up',
        priority: 'medium',
        status: 'pending',
        targetDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        channels: [
          { type: 'email', enabled: true, template: 'vendor-followup', timing: '1day' }
        ],
        eventId: 'event_123',
        vendorId: 'vendor_789',
        isAutomated: true,
        aiGenerated: true,
        context: 'vendor-communication',
        tags: ['follow-up', 'vendor', 'photography']
      },
      {
        id: '3',
        title: 'Budget Alert',
        message: 'You\'ve spent 85% of your total budget. Consider reviewing your expenses.',
        type: 'alert',
        priority: 'high',
        status: 'pending',
        targetDate: new Date(),
        channels: [
          { type: 'email', enabled: true, template: 'budget-alert', timing: 'immediate' },
          { type: 'push', enabled: true, template: 'budget-alert', timing: 'immediate' }
        ],
        eventId: 'event_123',
        isAutomated: true,
        aiGenerated: true,
        context: 'budget-management',
        tags: ['budget', 'alert', 'financial']
      }
    ]
    setNotifications(sampleNotifications)
  }, [])

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ))
  }

  const updateNotificationStatus = (notificationId: string, status: SmartNotification['status']) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId ? { ...notification, status } : notification
    ))
  }

  const sendTestNotification = (channel: string) => {
    toast({
      title: 'Test Notification Sent',
      description: `Test ${channel} notification has been sent successfully.`,
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reminder': return <Clock className="h-4 w-4 text-blue-600" />
      case 'deadline': return <Calendar className="h-4 w-4 text-red-600" />
      case 'follow-up': return <MessageSquare className="h-4 w-4 text-green-600" />
      case 'update': return <CheckCircle className="h-4 w-4 text-purple-600" />
      case 'alert': return <AlertTriangle className="h-4 w-4 text-orange-600" />
      default: return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />
      case 'sms': return <Smartphone className="h-4 w-4" />
      case 'push': return <Bell className="h-4 w-4" />
      case 'in-app': return <MessageSquare className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Smart Notifications & Reminders
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          AI-powered notifications that understand context and send the right message at the right time through the right channel.
        </p>
      </div>

      {/* Notification Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Smart Notification Rules
          </CardTitle>
          <CardDescription>
            Configure automated notification rules that trigger based on events, deadlines, and conditions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map(rule => (
              <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                    <div>
                      <h4 className="font-medium">{rule.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{rule.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge className={getPriorityColor(rule.priority)}>
                          {rule.priority} priority
                        </Badge>
                        <span className="text-sm text-slate-500">Trigger: {rule.trigger}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Conditions: {rule.conditions.length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Actions: {rule.actions.length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-slate-500" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Customize how and when you receive notifications across different channels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Channel Settings */}
            <div className="space-y-4">
              <h4 className="font-medium">Notification Channels</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Notifications</span>
                  </div>
                  <Switch
                    checked={settings.emailEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailEnabled: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span>SMS Notifications</span>
                  </div>
                  <Switch
                    checked={settings.smsEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsEnabled: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>Push Notifications</span>
                  </div>
                  <Switch
                    checked={settings.pushEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushEnabled: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>In-App Notifications</span>
                  </div>
                  <Switch
                    checked={settings.inAppEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, inAppEnabled: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="space-y-4">
              <h4 className="font-medium">Advanced Settings</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Quiet Hours</Label>
                  <div className="flex gap-2">
                    <Input
                      type="time"
                      value={settings.quietHours.start}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        quietHours: { ...prev.quietHours, start: e.target.value }
                      }))}
                    />
                    <span className="text-slate-500">to</span>
                    <Input
                      type="time"
                      value={settings.quietHours.end}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        quietHours: { ...prev.quietHours, end: e.target.value }
                      }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Time</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Test Notifications */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-3">Test Notifications</h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendTestNotification('Email')}
                disabled={!settings.emailEnabled}
              >
                <Mail className="h-4 w-4 mr-2" />
                Test Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendTestNotification('SMS')}
                disabled={!settings.smsEnabled}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Test SMS
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendTestNotification('Push')}
                disabled={!settings.pushEnabled}
              >
                <Bell className="h-4 w-4 mr-2" />
                Test Push
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Filters */}
      {notifications.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="reminder">Reminders</SelectItem>
              <SelectItem value="deadline">Deadlines</SelectItem>
              <SelectItem value="follow-up">Follow-ups</SelectItem>
              <SelectItem value="update">Updates</SelectItem>
              <SelectItem value="alert">Alerts</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Notifications List */}
      {filteredNotifications.length > 0 && (
        <div className="space-y-4">
          {filteredNotifications.map(notification => (
            <Card key={notification.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{notification.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {notification.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Target: {notification.targetDate.toLocaleDateString()}
                      </div>
                      {notification.sentDate && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Sent: {notification.sentDate.toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {/* Notification Channels */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">Channels:</span>
                      {notification.channels.map((channel, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {getChannelIcon(channel.type)}
                          {channel.type} ({channel.timing})
                        </Badge>
                      ))}
                    </div>

                    {/* AI Context */}
                    {notification.aiGenerated && (
                      <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          🤖 AI Context: {notification.context}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateNotificationStatus(notification.id, 'sent')}
                        disabled={notification.status === 'sent'}
                      >
                        Mark Sent
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateNotificationStatus(notification.id, 'dismissed')}
                        disabled={notification.status === 'dismissed'}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {notifications.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Bell className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No notifications yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Notifications will appear here as your events progress and deadlines approach.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
