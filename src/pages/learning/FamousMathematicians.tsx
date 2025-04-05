
import React, { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Mathematician } from "@/types/mathematician";
import { mathematicians } from "@/data/mathematicians";
import MathematicianCard from "@/components/learning/mathematicians/MathematicianCard";
import MathematicianDetail from "@/components/learning/mathematicians/MathematicianDetail";
import MathematicianTimeline from "@/components/learning/mathematicians/MathematicianTimeline";
import ContributionsGrid from "@/components/learning/mathematicians/ContributionsGrid";

const FamousMathematicians: React.FC = () => {
  const [selectedMathematician, setSelectedMathematician] = useState<Mathematician | null>(null);
  const [activeEra, setActiveEra] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Simulate data loading
  useEffect(() => {
    // This simulates network loading but ensures we're using pre-loaded data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const filteredMathematicians = activeEra === "all" 
    ? mathematicians 
    : mathematicians.filter(m => m.era === activeEra);
  
  if (isLoading) {
    return (
      <PageLayout
        title="Famous Mathematicians"
        subtitle="Loading mathematician data..."
      >
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-12 w-52" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout
      title="Famous Mathematicians"
      subtitle="Explore the lives and contributions of history's greatest mathematical minds"
    >
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="mb-6 bg-muted/50">
            <TabsTrigger value="gallery" className="data-[state=active]:bg-primary">Gallery View</TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-primary">Timeline</TabsTrigger>
            <TabsTrigger value="contributions" className="data-[state=active]:bg-primary">Major Contributions</TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-6">
            <Card className="p-6 bg-black/50 backdrop-blur-sm border-white/10">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-primary">Mathematical Legends</h2>
                <p className="text-muted-foreground">Discover the brilliant minds who shaped the field of mathematics throughout history.</p>
              </div>
              
              <div className="mb-6">
                <TabsList className="mb-4 bg-muted/30 inline-flex w-auto">
                  <TabsTrigger 
                    value="all" 
                    onClick={() => setActiveEra("all")}
                    className={activeEra === "all" ? "bg-primary text-white" : ""}
                  >
                    All Eras
                  </TabsTrigger>
                  <TabsTrigger 
                    value="Ancient" 
                    onClick={() => setActiveEra("Ancient")}
                    className={activeEra === "Ancient" ? "bg-primary text-white" : ""}
                  >
                    Ancient
                  </TabsTrigger>
                  <TabsTrigger 
                    value="Medieval" 
                    onClick={() => setActiveEra("Medieval")}
                    className={activeEra === "Medieval" ? "bg-primary text-white" : ""}
                  >
                    Medieval
                  </TabsTrigger>
                  <TabsTrigger 
                    value="Renaissance" 
                    onClick={() => setActiveEra("Renaissance")}
                    className={activeEra === "Renaissance" ? "bg-primary text-white" : ""}
                  >
                    Renaissance
                  </TabsTrigger>
                  <TabsTrigger 
                    value="Enlightenment" 
                    onClick={() => setActiveEra("Enlightenment")}
                    className={activeEra === "Enlightenment" ? "bg-primary text-white" : ""}
                  >
                    Enlightenment
                  </TabsTrigger>
                  <TabsTrigger 
                    value="Modern" 
                    onClick={() => setActiveEra("Modern")}
                    className={activeEra === "Modern" ? "bg-primary text-white" : ""}
                  >
                    Modern
                  </TabsTrigger>
                  <TabsTrigger 
                    value="Contemporary" 
                    onClick={() => setActiveEra("Contemporary")}
                    className={activeEra === "Contemporary" ? "bg-primary text-white" : ""}
                  >
                    Contemporary
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMathematicians.map((mathematician) => (
                  <MathematicianCard
                    key={mathematician.id}
                    mathematician={mathematician}
                    onClick={setSelectedMathematician}
                  />
                ))}
              </div>
              
              {filteredMathematicians.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No mathematicians found for this era.</p>
                </div>
              )}
            </Card>
            
            {selectedMathematician && (
              <MathematicianDetail
                mathematician={selectedMathematician}
                onBack={() => setSelectedMathematician(null)}
              />
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <MathematicianTimeline
              mathematicians={mathematicians}
              onSelectMathematician={setSelectedMathematician}
            />
            
            {selectedMathematician && (
              <MathematicianDetail
                mathematician={selectedMathematician}
                onBack={() => setSelectedMathematician(null)}
              />
            )}
          </TabsContent>

          <TabsContent value="contributions" className="space-y-6">
            <ContributionsGrid
              mathematicians={mathematicians}
              onSelectMathematician={setSelectedMathematician}
            />
            
            {selectedMathematician && (
              <MathematicianDetail
                mathematician={selectedMathematician}
                onBack={() => setSelectedMathematician(null)}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default FamousMathematicians;
