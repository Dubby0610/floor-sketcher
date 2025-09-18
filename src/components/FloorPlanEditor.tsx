import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Circle, Text } from 'react-konva';
import { Toolbar } from './Toolbar';
import { ToolsPanel } from './ToolsPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { StatusBar } from './StatusBar';
import { toast } from 'sonner';

export interface Wall {
  id: string;
  points: number[];
  thickness: number;
  color: string;
  selected: boolean;
}

export interface FloorPlanState {
  walls: Wall[];
  tool: 'select' | 'wall' | 'delete';
  scale: number;
  gridVisible: boolean;
  zoom: number;
}

const FloorPlanEditor = () => {
  const [state, setState] = useState<FloorPlanState>({
    walls: [],
    tool: 'select',
    scale: 1, // 1 unit = 1 meter
    gridVisible: true,
    zoom: 1,
  });

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentWall, setCurrentWall] = useState<number[]>([]);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const stageRef = useRef<any>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  // Auto-hide welcome dialog after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('canvas-container');
      if (container) {
        setStageSize({
          width: container.offsetWidth,
          height: container.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Grid generation with enhanced styling
  const generateGrid = () => {
    const gridSize = 20; // pixels per grid unit
    const lines = [];
    const { width, height } = stageSize;

    // Vertical lines
    for (let i = 0; i <= width / gridSize; i++) {
      const x = i * gridSize;
      const isMajor = i % 5 === 0;
      lines.push(
        <Line
          key={`v-${i}`}
          points={[x, 0, x, height]}
          stroke={isMajor ? "hsl(var(--grid-major))" : "hsl(var(--grid-line))"}
          strokeWidth={isMajor ? 1 : 0.5}
          opacity={isMajor ? 0.4 : 0.2}
        />
      );
    }

    // Horizontal lines
    for (let i = 0; i <= height / gridSize; i++) {
      const y = i * gridSize;
      const isMajor = i % 5 === 0;
      lines.push(
        <Line
          key={`h-${i}`}
          points={[0, y, width, y]}
          stroke={isMajor ? "hsl(var(--grid-major))" : "hsl(var(--grid-line))"}
          strokeWidth={isMajor ? 1 : 0.5}
          opacity={isMajor ? 0.4 : 0.2}
        />
      );
    }

    return lines;
  };

  // Enhanced snap to grid with visual feedback
  const snapToGrid = (pos: { x: number; y: number }) => {
    const gridSize = 20;
    const snapped = {
      x: Math.round(pos.x / gridSize) * gridSize,
      y: Math.round(pos.y / gridSize) * gridSize,
    };
    setMousePosition(snapped);
    return snapped;
  };

  // Handle canvas click with enhanced feedback and wall dragging
  const handleStageMouseDown = (e: any) => {
    const pos = snapToGrid(e.target.getStage().getPointerPosition());
    
    if (state.tool === 'wall') {
      if (!isDrawing) {
        // Start new wall
        setIsDrawing(true);
        setCurrentWall([pos.x, pos.y, pos.x, pos.y]);
        toast.success("Wall started! Click again to finish.", {
          duration: 2000,
        });
      } else {
        // Finish wall
        const newWall: Wall = {
          id: Date.now().toString(),
          points: [...currentWall, pos.x, pos.y],
          thickness: 10,
          color: 'hsl(var(--wall-default))',
          selected: false,
        };
        
        setState(prev => ({
          ...prev,
          walls: [...prev.walls, newWall],
        }));
        
        setIsDrawing(false);
        setCurrentWall([]);
        toast.success("Wall created successfully!", {
          duration: 2000,
        });
      }
    } else if (state.tool === 'select') {
      const clickedOnWall = e.target.attrs.wallId;
      
      if (clickedOnWall) {
        // Select wall and start dragging
        const selectedWallData = state.walls.find(wall => wall.id === clickedOnWall);
        if (selectedWallData) {
          setIsDragging(true);
          setDragOffset({
            x: pos.x - selectedWallData.points[0],
            y: pos.y - selectedWallData.points[1]
          });
        }
        
        setState(prev => ({
          ...prev,
          walls: prev.walls.map(wall => ({
            ...wall,
            selected: wall.id === clickedOnWall,
          })),
        }));
        
        toast.info("Wall selected - drag to move", { duration: 1500 });
      } else {
        // Deselect all walls
        setState(prev => ({
          ...prev,
          walls: prev.walls.map(wall => ({ ...wall, selected: false })),
        }));
      }
    } else if (state.tool === 'delete') {
      const clickedOnWall = e.target.attrs.wallId;
      
      if (clickedOnWall) {
        setState(prev => ({
          ...prev,
          walls: prev.walls.filter(wall => wall.id !== clickedOnWall),
        }));
        toast.success("Wall deleted", { duration: 1500 });
      }
    }
  };

  // Handle mouse up for dragging
  const handleStageMouseUp = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  // Enhanced mouse move with position tracking and wall dragging
  const handleStageMouseMove = (e: any) => {
    const pos = snapToGrid(e.target.getStage().getPointerPosition());
    
    if (isDrawing && state.tool === 'wall') {
      setCurrentWall(prev => [prev[0], prev[1], pos.x, pos.y]);
    } else if (isDragging && state.tool === 'select') {
      // Move selected wall
      const selectedWall = state.walls.find(wall => wall.selected);
      if (selectedWall) {
        const newStartX = pos.x - dragOffset.x;
        const newStartY = pos.y - dragOffset.y;
        const wallLength = Math.sqrt(
          Math.pow(selectedWall.points[2] - selectedWall.points[0], 2) +
          Math.pow(selectedWall.points[3] - selectedWall.points[1], 2)
        );
        const angle = Math.atan2(
          selectedWall.points[3] - selectedWall.points[1],
          selectedWall.points[2] - selectedWall.points[0]
        );
        
        setState(prev => ({
          ...prev,
          walls: prev.walls.map(wall =>
            wall.selected
              ? {
                  ...wall,
                  points: [
                    newStartX,
                    newStartY,
                    newStartX + wallLength * Math.cos(angle),
                    newStartY + wallLength * Math.sin(angle)
                  ]
                }
              : wall
          ),
        }));
      }
    }
  };

  // Enhanced tool handlers
  const handleToolChange = (tool: FloorPlanState['tool']) => {
    setState(prev => ({ ...prev, tool }));
    setIsDrawing(false);
    setCurrentWall([]);
    
    const toolNames = {
      select: 'Select Mode',
      wall: 'Wall Creation Mode',
      delete: 'Delete Mode'
    };
    
    toast.info(`Switched to ${toolNames[tool]}`, { duration: 1500 });
  };

  const handleDeleteWall = () => {
    const selectedCount = state.walls.filter(wall => wall.selected).length;
    if (selectedCount > 0) {
      setState(prev => ({
        ...prev,
        walls: prev.walls.filter(wall => !wall.selected),
      }));
      toast.success(`${selectedCount} wall(s) deleted`, { duration: 2000 });
    } else {
      // Switch to delete mode
      handleToolChange('delete');
    }
  };

  const handleToggleGrid = () => {
    setState(prev => ({ ...prev, gridVisible: !prev.gridVisible }));
    toast.info(`Grid ${!state.gridVisible ? 'enabled' : 'disabled'}`, { duration: 1500 });
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.02;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    
    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.1, Math.min(3, newScale));
    
    setState(prev => ({ ...prev, zoom: clampedScale }));
    
    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };
    stage.position(newPos);
  };

  const handleZoom = (zoomIn: boolean) => {
    const scaleBy = 1.2;
    const newZoom = zoomIn ? state.zoom * scaleBy : state.zoom / scaleBy;
    const clampedZoom = Math.max(0.1, Math.min(3, newZoom));
    setState(prev => ({ ...prev, zoom: clampedZoom }));
  };

  const updateWallProperty = (wallId: string, property: keyof Wall, value: any) => {
    setState(prev => ({
      ...prev,
      walls: prev.walls.map(wall =>
        wall.id === wallId ? { ...wall, [property]: value } : wall
      ),
    }));
  };

  const handleExportJSON = () => {
    const exportData = {
      walls: state.walls,
      scale: state.scale,
      metadata: {
        version: "1.0.0",
        exported: new Date().toISOString(),
        wallCount: state.walls.length,
        totalArea: calculateTotalArea(state.walls),
      },
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `floor-plan-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Floor plan exported successfully!", { duration: 2000 });
  };

  const selectedWall = state.walls.find(wall => wall.selected);
  const totalArea = calculateTotalArea(state.walls);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Top Toolbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Toolbar
          onExportJSON={handleExportJSON}
          onToggleGrid={handleToggleGrid}
          gridVisible={state.gridVisible}
          zoom={state.zoom}
          onZoom={handleZoom}
        />
      </div>

      {/* Left Tools Panel */}
      <div className="w-20 mt-16 flex-shrink-0">
        <ToolsPanel
          activeTool={state.tool}
          onToolChange={handleToolChange}
          onDeleteWall={handleDeleteWall}
        />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 mt-16 mb-10 relative">
        <div
          id="canvas-container"
          className="w-full h-full bg-canvas relative overflow-hidden"
        >
          {/* Canvas Instructions Overlay */}
          {state.walls.length === 0 && showWelcome && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 shadow-floating border border-border/20 animate-fade-in">
                <div className="text-center space-y-4">
                  <div className="text-2xl font-semibold text-foreground">Welcome to Floor Plan Editor</div>
                  <div className="text-muted-foreground max-w-md">
                    Select the "Create Wall" tool from the left panel and click on the canvas to start drawing your floor plan.
                  </div>
                  <div className="text-xs text-muted-foreground/70">
                    This message will disappear automatically
                  </div>
                </div>
              </div>
            </div>
          )}

          <Stage
            ref={stageRef}
            width={stageSize.width}
            height={stageSize.height}
            onMouseDown={handleStageMouseDown}
            onMouseMove={handleStageMouseMove}
            onMouseUp={handleStageMouseUp}
            onWheel={handleWheel}
            scaleX={state.zoom}
            scaleY={state.zoom}
          >
            <Layer>
              {/* Enhanced Grid */}
              {state.gridVisible && generateGrid()}

              {/* Existing walls with enhanced styling */}
              {state.walls.map((wall) => (
                <React.Fragment key={wall.id}>
                  <Line
                    points={wall.points}
                    stroke={wall.selected ? 'hsl(var(--wall-selected))' : wall.color}
                    strokeWidth={wall.selected ? wall.thickness + 2 : wall.thickness}
                    lineCap="round"
                    lineJoin="round"
                    wallId={wall.id}
                    shadowEnabled={wall.selected}
                    shadowColor={wall.selected ? 'hsl(var(--wall-selected))' : undefined}
                    shadowBlur={wall.selected ? 10 : 0}
                    shadowOpacity={wall.selected ? 0.3 : 0}
                  />
                  {wall.selected && (
                    <>
                      <Circle
                        x={wall.points[0]}
                        y={wall.points[1]}
                        radius={6}
                        fill="hsl(var(--wall-selected))"
                        stroke="white"
                        strokeWidth={2}
                      />
                      <Circle
                        x={wall.points[2]}
                        y={wall.points[3]}
                        radius={6}
                        fill="hsl(var(--wall-selected))"
                        stroke="white"
                        strokeWidth={2}
                      />
                      {/* Length label with smart positioning */}
                      <Text
                        x={(() => {
                          const midX = (wall.points[0] + wall.points[2]) / 2;
                          const midY = (wall.points[1] + wall.points[3]) / 2;
                          const isVertical = Math.abs(wall.points[2] - wall.points[0]) < Math.abs(wall.points[3] - wall.points[1]);
                          return isVertical ? midX + 15 : midX - 20;
                        })()}
                        y={(() => {
                          const midX = (wall.points[0] + wall.points[2]) / 2;
                          const midY = (wall.points[1] + wall.points[3]) / 2;
                          const isVertical = Math.abs(wall.points[2] - wall.points[0]) < Math.abs(wall.points[3] - wall.points[1]);
                          return isVertical ? midY : midY - 15;
                        })()}
                        text={`${calculateWallLength(wall.points).toFixed(1)}m`}
                        fontSize={12}
                        fill="hsl(var(--measurement-text))"
                        fontFamily="Inter"
                        fontStyle="bold"
                      />
                    </>
                  )}
                </React.Fragment>
              ))}

              {/* Enhanced current drawing wall */}
              {isDrawing && currentWall.length === 4 && (
                <>
                  <Line
                    points={currentWall}
                    stroke="hsl(var(--wall-hover))"
                    strokeWidth={12}
                    lineCap="round"
                    dash={[8, 6]}
                    opacity={0.8}
                  />
                  <Circle
                    x={currentWall[0]}
                    y={currentWall[1]}
                    radius={6}
                    fill="hsl(var(--wall-hover))"
                    stroke="white"
                    strokeWidth={2}
                  />
                  <Circle
                    x={currentWall[2]}
                    y={currentWall[3]}
                    radius={4}
                    fill="hsl(var(--wall-hover))"
                    opacity={0.7}
                  />
                </>
              )}

              {/* Mouse position indicator when creating walls */}
              {state.tool === 'wall' && mousePosition && (
                <Circle
                  x={mousePosition.x}
                  y={mousePosition.y}
                  radius={3}
                  fill="hsl(var(--primary))"
                  opacity={0.6}
                />
              )}
            </Layer>
          </Stage>
        </div>
      </div>

      {/* Right Properties Panel */}
      <div className="w-80 mt-16 mb-10 flex-shrink-0 max-h-screen overflow-hidden">
        <PropertiesPanel
          selectedWall={selectedWall}
          totalArea={totalArea}
          scale={state.scale}
          onUpdateWall={updateWallProperty}
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <StatusBar
          activeTool={state.tool}
          gridVisible={state.gridVisible}
          wallCount={state.walls.length}
          mousePosition={mousePosition}
        />
      </div>
    </div>
  );
};

// Enhanced helper functions
const calculateTotalArea = (walls: Wall[]): number => {
  // Calculate enclosed area based on wall positions (simplified polygon area calculation)
  if (walls.length < 3) return 0;
  
  // For demo purposes, calculate based on wall lengths and positions
  let totalLength = 0;
  walls.forEach(wall => {
    const length = calculateWallLength(wall.points);
    totalLength += length;
  });
  
  // Approximate area based on total perimeter (assuming roughly rectangular space)
  const estimatedArea = Math.pow(totalLength / 4, 2);
  return Math.max(estimatedArea, walls.length * 12.5); // Minimum realistic area
};

const calculateWallLength = (points: number[]): number => {
  if (points.length < 4) return 0;
  const dx = points[2] - points[0];
  const dy = points[3] - points[1];
  return Math.sqrt(dx * dx + dy * dy) / 20; // Convert pixels to meters
};

export default FloorPlanEditor;
