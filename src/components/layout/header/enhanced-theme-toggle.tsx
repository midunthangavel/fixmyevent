'use client'


import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu'
import { 
  Sun, 
    Moon,
  Monitor,
  Type, 
  Eye, 
  Accessibility,
  RotateCcw,
  Palette
} from 'lucide-react'
import { useEnhancedTheme } from '@/components/enhanced-theme-provider'

import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'


export function EnhancedThemeToggle() {
  const { 
    settings, 
    setTheme, 
    setFontSize, 
    setContrast, 
    setReducedMotion, 
    setHighContrast, 
    setShowFocusIndicators,
    resetToDefaults 
  } = useEnhancedTheme()
  


  const getThemeIcon = () => {
    switch (settings.theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }



  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            {getThemeIcon()}
            <span className="hidden sm:inline">Theme</span>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Theme & Accessibility
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          {/* Theme Selection */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Sun className="mr-2 h-4 w-4" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={settings.theme} onValueChange={(value) => setTheme(value as any)}>
                <DropdownMenuRadioItem value="light">
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  <Monitor className="mr-2 h-4 w-4" />
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Font Size */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Type className="mr-2 h-4 w-4" />
              <span>Font Size</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={settings.fontSize} onValueChange={(value) => setFontSize(value as any)}>
                <DropdownMenuRadioItem value="small">Small</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="large">Large</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="x-large">Extra Large</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Contrast */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Eye className="mr-2 h-4 w-4" />
              <span>Contrast</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={settings.contrast} onValueChange={(value) => setContrast(value as any)}>
                <DropdownMenuRadioItem value="normal">Normal</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="high">High</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="ultra-high">Ultra High</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          {/* Accessibility Toggles */}
          <div className="px-2 py-1.5">
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="reduced-motion" className="text-sm flex items-center gap-2">
                <Accessibility className="h-4 w-4" />
                Reduced Motion
              </Label>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={setReducedMotion}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="high-contrast" className="text-sm flex items-center gap-2">
                <Eye className="h-4 w-4" />
                High Contrast
              </Label>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={setHighContrast}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="focus-indicators" className="text-sm flex items-center gap-2">
                <Accessibility className="h-4 w-4" />
                Focus Indicators
              </Label>
              <Switch
                id="focus-indicators"
                checked={settings.showFocusIndicators}
                onCheckedChange={setShowFocusIndicators}
              />
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Reset Button */}
          <DropdownMenuItem onClick={resetToDefaults} className="text-red-600 focus:text-red-600">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Quick Theme Toggle for Mobile */}
      <div className="sm:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system']
            const currentIndex = themes.indexOf(settings.theme || 'light')
            const nextIndex = (currentIndex + 1) % themes.length
            const nextTheme = themes[nextIndex]
            if (nextTheme) {
              setTheme(nextTheme)
            }
          }}
          className="flex items-center gap-2"
        >
          {getThemeIcon()}
        </Button>
      </div>
    </div>
  )
}
