
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const GameRules: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-game-primary border-game-primary hover:bg-game-primary/10">
          How to Play
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card text-card-foreground border-game-primary/50 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-game-primary">
            HectoClash Arena Rules
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Make 100 using all six digits in order!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-game-primary">The Goal</h3>
            <p>Given six digits, insert mathematical operations to make the expression equal to 100.</p>
          </div>

          <div>
            <h3 className="font-semibold text-game-primary">The Rules</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>You must use all six digits in the exact order given.</li>
              <li>You can use addition (+), subtraction (-), multiplication (×), division (÷), exponentiation (^), and parentheses ().</li>
              <li>You cannot rearrange the digits.</li>
              <li>You have 2 minutes to solve each puzzle.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-game-primary">Example</h3>
            <p>Given the sequence "123456":</p>
            <p className="font-mono bg-muted/20 p-2 rounded my-2">1 + (2 + 3 + 4) × (5 + 6) = 100</p>
            <p>This works because:</p>
            <p className="font-mono bg-muted/20 p-2 rounded my-2">1 + (9) × (11) = 1 + 99 = 100</p>
          </div>

          <div>
            <h3 className="font-semibold text-game-primary">Scoring</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Base score: 100 points for each correct solution</li>
              <li>Time bonus: The faster you solve, the more bonus points you earn</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameRules;
