import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Download, 
  FileJson, 
  Image, 
  Grid, 
  ZoomIn, 
  ZoomOut,
  Undo,
  Redo,
  Settings,
  Ruler
} from 'lucide-react';

interface ToolbarProps {
  onExportJSON: () => void;
  onToggleGrid: () => void;
  gridVisible: boolean;
  zoom: number;
  onZoom: (zoomIn: boolean) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onExportJSON,
  onToggleGrid,
  gridVisible,
  zoom,
  onZoom,
}) => {
  const handleImportPDF = () => {
    // Placeholder for PDF import
    console.log('Import PDF/JPG - Coming in next milestone');
  };

  const handleScaleCalibration = () => {
    // Placeholder for scale calibration
    console.log('Scale Calibration - Coming in next milestone');
  };

  const handleExportPNG = () => {
    // Placeholder for PNG export
    console.log('Export PNG - Coming in next milestone');
  };

  const handleCRMSync = () => {
    // Placeholder for CRM sync
    console.log('CRM Sync - Future feature');
  };

  return (
    <div className="bg-gradient-toolbar border-b border-toolbar-border px-6 py-3 shadow-panel backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Brand Section */}
          <div className="flex items-center gap-3 mr-6">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-tool">
              <Ruler className="w-4 h-4 text-white" />
            </div>
            <div className="text-lg font-semibold text-foreground">
              Floor Plan Editor
            </div>
            <Badge variant="outline" className="text-xs font-medium">
              MVP
            </Badge>
          </div>

          {/* File Operations */}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleImportPDF}
              className="hover:bg-accent/50 transition-all duration-200 hover:shadow-tool"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import PDF/JPG
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleScaleCalibration}
              className="hover:bg-accent/50 transition-all duration-200 hover:shadow-tool"
            >
              <Settings className="w-4 h-4 mr-2" />
              Scale
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 opacity-30" />

          {/* Export Operations */}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onExportJSON}
              className="hover:bg-accent/50 transition-all duration-200 hover:shadow-tool"
            >
              <FileJson className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleExportPNG}
              className="hover:bg-accent/50 transition-all duration-200 hover:shadow-tool"
            >
              <Image className="w-4 h-4 mr-2" />
              Export PNG
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCRMSync}
              className="hover:bg-accent/50 transition-all duration-200 hover:shadow-tool"
            >
              <Download className="w-4 h-4 mr-2" />
              CRM Sync
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Separator orientation="vertical" className="h-6 opacity-30" />

          {/* View Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant={gridVisible ? "default" : "ghost"}
              size="sm"
              onClick={onToggleGrid}
              className={`transition-all duration-200 ${
                gridVisible 
                  ? 'bg-gradient-primary text-white shadow-glow' 
                  : 'hover:bg-accent/50 hover:shadow-tool'
              }`}
            >
              <Grid className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onZoom(false)}
              className="hover:bg-accent/50 transition-all duration-200 hover:shadow-tool"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs font-mono text-muted-foreground min-w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onZoom(true)}
              className="hover:bg-accent/50 transition-all duration-200 hover:shadow-tool"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 opacity-30" />

          {/* History Controls */}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-accent/50 transition-all duration-200 hover:shadow-tool"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-accent/50 transition-all duration-200 hover:shadow-tool"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};