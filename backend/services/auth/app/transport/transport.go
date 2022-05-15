package transport

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/grigoryevandrey/logistics-app/backend/lib/errors"
	"github.com/grigoryevandrey/logistics-app/backend/lib/middlewares/auth"
	jsonmw "github.com/grigoryevandrey/logistics-app/backend/lib/middlewares/json"
	"github.com/grigoryevandrey/logistics-app/backend/services/auth/app"
	"github.com/grigoryevandrey/logistics-app/backend/services/auth/app/constants"
	"gopkg.in/validator.v2"
)

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
			authGroupPublic := v1.Group("auth")
			authGroupPrivate := v1.Group("auth")

			authGroupPrivate.Use(auth.AuthMiddleware())
			{
				authGroupPublic.POST("/login", injectedHandler.login)
				authGroupPublic.PUT("/refresh", injectedHandler.refresh)
				authGroupPrivate.DELETE("/logout", injectedHandler.logout)
			}

			healthGroup := v1.Group("health")
			{
				healthGroup.GET("/", injectedHandler.health)
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

	if strategy != constants.ADMIN_STRATEGY && strategy != constants.MANAGER_STRATEGY {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "bad strategy"})
		return
	}

	err := ctx.ShouldBindJSON(&credentials)

	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = validator.Validate(credentials)

	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tokens, err := handlerRef.Login(credentials, strategy)

	if err != nil {
		log.Println(err)
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

func (handlerRef *handler) refresh(ctx *gin.Context) {
	query := ctx.Request.URL.Query()
	strategy := query.Get("strategy")

	if strategy != constants.ADMIN_STRATEGY && strategy != constants.MANAGER_STRATEGY {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "bad strategy"})
		return
	}

	authHeader := ctx.Request.Header.Get("Authorization")

	splittedAuthHeader := strings.Fields(authHeader)
	if len(splittedAuthHeader) < 2 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "bad auth header"})
		return
	}

	refreshToken := splittedAuthHeader[1]

	tokens, err := handlerRef.Refresh(refreshToken, strategy)

	if err != nil {
		log.Println(err)
		if err == errors.Error401 {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "bad credentials"})
			return
		}

		if err == errors.Error404 {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "can not find this refresh token"})
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

	if strategy != constants.ADMIN_STRATEGY && strategy != constants.MANAGER_STRATEGY {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "bad strategy"})
		return
	}

	err := ctx.ShouldBindJSON(&tokens)

	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = validator.Validate(tokens)

	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	switch strategy {
	case constants.ADMIN_STRATEGY:
		err = handlerRef.Logout(tokens.RefreshToken, strategy)
	case constants.MANAGER_STRATEGY:
		err = handlerRef.Logout(tokens.RefreshToken, strategy)
	default:
		log.Fatalln("Unknown strategy")
	}

	if err != nil {
		log.Println(err)
		if err == errors.Error404 {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "can not find this active refresh token"})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.Writer.WriteHeader(204)
}
