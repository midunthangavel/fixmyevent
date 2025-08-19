
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface PageWrapperProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ 
  icon: Icon, 
  title, 
  description, 
  children,
  className = ""
}: PageWrapperProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 bg-primary/10 rounded-full">
              <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              {title}
            </h1>
            {description && (
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-6 sm:space-y-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
