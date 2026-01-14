package main

import (
	"context"
	"log"
	"os"
	"profit_tracker/backend/middleware"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

type DailyProfit struct {
	Date   string  `json:"date"`
	Profit float64 `json:"profit"`
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// _ := os.Getenv("DATABASE_URL")

	// connect to DB
	conn, err := pgx.Connect(context.Background(), os.Getenv("DATABASE_URI"))
	if err != nil {
		log.Fatal("Unable to connect to database: ", err)
	}
	defer conn.Close(context.Background())

	r := gin.Default()

	// enable CORS
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*") // for dev only
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.GET("ping/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware())
	{
		api.GET("/dashboard", func(c *gin.Context) {
			userID := c.MustGet("user_id").(string)

			rows, err := conn.Query(context.Background(), `
							SELECT
								to_char(sold_at, 'YYYY-MM-DD') as day,
								SUM(sale_price - material_cost) as daily_profit
							FROM products
							WHERE user_id = $1
							GROUP BY day
							ORDER BY day ASC
                LIMIT 7
						`, userID)

			if err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
			}
			defer rows.Close()

			var results []DailyProfit
			for rows.Next() {
				var dp DailyProfit
				rows.Scan(&dp.Date, &dp.Profit)
				results = append(results, dp)
			}

			c.JSON(200, results)
		})
	}

	// private := r.Group("/api")
	// private.Use(middleware.AuthMiddleware())
	// {
	// 	private.POST("/products", addProductHandler)
	// 	private.GET("/dashboard", getDashboardDataHandler)
	// }

	r.Run(":8080")
}

func addProductHandler(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Product added!"})
}

func getDashboardDataHandler(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Here is your data"})
}
