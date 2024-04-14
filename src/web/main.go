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

	r.Static("/css", "./assets/css")
	r.Static("/img", "./assets/img")
	r.Static("/vendor", "./assets/vendor")
	r.Static("/js", "./assets/js")

	r.LoadHTMLGlob("./htmls/*")
	controller.Router(r)

	log.Println("Server started")
	r.Run()
}
