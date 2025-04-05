import React, { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Grid, RefreshCw, Check, Lightbulb } from "lucide-react";
import { MultiplayerProvider } from "@/contexts/MultiplayerContext";
import MultiplayerGameWrapper from "@/components/multiplayer/MultiplayerGameWrapper";

const SudokuGame: React.FC = () => {
  const [sudokuBoard, setSudokuBoard] = useState<(number | null)[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showHint, setShowHint] = useState(false);

  // Generate a new Sudoku board
  useEffect(() => {
    generateSudokuBoard();
  }, [difficulty]);

  const generateSudokuBoard = () => {
    // For demonstration purposes, creating a partially filled board
    // In a real app, you would use an algorithm to generate a proper Sudoku
    const baseBoard = [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9]
    ];
    
    // Create different difficulty levels by revealing different numbers of cells
    let newBoard = JSON.parse(JSON.stringify(baseBoard));
    if (difficulty === 'easy') {
      // Reveal more cells for easy mode
      newBoard[0][3] = 4;
      newBoard[1][1] = 2;
      newBoard[2][2] = 7;
    } else if (difficulty === 'hard') {
      // Hide more cells for hard mode
      newBoard[0][4] = null;
      newBoard[3][8] = null;
      newBoard[8][7] = null;
    }
    
    setSudokuBoard(newBoard);
    setIsComplete(false);
    setShowHint(false);
  };

  const handleCellClick = (row: number, col: number) => {
    // Don't allow editing original numbers
    if (sudokuBoard[row][col] === null || !isOriginalCell(row, col)) {
      setSelectedCell([row, col]);
    }
  };

  const isOriginalCell = (row: number, col: number): boolean => {
    // In a real implementation, you would track which cells were part of the original puzzle
    // For simplicity, assume cells with initial values are original
    return sudokuBoard[row][col] !== null;
  };

  const handleNumberInput = (num: number) => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      if (!isOriginalCell(row, col)) {
        const newBoard = [...sudokuBoard];
        newBoard[row][col] = num;
        setSudokuBoard(newBoard);
        
        // Check if the board is complete after each move
        checkBoardCompletion(newBoard);
      }
    }
  };

  const checkBoardCompletion = (board: (number | null)[][]) => {
    // Basic check: no null cells and rows/columns/boxes satisfy Sudoku rules
    const hasEmptyCells = board.some(row => row.some(cell => cell === null));
    if (hasEmptyCells) return;
    
    // This is a simplified check - a real implementation would be more thorough
    const isValid = checkAllRowsValid(board) && 
                    checkAllColumnsValid(board) && 
                    checkAllBoxesValid(board);
    
    if (isValid) {
      setIsComplete(true);
      toast.success("Congratulations! You've solved the Sudoku puzzle!");
    }
  };

  const checkAllRowsValid = (board: (number | null)[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      const seen = new Set();
      for (let col = 0; col < 9; col++) {
        const num = board[row][col];
        if (num === null || seen.has(num)) return false;
        seen.add(num);
      }
    }
    return true;
  };

  const checkAllColumnsValid = (board: (number | null)[][]): boolean => {
    for (let col = 0; col < 9; col++) {
      const seen = new Set();
      for (let row = 0; row < 9; row++) {
        const num = board[row][col];
        if (num === null || seen.has(num)) return false;
        seen.add(num);
      }
    }
    return true;
  };

  const checkAllBoxesValid = (board: (number | null)[][]): boolean => {
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const seen = new Set();
        for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
          for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
            const num = board[row][col];
            if (num === null || seen.has(num)) return false;
            seen.add(num);
          }
        }
      }
    }
    return true;
  };

  const handleClearCell = () => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      if (!isOriginalCell(row, col)) {
        const newBoard = [...sudokuBoard];
        newBoard[row][col] = null;
        setSudokuBoard(newBoard);
      }
    }
  };

  const toggleHint = () => {
    setShowHint(!showHint);
    if (!showHint) {
      toast.info("Look for cells where only one number is possible!");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <Button 
            variant={difficulty === 'easy' ? 'default' : 'outline'}
            onClick={() => setDifficulty('easy')}
          >
            Easy
          </Button>
          <Button 
            variant={difficulty === 'medium' ? 'default' : 'outline'}
            onClick={() => setDifficulty('medium')}
          >
            Medium
          </Button>
          <Button 
            variant={difficulty === 'hard' ? 'default' : 'outline'}
            onClick={() => setDifficulty('hard')}
          >
            Hard
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={generateSudokuBoard}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} /> New Game
          </Button>
          
          <Button 
            variant="outline" 
            onClick={toggleHint}
            className="flex items-center gap-2"
          >
            <Lightbulb size={16} /> Hint
          </Button>
        </div>
      </div>
      
      {showHint && (
        <div className="bg-muted/20 p-4 rounded-lg mb-6 animate-fade-in">
          <p className="text-sm">
            <strong>Hint:</strong> Look for rows, columns, or 3x3 boxes where most numbers are already filled. 
            The missing numbers must be between 1-9, and no digit can repeat in any row, column, or 3x3 box.
          </p>
        </div>
      )}
      
      {isComplete ? (
        <div className="bg-green-500/20 p-6 rounded-lg text-center mb-6 animate-fade-in">
          <h3 className="text-2xl font-bold mb-2">Puzzle Completed!</h3>
          <p className="mb-4">Congratulations on solving the Math Sudoku puzzle!</p>
          <Button onClick={generateSudokuBoard}>Play Again</Button>
        </div>
      ) : (
        <div className="bg-card rounded-lg p-4 shadow-lg">
          <div className="grid grid-cols-9 gap-0 border-2 border-gray-800 mb-6">
            {sudokuBoard.map((row, rowIndex) => (
              row.map((cell, colIndex) => (
                <div 
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    aspect-square flex items-center justify-center text-xl font-bold 
                    border border-gray-400
                    ${(rowIndex) % 3 === 0 ? 'border-t-gray-800' : ''}
                    ${(colIndex) % 3 === 0 ? 'border-l-gray-800' : ''}
                    ${selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex 
                      ? 'bg-primary/20' 
                      : ''}
                    ${isOriginalCell(rowIndex, colIndex) ? 'text-white' : 'text-primary'}
                    cursor-pointer hover:bg-muted/40 transition-colors
                  `}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell}
                </div>
              ))
            ))}
          </div>
          
          <div className="grid grid-cols-9 gap-2 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <Button 
                key={num} 
                variant="outline"
                onClick={() => handleNumberInput(num)}
                className="aspect-square text-xl font-bold"
              >
                {num}
              </Button>
            ))}
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="destructive" 
              onClick={handleClearCell}
              disabled={!selectedCell || (selectedCell && isOriginalCell(selectedCell[0], selectedCell[1]))}
            >
              Clear Cell
            </Button>
            
            <Button 
              onClick={() => checkBoardCompletion(sudokuBoard)}
              className="flex items-center gap-2"
            >
              <Check size={16} /> Check Solution
            </Button>
          </div>
        </div>
      )}
      
      <div className="mt-8 bg-muted/20 p-4 rounded-lg">
        <h3 className="text-xl font-bold mb-2">How to Play Math Sudoku</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Fill in the 9×9 grid so that each row, column and 3×3 box contains all digits from 1 to 9.</li>
          <li>Each digit must appear exactly once in each row, column, and 3×3 box.</li>
          <li>Some cells are pre-filled as clues to help you start.</li>
          <li>Click on an empty cell to select it, then click a number to fill it in.</li>
          <li>Use logic to deduce which numbers go where.</li>
        </ul>
      </div>
    </div>
  );
};

const LogicPuzzles: React.FC = () => {
  return (
    <PageLayout 
      title="MATH SUDOKU" 
      subtitle="SOLVE THE CLASSIC LOGICAL PUZZLE WITH A MATHEMATICAL TWIST"
    >
      <MultiplayerProvider>
        <MultiplayerGameWrapper
          gameType="sudoku"
          singlePlayerComponent={<SudokuGame />}
          gameTitle="Math Sudoku"
          gameDescription="Challenge other players to Sudoku duels or watch live matches!"
        />
      </MultiplayerProvider>
    </PageLayout>
  );
};

export default LogicPuzzles;
