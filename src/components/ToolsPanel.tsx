import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  MousePointer2, 
  Minus, 
  Trash2,
  Edit3
} from 'lucide-react';

interface ToolsPanelProps {
  activeTool: 'select' | 'wall' | 'delete';
  onToolChange: (tool: 'select' | 'wall' | 'delete') => void;
  onDeleteWall: () => void;
}

export const ToolsPanel: React.FC<ToolsPanelProps> = ({
  activeTool,
  onToolChange,
  onDeleteWall,
}) => {
  const tools = [
    {
      id: 'select' as const,
      icon: MousePointer2,
      label: 'Select/Move',
      description: 'Select and move walls',
    },
    {
      id: 'wall' as const,
      icon: Minus,
      label: 'Create Wall',
      description: 'Click to draw walls',
    },
  ];

  return (
    <div className="bg-gradient-glass backdrop-blur-sm border-r border-toolbar-border shadow-panel">
      <div className="flex flex-col items-center py-6 gap-3">
        {/* Main Tools */}
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <div key={tool.id} className="relative group">
              <Button
                variant={isActive ? "default" : "ghost"}
                size="lg"
                className={`w-14 h-14 p-0 transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-primary text-white shadow-glow scale-105' 
                    : 'hover:bg-accent/50 hover:shadow-tool hover:scale-105'
                }`}
                onClick={() => onToolChange(tool.id)}
                title={tool.description}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'animate-pulse' : ''}`} />
              </Button>
              
              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-floating opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                {tool.label}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover rotate-45"></div>
              </div>
            </div>
          );
        })}

        {/* Separator */}
        <div className="my-3 w-8 border-t border-border/30" />

        {/* Action Tools */}
        <div className="relative group">
          <Button
            variant={activeTool === 'delete' ? "destructive" : "ghost"}
            size="lg"
            className={`w-14 h-14 p-0 transition-all duration-200 ${
              activeTool === 'delete' 
                ? 'bg-destructive text-destructive-foreground shadow-glow scale-105' 
                : 'text-destructive hover:text-destructive hover:bg-destructive/10 hover:shadow-tool hover:scale-105'
            }`}
            onClick={onDeleteWall}
            title={activeTool === 'delete' ? "Click walls to delete" : "Delete selected wall"}
          >
            <Trash2 className={`w-6 h-6 ${activeTool === 'delete' ? 'animate-pulse' : ''}`} />
          </Button>
          
          <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-floating opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
            {activeTool === 'delete' ? 'Delete Mode' : 'Delete Wall'}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover rotate-45"></div>
          </div>
        </div>

        <div className="relative group">
          <Button
            variant="ghost"
            size="lg"
            className="w-14 h-14 p-0 hover:bg-accent/50 hover:shadow-tool hover:scale-105 transition-all duration-200"
            title="Edit wall properties"
          >
            <Edit3 className="w-6 h-6" />
          </Button>
          
          <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-floating opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
            Edit Properties
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover rotate-45"></div>
          </div>
        </div>
      </div>
    </div>
  );
};