import { useState } from "react";
import { cn } from "@/lib/utils";
import { Loading } from "./loading";

interface ImageWithLoadingProps {
  src: string;
  alt: string;
  className?: string;
  loadingClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const ImageWithLoading = ({ 
  src, 
  alt, 
  className, 
  loadingClassName,
  onLoad,
  onError 
}: ImageWithLoadingProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground",
        className
      )}>
        <div className="text-center">
          <div className="text-2xl mb-2">📷</div>
          <p className="text-sm">Erro ao carregar imagem</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-muted",
          loadingClassName
        )}>
          <Loading size="md" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          className,
          isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300"
        )}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};