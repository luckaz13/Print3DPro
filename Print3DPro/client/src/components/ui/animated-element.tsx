import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type AnimationType = 
  | "fade-in" 
  | "slide-up" 
  | "slide-down" 
  | "slide-left" 
  | "slide-right" 
  | "scale" 
  | "bounce" 
  | "pulse";

interface AnimatedElementProps {
  children: React.ReactNode;
  animation: AnimationType;
  duration?: number;
  delay?: number;
  className?: string;
  triggerOnce?: boolean;
  threshold?: number;
  animateOnMount?: boolean;
}

export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  animation,
  duration = 500,
  delay = 0,
  className,
  triggerOnce = true,
  threshold = 0.1,
  animateOnMount = true,
}) => {
  const [isVisible, setIsVisible] = useState(animateOnMount);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!triggerOnce || !hasAnimated) {
            setIsVisible(true);
            setHasAnimated(true);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px",
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [triggerOnce, hasAnimated, threshold]);

  const getAnimationClass = () => {
    switch (animation) {
      case "fade-in":
        return isVisible ? "opacity-100" : "opacity-0";
      case "slide-up":
        return isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0";
      case "slide-down":
        return isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0";
      case "slide-left":
        return isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0";
      case "slide-right":
        return isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0";
      case "scale":
        return isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0";
      case "bounce":
        return isVisible ? "animate-bounce" : "opacity-0";
      case "pulse":
        return isVisible ? "animate-pulse" : "opacity-0";
      default:
        return isVisible ? "opacity-100" : "opacity-0";
    }
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        "transition-all",
        getAnimationClass(),
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// Componente para animar itens em uma lista com efeito cascata
interface AnimatedListProps {
  children: React.ReactNode[];
  animation?: AnimationType;
  staggerDelay?: number;
  initialDelay?: number;
  duration?: number;
  className?: string;
  itemClassName?: string;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  animation = "fade-in",
  staggerDelay = 100,
  initialDelay = 0,
  duration = 500,
  className,
  itemClassName,
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <AnimatedElement
          key={index}
          animation={animation}
          delay={initialDelay + index * staggerDelay}
          duration={duration}
          className={itemClassName}
        >
          {child}
        </AnimatedElement>
      ))}
    </div>
  );
};

// Hook para animar elementos quando entram na viewport
export const useAnimateOnScroll = (
  options: {
    animation?: AnimationType;
    duration?: number;
    delay?: number;
    threshold?: number;
    triggerOnce?: boolean;
  } = {}
) => {
  const {
    animation = "fade-in",
    duration = 500,
    delay = 0,
    threshold = 0.1,
    triggerOnce = true,
  } = options;

  return {
    ref: useRef<HTMLDivElement>(null),
    className: cn(
      "transition-all opacity-0",
      animation === "slide-up" && "translate-y-8",
      animation === "slide-down" && "-translate-y-8",
      animation === "slide-left" && "translate-x-8",
      animation === "slide-right" && "-translate-x-8",
      animation === "scale" && "scale-95"
    ),
    style: {
      transitionDuration: `${duration}ms`,
      transitionDelay: `${delay}ms`,
    },
    props: {
      "data-animate": animation,
      "data-threshold": threshold,
      "data-trigger-once": triggerOnce ? "true" : "false",
    },
  };
};