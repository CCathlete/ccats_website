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

	r.Static("/static/css", "./static/css")
	r.Static("/static/img", "./static/img")
	r.Static("/static/scss", "./static/scss")
	r.Static("/static/vendor", "./static/vendor")
	r.Static("/static/js", "./static/js")
	r.StaticFile("/img/favicon.ico", "./img/favicon.ico")

	r.LoadHTMLGlob("templates/**/*")
	controller.Router(r)

	log.Println("Server started")
	r.Run()
}
