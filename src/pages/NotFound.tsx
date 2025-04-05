
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <PageLayout 
      title="404 - Page Not Found" 
      subtitle="Oops! The page you're looking for doesn't exist."
    >
      <div className="flex flex-col items-center justify-center py-16 max-w-md mx-auto">
        <div className="mb-8 bg-card rounded-xl border border-white/10 p-8 text-center w-full">
          <div className="text-8xl font-bold mb-4 text-primary opacity-70">404</div>
          <p className="text-xl text-muted-foreground mb-8">
            We couldn't find the page you were looking for.
          </p>
          
          <div className="flex flex-col space-y-4">
            <Button 
              className="w-full py-6 flex items-center justify-center gap-2" 
              onClick={() => handleNavigate('/')}
            >
              <Home size={18} /> Return Home
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full py-6 flex items-center justify-center gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} /> Go Back
            </Button>
          </div>
        </div>
        
        <div className="text-center text-muted-foreground">
          <p>Looking for math games? Check out our featured collections:</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Button 
              variant="link" 
              onClick={() => handleNavigate('/math-games/hectoclash')}
            >
              HectoClash
            </Button>
            <Button 
              variant="link" 
              onClick={() => handleNavigate('/math-games/speed-math')}
            >
              Speed Math
            </Button>
            <Button 
              variant="link" 
              onClick={() => handleNavigate('/brain-teasers/logic-puzzles')}
            >
              Logic Puzzles
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
