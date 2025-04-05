
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mathematician } from "@/types/mathematician";

interface ContributionsGridProps {
  mathematicians: Mathematician[];
  onSelectMathematician: (mathematician: Mathematician) => void;
}

const ContributionsGrid: React.FC<ContributionsGridProps> = ({ 
  mathematicians,
  onSelectMathematician
}) => {
  // Find mathematicians by ID
  const findById = (id: string) => mathematicians.find(m => m.id === id);

  return (
    <Card className="p-6 bg-black/50 backdrop-blur-sm border-white/10">
      <h2 className="text-2xl font-bold mb-4 text-primary">Revolutionary Contributions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-white/10 bg-gradient-to-br from-gray-900 to-black p-4">
          <h3 className="text-lg font-bold mb-2 text-white">Calculus</h3>
          <p className="text-sm text-gray-300 mb-3">
            The development of calculus revolutionized mathematics and made modern physics possible.
          </p>
          <div className="flex items-center gap-2 mb-3">
            <img 
              src={findById("newton")?.image} 
              alt="Newton" 
              className="w-8 h-8 rounded-full"
              loading="lazy"
            />
            <div>
              <p className="text-sm font-medium">Isaac Newton</p>
              <p className="text-xs text-gray-400">Developed fluxions (his version of calculus)</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-white/10 hover:bg-primary/20"
            onClick={() => {
              const newton = findById("newton");
              if (newton) onSelectMathematician(newton);
            }}
          >
            Learn More
          </Button>
        </Card>
        
        <Card className="border-white/10 bg-gradient-to-br from-gray-900 to-black p-4">
          <h3 className="text-lg font-bold mb-2 text-white">Number Theory</h3>
          <p className="text-sm text-gray-300 mb-3">
            The study of integers and their properties has led to breakthroughs in cryptography and computer science.
          </p>
          <div className="flex items-center gap-2 mb-3">
            <img 
              src={findById("gauss")?.image} 
              alt="Gauss" 
              className="w-8 h-8 rounded-full"
              loading="lazy"
            />
            <div>
              <p className="text-sm font-medium">Carl Friedrich Gauss</p>
              <p className="text-xs text-gray-400">Foundational work in number theory</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-white/10 hover:bg-primary/20"
            onClick={() => {
              const gauss = findById("gauss");
              if (gauss) onSelectMathematician(gauss);
            }}
          >
            Learn More
          </Button>
        </Card>
        
        <Card className="border-white/10 bg-gradient-to-br from-gray-900 to-black p-4">
          <h3 className="text-lg font-bold mb-2 text-white">Computer Science</h3>
          <p className="text-sm text-gray-300 mb-3">
            Mathematical foundations for computation transformed our world through digital technology.
          </p>
          <div className="flex items-center gap-2 mb-3">
            <img 
              src={findById("turing")?.image} 
              alt="Turing" 
              className="w-8 h-8 rounded-full"
              loading="lazy"
            />
            <div>
              <p className="text-sm font-medium">Alan Turing</p>
              <p className="text-xs text-gray-400">Created the theoretical basis for modern computers</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-white/10 hover:bg-primary/20"
            onClick={() => {
              const turing = findById("turing");
              if (turing) onSelectMathematician(turing);
            }}
          >
            Learn More
          </Button>
        </Card>
        
        <Card className="border-white/10 bg-gradient-to-br from-gray-900 to-black p-4">
          <h3 className="text-lg font-bold mb-2 text-white">Abstract Algebra</h3>
          <p className="text-sm text-gray-300 mb-3">
            Developed abstract structures that underpin modern mathematics and physics.
          </p>
          <div className="flex items-center gap-2 mb-3">
            <img 
              src={findById("noether")?.image} 
              alt="Noether" 
              className="w-8 h-8 rounded-full"
              loading="lazy"
            />
            <div>
              <p className="text-sm font-medium">Emmy Noether</p>
              <p className="text-xs text-gray-400">Revolutionary contributions to abstract algebra</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-white/10 hover:bg-primary/20"
            onClick={() => {
              const noether = findById("noether");
              if (noether) onSelectMathematician(noether);
            }}
          >
            Learn More
          </Button>
        </Card>
      </div>
    </Card>
  );
};

export default ContributionsGrid;
