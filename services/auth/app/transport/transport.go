package transport

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grigoryevandrey/logistics-app/lib/errors"
	jsonmw "github.com/grigoryevandrey/logistics-app/lib/middlewares/json"
	"github.com/grigoryevandrey/logistics-app/services/auth/app"
	"gopkg.in/validator.v2"
)

const ADMIN_STRATEGY = "admin"
const MANAGER_STRATEGY = "manager"

type handler struct {
	app.Service
}

func Handler(service app.Service) *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(jsonmw.JSONMiddleware())

	injectedHandler := &handler{service}

	superGroup := router.Group("api")

	{
		v1 := superGroup.Group("v1")
		{
			authGroup := v1.Group("auth")
			{
				authGroup.POST("/login", injectedHandler.login)
				authGroup.DELETE("/logout", injectedHandler.logout)

				healthGroup := authGroup.Group("health")
				{
					healthGroup.GET("/", injectedHandler.health)
				}
			}
		}
	}

	return router
}

func (handlerRef *handler) health(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": "UP"})
}

func (handlerRef *handler) login(ctx *gin.Context) {
	var credentials app.LoginCredentials

	query := ctx.Request.URL.Query()
	strategy := query.Get("strategy")

	if strategy != ADMIN_STRATEGY && strategy != MANAGER_STRATEGY {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "bad strategy"})
		return
	}

	err := ctx.ShouldBindJSON(&credentials)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = validator.Validate(credentials)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var tokens *app.Tokens

	switch strategy {
	case ADMIN_STRATEGY:
		tokens, err = handlerRef.Login(credentials, strategy)
	case MANAGER_STRATEGY:
		tokens, err = handlerRef.Login(credentials, strategy)
	default:
		log.Fatalln("Unknown strategy")
	}

	if err != nil {
		if err == errors.Error401 {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "bad credentials"})
			return
		}

		if err == errors.Error404 {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "user with this login can not be found"})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, tokens)
}

func (handlerRef *handler) logout(ctx *gin.Context) {
	var tokens app.Tokens

	query := ctx.Request.URL.Query()
	strategy := query.Get("strategy")

	if strategy != ADMIN_STRATEGY && strategy != MANAGER_STRATEGY {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "bad strategy"})
		return
	}

	err := ctx.ShouldBindJSON(&tokens)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = validator.Validate(tokens)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	switch strategy {
	case ADMIN_STRATEGY:
		err = handlerRef.Logout(tokens.RefreshToken, strategy)
	case MANAGER_STRATEGY:
		err = handlerRef.Logout(tokens.RefreshToken, strategy)
	default:
		log.Fatalln("Unknown strategy")
	}

	if err != nil {
		if err == errors.Error404 {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "can not find this active refresh token"})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.Writer.WriteHeader(204)
}
