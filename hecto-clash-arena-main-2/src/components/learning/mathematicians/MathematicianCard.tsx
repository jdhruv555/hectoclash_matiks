
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mathematician } from "@/types/mathematician";

interface MathematicianCardProps {
  mathematician: Mathematician;
  onClick: (mathematician: Mathematician) => void;
}

const MathematicianCard: React.FC<MathematicianCardProps> = ({ mathematician, onClick }) => {
  return (
    <Card 
      className="overflow-hidden border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:shadow-primary/20 bg-gradient-to-br from-gray-900 to-black cursor-pointer"
      onClick={() => onClick(mathematician)}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <img 
          src={mathematician.image} 
          alt={mathematician.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <span className="text-xs px-2 py-1 bg-primary/80 rounded-full">{mathematician.era}</span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold mb-1 text-white">{mathematician.name}</h3>
        <p className="text-sm text-gray-400 mb-3">{mathematician.lifespan} • {mathematician.nationality}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {mathematician.knownFor.slice(0, 2).map((achievement, index) => (
            <span key={index} className="text-xs bg-muted/50 text-gray-300 px-2 py-1 rounded">
              {achievement}
            </span>
          ))}
          {mathematician.knownFor.length > 2 && (
            <span className="text-xs bg-muted/50 text-gray-300 px-2 py-1 rounded">
              +{mathematician.knownFor.length - 2} more
            </span>
          )}
        </div>
        <Button 
          variant="outline" 
          className="w-full border-white/10 hover:bg-primary/20 hover:text-white"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default MathematicianCard;
