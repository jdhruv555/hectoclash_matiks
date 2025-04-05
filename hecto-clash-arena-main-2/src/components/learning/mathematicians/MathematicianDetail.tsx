
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Award, ExternalLink } from "lucide-react";
import { Mathematician } from "@/types/mathematician";

interface MathematicianDetailProps {
  mathematician: Mathematician;
  onBack: () => void;
}

const MathematicianDetail: React.FC<MathematicianDetailProps> = ({ mathematician, onBack }) => {
  return (
    <Card className="p-6 bg-black/50 backdrop-blur-sm border-white/10">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="rounded-lg overflow-hidden border border-white/10">
            <img 
              src={mathematician.image} 
              alt={mathematician.name}
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
          <div className="mt-4 space-y-3">
            <div className="bg-muted/30 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-primary mb-1">Known For</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {mathematician.knownFor.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-primary mb-1">Quote</h4>
              <blockquote className="border-l-2 border-primary/50 pl-3 italic text-sm">
                "{mathematician.famousQuote}"
              </blockquote>
            </div>
          </div>
        </div>
        <div className="md:w-2/3">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{mathematician.name}</h2>
              <p className="text-muted-foreground">{mathematician.lifespan} • {mathematician.nationality}</p>
            </div>
            <span className="px-2 py-1 bg-primary/20 text-primary rounded text-sm">{mathematician.era} Era</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-medium mb-2 text-white">
                <History size={18} className="text-primary" /> Biography
              </h3>
              <p className="text-gray-300">{mathematician.biography}</p>
            </div>
            
            <div>
              <h3 className="flex items-center gap-2 text-lg font-medium mb-2 text-white">
                <Award size={18} className="text-primary" /> Contributions to Mathematics
              </h3>
              <p className="text-gray-300">{mathematician.contributions}</p>
            </div>
            
            <div className="pt-4">
              <Button 
                variant="outline" 
                className="mr-2 border-white/10 hover:bg-primary/20"
                onClick={onBack}
              >
                Back to Gallery
              </Button>
              <Button asChild>
                <a 
                  href={`https://en.wikipedia.org/wiki/${mathematician.name.replace(/\s/g, '_')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  Learn More <ExternalLink size={14} />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MathematicianDetail;
