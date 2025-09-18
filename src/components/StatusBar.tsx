import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MousePointer2, 
  Minus, 
  Grid, 
  Activity,
  Ruler,
  Clock
} from 'lucide-react';

interface StatusBarProps {
  activeTool: 'select' | 'wall' | 'delete';
  gridVisible: boolean;
  wallCount: number;
  mousePosition: { x: number; y: number } | null;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  activeTool,
  gridVisible,
  wallCount,
  mousePosition,
}) => {
  const getToolIcon = () => {
    switch (activeTool) {
      case 'select':
        return MousePointer2;
      case 'wall':
        return Minus;
      default:
        return MousePointer2;
    }
  };

  const getToolLabel = () => {
    switch (activeTool) {
      case 'select':
        return 'Select Mode';
      case 'wall':
        return 'Wall Creation Mode';
      default:
        return 'Select Mode';
    }
  };

  const ToolIcon = getToolIcon();

  return (
    <div className="bg-gradient-glass backdrop-blur-sm border-t border-toolbar-border px-4 py-2 shadow-panel">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {/* Current Tool */}
          <div className="flex items-center gap-2">
            <ToolIcon className="w-4 h-4 text-primary" />
            <span className="font-medium">{getToolLabel()}</span>
          </div>

          <Separator orientation="vertical" className="h-4 opacity-30" />

          {/* Grid Status */}
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-muted-foreground" />
            <Badge variant={gridVisible ? "default" : "secondary"} className="text-xs">
              Grid {gridVisible ? 'ON' : 'OFF'}
            </Badge>
          </div>

          <Separator orientation="vertical" className="h-4 opacity-30" />

          {/* Wall Count */}
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Walls: {wallCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Mouse Position */}
          {mousePosition && (
            <>
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-muted-foreground">
                  X: {(mousePosition.x / 20).toFixed(1)}m, Y: {(mousePosition.y / 20).toFixed(1)}m
                </span>
              </div>
              <Separator orientation="vertical" className="h-4 opacity-30" />
            </>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};