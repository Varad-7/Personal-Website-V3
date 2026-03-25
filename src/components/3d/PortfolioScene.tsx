import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, Float, Text } from '@react-three/drei';
import { useRef, useMemo, Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

/* ─── SCROLL LISTENER ─── */
const ScrollListener = () => {
  const scroll = useScroll();
  
  useEffect(() => {
    const handleScrollTo = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const targetOffset = detail / (scroll.pages - 1);
      const scrollPx = targetOffset * (scroll.el.scrollHeight - scroll.el.clientHeight);
      scroll.el.scrollTo({ top: scrollPx, behavior: 'smooth' });
    };
    window.addEventListener('scrollToSection', handleScrollTo);
    return () => window.removeEventListener('scrollToSection', handleScrollTo);
  }, [scroll]);
  
  useFrame(() => {
    if (!scroll) return;
    const currentSection = Math.round(scroll.offset * (scroll.pages - 1));
    window.dispatchEvent(new CustomEvent('syncActiveSection', { detail: currentSection }));
  });
  
  return null;
};

/* ─── PARTICLES ─── */
const ParticleField = ({ count = 300 }) => {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 30;
      p[i * 3 + 1] = (Math.random() - 0.5) * 80;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return p;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const a = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      a[i * 3 + 1] -= 0.008;
      if (a[i * 3 + 1] < -40) a[i * 3 + 1] = 40;
      a[i * 3] += Math.sin(clock.elapsedTime * 0.5 + i) * 0.003;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.12} color="#6d8cff" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
};

/* ─── DOUBLE HELIX ─── */
const DoubleHelix = () => {
  const ref = useRef<THREE.Group>(null);
  const { curve1, curve2 } = useMemo(() => {
    const s1: THREE.Vector3[] = [];
    const s2: THREE.Vector3[] = [];
    for (let i = 0; i < 200; i++) {
      const t = i / 200;
      const angle = t * Math.PI * 2 * 6;
      const y = 45 - t * 90;
      s1.push(new THREE.Vector3(Math.cos(angle) * 3, y, Math.sin(angle) * 3 - 8));
      s2.push(new THREE.Vector3(Math.cos(angle + Math.PI) * 3, y, Math.sin(angle + Math.PI) * 3 - 8));
    }
    return { curve1: new THREE.CatmullRomCurve3(s1), curve2: new THREE.CatmullRomCurve3(s2) };
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.015;
  });

  return (
    <group ref={ref}>
      <mesh>
        <tubeGeometry args={[curve1, 200, 0.12, 8, false]} />
        <meshBasicMaterial color="#4d7cff" transparent opacity={0.7} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curve2, 200, 0.12, 8, false]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

/* ─── HERO OBJECT ─── */
const HeroObject = ({ y }: { y: number }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.4;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.15;
    ref.current.position.y = y + Math.sin(clock.elapsedTime * 0.6) * 0.4;
  });
  return (
    <group ref={ref} position={[0, y, 0]}>
      <mesh>
        <torusGeometry args={[1.8, 0.2, 16, 32]} />
        <meshBasicMaterial color="#4d7cff" />
      </mesh>
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 2.1, Math.sin(a) * 2.1, 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.2, 0.4, 0.25]} />
            <meshBasicMaterial color="#4d7cff" />
          </mesh>
        );
      })}
      <mesh>
        <icosahedronGeometry args={[1.1, 2]} />
        <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.8} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

/* ─── EDUCATION ─── */
const EducationSection = ({ y }: { y: number }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.2;
  });
  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 3, 32]} />
        <meshBasicMaterial color="#4d7cff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <group ref={ref}>
        <mesh position={[0, 2, 0]}>
          <octahedronGeometry args={[1.8, 0]} />
          <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.9} />
        </mesh>
        <mesh position={[0, 2, 0]}>
          <octahedronGeometry args={[1.2, 0]} />
          <meshBasicMaterial color="#4d7cff" transparent opacity={0.5} />
        </mesh>
      </group>
      <Text position={[0, 6.5, 0]} fontSize={0.6} color="#e2e8f0" anchorX="center">
        IIT Bombay
      </Text>
      <Text position={[0, 5.7, 0]} fontSize={0.3} color="#c084fc" anchorX="center">
        Mechanical Engineering + AI/ML Minor
      </Text>
      <Text position={[0, 5.2, 0]} fontSize={0.2} color="#22d3ee" anchorX="center">
        2022 - Present
      </Text>
      <Text position={[0, 4.6, 0]} fontSize={0.2} color="#e2e8f0" anchorX="center" maxWidth={10} textAlign="center" lineHeight={1.5}>
        Built interdisciplinary projects combining engineering fundamentals with machine learning, data-driven modeling, and practical software workflows.
      </Text>
    </group>
  );
};

