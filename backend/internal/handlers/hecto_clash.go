package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

type HectoClashScore struct {
	Score int `json:"score"`
}

func SaveHectoClashScore(c *gin.Context) {
	var score HectoClashScore
	if err := c.ShouldBindJSON(&score); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid score format"})
		return
	}

	// Store score in Redis with timestamp
	ctx := context.Background()
	scoreData := map[string]interface{}{
		"score":     score.Score,
		"timestamp": time.Now().Unix(),
	}

	scoreJSON, err := json.Marshal(scoreData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process score"})
		return
	}

	// Store in sorted set for leaderboard
	err = rdb.ZAdd(ctx, "hecto_clash_scores", redis.Z{
		Score:  float64(score.Score),
		Member: string(scoreJSON),
	}).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save score"})
		return
	}

	// Keep only top 100 scores
	rdb.ZRemRangeByRank(ctx, "hecto_clash_scores", 0, -101)

	c.JSON(http.StatusOK, gin.H{"message": "Score saved successfully"})
}

func GetHectoClashLeaderboard(c *gin.Context) {
	ctx := context.Background()

	// Get top 10 scores
	scores, err := rdb.ZRevRange(ctx, "hecto_clash_scores", 0, 9).Result()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch leaderboard"})
		return
	}

	var leaderboard []map[string]interface{}
	for _, score := range scores {
		var scoreData map[string]interface{}
		if err := json.Unmarshal([]byte(score), &scoreData); err != nil {
			continue
		}
		leaderboard = append(leaderboard, scoreData)
	}

	c.JSON(http.StatusOK, gin.H{"leaderboard": leaderboard})
} 