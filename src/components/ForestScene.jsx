import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Realistic Sun Component - Only visible during day
const Sun = ({ sunlightBoost }) => {
  const sunRef = useRef();
  const coronaRef = useRef();
  
  useFrame((state) => {
    if (sunRef.current) {
      const time = state.clock.getElapsedTime();
      sunRef.current.rotation.y = time * 0.05;
    }
    if (coronaRef.current) {
      const time = state.clock.getElapsedTime();
      coronaRef.current.rotation.z = time * 0.1;
      coronaRef.current.scale.set(
        1 + Math.sin(time * 2) * 0.05,
        1 + Math.sin(time * 2) * 0.05,
        1
      );
    }
  });
  
  return (
    <group ref={sunRef} position={[25, 20, -30]}>
      {/* Sun core - bright yellow */}
      <mesh>
        <sphereGeometry args={[3, 64, 64]} />
        <meshBasicMaterial 
          color="#FFFF00"
        />
      </mesh>
      
      {/* Inner glow - bright yellow */}
      <mesh>
        <sphereGeometry args={[3.3, 64, 64]} />
        <meshBasicMaterial 
          color="#FFFF00"
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Outer glow - yellow */}
      <mesh>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial 
          color="#FFFF00"
          transparent
          opacity={0.25}
        />
      </mesh>
      
      {/* Atmospheric glow */}
      <mesh>
        <sphereGeometry args={[5.5, 32, 32]} />
        <meshBasicMaterial 
          color="#FFFF66"
          transparent
          opacity={0.1}
        />
      </mesh>
      
      {/* Corona effect - rotating subtle rays */}
      <group ref={coronaRef}>
        {[...Array(16)].map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const length = 2 + Math.random() * 1;
          return (
            <mesh 
              key={i}
              position={[Math.cos(angle) * 4.5, Math.sin(angle) * 4.5, 0]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.08, length, 0.08]} />
              <meshBasicMaterial 
                color="#FFFF00"
                transparent
                opacity={0.4}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Lens flare effect */}
      <mesh position={[0, 0, 0.5]}>
        <sphereGeometry args={[3.8, 32, 32]} />
        <meshBasicMaterial 
          color="#FFFACD"
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
};

