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

	r.Static("/assets/css", "./assets/css")
	r.Static("/assets/img", "./assets/img")
	r.Static("/assets/vendor", "./assets/vendor")
	r.Static("/assets/js", "./assets/js")

	r.LoadHTMLGlob("./htmls/*")
	controller.EndpointRouter(r)

	log.Println("Server started")
	r.Run()
}
