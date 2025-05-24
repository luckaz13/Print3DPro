import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

interface EnhancedHoverCardProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  contentClassName?: string;
  openDelay?: number;
  closeDelay?: number;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  arrowClassName?: string;
  showArrow?: boolean;
}

export const EnhancedHoverCard: React.FC<EnhancedHoverCardProps> = ({
  trigger,
  content,
  className,
  contentClassName,
  openDelay = 200,
  closeDelay = 300,
  side = "top",
  align = "center",
  sideOffset = 8,
  alignOffset = 0,
  arrowClassName,
  showArrow = true,
}) => {
  return (
    <HoverCard openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger asChild className={cn("cursor-pointer", className)}>
        <div className="relative group">
          {trigger}
          <span className="absolute -inset-1 rounded-lg bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className={cn(
          "animate-in zoom-in-50 data-[state=closed]:animate-out data-[state=closed]:zoom-out-0 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200",
          contentClassName
        )}
      >
        {content}
      </HoverCardContent>
    </HoverCard>
  );
};

// Componente para mostrar dicas em elementos interativos
interface TooltipCardProps {
  children: React.ReactNode;
  tooltip: string | React.ReactNode;
  className?: string;
  tooltipClassName?: string;
  side?: "top" | "right" | "bottom" | "left";
}

export const TooltipCard: React.FC<TooltipCardProps> = ({
  children,
  tooltip,
  className,
  tooltipClassName,
  side = "top",
}) => {
  return (
    <EnhancedHoverCard
      trigger={children}
      content={
        <div className={cn("p-2 max-w-xs text-sm", tooltipClassName)}>
          {tooltip}
        </div>
      }
      className={className}
      side={side}
      openDelay={100}
      closeDelay={200}
    />
  );
};

// Componente para mostrar informações detalhadas em cartões
interface InfoCardProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  trigger,
  title,
  description,
  icon,
  className,
  contentClassName,
}) => {
  return (
    <EnhancedHoverCard
      trigger={trigger}
      content={
        <div className={cn("p-4 space-y-2 max-w-sm", contentClassName)}>
          <div className="flex items-center gap-2">
            {icon && <div className="text-primary">{icon}</div>}
            <h4 className="font-medium">{title}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      }
      className={className}
      side="right"
      align="start"
    />
  );
};