// Realistic Moon Component - Only visible during night
const Moon = () => {
  const moonRef = useRef();
  const glowRef = useRef();
  
  useFrame((state) => {
    if (moonRef.current) {
      const time = state.clock.getElapsedTime();
      moonRef.current.rotation.y = time * 0.02;
    }
    if (glowRef.current) {
      const time = state.clock.getElapsedTime();
      glowRef.current.scale.set(
        1 + Math.sin(time * 1.5) * 0.03,
        1 + Math.sin(time * 1.5) * 0.03,
        1
      );
    }
  });
  
  return (
    <group position={[-22, 22, -28]}>
      {/* Moon surface - realistic color */}
      <mesh ref={moonRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial 
          color="#D4D4D4"
          roughness={0.9}
          metalness={0.1}
          emissive="#B8B8B8"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Large craters - Mare (dark spots) */}
      <mesh position={[0.8, 0.6, 2.45]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial 
          color="#9A9A9A"
          roughness={0.95}
        />
      </mesh>
      <mesh position={[-0.7, -0.6, 2.45]}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial 
          color="#A5A5A5"
          roughness={0.95}
        />
      </mesh>
      <mesh position={[0.4, -1, 2.45]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial 
          color="#ABABAB"
          roughness={0.95}
        />
      </mesh>
      <mesh position={[-1, 0.3, 2.4]}>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshStandardMaterial 
          color="#B0B0B0"
          roughness={0.95}
        />
      </mesh>
      
      {/* Small craters */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 1.5 + Math.random() * 0.8;
        const size = 0.1 + Math.random() * 0.15;
        return (
          <mesh 
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius,
              2.4
            ]}
          >
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial 
              color="#BEBEBE"
              roughness={0.95}
            />
          </mesh>
        );
      })}
      
      {/* Soft glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshBasicMaterial 
          color="#E8E8E8"
          transparent
          opacity={0.15}
        />
      </mesh>
      
      {/* Outer atmospheric glow */}
      <mesh>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial 
          color="#C8D5E8"
          transparent
          opacity={0.08}
        />
      </mesh>
      
      {/* Stars in the night sky */}
      {[...Array(30)].map((_, i) => {
        const angle1 = Math.random() * Math.PI * 2;
        const angle2 = Math.random() * Math.PI;
        const distance = 15 + Math.random() * 10;
        const size = 0.05 + Math.random() * 0.1;
        const brightness = 0.5 + Math.random() * 0.5;
        
        return (
          <mesh 
            key={`star-${i}`}
            position={[
              Math.cos(angle1) * Math.sin(angle2) * distance,
              Math.cos(angle2) * distance,
              Math.sin(angle1) * Math.sin(angle2) * distance - 10
            ]}
          >
            <sphereGeometry args={[size, 8, 8]} />
            <meshBasicMaterial 
              color="#FFFFFF"
              transparent
              opacity={brightness}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Clouds Component
const Cloud = ({ position, scale = 1 }) => {
  const cloudRef = useRef();
  
  useFrame((state) => {
    if (cloudRef.current) {
      const time = state.clock.getElapsedTime();
      cloudRef.current.position.x = position[0] + Math.sin(time * 0.1) * 2;
    }
  });
  
  return (
    <group ref={cloudRef} position={position}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8 * scale, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0.7 * scale, 0, 0]}>
        <sphereGeometry args={[0.6 * scale, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
      </mesh>
      <mesh position={[-0.6 * scale, 0, 0]}>
        <sphereGeometry args={[0.7 * scale, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
      </mesh>
    </group>
  );
};

const Clouds = ({ timeOfDay }) => {
  const cloudData = useMemo(() => [
    { position: [-15, 12, -15], scale: 1.2 },
    { position: [10, 14, -18], scale: 1 },
    { position: [5, 13, -20], scale: 1.3 },
    { position: [-8, 15, -22], scale: 0.9 },
  ], []);
  
  // More clouds during day
  if (timeOfDay === 'day') {
    return (
      <group>
        {cloudData.map((cloud, i) => (
          <Cloud key={i} position={cloud.position} scale={cloud.scale} />
        ))}
      </group>
    );
  }
  
  return null;
};

// Birds Component
const Bird = ({ position, delay = 0 }) => {
  const birdRef = useRef();
  
  useFrame((state) => {
    if (birdRef.current) {
      const time = state.clock.getElapsedTime() + delay;
      const radius = 12;
      birdRef.current.position.x = Math.cos(time * 0.3) * radius;
      birdRef.current.position.z = Math.sin(time * 0.3) * radius;
      birdRef.current.position.y = 8 + Math.sin(time * 0.5) * 2;
      birdRef.current.rotation.y = time * 0.3 + Math.PI / 2;
    }
  });
  
  return (
    <group ref={birdRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#2A2A2A" />
      </mesh>
      <mesh position={[-0.08, 0, 0.12]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.25, 0.02, 0.12]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
      <mesh position={[-0.08, 0, -0.12]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.25, 0.02, 0.12]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
    </group>
  );
};

const Birds = ({ timeOfDay }) => {
  // Birds only fly during day
  if (timeOfDay !== 'day') return null;
  
  return (
    <group>
      <Bird position={[0, 8, 0]} delay={0} />
      <Bird position={[5, 9, 5]} delay={2} />
      <Bird position={[-5, 8, -5]} delay={4} />
    </group>
  );
};

// Simple fallback tree if model doesn't load
const FallbackTree = ({ position, health, scale, hasFlowers, hasNewLeaves }) => {
  const treeRef = useRef();
  
  useFrame((state) => {
    if (treeRef.current) {
      const time = state.clock.getElapsedTime();
      treeRef.current.rotation.z = Math.sin(time * 0.8 + position[0]) * 0.03;
    }
  });
  
  const trunkColor = health > 0.6 ? '#654321' : health > 0.3 ? '#4a3520' : '#3a2510';
  const leavesColor = health > 0.8 ? '#2d5016' : health > 0.6 ? '#3d6b1f' : 
                      health > 0.4 ? '#527a2b' : health > 0.2 ? '#6b7c4a' : '#7a7767';
  
  return (
    <group ref={treeRef} position={position}>
      <mesh position={[0, 1.5 * scale, 0]} castShadow>
        <cylinderGeometry args={[0.15 * scale, 0.25 * scale, 3 * scale, 12]} />
        <meshStandardMaterial color={trunkColor} roughness={0.95} />
      </mesh>
      <mesh position={[0, 3.5 * scale, 0]} castShadow>
        <sphereGeometry args={[1.5 * scale, 16, 16]} />
        <meshStandardMaterial color={leavesColor} roughness={0.9} />
      </mesh>
      {hasFlowers && (
        <mesh position={[0.8 * scale, 3.5 * scale, 0]} castShadow>
          <sphereGeometry args={[0.15 * scale, 8, 8]} />
          <meshStandardMaterial color="#FF69B4" emissive="#FF1493" emissiveIntensity={0.5} />
        </mesh>
      )}
      {hasNewLeaves && (
        <mesh position={[-0.8 * scale, 3.8 * scale, 0]} castShadow>
          <sphereGeometry args={[0.2 * scale, 8, 8]} />
          <meshStandardMaterial color="#90EE90" emissive="#7CFC00" emissiveIntensity={0.4} />
        </mesh>
      )}
    </group>
  );
};

const Tree = ({ position, health, scale = 1, hasFlowers = false, hasNewLeaves = false }) => {
  const treeRef = useRef();
  const groupRef = useRef();
  
  // Try to load tree model - you'll need to add actual tree models to public/models/
  // For now, we'll use a fallback
  // Uncomment when you have tree models:
  // const { scene } = useGLTF('/models/tree.glb', true);
  
  const useModelTree = false; // Set to true when you have models
  
  // Animate tree swaying with wind
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      const windStrength = 0.02;
      groupRef.current.rotation.z = Math.sin(time * 0.8 + position[0]) * windStrength;
      groupRef.current.rotation.x = Math.sin(time * 0.5 + position[2]) * windStrength * 0.5;
    }
  });
  
  // Realistic tree colors based on health
  const trunkColor = health > 0.7 ? '#654321' : // Saddle brown - healthy
                     health > 0.5 ? '#5d4e37' : // Dark brown
                     health > 0.3 ? '#4a3520' : // Darker brown
                     '#3a2510'; // Very dark - dying
                     
  const barkHighlight = health > 0.5 ? '#8B7355' : '#6B5345';
  
  const leavesColor = health > 0.8 ? '#2d5016' : // Dark forest green - healthy
                      health > 0.6 ? '#3d6b1f' : // Forest green - good
                      health > 0.4 ? '#527a2b' : // Yellow green - tired
                      health > 0.2 ? '#6b7c4a' : // Olive - weak
                      '#7a7767'; // Gray green - dying
                      
  const leafHighlight = health > 0.6 ? '#4a7c2f' : '#5a6c3f';
  
  const treeScale = scale * (0.75 + health * 0.25);
  
  // If you want to use model trees, set useModelTree to true and uncomment the model loading
  if (useModelTree) {
    // When you have tree models, the code will use them here
    // const clonedScene = useMemo(() => scene.clone(), [scene]);
    
    return (
      <group ref={groupRef} position={position} scale={[treeScale, treeScale, treeScale]}>
        {/* <primitive object={clonedScene} castShadow receiveShadow /> */}
        
        {/* Add effects on top of model */}
        {hasFlowers && (
          <group position={[0, 3, 0]}>
            {[...Array(6)].map((_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(angle) * 1.2, Math.random() * 0.5, Math.sin(angle) * 1.2]}>
                  <sphereGeometry args={[0.12, 8, 8]} />
                  <meshStandardMaterial color="#FF69B4" emissive="#FF1493" emissiveIntensity={0.6} />
                </mesh>
              );
            })}
          </group>
        )}
        
        {hasNewLeaves && (
          <group position={[0, 3, 0]}>
            {[...Array(4)].map((_, i) => {
              const angle = (i / 4) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(angle) * 1.1, Math.random() * 0.6, Math.sin(angle) * 1.1]}>
                  <sphereGeometry args={[0.18, 8, 8]} />
                  <meshStandardMaterial color="#90EE90" emissive="#7CFC00" emissiveIntensity={0.5} />
                </mesh>
              );
            })}
          </group>
        )}
      </group>
    );
  }
  
  // Use fallback tree (current simplified version)
  return <FallbackTree position={position} health={health} scale={treeScale} hasFlowers={hasFlowers} hasNewLeaves={hasNewLeaves} />;
};const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial 
        color="#1a4d2e" 
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
};

