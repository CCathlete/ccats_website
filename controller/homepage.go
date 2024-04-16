package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func EndpointRouter(r *gin.Engine) {
	r.GET("/", index)
}

func index(context *gin.Context) {
	context.HTML(
		http.StatusOK,
		"index.html",
		gin.H{
			"title": "CCat's website",
		},
	)
}
