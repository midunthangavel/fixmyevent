'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useLocalStorage } from '@/hooks/use-local-storage'

type Theme = 'dark' | 'light' | 'system'
type FontSize = 'small' | 'medium' | 'large' | 'x-large'
type Contrast = 'normal' | 'high' | 'ultra-high'

interface ThemeSettings {
  theme: Theme
  fontSize: FontSize
  contrast: Contrast
  reducedMotion: boolean
  highContrast: boolean
  showFocusIndicators: boolean
}

interface EnhancedThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

interface EnhancedThemeProviderState {
  settings: ThemeSettings
  setTheme: (theme: Theme) => void
  setFontSize: (size: FontSize) => void
  setContrast: (contrast: Contrast) => void
  setReducedMotion: (reduced: boolean) => void
  setHighContrast: (high: boolean) => void
  setShowFocusIndicators: (show: boolean) => void
  resetToDefaults: () => void
}

const defaultSettings: ThemeSettings = {
  theme: 'system',
  fontSize: 'medium',
  contrast: 'normal',
  reducedMotion: false,
  highContrast: false,
  showFocusIndicators: true
}

const initialState: EnhancedThemeProviderState = {
  settings: defaultSettings,
  setTheme: () => null,
  setFontSize: () => null,
  setContrast: () => null,
  setReducedMotion: () => null,
  setHighContrast: () => null,
  setShowFocusIndicators: () => null,
  resetToDefaults: () => null
}

const EnhancedThemeProviderContext = createContext<EnhancedThemeProviderState>(initialState)

export function EnhancedThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'fixmyevent-theme-settings',
  ...props
}: EnhancedThemeProviderProps) {
  const [settings, setSettings] = useLocalStorage<ThemeSettings>(storageKey, {
    ...defaultSettings,
    theme: defaultTheme
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement

    // Apply theme
    root.classList.remove('light', 'dark')
    if (settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(settings.theme)
    }

    // Apply font size
    root.classList.remove('text-small', 'text-medium', 'text-large', 'text-x-large')
    root.classList.add(`text-${settings.fontSize}`)

    // Apply contrast
    root.classList.remove('contrast-normal', 'contrast-high', 'contrast-ultra-high')
    root.classList.add(`contrast-${settings.contrast}`)

    // Apply accessibility features
    if (settings.reducedMotion) {
      root.classList.add('motion-reduce')
    } else {
      root.classList.remove('motion-reduce')
    }

    if (settings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    if (settings.showFocusIndicators) {
      root.classList.add('show-focus')
    } else {
      root.classList.remove('show-focus')
    }

    // Update CSS custom properties for dynamic theming
    root.style.setProperty('--font-size-base', getFontSizeValue(settings.fontSize))
    root.style.setProperty('--contrast-multiplier', getContrastValue(settings.contrast))
  }, [settings, mounted])

  const getFontSizeValue = (size: FontSize): string => {
    switch (size) {
      case 'small': return '0.875rem'
      case 'medium': return '1rem'
      case 'large': return '1.125rem'
      case 'x-large': return '1.25rem'
      default: return '1rem'
    }
  }

  const getContrastValue = (contrast: Contrast): string => {
    switch (contrast) {
      case 'normal': return '1'
      case 'high': return '1.2'
      case 'ultra-high': return '1.5'
      default: return '1'
    }
  }

  const setTheme = (theme: Theme) => {
    setSettings(prev => ({ ...prev, theme }))
  }

  const setFontSize = (fontSize: FontSize) => {
    setSettings(prev => ({ ...prev, fontSize }))
  }

  const setContrast = (contrast: Contrast) => {
    setSettings(prev => ({ ...prev, contrast }))
  }

  const setReducedMotion = (reducedMotion: boolean) => {
    setSettings(prev => ({ ...prev, reducedMotion }))
  }

  const setHighContrast = (highContrast: boolean) => {
    setSettings(prev => ({ ...prev, highContrast }))
  }

  const setShowFocusIndicators = (showFocusIndicators: boolean) => {
    setSettings(prev => ({ ...prev, showFocusIndicators }))
  }

  const resetToDefaults = () => {
    setSettings(defaultSettings)
  }

  const value: EnhancedThemeProviderState = {
    settings,
    setTheme,
    setFontSize,
    setContrast,
    setReducedMotion,
    setHighContrast,
    setShowFocusIndicators,
    resetToDefaults
  }

  return (
    <EnhancedThemeProviderContext.Provider {...props} value={value}>
      {children}
    </EnhancedThemeProviderContext.Provider>
  )
}

export const useEnhancedTheme = () => {
  const context = useContext(EnhancedThemeProviderContext)
  if (context === undefined) {
    throw new Error('useEnhancedTheme must be used within an EnhancedThemeProvider')
  }
  return context
}