/* ─── EXPERIENCE ─── */
const ExperienceTimeline = ({ y }: { y: number }) => {
  const isMobile = useIsMobile();
  const sideOffset = isMobile ? 0 : 5;
  const cardWidth = isMobile ? 5.5 : 7;
  const exps = [
    { title: 'TDI Intern', co: 'Deutsche Bank', desc: 'Pre-Placement Offer. Built IncidentHub using embeddings and vector search.', dy: 4, color: '#4d7cff', side: sideOffset },
    { title: 'Teaching Assistant', co: 'IIT Bombay', desc: 'Applied Data Science and ML. Mentoring students through lab sessions.', dy: 0, color: '#22d3ee', side: -sideOffset },
    { title: 'AI/ML Intern', co: 'Samespace Labs', desc: 'Built and fine-tuned a TTS model for Tagalish. Implemented scalable GRPC architecture.', dy: -4, color: '#a855f7', side: sideOffset },
  ];
  return (
    <group position={[0, y, 0]}>
      <mesh>
        <cylinderGeometry args={[0.06, 0.06, 14, 8]} />
        <meshBasicMaterial color="#4d7cff" transparent opacity={0.6} />
      </mesh>
      {exps.map((e, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.03} floatIntensity={0.15}>
          <group position={[e.side, e.dy, 0]}>
            <mesh>
              <boxGeometry args={[cardWidth, 3, 0.06]} />
              <meshBasicMaterial color={e.color} transparent opacity={0.1} />
            </mesh>
            <mesh>
              <boxGeometry args={[cardWidth + 0.06, 3.06, 0.03]} />
              <meshBasicMaterial color={e.color} transparent opacity={0.35} wireframe />
            </mesh>
            <Text position={[0, 0.8, 0.08]} fontSize={isMobile ? 0.3 : 0.35} color="#e2e8f0" anchorX="center">
              {e.title}
            </Text>
            <Text position={[0, 0.3, 0.08]} fontSize={isMobile ? 0.22 : 0.25} color={e.color} anchorX="center">
              {e.co}
            </Text>
            <Text position={[0, -0.4, 0.08]} fontSize={isMobile ? 0.16 : 0.18} color="#94a3b8" anchorX="center" maxWidth={cardWidth - 0.8} textAlign="center" lineHeight={1.5}>
              {e.desc}
            </Text>
          </group>
        </Float>
      ))}
    </group>
  );
};

/* ─── ORBITING HOBBIES ─── */
const OrbitingHobbies = ({ y }: { y: number }) => {
  const items = [
    { label: 'Sketching', color: '#fbbf24', r: 6, speed: 0.3, offset: 0 },
    { label: 'Gaming', color: '#4d7cff', r: 7, speed: 0.25, offset: 1.2 },
    { label: 'Music', color: '#a855f7', r: 5.5, speed: 0.35, offset: 2.5 },
    { label: 'Photography', color: '#6b7280', r: 6.5, speed: 0.2, offset: 3.8 },
    { label: 'Food', color: '#f97316', r: 5, speed: 0.28, offset: 5.0 },
  ];
  return (
    <group position={[0, y, 0]}>
      <Text position={[0, 4, 0]} fontSize={0.5} color="#e2e8f0" anchorX="center">
        My Hobbies
      </Text>
      {items.map((item, i) => (
        <OrbitItem key={i} {...item} />
      ))}
    </group>
  );
};

const OrbitItem = ({ label, color, r, speed, offset }: { label: string; color: string; r: number; speed: number; offset: number }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + offset;
    ref.current.position.set(Math.cos(t) * r, Math.sin(t * 0.5) * 1.5, Math.sin(t) * r);
    ref.current.rotation.y = t;
  });
  return (
    <group ref={ref}>
      <mesh>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial color={color} wireframe />
      </mesh>
      <Text position={[0, -0.8, 0]} fontSize={0.3} color={color} anchorX="center">
        {label}
      </Text>
    </group>
  );
};