const Grass = ({ count = 200, health }) => {
  const grassRef = useRef();
  
  const grassPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      positions.push([
        (Math.random() - 0.5) * 40,
        0.1,
        (Math.random() - 0.5) * 40
      ]);
    }
    return positions;
  }, [count]);
  
  useFrame((state) => {
    if (grassRef.current) {
      const time = state.clock.getElapsedTime();
      grassRef.current.children.forEach((grass, i) => {
        grass.rotation.z = Math.sin(time + i * 0.5) * 0.1;
      });
    }
  });
  
  const grassColor = health > 0.6 ? '#4CAF50' : '#6B8E23';
  
  return (
    <group ref={grassRef}>
      {grassPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <coneGeometry args={[0.05, 0.3, 3]} />
          <meshStandardMaterial color={grassColor} />
        </mesh>
      ))}
    </group>
  );
};

const Particles = ({ count = 50 }) => {
  const particlesRef = useRef();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 30,
          Math.random() * 10,
          (Math.random() - 0.5) * 30
        ],
        speed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2
      });
    }
    return temp;
  }, [count]);
  
  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      particlesRef.current.children.forEach((particle, i) => {
        particle.position.y += Math.sin(time + particles[i].phase) * 0.01;
        particle.position.x += Math.sin(time * 0.5) * 0.005;
        
        // Reset particle if it goes too high
        if (particle.position.y > 10) {
          particle.position.y = 0;
        }
      });
    }
  });
  
  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial 
            color="#FFE156" 
            transparent 
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};

