package main

import (
	"log"
	"profit_tracker/backend/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// _ := os.Getenv("DATABASE_URL")

	r := gin.Default()

	r.GET("ping/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	private := r.Group("/api")
	private.Use(middleware.AuthMiddleware())
	{
		private.POST("/products", addProductHandler)
		private.GET("/dashboard", getDashboardDataHandler)
	}

	r.Run(":8080")
}

func addProductHandler(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Product added!"})
}

func getDashboardDataHandler(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Here is your data"})
}
