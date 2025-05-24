import React, { useState, useLayoutEffect } from "react";
import { cn } from "@/lib/utils";

interface RippleProps {
  className?: string;
  color?: string;
  duration?: number;
}

interface RippleType {
  x: number;
  y: number;
  size: number;
  id: number;
}

export const RippleEffect: React.FC<
  React.PropsWithChildren<RippleProps>
> = ({
  children,
  className,
  color = "rgba(255, 255, 255, 0.35)",
  duration = 500,
}) => {
  const [ripples, setRipples] = useState<RippleType[]>([]);
  const nextId = React.useRef(0);

  useLayoutEffect(() => {
    if (ripples.length > 0) {
      const timeoutId = setTimeout(() => {
        setRipples([]);
      }, duration * 1.5);
      return () => clearTimeout(timeoutId);
    }
  }, [ripples, duration]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;
    
    const newRipple: RippleType = {
      x,
      y,
      size,
      id: nextId.current,
    };
    
    nextId.current += 1;
    setRipples([...ripples, newRipple]);
  };

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseDown={handleMouseDown}
      style={{ isolation: "isolate" }}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: "absolute",
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            borderRadius: "50%",
            backgroundColor: color,
            opacity: 0,
            transform: "scale(0)",
            animation: `ripple ${duration}ms ease-out`,
          }}
        />
      ))}
      <style>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
      {children}
    </div>
  );
};