const ForestScene = ({ health = 0.5, timeOfDay = 'day', ecoActions = {}, screenTime = 0 }) => {
  const fogRef = useRef();
  
  // Eco actions: { lightsOff: bool, exercise: bool, ecoTravel: bool, longWork: bool }
  const hasFlowers = ecoActions.ecoTravel || false;
  const hasNewLeaves = ecoActions.lightsOff || false;
  const showDigitalFog = screenTime > 4; // More than 4 hours screen time
  const tiredTrees = ecoActions.longWork || false;
  const sunlightBoost = ecoActions.exercise || false;
  
  // Generate tree positions
  const trees = useMemo(() => {
    const positions = [];
    const radius = 15;
    const count = 30;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const distance = radius + (Math.random() - 0.5) * 10;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const scale = 0.8 + Math.random() * 0.4;
      const showFlowers = hasFlowers && Math.random() > 0.6; // 40% of trees get flowers
      const showNewLeaves = hasNewLeaves && Math.random() > 0.5; // 50% chance
      
      positions.push({ position: [x, 0, z], scale, showFlowers, showNewLeaves });
    }
    
    return positions;
  }, [hasFlowers, hasNewLeaves]);
  
  // Lighting based on time of day and user habits
  const getLighting = () => {
    let baseIntensity = 1;
    let fogDensityBase = 0.02;
    
    // Increase sunlight for meditation/exercise
    if (sunlightBoost) {
      baseIntensity = 1.3;
    }
    
    // Digital fog from high screen time
    if (showDigitalFog) {
      fogDensityBase = 0.12;
    }
    
    // Tired trees from long work
    if (tiredTrees) {
      fogDensityBase += 0.05;
    }
    
    switch (timeOfDay) {
      case 'night':
        return {
          ambient: '#1a2744',
          directional: '#4a5f8f',
          intensity: 0.3 * baseIntensity,
          fogColor: showDigitalFog ? '#2a3a4a' : '#0B132B',
          fogDensity: 0.1 + (showDigitalFog ? 0.05 : 0)
        };
      case 'evening':
        return {
          ambient: '#ff9a56',
          directional: '#ffa856',
          intensity: 0.6 * baseIntensity,
          fogColor: showDigitalFog ? '#9a7a66' : '#ff9a56',
          fogDensity: 0.05 + fogDensityBase
        };
      default: // day
        return {
          ambient: sunlightBoost ? '#fffacd' : '#ffffff',
          directional: sunlightBoost ? '#FFD700' : '#FFE156',
          intensity: baseIntensity,
          fogColor: showDigitalFog ? '#8a9ba8' : 
                   tiredTrees ? '#b0b8b0' :
                   health < 0.4 ? '#c0c8c0' : '#A7E8BD',
          fogDensity: fogDensityBase + (health < 0.4 ? 0.06 : 0)
        };
    }
  };
  
  const lighting = getLighting();
  
  useFrame((state) => {
    // Animate fog
    if (fogRef.current) {
      fogRef.current.density = lighting.fogDensity + 
        Math.sin(state.clock.getElapsedTime() * 0.5) * 0.01;
    }
  });
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={lighting.intensity * 0.5} color={lighting.ambient} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={lighting.intensity}
        color={lighting.directional}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#FFE156" />
      
      {/* Fog */}
      <fog ref={fogRef} attach="fog" args={[lighting.fogColor, 10, 50]} />
      
      {/* Sky Elements - Day Mode */}
      {timeOfDay === 'day' && (
        <>
          <Sun sunlightBoost={sunlightBoost} />
          <Clouds timeOfDay={timeOfDay} />
          <Birds timeOfDay={timeOfDay} />
        </>
      )}
      
      {/* Sky Elements - Night Mode */}
      {timeOfDay === 'night' && <Moon />}
      
      {/* Scene Elements */}
      <Ground />
      <Grass count={200} health={health} />
      
      {/* Trees */}
      {trees.map((tree, i) => (
        <Tree 
          key={i} 
          position={tree.position} 
          health={tiredTrees ? Math.max(health - 0.2, 0.2) : health}
          scale={tree.scale}
          hasFlowers={tree.showFlowers}
          hasNewLeaves={tree.showNewLeaves}
        />
      ))}
      
      {/* Floating Particles (fireflies/sparkles) - More when healthy/exercise */}
      {health > 0.5 && <Particles count={sunlightBoost ? 50 : 30} />}
    </>
  );
};

export default ForestScene;
