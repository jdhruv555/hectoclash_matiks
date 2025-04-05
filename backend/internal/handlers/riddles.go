package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

type Riddle struct {
	Question   string `json:"question"`
	Answer     string `json:"answer"`
	Hint       string `json:"hint"`
	Difficulty string `json:"difficulty"`
}

var riddles = []Riddle{
	{
		Question:   "I am a number that when multiplied by 3 and then divided by 2 gives 9. What am I?",
		Answer:     "6",
		Hint:       "Try working backwards from 9",
		Difficulty: "easy",
	},
	{
		Question:   "If you have 12 apples and take away 3, then add 5, and finally divide by 2, how many apples do you have?",
		Answer:     "7",
		Hint:       "Follow the operations step by step",
		Difficulty: "easy",
	},
	{
		Question:   "A number is increased by 25% and then decreased by 20%. The final result is 100. What was the original number?",
		Answer:     "100",
		Hint:       "Let x be the original number and solve the equation",
		Difficulty: "medium",
	},
	{
		Question:   "If 2^x = 16 and 3^y = 27, what is x + y?",
		Answer:     "7",
		Hint:       "Find the values of x and y separately",
		Difficulty: "medium",
	},
	{
		Question:   "The sum of three consecutive even numbers is 54. What is the largest number?",
		Answer:     "20",
		Hint:       "Let n be the smallest number and write an equation",
		Difficulty: "hard",
	},
}

func GetRiddles(c *gin.Context) {
	ctx := context.Background()
	rdb := c.MustGet("redis").(*redis.Client)

	// Try to get from cache first
	cached, err := rdb.Get(ctx, "riddles").Result()
	if err == nil {
		var riddles []Riddle
		if err := json.Unmarshal([]byte(cached), &riddles); err == nil {
			c.JSON(http.StatusOK, riddles)
			return
		}
	}

	// If not in cache, return the riddles and cache them
	riddlesJSON, err := json.Marshal(riddles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process riddles"})
		return
	}

	// Cache for 1 hour
	rdb.Set(ctx, "riddles", riddlesJSON, time.Hour)

	c.JSON(http.StatusOK, riddles)
} 