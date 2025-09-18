import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ruler, Square, Palette, Info, Lightbulb } from 'lucide-react';

interface Wall {
  id: string;
  points: number[];
  thickness: number;
  color: string;
  selected: boolean;
}

interface PropertiesPanelProps {
  selectedWall: Wall | undefined;
  totalArea: number;
  scale: number;
  onUpdateWall?: (wallId: string, property: keyof Wall, value: any) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedWall,
  totalArea,
  scale,
  onUpdateWall,
}) => {
  const calculateWallLength = (points: number[]): number => {
    if (points.length < 4) return 0;
    const dx = points[2] - points[0];
    const dy = points[3] - points[1];
    return Math.sqrt(dx * dx + dy * dy) / 20; // Convert pixels to meters (20px = 1m)
  };

  return (
    <div className="bg-gradient-glass backdrop-blur-sm border-l border-toolbar-border shadow-panel h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
        {/* Area Calculation */}
        <Card className="shadow-tool border-border/20 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Square className="w-4 h-4 text-white" />
              </div>
              Area Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Total Area</Label>
                <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {totalArea.toFixed(2)} m²
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Scale</Label>
                <Badge variant="outline" className="font-mono text-sm">
                  1:{scale}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="opacity-30" />

        {/* Wall Properties */}
        {selectedWall ? (
          <Card className="shadow-tool border-border/20 bg-card/80 backdrop-blur-sm animate-fade-in">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Ruler className="w-4 h-4 text-white" />
                </div>
                Wall Properties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-3">
                  <Label htmlFor="wall-length" className="text-sm font-medium">Length</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="wall-length"
                      value={calculateWallLength(selectedWall.points).toFixed(2)}
                      readOnly
                      className="font-mono bg-muted/50 border-border/30"
                    />
                    <Badge variant="secondary" className="text-xs">meters</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="wall-thickness" className="text-sm font-medium">Thickness</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="wall-thickness"
                      value={selectedWall.thickness}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && onUpdateWall) {
                          onUpdateWall(selectedWall.id, 'thickness', value);
                        }
                      }}
                      className="font-mono bg-background/50 border-border/30"
                      type="number"
                      min="1"
                      max="100"
                    />
                    <Badge variant="secondary" className="text-xs">cm</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Color
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      type="color"
                      value={selectedWall.color.includes('hsl') ? '#374151' : selectedWall.color}
                      onChange={(e) => {
                        if (onUpdateWall) {
                          onUpdateWall(selectedWall.id, 'color', e.target.value);
                        }
                      }}
                      className="w-16 h-10 p-1 rounded-lg cursor-pointer border-border/30"
                    />
                    <Input
                      value={selectedWall.color}
                      onChange={(e) => {
                        if (onUpdateWall) {
                          onUpdateWall(selectedWall.id, 'color', e.target.value);
                        }
                      }}
                      className="flex-1 font-mono text-sm bg-background/50 border-border/30"
                      placeholder="Enter color (hex, hsl, etc.)"
                    />
                  </div>
                </div>
              </div>

              <Separator className="opacity-30" />

              <div className="bg-muted/20 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Info className="w-4 h-4 text-primary" />
                  Coordinates
                </div>
                <div className="text-sm text-muted-foreground space-y-1 font-mono">
                  <div>Start: ({(selectedWall.points[0] / 20).toFixed(1)}, {(selectedWall.points[1] / 20).toFixed(1)})</div>
                  <div>End: ({(selectedWall.points[2] / 20).toFixed(1)}, {(selectedWall.points[3] / 20).toFixed(1)})</div>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                onClick={() => {
                  // Changes are applied automatically on input change
                }}
              >
                Properties Auto-Saved
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-tool border-border/20 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto">
                  <Ruler className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">No Wall Selected</div>
                  <div className="text-xs text-muted-foreground">
                    Select a wall to view and edit its properties
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="shadow-tool border-border/20 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-accent-foreground" />
              </div>
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>Select "Create Wall" tool and click to place walls with grid snapping</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>Use "Select/Move" tool to select and modify existing walls</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>Toggle grid for precise alignment and measurements</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>Export as JSON for data backup or PNG for visual sharing</div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};