package main

import (
	"ccats_website/controller"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	controller.Router(r)

	log.Println("Server started")
	r.Run()
}
