import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Environment, ContactShadows, Center } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  animation: 'idle' | 'talking' | 'roasting' | 'laughing';
}

function Model({ animation }: { animation: Props['animation'] }) {
  const group = useRef<THREE.Group>(null);
  const headBone = useRef<THREE.Bone | null>(null);
  const headInitialRot = useRef<THREE.Euler | null>(null);
  const { scene, animations } = useGLTF('/indian_man_in_kurta.glb');
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Bone && child.name === 'Head_08') {
        headBone.current = child as THREE.Bone;
        headInitialRot.current = child.rotation.clone();
      }
    });
  }, [scene]);

  useFrame((state) => {
    const bone = headBone.current;
    if (!bone || !headInitialRot.current) return;

    if (animation === 'talking') {
      const nod = Math.sin(state.clock.elapsedTime * 12) * 0.03;
      const shake = Math.sin(state.clock.elapsedTime * 8.5) * 0.02;
      bone.rotation.x = headInitialRot.current.x + nod;
      bone.rotation.y = headInitialRot.current.y + shake;
      bone.rotation.z = headInitialRot.current.z + Math.sin(state.clock.elapsedTime * 10) * 0.01;
    } else {
      bone.rotation.copy(headInitialRot.current);
    }
  });

  useEffect(() => {
    const action = actions['mixamo.com'];
    if (!action) return;

    action.reset().fadeIn(0.3);

    switch (animation) {
      case 'idle':
        action.setLoop(THREE.LoopRepeat, Infinity).play();
        action.timeScale = 1.0;
        break;
      case 'talking':
        action.setLoop(THREE.LoopRepeat, Infinity).play();
        action.timeScale = 1.6;
        break;
      case 'roasting': {
        action.setLoop(THREE.LoopOnce, 1).play();
        action.timeScale = 0.35;
        action.clampWhenFinished = true;
        const onRoastEnd = () => {
          mixer.removeEventListener('finished', onRoastEnd);
          const idle = actions['mixamo.com'];
          if (idle) {
            idle.reset().setLoop(THREE.LoopRepeat, Infinity).play();
            idle.timeScale = 1.0;
          }
        };
        mixer.addEventListener('finished', onRoastEnd);
        break;
      }
      case 'laughing':
        action.setLoop(THREE.LoopRepeat, Infinity).play();
        action.timeScale = 0.7;
        break;
    }

    return () => {
      action.fadeOut(0.2);
    };
  }, [animation, actions, mixer]);

  return (
    <group ref={group}>
      <primitive object={scene} scale={2.0} />
    </group>
  );
}

export default function CharacterCoach({ animation }: Props) {
  return (
    <div className="w-full h-[300px] md:h-[360px]">
      <Canvas
        camera={{ position: [0, 1.0, 3.0], fov: 30 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.4} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#ff8800" />
        <spotLight position={[0, 4, 3]} angle={0.25} penumbra={1} intensity={1} />

        <Environment preset="studio" />

        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.3}
          scale={3}
          blur={3}
          far={1.5}
        />

        <Center position={[0, 0.6, 0]}>
          <Model animation={animation} />
        </Center>
      </Canvas>
    </div>
  );
}
