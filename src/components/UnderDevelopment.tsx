import React from "react";
import PageLayout from "./PageLayout";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UnderDevelopmentProps {
  title: string;
  description?: string;
}

const UnderDevelopment: React.FC<UnderDevelopmentProps> = ({
  title,
  description = "This game is currently under development. Check back soon for an exciting new challenge!",
}) => {
  const navigate = useNavigate();

  return (
    <PageLayout title={title}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Construction className="w-24 h-24 text-yellow-500 mb-6 animate-bounce" />
        <h2 className="text-2xl font-bold mb-4">Coming Soon!</h2>
        <p className="text-lg text-muted-foreground max-w-md mb-8">{description}</p>
        <Button onClick={() => navigate("/")} variant="outline" size="lg">
          Return Home
        </Button>
      </div>
    </PageLayout>
  );
};

export default UnderDevelopment; 