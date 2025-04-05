
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mathematician } from "@/types/mathematician";

interface MathematicianTimelineProps {
  mathematicians: Mathematician[];
  onSelectMathematician: (mathematician: Mathematician) => void;
}

const MathematicianTimeline: React.FC<MathematicianTimelineProps> = ({ 
  mathematicians,
  onSelectMathematician
}) => {
  const sortedMathematicians = [...mathematicians].sort((a, b) => {
    const yearA = parseInt(a.lifespan.split(' – ')[0].replace(/\D/g, ''));
    const yearB = parseInt(b.lifespan.split(' – ')[0].replace(/\D/g, ''));
    const isABCE = a.lifespan.includes("BCE");
    const isBBCE = b.lifespan.includes("BCE");
    
    if (isABCE && isBBCE) return yearB - yearA; // Both BCE, higher number is earlier
    if (isABCE) return 1; // A is BCE, should come first (older)
    if (isBBCE) return -1; // B is BCE, should come first (older)
    return yearA - yearB; // Neither is BCE, regular comparison
  });

  return (
    <Card className="p-6 bg-black/50 backdrop-blur-sm border-white/10">
      <h2 className="text-2xl font-bold mb-6 text-primary">Mathematical Timeline</h2>
      <div className="relative border-l-2 border-primary/50 ml-12 pl-8">
        {sortedMathematicians.map((mathematician) => (
          <div 
            key={mathematician.id} 
            className="mb-10 relative"
          >
            <div className="absolute -left-14 mt-1.5 h-5 w-5 rounded-full bg-primary"></div>
            <div className="absolute -left-40 mt-1 text-sm text-primary/90 font-mono w-24 text-right">
              {mathematician.lifespan.split(' – ')[0]}
            </div>
            <Card className="p-4 border-white/10 bg-gradient-to-r from-gray-900 to-black">
              <div className="flex items-start gap-4">
                <img
                  src={mathematician.image}
                  alt={mathematician.name}
                  className="w-20 h-20 object-cover rounded-full border-2 border-primary/50"
                  loading="lazy"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{mathematician.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">{mathematician.lifespan} • {mathematician.nationality}</p>
                  <p className="text-sm text-gray-300 mb-2">{mathematician.knownFor.join(', ')}</p>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{mathematician.biography.substring(0, 120)}...</p>
                  <Button 
                    variant="link" 
                    className="text-primary p-0 h-auto text-sm"
                    onClick={() => onSelectMathematician(mathematician)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MathematicianTimeline;
