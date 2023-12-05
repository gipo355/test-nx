package main

import (
	"apps/gin-app/bootstrap"
	"apps/gin-app/utils"

	"github.com/joho/godotenv"
	"go.uber.org/fx"
)

func main() {
	godotenv.Load()
	logger := utils.GetLogger().GetFxLogger()

	fx.New(bootstrap.Module, fx.Logger(logger)).Run()
}
