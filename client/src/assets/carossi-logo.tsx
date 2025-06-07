import { getAssetPath } from "@/lib/utils";

interface CarossiLogoProps {
  white?: boolean;
}

export const CarossiLogo: React.FC<CarossiLogoProps> = ({ white = false }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto ${white ? 'text-white' : 'text-foreground'}`}
    >
      <image
        href={getAssetPath("/2.jpg")}
        width="200"
        height="80"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
};
