import { FC, ReactNode } from 'react';

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
}

const GlassContainer: FC<GlassContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`
        bg-white/15 
        rounded-2xl 
        shadow-[0_4px_30px_rgba(0,0,0,0.1)]
        backdrop-blur-[4px]
        border
        border-white/30
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassContainer;
