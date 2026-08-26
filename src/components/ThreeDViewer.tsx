import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';
import { Loader2, RotateCcw, Eye, Sparkles, AlertCircle, Layers } from 'lucide-react';

interface ThreeDViewerProps {
  stlUrl?: string;
  colorHex: string;
  wireframe?: boolean;
  scale?: number;
  autoRotate?: boolean;
}

// Converter Data URL (Base64) para ArrayBuffer síncrono
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

// Função Matemática Infalível para envelopar, escalar e pousar qualquer objeto 3D sobre a cama
function wrapAndCenterObjectOnBed(
  scene: THREE.Scene,
  rawObject: THREE.Object3D,
  targetSize: number = 3.6,
  bedY: number = -1.78
): THREE.Group {
  const containerGroup = new THREE.Group();

  // 1. Obter caixa delimitadora original do objeto
  const box = new THREE.Box3().setFromObject(rawObject);
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);

  // 2. Centralizar o objeto bruto em (0,0,0) dentro do container
  rawObject.position.set(-center.x, -center.y, -center.z);
  containerGroup.add(rawObject);

  // 3. Aplicar escala proporcional para ser perfeitamente visível na câmera
  const maxDim = Math.max(size.x, size.y, size.z);
  const scaleFactor = maxDim > 0 ? targetSize / maxDim : 1;
  containerGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);

  // 4. Pousar a base do containerGroup exatamente no topo da cama de impressão
  const scaledHeight = size.y * scaleFactor;
  containerGroup.position.set(0, bedY + scaledHeight / 2, 0);

  scene.add(containerGroup);
  return containerGroup;
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
  const [showBed, setShowBed] = useState<boolean>(true);
  const [modelType, setModelType] = useState<'stl' | '3mf' | 'demo'>('demo');
  const [hasOriginal3mfColors, setHasOriginal3mfColors] = useState<boolean>(false);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshRef = useRef<THREE.Object3D | null>(null);
  const bedGroupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 360;

    // 1. Cenário 3D com Estilo Studio Dark MakerWorld (#1b1e24)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1b1e24');
    sceneRef.current = scene;

    // 2. Cama de Impressão 3D Estilo Bambu Lab / MakerWorld (Dark Plate com Grid)
    const bedGroup = new THREE.Group();
    
    // Placa de metal escura da cama (25.6cm x 25.6cm equivalente)
    const bedGeometry = new THREE.BoxGeometry(10, 0.1, 10);
    const bedMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2b2f38'),
      roughness: 0.7,
      metalness: 0.4,
    });
    const bedMesh = new THREE.Mesh(bedGeometry, bedMaterial);
    bedMesh.position.y = -1.85;
    bedGroup.add(bedMesh);

    // Grid discreto estilo MakerWorld
    const gridHelper = new THREE.GridHelper(9.8, 20, 0x00f0ff, 0x4a5568);
    gridHelper.position.y = -1.79;
    bedGroup.add(gridHelper);

    scene.add(bedGroup);
    bedGroupRef.current = bedGroup;

    // 3. Câmera com Ângulo Tridimensional MakerWorld
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 4.5, 9);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 4. Iluminação Studio MakerWorld (3 Pontos de Luz)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(6, 12, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    fillLight.position.set(-6, -2, -6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
    rimLight.position.set(0, 10, -10);
    scene.add(rimLight);

    // 5. Renderer WebGL com Antialias
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // Material Padrão para Peças Sólidas (Efeito Filamento 3D Matte/Silk)
    const displayColor = colorHex === 'gradient' ? '#38BDF8' : colorHex;
    const defaultMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(displayColor),
      metalness: 0.15,
      roughness: 0.35,
      wireframe: isWireframe,
    });
    materialRef.current = defaultMaterial;

    // Renderizar o buffer do arquivo 3D (STL ou 3MF)
    const renderModelBuffer = (buffer: ArrayBuffer, urlSource: string) => {
      try {
        const bytes = new Uint8Array(buffer);
        const is3MF =
          (bytes[0] === 0x50 && bytes[1] === 0x4b) ||
          urlSource.toLowerCase().includes('.3mf');

        if (is3MF) {
          const m3fLoader = new ThreeMFLoader();
          const group = m3fLoader.parse(buffer);

          let hasColorsIn3mf = false;

          // Processar malhas e normais do modelo 3MF
          group.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              if (mesh.geometry) {
                mesh.geometry.computeVertexNormals();
              }

              // Verificar se o arquivo 3MF já veio com materiais/cores nativas (ex: Creeper verde/preto)
              if (mesh.material) {
                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                materials.forEach((mat) => {
                  if (mat && 'color' in mat) {
                    hasColorsIn3mf = true;
                    if ('roughness' in mat) (mat as THREE.MeshStandardMaterial).roughness = 0.4;
                    if ('metalness' in mat) (mat as THREE.MeshStandardMaterial).metalness = 0.1;
                    if ('wireframe' in mat) mat.wireframe = isWireframe;
                  }
                });
              } else {
                mesh.material = defaultMaterial;
              }
            }
          });

          setHasOriginal3mfColors(hasColorsIn3mf);

          // Se o 3MF NÃO veio com cores próprias, aplicar a cor escolhida pelo usuário
          if (!hasColorsIn3mf) {
            group.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                (child as THREE.Mesh).material = defaultMaterial;
              }
            });
          }

          // Envelopar, centralizar e pousar perfeitamente sobre a cama de impressão
          const container = wrapAndCenterObjectOnBed(scene, group, 3.6, -1.78);
          meshRef.current = container;
          setModelType('3mf');
          setLoading(false);
        } else {
          // Arquivo STL padrão (Cor Única Sólida)
          const stlLoader = new STLLoader();
          const geometry = stlLoader.parse(buffer);
          geometry.center();
          geometry.computeVertexNormals();

          const rawMesh = new THREE.Mesh(geometry, defaultMaterial);
          const container = wrapAndCenterObjectOnBed(scene, rawMesh, 3.6, -1.78);

          meshRef.current = container;
          setModelType('stl');
          setLoading(false);
        }
      } catch (err) {
        console.error('Erro ao fazer parse do arquivo 3D:', err);
        createFallbackMesh(scene, defaultMaterial);
      }
    };

    // Carregamento do arquivo
    if (stlUrl && stlUrl.trim().length > 0) {
      setLoading(true);

      if (stlUrl.startsWith('data:')) {
        try {
          const buffer = dataUrlToArrayBuffer(stlUrl);
          renderModelBuffer(buffer, stlUrl);
        } catch (e) {
          console.error('Erro ao converter Data URL base64:', e);
          createFallbackMesh(scene, defaultMaterial);
        }
      } else {
        fetch(stlUrl)
          .then((res) => res.arrayBuffer())
          .then((buffer) => renderModelBuffer(buffer, stlUrl))
          .catch((error) => {
            console.warn('Erro ao carregar URL do arquivo 3D:', error);
            createFallbackMesh(scene, defaultMaterial);
          });
      }
    } else {
      createFallbackMesh(scene, defaultMaterial);
    }

    function createFallbackMesh(sc: THREE.Scene, mat: THREE.MeshStandardMaterial) {
      const geom = new THREE.IcosahedronGeometry(1.8, 1);
      geom.computeVertexNormals();
      const rawMesh = new THREE.Mesh(geom, mat);
      const container = wrapAndCenterObjectOnBed(sc, rawMesh, 3.6, -1.78);
      meshRef.current = container;
      setModelType('demo');
      setLoading(false);
    }

    // Loop de Animação Suave (Rotaciona ao redor do centro da cama)
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
      const h = containerRef.current.clientHeight || 360;
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

  // Atualizar Cor caso não seja um 3MF com cores nativas salvas
  useEffect(() => {
    if (meshRef.current && !hasOriginal3mfColors) {
      const displayColor = colorHex === 'gradient' ? '#38BDF8' : colorHex;
      const newColor = new THREE.Color(displayColor);
      meshRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
          const mat = (child as THREE.Mesh).material;
          if (Array.isArray(mat)) {
            mat.forEach((m) => {
              if ('color' in m) (m as THREE.MeshStandardMaterial).color.set(newColor);
            });
          } else if ('color' in mat) {
            (mat as THREE.MeshStandardMaterial).color.set(newColor);
          }
        }
      });
    }
  }, [colorHex, hasOriginal3mfColors]);

  // Alternar Wireframe / Sólido
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
          const mat = (child as THREE.Mesh).material;
          if (Array.isArray(mat)) {
            mat.forEach((m) => {
              if ('wireframe' in m) m.wireframe = isWireframe;
            });
          } else if ('wireframe' in mat) {
            mat.wireframe = isWireframe;
          }
        }
      });
    }
  }, [isWireframe]);

  // Alternar Visibilidade da Cama de Impressão
  useEffect(() => {
    if (bedGroupRef.current) {
      bedGroupRef.current.visible = showBed;
    }
  }, [showBed]);

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
    }
  };

  return (
    <div className="relative w-full h-[360px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl select-none group">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md z-20 text-cyan-400">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-cyan-400" />
          <span className="text-xs font-bold font-mono tracking-widest text-slate-300">
            PROCESSANDO MODELO 3D ESTILO MAKERWORLD...
          </span>
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

      {/* BADGE DA PARTE SUPERIOR (MAKERWORLD STYLE) */}
      <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-700/80 flex items-center gap-2 pointer-events-none shadow-lg">
        {modelType === 'stl' || modelType === '3mf' ? (
          <>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-[11px] font-bold font-mono text-cyan-300">
              Modelo {modelType.toUpperCase()} Real {hasOriginal3mfColors ? '(Cores Nativas)' : ''} • MakerWorld Studio
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold font-mono text-amber-300">
              Preview 3D Interativo • Arraste para Girar
            </span>
          </>
        )}
      </div>

      {/* BARRA DE FERRAMENTAS E CONTROLES ESTILO MAKERWORLD */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-xl">
        <button
          type="button"
          onClick={() => setShowBed(!showBed)}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
            showBed ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800'
          }`}
          title="Mostrar/Ocultar Cama de Impressão"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="text-[10px]">Cama</span>
        </button>

        <button
          type="button"
          onClick={() => setIsWireframe(!isWireframe)}
          className={`p-2 rounded-xl text-xs font-bold transition-all ${
            isWireframe ? 'bg-pink-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Alternar entre Malha de Arame e Sólido"
        >
          <Eye className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
            isRotating ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800'
          }`}
          title="Alternar Rotação Automática"
        >
          {isRotating ? 'GIRANDO 💫' : 'PAUSADO'}
        </button>

        <button
          type="button"
          onClick={resetView}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          title="Resetar Posição da Câmera"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
