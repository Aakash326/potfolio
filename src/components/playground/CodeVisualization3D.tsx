/**
 * 3D Code Visualization using Three.js
 * Features: Interactive code structure, dependency graphs, animated particles
 */

import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2,
  Settings,
  Eye,
  Zap,
  Layers,
  Network
} from 'lucide-react';
import * as THREE from 'three';
import { CodeVisualization3D as CodeViz3DType } from '@/types/codeplayground';

interface CodeVisualization3DProps {
  data: CodeViz3DType;
  isAnimated?: boolean;
  onNodeClick?: (nodeId: string) => void;
  width?: number;
  height?: number;
  className?: string;
}

interface VisualizationSettings {
  rotation: boolean;
  zoom: number;
  nodeSize: number;
  edgeOpacity: number;
  animationSpeed: number;
  showLabels: boolean;
  colorScheme: 'default' | 'rainbow' | 'mono';
}

const CodeVisualization3D: React.FC<CodeVisualization3DProps> = memo(({
  data,
  isAnimated = true,
  onNodeClick,
  width = 800,
  height = 600,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const nodesRef = useRef<THREE.Group>(new THREE.Group());
  const edgesRef = useRef<THREE.Group>(new THREE.Group());
  const particlesRef = useRef<THREE.Points | null>(null);

  const [isPlaying, setIsPlaying] = useState(isAnimated);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [settings, setSettings] = useState<VisualizationSettings>({
    rotation: true,
    zoom: 1,
    nodeSize: 1,
    edgeOpacity: 0.6,
    animationSpeed: 1,
    showLabels: true,
    colorScheme: 'default'
  });
  const [stats, setStats] = useState({
    nodes: 0,
    edges: 0,
    fps: 0
  });

  // Color schemes for different node types
  const nodeColors = {
    class: 0x4CAF50,
    function: 0x2196F3,
    variable: 0xFF9800,
    import: 0x9C27B0,
    default: 0x607D8B
  };

  // Initialize Three.js scene
  const initScene = useCallback(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 100, 1000);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    camera.position.set(0, 0, 50);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00ff88, 0.5, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Add groups for nodes and edges
    scene.add(nodesRef.current);
    scene.add(edgesRef.current);

    // Mount to DOM
    mountRef.current.appendChild(renderer.domElement);

    // Mouse controls
    const controls = addMouseControls(camera, renderer.domElement);
    
    return { scene, camera, renderer, controls };
  }, [width, height]);

  // Add mouse controls for camera
  const addMouseControls = (camera: THREE.PerspectiveCamera, domElement: HTMLElement) => {
    let isMouseDown = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (event: MouseEvent) => {
      isMouseDown = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isMouseDown) return;

      const deltaX = event.clientX - previousMousePosition.x;
      const deltaY = event.clientY - previousMousePosition.y;

      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position);
      
      spherical.theta -= deltaX * 0.01;
      spherical.phi += deltaY * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 0, 0);

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleWheel = (event: WheelEvent) => {
      const scale = event.deltaY > 0 ? 1.1 : 0.9;
      camera.position.multiplyScalar(scale);
      camera.position.clampLength(10, 200);
    };

    const handleClick = (event: MouseEvent) => {
      const rect = domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(nodesRef.current.children);

      if (intersects.length > 0) {
        const object = intersects[0].object;
        const nodeId = (object as any).userData.nodeId;
        setSelectedNode(nodeId);
        onNodeClick?.(nodeId);
      }
    };

    domElement.addEventListener('mousedown', handleMouseDown);
    domElement.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('mousemove', handleMouseMove);
    domElement.addEventListener('wheel', handleWheel);
    domElement.addEventListener('click', handleClick);

    return {
      dispose: () => {
        domElement.removeEventListener('mousedown', handleMouseDown);
        domElement.removeEventListener('mouseup', handleMouseUp);
        domElement.removeEventListener('mousemove', handleMouseMove);
        domElement.removeEventListener('wheel', handleWheel);
        domElement.removeEventListener('click', handleClick);
      }
    };
  };

  // Create 3D nodes
  const createNodes = useCallback(() => {
    if (!sceneRef.current) return;

    // Clear existing nodes
    nodesRef.current.clear();

    data.nodes.forEach((node, index) => {
      // Node geometry based on type
      let geometry: THREE.BufferGeometry;
      switch (node.type) {
        case 'class':
          geometry = new THREE.BoxGeometry(2, 2, 2);
          break;
        case 'function':
          geometry = new THREE.SphereGeometry(1.5, 16, 16);
          break;
        case 'variable':
          geometry = new THREE.ConeGeometry(1, 2, 8);
          break;
        case 'import':
          geometry = new THREE.OctahedronGeometry(1.2);
          break;
        default:
          geometry = new THREE.SphereGeometry(1, 12, 12);
      }

      // Material with color based on type
      const color = nodeColors[node.type] || nodeColors.default;
      const material = new THREE.MeshPhongMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.8,
        shininess: 100
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(node.position[0], node.position[1], node.position[2]);
      mesh.scale.setScalar(node.size * settings.nodeSize);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Store node data
      (mesh as any).userData = { 
        nodeId: node.id, 
        type: node.type, 
        label: node.label 
      };

      // Add selection outline
      const outlineGeometry = geometry.clone();
      const outlineMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.BackSide,
        transparent: true,
        opacity: selectedNode === node.id ? 0.3 : 0
      });
      const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
      outline.scale.setScalar(1.1);
      mesh.add(outline);

      // Add text label if enabled
      if (settings.showLabels) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = 256;
        canvas.height = 64;
        context.fillStyle = '#ffffff';
        context.font = '24px Arial';
        context.textAlign = 'center';
        context.fillText(node.label, 128, 40);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(0, 3, 0);
        sprite.scale.set(4, 1, 1);
        mesh.add(sprite);
      }

      nodesRef.current.add(mesh);
    });
  }, [data.nodes, selectedNode, settings.nodeSize, settings.showLabels]);

  // Create 3D edges (connections between nodes)
  const createEdges = useCallback(() => {
    if (!sceneRef.current) return;

    // Clear existing edges
    edgesRef.current.clear();

    data.edges.forEach(edge => {
      const sourceNode = data.nodes.find(n => n.id === edge.source);
      const targetNode = data.nodes.find(n => n.id === edge.target);

      if (!sourceNode || !targetNode) return;

      // Create curved line between nodes
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(...sourceNode.position),
        new THREE.Vector3(
          (sourceNode.position[0] + targetNode.position[0]) / 2,
          (sourceNode.position[1] + targetNode.position[1]) / 2 + 5,
          (sourceNode.position[2] + targetNode.position[2]) / 2
        ),
        new THREE.Vector3(...targetNode.position)
      );

      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      // Edge color based on type
      let color: number;
      switch (edge.type) {
        case 'calls':
          color = 0xff4444;
          break;
        case 'imports':
          color = 0x44ff44;
          break;
        case 'inherits':
          color = 0x4444ff;
          break;
        case 'uses':
          color = 0xffff44;
          break;
        default:
          color = 0x888888;
      }

      const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: settings.edgeOpacity * edge.strength,
        linewidth: 2
      });

      const line = new THREE.Line(geometry, material);
      edgesRef.current.add(line);
    });
  }, [data.nodes, data.edges, settings.edgeOpacity]);

  // Create particle system for background effects
  const createParticles = useCallback(() => {
    if (!sceneRef.current) return;

    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a sphere
      positions[i3] = (Math.random() - 0.5) * 200;
      positions[i3 + 1] = (Math.random() - 0.5) * 200;
      positions[i3 + 2] = (Math.random() - 0.5) * 200;

      // Random colors
      colors[i3] = Math.random() * 0.5 + 0.5;
      colors[i3 + 1] = Math.random() * 0.5 + 0.5;
      colors[i3 + 2] = Math.random() * 0.5 + 0.5;

      sizes[i] = Math.random() * 2 + 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float r = distance(gl_PointCoord, vec2(0.5, 0.5));
          if (r > 0.5) discard;
          
          float alpha = 1.0 - (r * 2.0);
          gl_FragColor = vec4(vColor, alpha * 0.3);
        }
      `,
      transparent: true,
      vertexColors: true
    });

    particlesRef.current = new THREE.Points(geometry, material);
    sceneRef.current.add(particlesRef.current);
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    if (!rendererRef.current || !cameraRef.current || !sceneRef.current) return;

    const time = Date.now() * 0.001 * settings.animationSpeed;

    // Rotate scene if enabled
    if (settings.rotation && isPlaying) {
      sceneRef.current.rotation.y += 0.005;
    }

    // Animate particles
    if (particlesRef.current) {
      const material = particlesRef.current.material as THREE.ShaderMaterial;
      material.uniforms.time.value = time;
      
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + i * 0.01) * 0.01;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate nodes
    nodesRef.current.children.forEach((node, index) => {
      if (isPlaying) {
        node.rotation.y += 0.01;
        node.position.y += Math.sin(time + index) * 0.02;
      }
    });

    rendererRef.current.render(sceneRef.current, cameraRef.current);

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [isPlaying, settings.rotation, settings.animationSpeed]);

  // Initialize scene on mount
  useEffect(() => {
    const scene = initScene();
    createNodes();
    createEdges();
    createParticles();
    
    setStats({
      nodes: data.nodes.length,
      edges: data.edges.length,
      fps: 60
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      scene?.controls.dispose();
    };
  }, [initScene, createNodes, createEdges, createParticles, data]);

  // Start/stop animation
  useEffect(() => {
    if (isPlaying) {
      animate();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [isPlaying, animate]);

  // Update visualization when settings change
  useEffect(() => {
    createNodes();
    createEdges();
  }, [createNodes, createEdges, settings]);

  const togglePlayback = () => setIsPlaying(!isPlaying);

  const resetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 50);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const updateSetting = (key: keyof VisualizationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className={`bg-background/50 backdrop-blur-sm border-border/50 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            3D Code Visualization
            {selectedNode && (
              <Badge variant="secondary" className="ml-2">
                Selected: {data.nodes.find(n => n.id === selectedNode)?.label}
              </Badge>
            )}
          </CardTitle>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Layers className="h-3 w-3" />
              {stats.nodes} nodes
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Zap className="h-3 w-3" />
              {stats.edges} edges
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlayback}
            className="h-8 gap-2"
          >
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetCamera}
            className="h-8 gap-2"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>

          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-muted-foreground">Zoom:</span>
            <Slider
              value={[settings.zoom]}
              onValueChange={([value]) => updateSetting('zoom', value)}
              min={0.5}
              max={3}
              step={0.1}
              className="w-16"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Speed:</span>
            <Slider
              value={[settings.animationSpeed]}
              onValueChange={([value]) => updateSetting('animationSpeed', value)}
              min={0.1}
              max={3}
              step={0.1}
              className="w-16"
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-8"
          >
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative">
          <div
            ref={mountRef}
            style={{ width, height }}
            className="border-t border-border/50 bg-gradient-to-br from-background/80 to-muted/20"
          />
          
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border border-border/50 rounded-lg p-3"
            >
              <div className="text-sm">
                <div className="font-semibold">{data.nodes.find(n => n.id === selectedNode)?.label}</div>
                <div className="text-muted-foreground">
                  Type: {data.nodes.find(n => n.id === selectedNode)?.type}
                </div>
                <div className="text-muted-foreground">
                  Connections: {data.edges.filter(e => e.source === selectedNode || e.target === selectedNode).length}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

CodeVisualization3D.displayName = 'CodeVisualization3D';

export default CodeVisualization3D;