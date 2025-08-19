'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'

import { Upload, Download, FileText, Database, Users, Calendar, Settings, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface BulkOperation {
  id: string
  type: 'import' | 'export' | 'batch-update' | 'bulk-delete' | 'data-migration'
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  progress: number
  totalItems: number
  processedItems: number
  successCount: number
  errorCount: number
  startTime: Date
  endTime?: Date
  description: string
  errors: string[]
}

interface ImportTemplate {
  id: string
  name: string
  description: string
  category: string
  fields: string[]
  sampleData: string
  isActive: boolean
}

const importTemplates: ImportTemplate[] = [
  {
    id: 'events-csv',
    name: 'Events CSV Import',
    description: 'Import multiple events from CSV file',
    category: 'Events',
    fields: ['Event Name', 'Date', 'Location', 'Guest Count', 'Budget', 'Event Type'],
    sampleData: 'Event Name,Date,Location,Guest Count,Budget,Event Type\nWedding,2024-06-15,New York,150,15000,Wedding\nConference,2024-07-20,Los Angeles,200,25000,Conference',
    isActive: true
  },
  {
    id: 'vendors-csv',
    name: 'Vendors CSV Import',
    description: 'Import vendor information from CSV file',
    category: 'Vendors',
    fields: ['Vendor Name', 'Category', 'Contact Email', 'Phone', 'Services', 'Rating'],
    sampleData: 'Vendor Name,Category,Contact Email,Phone,Services,Rating\nABC Catering,Catering,abc@email.com,555-0123,Full Service,4.5\nXYZ Photography,Photography,xyz@email.com,555-0456,Wedding Photos,4.8',
    isActive: true
  },
  {
    id: 'guests-csv',
    name: 'Guest List Import',
    description: 'Import guest lists from CSV file',
    category: 'Guests',
    fields: ['First Name', 'Last Name', 'Email', 'Phone', 'RSVP Status', 'Dietary Restrictions'],
    sampleData: 'First Name,Last Name,Email,Phone,RSVP Status,Dietary Restrictions\nJohn,Doe,john@email.com,555-0789,Confirmed,None\nJane,Smith,jane@email.com,555-0123,Pending,Vegetarian',
    isActive: true
  }
]

export function BulkOperations() {
  const [operations, setOperations] = useState<BulkOperation[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [selectedOperation, setSelectedOperation] = useState<string>('')
  const [fileInput, setFileInput] = useState<File | null>(null)
  const [batchData, setBatchData] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sample operations for demonstration
  const sampleOperations: BulkOperation[] = [
    {
      id: '1',
      type: 'import',
      status: 'completed',
      progress: 100,
      totalItems: 150,
      processedItems: 150,
      successCount: 148,
      errorCount: 2,
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      description: 'Imported 150 guest records from CSV',
      errors: ['Invalid email format for guest@invalid', 'Missing phone number for John Smith']
    },
    {
      id: '2',
      type: 'export',
      status: 'in-progress',
      progress: 65,
      totalItems: 200,
      processedItems: 130,
      successCount: 130,
      errorCount: 0,
      startTime: new Date(Date.now() - 30 * 60 * 1000),
      description: 'Exporting event data to Excel format',
      errors: []
    }
  ]

  // Initialize with sample data
  useState(() => {
    setOperations(sampleOperations)
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileInput(file)
      toast({
        title: 'File Selected',
        description: `${file.name} has been selected for import.`,
      })
    }
  }

  const startImport = async () => {
    if (!fileInput || !selectedTemplate) {
      toast({
        title: 'Missing Information',
        description: 'Please select a file and template to start import.',
        variant: 'destructive'
      })
      return
    }

    setIsProcessing(true)
    const operation: BulkOperation = {
      id: `op_${Date.now()}`,
      type: 'import',
      status: 'in-progress',
      progress: 0,
      totalItems: 100, // This would be calculated from the file
      processedItems: 0,
      successCount: 0,
      errorCount: 0,
      startTime: new Date(),
      description: `Importing ${fileInput.name} using ${selectedTemplate} template`,
      errors: []
    }

    setOperations(prev => [operation, ...prev])

    try {
      // Simulate import process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setOperations(prev => prev.map(op => 
          op.id === operation.id 
            ? { 
                ...op, 
                progress: i, 
                processedItems: Math.floor((i / 100) * operation.totalItems),
                successCount: Math.floor((i / 100) * operation.totalItems * 0.95),
                errorCount: Math.floor((i / 100) * operation.totalItems * 0.05)
              }
            : op
        ))
      }

      // Mark as completed
      setOperations(prev => prev.map(op => 
        op.id === operation.id 
          ? { ...op, status: 'completed', endTime: new Date() }
          : op
      ))

      toast({
        title: 'Import Completed',
        description: `Successfully imported ${operation.totalItems} items.`,
      })
    } catch (error) {
      setOperations(prev => prev.map(op => 
        op.id === operation.id 
          ? { ...op, status: 'failed', endTime: new Date() }
          : op
      ))
      toast({
        title: 'Import Failed',
        description: 'There was an error during import. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsProcessing(false)
      setFileInput(null)
      setSelectedTemplate('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const startExport = async () => {
    if (!selectedOperation) {
      toast({
        title: 'Missing Information',
        description: 'Please select an export operation.',
        variant: 'destructive'
      })
      return
    }

    setIsProcessing(true)
    const operation: BulkOperation = {
      id: `op_${Date.now()}`,
      type: 'export',
      status: 'in-progress',
      progress: 0,
      totalItems: 200,
      processedItems: 0,
      successCount: 0,
      errorCount: 0,
      startTime: new Date(),
      description: `Exporting ${selectedOperation} data`,
      errors: []
    }

    setOperations(prev => [operation, ...prev])

    try {
      // Simulate export process
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 300))
        setOperations(prev => prev.map(op => 
          op.id === operation.id 
            ? { 
                ...op, 
                progress: i, 
                processedItems: Math.floor((i / 100) * operation.totalItems),
                successCount: Math.floor((i / 100) * operation.totalItems)
              }
            : op
        ))
      }

      // Mark as completed
      setOperations(prev => prev.map(op => 
        op.id === operation.id 
          ? { ...op, status: 'completed', endTime: new Date() }
          : op
      ))

      // Trigger download
      const blob = new Blob(['Sample export data'], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedOperation}-export.csv`
      a.click()
      URL.revokeObjectURL(url)

      toast({
        title: 'Export Completed',
        description: `Data exported successfully.`,
      })
    } catch (error) {
      setOperations(prev => prev.map(op => 
        op.id === operation.id 
          ? { ...op, status: 'failed', endTime: new Date() }
          : op
      ))
      toast({
        title: 'Export Failed',
        description: 'There was an error during export. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsProcessing(false)
      setSelectedOperation('')
    }
  }

  const startBatchUpdate = async () => {
    if (!batchData.trim()) {
      toast({
        title: 'Missing Data',
        description: 'Please enter batch update data.',
        variant: 'destructive'
      })
      return
    }

    setIsProcessing(true)
    const operation: BulkOperation = {
      id: `op_${Date.now()}`,
      type: 'batch-update',
      status: 'in-progress',
      progress: 0,
      totalItems: 50,
      processedItems: 0,
      successCount: 0,
      errorCount: 0,
      startTime: new Date(),
      description: 'Performing batch update operation',
      errors: []
    }

    setOperations(prev => [operation, ...prev])

    try {
      // Simulate batch update process
      for (let i = 0; i <= 100; i += 25) {
        await new Promise(resolve => setTimeout(resolve, 400))
        setOperations(prev => prev.map(op => 
          op.id === operation.id 
            ? { 
                ...op, 
                progress: i, 
                processedItems: Math.floor((i / 100) * operation.totalItems),
                successCount: Math.floor((i / 100) * operation.totalItems * 0.98),
                errorCount: Math.floor((i / 100) * operation.totalItems * 0.02)
              }
            : op
        ))
      }

      setOperations(prev => prev.map(op => 
        op.id === operation.id 
          ? { ...op, status: 'completed', endTime: new Date() }
          : op
      ))

      toast({
        title: 'Batch Update Completed',
        description: `Successfully updated ${operation.totalItems} items.`,
      })
    } catch (error) {
      setOperations(prev => prev.map(op => 
        op.id === operation.id 
          ? { ...op, status: 'failed', endTime: new Date() }
          : op
      ))
      toast({
        title: 'Batch Update Failed',
        description: 'There was an error during batch update. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsProcessing(false)
      setBatchData('')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in-progress': return <RotateCcw className="h-4 w-4 text-blue-600 animate-spin" />
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />
      default: return <Calendar className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Bulk Operations & Data Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Import, export, and manage large amounts of data efficiently. Support for CSV, Excel, and custom formats with validation and error handling.
        </p>
      </div>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-500" />
            Import Data
          </CardTitle>
          <CardDescription>
            Import events, vendors, guests, and other data from CSV files using predefined templates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="importTemplate">Import Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select import template" />
                  </SelectTrigger>
                  <SelectContent>
                    {importTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fileUpload">File Upload</Label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {selectedTemplate && (
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Template Details</h4>
                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <p><strong>Fields:</strong> {importTemplates.find(t => t.id === selectedTemplate)?.fields.join(', ')}</p>
                  <p><strong>Sample Data:</strong></p>
                  <pre className="bg-white dark:bg-slate-800 p-2 rounded text-xs overflow-x-auto">
                    {importTemplates.find(t => t.id === selectedTemplate)?.sampleData}
                  </pre>
                </div>
              </div>
            )}

            <Button 
              onClick={startImport} 
              disabled={!fileInput || !selectedTemplate || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Start Import
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-500" />
            Export Data
          </CardTitle>
          <CardDescription>
            Export your data in various formats for backup, analysis, or integration with other systems.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exportOperation">Export Operation</Label>
                <Select value={selectedOperation} onValueChange={setSelectedOperation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select export operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="events">All Events</SelectItem>
                    <SelectItem value="vendors">Vendor Directory</SelectItem>
                    <SelectItem value="guests">Guest Lists</SelectItem>
                    <SelectItem value="tasks">Task Lists</SelectItem>
                    <SelectItem value="budgets">Budget Reports</SelectItem>
                    <SelectItem value="analytics">Analytics Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Format</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">CSV</Button>
                  <Button variant="outline" size="sm" className="flex-1">Excel</Button>
                  <Button variant="outline" size="sm" className="flex-1">JSON</Button>
                </div>
              </div>
            </div>

            <Button 
              onClick={startExport} 
              disabled={!selectedOperation || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Start Export
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Batch Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-500" />
            Batch Operations
          </CardTitle>
          <CardDescription>
            Perform bulk updates, deletions, or data migrations across multiple items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="batchData">Batch Update Data (JSON)</Label>
              <Textarea
                id="batchData"
                value={batchData}
                onChange={(e) => setBatchData(e.target.value)}
                placeholder='{"operation": "update", "items": [{"id": "1", "status": "active"}]}'
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={startBatchUpdate} 
                disabled={!batchData.trim() || isProcessing}
                variant="outline"
              >
                {isProcessing ? (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    Batch Update
                  </>
                )}
              </Button>
              <Button variant="outline" disabled={isProcessing}>
                <Database className="h-4 w-4 mr-2" />
                Data Migration
              </Button>
              <Button variant="outline" disabled={isProcessing}>
                <Users className="h-4 w-4 mr-2" />
                Bulk Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operations History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-500" />
            Operations History
          </CardTitle>
          <CardDescription>
            Track the progress and results of all bulk operations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {operations.map(operation => (
              <div key={operation.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(operation.status)}
                      <h4 className="font-medium">{operation.description}</h4>
                      <Badge className={getStatusColor(operation.status)}>
                        {operation.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div>
                        <span className="font-medium">Progress:</span> {operation.progress}%
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> {operation.totalItems}
                      </div>
                      <div>
                        <span className="font-medium">Success:</span> {operation.successCount}
                      </div>
                      <div>
                        <span className="font-medium">Errors:</span> {operation.errorCount}
                      </div>
                    </div>

                    {operation.progress > 0 && operation.progress < 100 && (
                      <Progress value={operation.progress} className="mt-2" />
                    )}

                    {operation.errors.length > 0 && (
                      <div className="mt-2 p-2 bg-red-50 dark:bg-red-950 rounded text-sm">
                        <p className="font-medium text-red-800 dark:text-red-200 mb-1">Errors:</p>
                        <ul className="text-red-700 dark:text-red-300 space-y-1">
                          {operation.errors.map((error, index) => (
                            <li key={index} className="text-xs">• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right text-sm text-slate-500">
                    <div>Started: {operation.startTime.toLocaleTimeString()}</div>
                    {operation.endTime && (
                      <div>Ended: {operation.endTime.toLocaleTimeString()}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {operations.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <FileText className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                <p>No operations yet</p>
                <p className="text-sm">Start an import, export, or batch operation to see it here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
