'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Users, DollarSign, Clock, Sparkles, Copy, Download } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface EventTemplate {
  id: string
  name: string
  category: string
  eventType: string
  estimatedDuration: string
  estimatedBudget: number
  guestCount: number
  description: string
  checklist: string[]
  timeline: string[]
  vendorCategories: string[]
  tags: string[]
  popularity: number
  isCustomizable: boolean
}

const defaultTemplates: EventTemplate[] = [
  {
    id: 'wedding-classic',
    name: 'Classic Wedding',
    category: 'Celebration',
    eventType: 'Wedding',
    estimatedDuration: '8-10 hours',
    estimatedBudget: 15000,
    guestCount: 150,
    description: 'Traditional wedding with elegant ceremony and reception',
    checklist: [
      'Book ceremony venue',
      'Book reception venue',
      'Hire photographer',
      'Hire videographer',
      'Book caterer',
      'Hire DJ/band',
      'Order flowers',
      'Send invitations',
      'Book transportation',
      'Arrange accommodations'
    ],
    timeline: [
      '12 months: Book venues and key vendors',
      '10 months: Send save-the-dates',
      '8 months: Book remaining vendors',
      '6 months: Order dress and suits',
      '4 months: Send invitations',
      '2 months: Final vendor meetings',
      '1 month: Final details and rehearsal',
      '1 week: Final confirmations'
    ],
    vendorCategories: ['Venue', 'Catering', 'Photography', 'Music', 'Flowers', 'Transportation'],
    tags: ['traditional', 'elegant', 'romantic'],
    popularity: 95,
    isCustomizable: true
  },
  {
    id: 'corporate-conference',
    name: 'Corporate Conference',
    category: 'Business',
    eventType: 'Conference',
    estimatedDuration: '6-8 hours',
    estimatedBudget: 25000,
    guestCount: 200,
    description: 'Professional business conference with networking opportunities',
    checklist: [
      'Secure conference venue',
      'Book keynote speakers',
      'Arrange catering',
      'Set up registration system',
      'Prepare presentation materials',
      'Arrange audio/visual equipment',
      'Plan networking sessions',
      'Organize transportation',
      'Prepare attendee materials',
      'Set up feedback system'
    ],
    timeline: [
      '6 months: Book venue and speakers',
      '4 months: Launch registration',
      '3 months: Finalize agenda',
      '2 months: Confirm vendors',
      '1 month: Final preparations',
      '1 week: Final walkthrough',
      'Day of: Setup and execution'
    ],
    vendorCategories: ['Venue', 'Catering', 'AV Equipment', 'Speakers', 'Transportation'],
    tags: ['professional', 'networking', 'educational'],
    popularity: 88,
    isCustomizable: true
  },
  {
    id: 'birthday-party',
    name: 'Birthday Celebration',
    category: 'Celebration',
    eventType: 'Birthday',
    estimatedDuration: '4-6 hours',
    estimatedBudget: 2000,
    guestCount: 50,
    description: 'Fun and memorable birthday party for all ages',
    checklist: [
      'Choose party theme',
      'Book party venue',
      'Order cake',
      'Plan activities',
      'Prepare decorations',
      'Arrange food and drinks',
      'Send invitations',
      'Plan entertainment',
      'Prepare party favors',
      'Set up photo booth'
    ],
    timeline: [
      '1 month: Choose theme and venue',
      '3 weeks: Send invitations',
      '2 weeks: Order supplies',
      '1 week: Final preparations',
      'Day of: Setup and celebration'
    ],
    vendorCategories: ['Venue', 'Catering', 'Entertainment', 'Decorations'],
    tags: ['fun', 'casual', 'memorable'],
    popularity: 92,
    isCustomizable: true
  }
]

export function EventTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<EventTemplate | null>(null)
  const [customization, setCustomization] = useState({
    guestCount: 0,
    budget: 0,
    date: '',
    location: '',
    theme: '',
    specialRequirements: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredTemplates = defaultTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleTemplateSelect = (template: EventTemplate) => {
    setSelectedTemplate(template)
    setCustomization({
      guestCount: template.guestCount,
      budget: template.estimatedBudget,
      date: '',
      location: '',
      theme: template.name,
      specialRequirements: ''
    })
  }

  const handleCustomize = async () => {
    if (!selectedTemplate) return

    try {
      // Here you would integrate with your AI service to customize the template
      toast({
        title: 'Template Customized!',
        description: `Your ${selectedTemplate.name} template has been customized for ${customization.guestCount} guests with a $${customization.budget} budget.`,
      })
    } catch (error) {
      toast({
        title: 'Customization Failed',
        description: 'There was an error customizing your template. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleDownload = (template: EventTemplate) => {
    // Create a downloadable version of the template
    const templateData = {
      ...template,
      customization,
      generatedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${template.name}-template.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: 'Template Downloaded',
      description: 'Your template has been downloaded successfully.',
    })
  }

  const categories = ['all', ...Array.from(new Set(defaultTemplates.map(t => t.category)))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Smart Event Templates
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Jump-start your event planning with AI-powered templates. Customize any template to match your specific needs and budget.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <Card 
            key={template.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {template.popularity}% popular
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {template.guestCount}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  ${template.estimatedBudget.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {template.estimatedDuration}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {template.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownload(template)
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTemplateSelect(template)
                    }}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Use Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customization Panel */}
      {selectedTemplate && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Customize {selectedTemplate.name}
            </CardTitle>
            <CardDescription>
              AI will automatically adjust timelines, budgets, and recommendations based on your inputs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guestCount">Guest Count</Label>
                <Input
                  id="guestCount"
                  type="number"
                  value={customization.guestCount}
                  onChange={(e) => setCustomization(prev => ({ ...prev, guestCount: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter guest count"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={customization.budget}
                  onChange={(e) => setCustomization(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter budget"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Event Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={customization.date}
                  onChange={(e) => setCustomization(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={customization.location}
                  onChange={(e) => setCustomization(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter location"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="theme">Theme/Customization</Label>
                <Input
                  id="theme"
                  value={customization.theme}
                  onChange={(e) => setCustomization(prev => ({ ...prev, theme: e.target.value }))}
                  placeholder="Describe your custom theme or requirements"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="specialRequirements">Special Requirements</Label>
                <Textarea
                  id="specialRequirements"
                  value={customization.specialRequirements}
                  onChange={(e) => setCustomization(prev => ({ ...prev, specialRequirements: e.target.value }))}
                  placeholder="Any special requirements or notes..."
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button onClick={handleCustomize} className="flex-1">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Customize Template
              </Button>
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
