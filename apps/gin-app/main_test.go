package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	misc_v1 "apps/gin-app/controllers/v1/misc"
	"apps/gin-app/utils"

	"github.com/alecthomas/assert"
	"github.com/gin-gonic/gin"
)

func SetUpRouter() *gin.Engine {
	router := gin.Default()
	return router
}
func TestMiscVersion(t *testing.T) {
	r := SetUpRouter()
	miscController := misc_v1.NewMiscController(utils.GetLogger())
	r.GET("/version", miscController.GetVersion)
	req, _ := http.NewRequest("GET", "/version", http.NoBody)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
}
