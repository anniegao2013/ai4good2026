"use client"

import { useState, useCallback, useRef, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Cityscape } from "@/components/Cityscape"
import { 
  roadmapNodes, 
  tracks, 
  type RoadmapNode, 
  type TrackId,
  getSuggestedNextNodes,
  getDependentNodes 
} from "@/lib/roadmap-data"
import { cn } from "@/lib/utils"
import { 
  Check, 
  ChevronRight,
  X,
  Lightbulb,
  GripHorizontal,
  ZoomIn,
  ZoomOut,
  Home,
  RotateCcw,
  Sparkles
} from "lucide-react"

const CELL_WIDTH = 280
const CELL_HEIGHT = 160
const CANVAS_PADDING = 100

function getTrackConfig(trackId: TrackId) {
  return tracks.find(t => t.id === trackId) || tracks[0]
}

// Connection line between nodes
function ConnectionLine({ 
  from, 
  to, 
  isCompleted 
}: { 
  from: RoadmapNode
  to: RoadmapNode
  isCompleted: boolean
}) {
  const fromX = from.position.x * CELL_WIDTH + CELL_WIDTH / 2 + CANVAS_PADDING
  const fromY = from.position.y * CELL_HEIGHT + CELL_HEIGHT + CANVAS_PADDING
  const toX = to.position.x * CELL_WIDTH + CELL_WIDTH / 2 + CANVAS_PADDING
  const toY = to.position.y * CELL_HEIGHT + CANVAS_PADDING
  
  // Create a curved path
  const midY = (fromY + toY) / 2
  const path = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`
  
  return (
    <motion.path
      d={path}
      fill="none"
      stroke={isCompleted ? "#22c55e" : "#e5e7eb"}
      strokeWidth={isCompleted ? 3 : 2}
      strokeDasharray={isCompleted ? "none" : "6 4"}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  )
}

// Individual node component
function RoadmapNodeCard({
  node,
  isCompleted,
  isUnlocked,
  isFocused,
  onSelect,
  onComplete
}: {
  node: RoadmapNode
  isCompleted: boolean
  isUnlocked: boolean
  isFocused: boolean
  onSelect: () => void
  onComplete: () => void
}) {
  const track = getTrackConfig(node.track)
  const x = node.position.x * CELL_WIDTH + CANVAS_PADDING
  const y = node.position.y * CELL_HEIGHT + CANVAS_PADDING
  
  return (
    <motion.div
      className={cn(
        "absolute w-[260px] rounded-2xl border-2 p-4 cursor-pointer transition-shadow",
        isCompleted
          ? "border-primary/50 bg-primary/10"
          : isUnlocked
            ? "border-faro-primary/40 bg-white shadow-md hover:shadow-xl"
            : "border-border/50 bg-muted/50 opacity-60",
        isFocused && "ring-4 ring-primary/30 shadow-xl z-10"
      )}
      style={{ 
        left: x, 
        top: y,
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={isUnlocked ? { scale: 1.02 } : {}}
      onClick={isUnlocked ? onSelect : undefined}
    >
      {/* Track badge */}
      <div 
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium mb-2"
        style={{ backgroundColor: track.bgColor, color: track.color }}
      >
        {track.label}
      </div>
      
      {/* Title */}
      <h3 className={cn(
        "font-semibold text-sm mb-1 line-clamp-2",
        isCompleted && "line-through text-muted-foreground"
      )}>
        {node.title}
      </h3>
      
      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2">
        {node.description}
      </p>
      
      {/* Completed checkmark */}
      {isCompleted && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      
    </motion.div>
  )
}

// Detail panel for selected node
function NodeDetailPanel({
  node,
  isCompleted,
  onComplete,
  onClose,
  dependents
}: {
  node: RoadmapNode
  isCompleted: boolean
  onComplete: () => void
  onClose: () => void
  dependents: RoadmapNode[]
}) {
  const track = getTrackConfig(node.track)
  
  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-card border-l border-border shadow-2xl z-50 overflow-y-auto"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
            style={{ backgroundColor: track.bgColor, color: track.color }}
          >
            {track.label}
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Title */}
        <h2 className={cn(
          "text-2xl font-bold mb-3",
          isCompleted && "line-through text-muted-foreground"
        )}>
          {node.title}
        </h2>
        
        {/* Description */}
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {node.details}
        </p>
        
        {/* Tips */}
        {node.tips && node.tips.length > 0 && (
          <div className="mb-6">
            <h3 className="flex items-center gap-2 font-semibold mb-3">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Tips
            </h3>
            <ul className="space-y-2">
              {node.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* What this unlocks */}
        {dependents.length > 0 && (
          <div className="mb-8">
            <h3 className="flex items-center gap-2 font-semibold mb-3">
              <ChevronRight className="w-4 h-4" />
              Completing this unlocks
            </h3>
            <div className="space-y-2">
              {dependents.map(dep => {
                const depTrack = getTrackConfig(dep.track)
                return (
                  <div 
                    key={dep.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50"
                  >
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: depTrack.color }}
                    />
                    <span className="text-sm">{dep.title}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        
        {/* Complete button */}
        <button
          onClick={onComplete}
          className={cn(
            "w-full py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-3",
            isCompleted
              ? "bg-primary/10 text-primary border-2 border-primary/30"
              : "bg-primary text-primary-foreground hover:opacity-90"
          )}
        >
          {isCompleted ? (
            <>
              <Check className="w-5 h-5" />
              Completed
            </>
          ) : (
            "Mark as complete"
          )}
        </button>
      </div>
    </motion.div>
  )
}

// Track legend
function TrackLegend() {
  return (
    <div className="flex flex-wrap gap-2">
      {tracks.map(track => (
        <div 
          key={track.id}
          className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: track.bgColor, color: track.color }}
        >
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: track.color }}
          />
          {track.label}
        </div>
      ))}
    </div>
  )
}

function RoadmapContent() {
  const searchParams = useSearchParams()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [zoom, setZoom] = useState(1.3)
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 })
  
  // Calculate canvas dimensions
  const maxX = Math.max(...roadmapNodes.map(n => n.position.x))
  const maxY = Math.max(...roadmapNodes.map(n => n.position.y))
  const canvasWidth = (maxX + 1) * CELL_WIDTH + CANVAS_PADDING * 2
  const canvasHeight = (maxY + 1) * CELL_HEIGHT + CANVAS_PADDING * 2
  
  const progress = completedTasks.size / roadmapNodes.length
  const suggestedNext = getSuggestedNextNodes(completedTasks, 3)
  
  // Check if a node is unlocked
  const isNodeUnlocked = useCallback((node: RoadmapNode) => {
    if (completedTasks.has(node.id)) return true
    return node.dependencies.every(dep => completedTasks.has(dep))
  }, [completedTasks])
  
  // Handle drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.node-card')) return
    setIsDragging(true)
    dragStart.current = { 
      x: e.clientX, 
      y: e.clientY, 
      posX: position.x, 
      posY: position.y 
    }
  }
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setPosition({
      x: dragStart.current.posX + dx,
      y: dragStart.current.posY + dy
    })
  }, [isDragging])
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])
  
  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.node-card')) return
    const touch = e.touches[0]
    setIsDragging(true)
    dragStart.current = { 
      x: touch.clientX, 
      y: touch.clientY, 
      posX: position.x, 
      posY: position.y 
    }
  }
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return
    const touch = e.touches[0]
    const dx = touch.clientX - dragStart.current.x
    const dy = touch.clientY - dragStart.current.y
    setPosition({
      x: dragStart.current.posX + dx,
      y: dragStart.current.posY + dy
    })
  }, [isDragging])
  
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleTouchEnd)
      return () => {
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, handleTouchMove, handleTouchEnd])
  
  // Toggle completion
  const toggleComplete = useCallback((nodeId: string) => {
    setCompletedTasks(prev => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }, [])
  
  // Zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 1.5))
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4))
  const handleReset = () => {
    setZoom(1.3)
    setPosition({ x: 0, y: 0 })
  }
  
  // Focus on a node
  const focusOnNode = useCallback((node: RoadmapNode) => {
    if (!containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const nodeX = node.position.x * CELL_WIDTH + CANVAS_PADDING + 130
    const nodeY = node.position.y * CELL_HEIGHT + CANVAS_PADDING + 80
    
    setPosition({
      x: containerRect.width / 2 - nodeX * zoom,
      y: containerRect.height / 2 - nodeY * zoom
    })
  }, [zoom])
  
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-border bg-card/80 backdrop-blur-sm z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-faro-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm leading-none">S</span>
              </div>
              <span className="text-lg font-bold tracking-tight">Settle</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-semibold text-primary">{completedTasks.size}</span>
                <span className="text-muted-foreground">/{roadmapNodes.length} tasks</span>
              </div>
              <Link
                href={`/result?${searchParams.toString()}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back
              </Link>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {/* Track legend */}
          <TrackLegend />
        </div>
      </header>
      
      {/* Canvas area */}
      <div 
        ref={containerRef}
        className={cn(
          "flex-1 relative overflow-hidden",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Zoom controls */}
        <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
          <button 
            onClick={handleZoomIn}
            className="p-2 bg-card border border-border rounded-lg hover:bg-secondary transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button 
            onClick={handleZoomOut}
            className="p-2 bg-card border border-border rounded-lg hover:bg-secondary transition-colors"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button 
            onClick={handleReset}
            className="p-2 bg-card border border-border rounded-lg hover:bg-secondary transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
        
        {/* Suggested next */}
        {suggestedNext.length > 0 && !selectedNode && (
          <div className="absolute bottom-24 left-4 right-4 z-30">
            <div className="bg-card/95 backdrop-blur-sm border border-border rounded-2xl p-4 max-w-md">
              <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Suggested next steps
              </h3>
              <div className="space-y-2">
                {suggestedNext.map(node => {
                  const track = getTrackConfig(node.track)
                  return (
                    <button
                      key={node.id}
                      onClick={() => {
                        setSelectedNode(node)
                        focusOnNode(node)
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors text-left"
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: track.bgColor }}
                      >
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: track.color }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{node.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{track.label}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* Canvas */}
        <div
          ref={canvasRef}
          className="absolute"
          style={{
            width: canvasWidth,
            height: canvasHeight,
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Connection lines */}
          <svg 
            className="absolute inset-0 pointer-events-none"
            style={{ width: canvasWidth, height: canvasHeight }}
          >
            {roadmapNodes.map(node => 
              node.dependencies.map(depId => {
                const depNode = roadmapNodes.find(n => n.id === depId)
                if (!depNode) return null
                const isCompleted = completedTasks.has(depId)
                return (
                  <ConnectionLine
                    key={`${depId}-${node.id}`}
                    from={depNode}
                    to={node}
                    isCompleted={isCompleted}
                  />
                )
              })
            )}
          </svg>
          
          {/* Nodes */}
          {roadmapNodes.map(node => (
            <div key={node.id} className="node-card">
              <RoadmapNodeCard
                node={node}
                isCompleted={completedTasks.has(node.id)}
                isUnlocked={isNodeUnlocked(node)}
                isFocused={selectedNode?.id === node.id}
                onSelect={() => setSelectedNode(node)}
                onComplete={() => toggleComplete(node.id)}
              />
            </div>
          ))}
        </div>
        
        {/* Cityscape */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <Cityscape progress={progress} />
        </div>
        
        {/* Drag hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-card/80 backdrop-blur-sm border border-border rounded-full text-xs text-muted-foreground">
            <GripHorizontal className="w-4 h-4" />
            Drag to explore
          </div>
        </div>
      </div>
      
      {/* Detail panel */}
      <AnimatePresence>
        {selectedNode && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setSelectedNode(null)}
            />
            <NodeDetailPanel
              node={selectedNode}
              isCompleted={completedTasks.has(selectedNode.id)}
              onComplete={() => toggleComplete(selectedNode.id)}
              onClose={() => setSelectedNode(null)}
              dependents={getDependentNodes(selectedNode.id)}
            />
          </>
        )}
      </AnimatePresence>
      
      {/* Completion celebration */}
      <AnimatePresence>
        {completedTasks.size === roadmapNodes.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="max-w-md w-full text-center"
            >
              <motion.div 
                className="text-6xl mb-6"
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                🎉
              </motion.div>
              
              <h2 className="text-3xl font-bold mb-4">
                You&apos;re a financial pro!
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                You&apos;ve completed every step on your roadmap. Your financial foundation in the US is solid!
              </p>
              
              <div className="flex flex-col gap-3">
                <Link
                  href="/"
                  className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Back to home
                </Link>
                <button
                  onClick={() => setCompletedTasks(new Set())}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Start over
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function RoadmapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Building your roadmap...</p>
        </div>
      </div>
    }>
      <RoadmapContent />
    </Suspense>
  )
}
