import { useEffect, useState } from 'react';

interface Leaf {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  rotation: number;
}

export default function FallingLeaves() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const newLeaves: Leaf[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 10 + Math.random() * 10,
      animationDelay: Math.random() * 5,
      size: 20 + Math.random() * 20,
      rotation: Math.random() * 360
    }));
    setLeaves(newLeaves);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute animate-fall"
          style={{
            left: `${leaf.left}%`,
            top: '-50px',
            animationDuration: `${leaf.animationDuration}s`,
            animationDelay: `${leaf.animationDelay}s`,
            fontSize: `${leaf.size}px`,
            transform: `rotate(${leaf.rotation}deg)`
          }}
        >
          🍂
        </div>
      ))}
    </div>
  );
}