/* ─── TERMINAL ─── */
const TerminalSection = ({ y }: { y: number }) => {
  const ref = useRef<THREE.Group>(null);
  const isMobile = useIsMobile();
  const w = isMobile ? 7 : 10;
  const h = isMobile ? 4.5 : 5.5;
  const lx = isMobile ? -2.8 : -4;
  const fs = isMobile ? 0.18 : 0.22;
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = y + Math.sin(clock.elapsedTime * 0.3) * 0.3;
  });
  return (
    <group ref={ref} position={[0, y, 0]}>
      <mesh>
        <boxGeometry args={[w, h, 0.2]} />
        <meshBasicMaterial color="#0f1729" />
      </mesh>
      <mesh position={[0, 0, -0.08]}>
        <boxGeometry args={[w + 0.2, h + 0.2, 0.06]} />
        <meshBasicMaterial color="#4d7cff" transparent opacity={0.25} />
      </mesh>
      <Text position={[lx, 1.5, 0.15]} fontSize={fs} color="#4d7cff" anchorX="left" maxWidth={w - 1}>
        {'$ echo "Let\'s build something meaningful"'}
      </Text>
      <Text position={[lx, 0.8, 0.15]} fontSize={isMobile ? 0.25 : 0.3} color="#c084fc" anchorX="left" maxWidth={w - 1}>
        {"Let's build something meaningful"}
      </Text>
      <Text position={[lx, 0, 0.15]} fontSize={fs} color="#4d7cff" anchorX="left">
        {'$ contact --email'}
      </Text>
      <Text position={[lx, -0.6, 0.15]} fontSize={isMobile ? 0.22 : 0.26} color="#22d3ee" anchorX="left">
        varadpatil5424@gmail.com
      </Text>
      <Text position={[lx, -1.6, 0.15]} fontSize={isMobile ? 0.15 : 0.18} color="#6b7280" anchorX="left" maxWidth={w - 1}>
        © 2026 Varad Vikas Patil. All rights reserved.
      </Text>
    </group>
  );
};

/* ─── CAMERA RIG ─── */
const CameraRig = () => {
  const scroll = useScroll();
  const { viewport } = useThree();

  useFrame((state) => {
    const aspect = viewport.aspect;
    // Portrait phone: push camera back; landscape phone: bring closer; desktop: normal
    let zDist: number;
    if (aspect < 0.7) {
      // Portrait phone
      zDist = 18;
    } else if (aspect < 1.2) {
      // Landscape phone / small tablet
      zDist = 14;
    } else {
      // Desktop / wide
      zDist = 14;
    }

    const t = scroll.offset;
    const y = 38 - t * 72;
    const xSway = aspect < 0.7 ? Math.sin(t * Math.PI * 2) * 1.5 : Math.sin(t * Math.PI * 2) * 3;
    state.camera.position.set(
      xSway,
      y + 3,
      zDist
    );
    state.camera.lookAt(0, y - 2, 0);
  });
  return null;
};

/* ─── SCENE ─── */
const Scene = () => (
  <>
    <ScrollListener />
    <CameraRig />
    <ambientLight intensity={0.5} />
    
    <DoubleHelix />
    <ParticleField />
    
    <HeroObject y={36} />
    <Text position={[0, 33, 2]} fontSize={0.8} color="#e2e8f0" anchorX="center" maxWidth={14} textAlign="center">
      Varad Vikas Patil
    </Text>
    <Text position={[0, 31.7, 2]} fontSize={0.4} color="#c084fc" anchorX="center" maxWidth={16} textAlign="center">
      AI/ML Engineer and Builder
    </Text>
    <Text position={[0, 30.6, 2]} fontSize={0.25} color="#e2e8f0" anchorX="center" maxWidth={10} textAlign="center" lineHeight={1.5}>
      Building practical AI for real problems.{"\n"}
      I build reliable ML systems, production tools, and thoughtful experiences.{"\n"}
      This space captures my work, experiments, and what I am currently exploring.
    </Text>
    
    <EducationSection y={20} />
    <ExperienceTimeline y={6} />
    <OrbitingHobbies y={-10} />
    <TerminalSection y={-28} />
  </>
);

export const PortfolioScene = () => (
  <div className="fixed inset-0" style={{ background: '#080c16' }}>
    <Canvas
      camera={{ position: [0, 41, 14], fov: 50, near: 0.1, far: 200 }}
      gl={{ antialias: true }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={['#080c16']} />
      <Suspense fallback={null}>
        <ScrollControls pages={5} damping={0.2}>
          <Scene />
        </ScrollControls>
      </Suspense>
    </Canvas>
  </div>
);
