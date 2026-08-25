import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';
import { Loader2, RotateCcw, Eye, Sparkles, AlertCircle } from 'lucide-react';

interface ThreeDViewerProps {
  stlUrl?: string;
  colorHex: string;
  wireframe?: boolean;
  scale?: number;
  autoRotate?: boolean;
}

// Converter Data URL (Base64) diretamente para ArrayBuffer de forma síncrona
function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer {
  const base64Index = dataUrl.indexOf(';base64,');
  if (base64Index !== -1) {
    const base64 = dataUrl.substring(base64Index + 8);
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  const commaIndex = dataUrl.indexOf(',');
  const text = decodeURIComponent(dataUrl.substring(commaIndex + 1));
  const encoder = new TextEncoder();
  return encoder.encode(text).buffer;
}

export const ThreeDViewer: React.FC<ThreeDViewerProps> = ({
  stlUrl,
  colorHex,
  wireframe = false,
  scale = 1,
  autoRotate = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(autoRotate);
  const [isWireframe, setIsWireframe] = useState<boolean>(wireframe);
  const [modelType, setModelType] = useState<'stl' | '3mf' | 'demo'>('demo');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshRef = useRef<THREE.Object3D | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 350;

    // 1. Cenário 3D com fundo claro e suave
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f0f9ff');
    sceneRef.current = scene;

    // Hotbed Grid de Impressão 3D alegre
    const gridHelper = new THREE.GridHelper(12, 24, 0xf97316, 0xcbd5e1);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // 2. Câmera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4, 9);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Iluminação Studio
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 10, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00f0ff, 0.6);
    fillLight.position.set(-5, -2, -5);
    scene.add(fillLight);

    // 4. Renderer WebGL
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // Material 3D Base
    const displayColor = colorHex === 'gradient' ? '#FF5500' : colorHex;
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(displayColor),
      metalness: 0.3,
      roughness: 0.25,
      wireframe: isWireframe,
    });
    materialRef.current = material;

    // Função universal para renderizar tanto arquivos STL quanto arquivos 3MF (ZIP)
    const renderModelBuffer = (buffer: ArrayBuffer, urlSource: string) => {
      try {
        const bytes = new Uint8Array(buffer);
        // Arquivos 3MF são contêineres ZIP iniciando com a assinatura 0x50 0x4B (PK..)
        const is3MF =
          (bytes[0] === 0x50 && bytes[1] === 0x4b) ||
          urlSource.toLowerCase().includes('.3mf');

        if (is3MF) {
          const m3fLoader = new ThreeMFLoader();
          const group = m3fLoader.parse(buffer);

          // Centralizar objeto 3MF
          const box = new THREE.Box3().setFromObject(group);
          const center = new THREE.Vector3();
          box.getCenter(center);
          group.position.sub(center);

          const size = new THREE.Vector3();
          box.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          const targetSize = 3.5;
          const fitScale = maxDim > 0 ? targetSize / maxDim : 1;
          group.scale.set(fitScale, fitScale, fitScale);

          // Aplicar o material selecionado a todas as malhas do modelo 3MF
          group.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              (child as THREE.Mesh).material = material;
            }
          });

          meshRef.current = group;
          scene.add(group);
          setModelType('3mf');
          setLoading(false);
        } else {
          // Arquivo STL padrão
          const stlLoader = new STLLoader();
          const geometry = stlLoader.parse(buffer);
          geometry.center();
          geometry.computeVertexNormals();

          geometry.computeBoundingBox();
          const box = geometry.boundingBox;
          if (box) {
            const maxDim = Math.max(
              box.max.x - box.min.x,
              box.max.y - box.min.y,
              box.max.z - box.min.z
            );
            const targetSize = 3.5;
            const fitScale = maxDim > 0 ? targetSize / maxDim : 1;
            geometry.scale(fitScale, fitScale, fitScale);
          }

          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(0, 0, 0);
          meshRef.current = mesh;
          scene.add(mesh);
          setModelType('stl');
          setLoading(false);
        }
      } catch (err) {
        console.error('Erro ao fazer parse do arquivo 3D:', err);
        createFallbackMesh(scene, material);
      }
    };

    // Carregamento Seguro do Arquivo 3D
    if (stlUrl && stlUrl.trim().length > 0) {
      setLoading(true);

      if (stlUrl.startsWith('data:')) {
        try {
          const buffer = dataUrlToArrayBuffer(stlUrl);
          renderModelBuffer(buffer, stlUrl);
        } catch (e) {
          console.error('Erro ao converter Data URL base64:', e);
          createFallbackMesh(scene, material);
        }
      } else {
        fetch(stlUrl)
          .then((res) => res.arrayBuffer())
          .then((buffer) => renderModelBuffer(buffer, stlUrl))
          .catch((error) => {
            console.warn('Erro ao carregar URL do arquivo 3D:', error);
            createFallbackMesh(scene, material);
          });
      }
    } else {
      createFallbackMesh(scene, material);
    }

    function createFallbackMesh(sc: THREE.Scene, mat: THREE.MeshStandardMaterial) {
      const geom = new THREE.IcosahedronGeometry(1.8, 1);
      geom.computeVertexNormals();
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(0, 0, 0);
      meshRef.current = mesh;
      sc.add(mesh);
      setModelType('demo');
      setLoading(false);
    }

    // Loop de Animação
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (meshRef.current && isRotating && !isDragging.current) {
        meshRef.current.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 350;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [stlUrl]);

  // Atualizar Cor
  useEffect(() => {
    if (meshRef.current) {
      const displayColor = colorHex === 'gradient' ? '#FF5500' : colorHex;
      const newColor = new THREE.Color(displayColor);
      meshRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
          ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).color.set(newColor);
        }
      });
    }
  }, [colorHex]);

  // Atualizar Wireframe
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
          ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).wireframe = isWireframe;
        }
      });
    }
  }, [isWireframe]);

  // Atualizar Escala
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(scale, scale, scale);
    }
  }, [scale]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !meshRef.current) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    meshRef.current.rotation.y += deltaX * 0.01;
    meshRef.current.rotation.x += deltaY * 0.01;

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const resetView = () => {
    if (meshRef.current) {
      meshRef.current.rotation.set(0, 0, 0);
      meshRef.current.scale.set(1, 1, 1);
    }
  };

  return (
    <div className="relative w-full h-[360px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-xs select-none group">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-20 text-indigo-600">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-600" />
          <span className="text-xs font-bold tracking-widest text-slate-600">CARREGANDO MODELO 3D (.STL / .3MF)...</span>
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 flex items-center gap-2 pointer-events-none shadow-xs">
        {modelType === 'stl' || modelType === '3mf' ? (
          <>
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-700">
              Modelo {modelType.toUpperCase()} Real • Arraste para girar 🚀
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] font-bold text-amber-800">
              Preview 3D Interativo • Faça upload no Painel Admin
            </span>
          </>
        )}
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={() => setIsWireframe(!isWireframe)}
          className={`p-2 rounded-xl text-xs font-bold transition-all ${
            isWireframe ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
          title="Alternar Wireframe"
        >
          <Eye className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
            isRotating ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-500 hover:bg-slate-100'
          }`}
          title="Rotação Automática"
        >
          {isRotating ? 'GIRANDO 💫' : 'PAUSADO'}
        </button>

        <button
          type="button"
          onClick={resetView}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
          title="Resetar Câmera"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
