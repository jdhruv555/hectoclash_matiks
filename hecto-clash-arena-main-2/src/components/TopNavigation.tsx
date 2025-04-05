
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Brain, Calculator, BookOpen, Trophy, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (props.href) {
      navigate(props.href);
    }
  };
  
  return (
    <li>
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none text-white cursor-pointer",
          className
        )}
        onClick={handleClick}
        style={{color: "white", opacity: 1}}
        {...props}
      >
        <div className="text-sm font-medium leading-none" style={{color: "white", opacity: 1}}>{title}</div>
        <p 
          className="line-clamp-2 text-sm leading-snug text-white" 
          style={{color: "white", opacity: 1}}
        >
          {children}
        </p>
      </a>
    </li>
  );
});
ListItem.displayName = "ListItem";

const TopNavigation: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigateTo = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const dropdownStyle = {
    backgroundColor: "#000000",
    color: "white",
    opacity: 1,
    zIndex: 9999
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const mobileMenu = document.getElementById('mobile-menu');
      const menuButton = document.getElementById('menu-button');
      
      if (mobileMenuOpen && mobileMenu && menuButton && 
          !mobileMenu.contains(target) && !menuButton.contains(target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);
  
  return (
    <div className="border-b border-white/10 bg-background/95 backdrop-blur-none supports-[backdrop-filter]:bg-background/60 z-[9999] relative">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <div onClick={() => navigateTo("/")} className="font-bold text-2xl cursor-pointer">
            <span className="math-gradient-text">HectoClash</span>
          </div>
          
          {isMobile ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              id="menu-button"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          ) : (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Calculator className="mr-2" size={16} />
                    Math Games
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]" style={dropdownStyle}>
                      <ListItem
                        title="Hectoclash"
                        href="/math-games/hectoclash"
                      >
                        Use math operators to reach 100 using all digits in sequence
                      </ListItem>
                      <ListItem
                        title="Speed Math"
                        href="/math-games/speed-math"
                      >
                        Test your calculation speed against the clock
                      </ListItem>
                      <ListItem
                        title="Number Puzzles"
                        href="/math-games/number-puzzles"
                      >
                        Solve challenging mathematical puzzles
                      </ListItem>
                      <ListItem
                        title="Calculus Quest"
                        href="/math-games/calculus-quest"
                      >
                        Master derivatives and integrals through interactive challenges
                      </ListItem>
                      <ListItem
                        title="Geometry Dash"
                        href="/math-games/geometry-dash"
                      >
                        Calculate angles, areas, and more in timed challenges
                      </ListItem>
                      <ListItem
                        title="Math Duels"
                        href="/math-games/math-duels"
                      >
                        Compete against others in real-time math competitions
                      </ListItem>
                      <ListItem
                        title="Visual Math Puzzles"
                        href="/math-games/visual-math-puzzle"
                      >
                        Solve mathematical puzzles through visual patterns
                      </ListItem>
                      <ListItem
                        title="Cryptarithmetic"
                        href="/math-games/cryptarithmetic"
                      >
                        Decode letter-for-digit substitution puzzles
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Brain className="mr-2" size={16} />
                    Brain Teasers
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]" style={dropdownStyle}>
                      <ListItem
                        title="Logic Puzzles"
                        href="/brain-teasers/logic-puzzles"
                      >
                        Test your deductive reasoning with challenging logic problems
                      </ListItem>
                      <ListItem
                        title="Pattern Recognition"
                        href="/brain-teasers/pattern-recognition"
                      >
                        Find the hidden patterns in sequences and visual puzzles
                      </ListItem>
                      <ListItem
                        title="Memory Games"
                        href="/brain-teasers/memory-games"
                      >
                        Enhance your recall with strategic memory challenges
                      </ListItem>
                      <ListItem
                        title="Riddles"
                        href="/brain-teasers/riddles"
                      >
                        Solve mathematical riddles that challenge your thinking
                      </ListItem>
                      <ListItem
                        title="Visual Math Puzzles"
                        href="/brain-teasers/visual-math-puzzle"
                      >
                        Solve challenging visual puzzles that test your mathematical intuition
                      </ListItem>
                      <ListItem
                        title="Cryptarithmetic"
                        href="/brain-teasers/cryptarithmetic"
                      >
                        Decode letter-for-digit substitution puzzles
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <BookOpen className="mr-2" size={16} />
                    Learning
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]" style={dropdownStyle}>
                      <ListItem
                        title="Math Tutorials"
                        href="/learning/tutorials"
                      >
                        Step-by-step guides for learning mathematical concepts
                      </ListItem>
                      <ListItem
                        title="Mental Math"
                        href="/learning/mental-math"
                      >
                        Learn strategies to calculate faster in your head
                      </ListItem>
                      <ListItem
                        title="Problem-Solving"
                        href="/learning/strategies"
                      >
                        Techniques for approaching difficult math problems
                      </ListItem>
                      <ListItem
                        title="Interactive Lessons"
                        href="/learning/interactive"
                      >
                        Engage with interactive learning modules
                      </ListItem>
                      <ListItem
                        title="Famous Mathematicians"
                        href="/learning/mathematicians"
                      >
                        Learn about history's greatest mathematical minds
                      </ListItem>
                      <ListItem
                        title="Advanced Topics"
                        href="/learning/advanced-topics"
                      >
                        Dive deep into complex mathematical subjects
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Trophy className="mr-2" size={16} />
                    Leaderboards
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]" style={dropdownStyle}>
                      <ListItem
                        title="Global Rankings"
                        href="/leaderboards/global"
                      >
                        See how you compare to players worldwide
                      </ListItem>
                      <ListItem
                        title="Daily Challenges"
                        href="/leaderboards/daily"
                      >
                        Compete in special daily math challenges
                      </ListItem>
                      <ListItem
                        title="Personal Stats"
                        href="/leaderboards/stats"
                      >
                        Track your progress and improvement over time
                      </ListItem>
                      <ListItem
                        title="Achievements"
                        href="/leaderboards/achievements"
                      >
                        View your earned badges and accomplishments
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden md:flex">
            Sign In
          </Button>
          <Button>Get Started</Button>
        </div>
      </div>
      
      {isMobile && mobileMenuOpen && (
        <div id="mobile-menu" className="container pb-4 bg-background shadow-lg rounded-b-lg border-t border-white/5">
          <div className="space-y-2 pt-2">
            <div className="py-2 border-b border-white/5">
              <h3 className="font-semibold px-2 flex items-center">
                <Calculator className="mr-2" size={16} />
                Math Games
              </h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div onClick={() => navigateTo("/math-games/hectoclash")} className="px-3 py-2 hover:bg-accent/30 rounded-md cursor-pointer">Hectoclash</div>
                <div onClick={() => navigateTo("/math-games/speed-math")} className="px-3 py-2 hover:bg-accent/30 rounded-md cursor-pointer">Speed Math</div>
                <div onClick={() => navigateTo("/math-games/number-puzzles")} className="px-3 py-2 hover:bg-accent/30 rounded-md cursor-pointer">Number Puzzles</div>
                <div onClick={() => navigateTo("/math-games/calculus-quest")} className="px-3 py-2 hover:bg-accent/30 rounded-md cursor-pointer">Calculus Quest</div>
              </div>
            </div>
            
            <div className="py-2 border-b border-white/5">
              <h3 className="font-semibold px-2 flex items-center">
                <Brain className="mr-2" size={16} />
                Brain Teasers
              </h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div onClick={() => navigateTo("/brain-teasers/logic-puzzles")} className="px-3 py-2 hover:bg-accent/30 rounded-md cursor-pointer">Logic Puzzles</div>
                <div onClick={() => navigateTo("/brain-teasers/pattern-recognition")} className="px-3 py-2 hover:bg-accent/30 rounded-md cursor-pointer">Pattern Recognition</div>
                <div onClick={() => navigateTo("/brain-teasers/memory-games")} className="px-3 py-2 hover:bg-accent/30 rounded-md cursor-pointer">Memory Games</div>
                <div onClick={() => navigateTo("/brain-teasers/riddles")} className="px-3 py-2 hover:bg-accent/30 rounded-md cursor-pointer">Riddles</div>
              </div>
            </div>
            
            <div className="flex justify-center mt-4 gap-2">
              <Button variant="outline" size="sm">Sign In</Button>
              <Button size="sm">Get Started</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNavigation;
