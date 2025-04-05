package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

type MathProblem struct {
	Question string `json:"question"`
	Answer   int    `json:"answer"`
}

type GeometryDashProblem struct {
	Type     string      `json:"type"`
	Position int         `json:"position"`
	Value    interface{} `json:"value,omitempty"`
}

func generateMathProblem() MathProblem {
	operations := []string{"+", "-", "×"}
	operation := operations[rand.Intn(len(operations))]
	var num1, num2, answer int

	switch operation {
	case "+":
		num1 = rand.Intn(20) + 1
		num2 = rand.Intn(20) + 1
		answer = num1 + num2
	case "-":
		num1 = rand.Intn(20) + 1
		num2 = rand.Intn(num1) + 1
		answer = num1 - num2
	case "×":
		num1 = rand.Intn(10) + 1
		num2 = rand.Intn(10) + 1
		answer = num1 * num2
	}

	return MathProblem{
		Question: fmt.Sprintf("%d %s %d = ?", num1, operation, num2),
		Answer:   answer,
	}
}

func GetGeometryDashProblems(c *gin.Context) {
	ctx := context.Background()
	rdb := c.MustGet("redis").(*redis.Client)

	// Generate initial obstacles
	obstacles := make([]GeometryDashProblem, 5)
	for i := 0; i < 5; i++ {
		isMath := rand.Float64() > 0.5
		problem := GeometryDashProblem{
			Type:     "math",
			Position: 100 + i*200,
		}

		if isMath {
			mathProblem := generateMathProblem()
			problem.Value = mathProblem.Answer
		} else {
			problem.Type = "jump"
		}

		obstacles[i] = problem
	}

	// Cache the problems
	problemsJSON, err := json.Marshal(obstacles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate problems"})
		return
	}

	// Cache for 5 minutes
	rdb.Set(ctx, "geometry_dash_problems", problemsJSON, 5*time.Minute)

	c.JSON(http.StatusOK, obstacles)
}

type Score struct {
	Score int `json:"score"`
}

func SaveGeometryDashScore(c *gin.Context) {
	var score Score
	if err := c.ShouldBindJSON(&score); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid score data"})
		return
	}

	ctx := context.Background()
	rdb := c.MustGet("redis").(*redis.Client)

	// Store the score in Redis
	scoreKey := "geometry_dash_score:" + time.Now().Format("20060102")
	rdb.Incr(ctx, scoreKey)

	c.JSON(http.StatusOK, gin.H{"message": "Score saved successfully"})
} 