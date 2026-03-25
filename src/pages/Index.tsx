import { PortfolioScene } from '@/components/3d/PortfolioScene';
import { HUD } from '@/components/HUD';

const Index = () => {
  return (
    <div className="relative w-full h-screen bg-void overflow-hidden">
      <PortfolioScene />
      <HUD />
    </div>
  );
};

export default Index;
