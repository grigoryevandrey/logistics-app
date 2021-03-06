package transport

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	globalConstants "github.com/grigoryevandrey/logistics-app/backend/lib/constants"
	"github.com/grigoryevandrey/logistics-app/backend/lib/errors"
	"github.com/grigoryevandrey/logistics-app/backend/lib/middlewares/auth"
	"github.com/grigoryevandrey/logistics-app/backend/lib/middlewares/cors"
	jsonmw "github.com/grigoryevandrey/logistics-app/backend/lib/middlewares/json"
	"github.com/grigoryevandrey/logistics-app/backend/lib/middlewares/restrictions"
	"github.com/grigoryevandrey/logistics-app/backend/services/admins/app"
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
	router.Use(cors.CORSMiddleware())

	injectedHandler := &handler{service}

	superGroup := router.Group("api")

	{
		v1 := superGroup.Group("v1")
		{
			adminsGroup := v1.Group("admins")
			adminsGroup.Use(auth.AuthMiddleware())
			adminsGroup.Use(restrictions.RestrictionsMiddleware(globalConstants.MANAGER_ROLE))
			adminsGroup.Use(restrictions.RestrictionsMiddleware(globalConstants.ADMIN_ROLE_REGULAR))
			{
				adminsGroup.GET("/:id", injectedHandler.getAdmin)
				adminsGroup.GET("/", injectedHandler.getAdmins)
				adminsGroup.POST("/", injectedHandler.addAdmin)
				adminsGroup.PUT("/", injectedHandler.updateAdmin)
				adminsGroup.DELETE("/", injectedHandler.deleteAdmin)
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

func (handlerRef *handler) addAdmin(ctx *gin.Context) {
	var admin app.PostAdminDto

	err := ctx.ShouldBindJSON(&admin)

	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = validator.Validate(admin)

	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := handlerRef.AddAdmin(admin)

	if err != nil {
		log.Println(err)
		if err == errors.Error409 {
			ctx.JSON(http.StatusConflict, gin.H{"error": "user with this login already exists."})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, response)
}

func (handlerRef *handler) getAdmin(ctx *gin.Context) {
	id := ctx.Param("id")

	if id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "bad id param"})
		return
	}

	admin, err := handlerRef.GetAdmin(id)

	if err != nil {
		log.Println(err)
		if err == errors.Error404 {
			message := fmt.Sprintf("Can not find admin with id: %s", id)

			ctx.JSON(http.StatusNotFound, gin.H{"error": message})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, admin)
}

func (handlerRef *handler) getAdmins(ctx *gin.Context) {
	query := ctx.Request.URL.Query()

	limit, err := strconv.Atoi(query.Get("limit"))
	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "wrong limit param"})
		return
	}

	offset, err := strconv.Atoi(query.Get("offset"))
	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "wrong offset param"})
		return
	}

	if offset < 0 {
		offset = 0
	}

	if limit <= 0 {
		limit = 10
	}

	if limit > 100 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "limit param is too big"})
		return
	}

	sort := query.Get("sort")
	if sort == "" {
		sort = app.DEFAULT_SORTING_STRATEGY
	}

	sortString, ok := app.SortingStrategies[sort]

	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "bad sort param"})
		return
	}

	filter := query.Get("filter")
	if filter == "" {
		filter = app.DEFAULT_FILTERING_STRATEGY
	}

	filterString, ok := app.FilteringStrategies[filter]

	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "bad filter param"})
		return
	}

	admins, totalRows, err := handlerRef.GetAdmins(offset, limit, sortString, filterString)
	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"admins": admins, "count": len(admins), "totalRows": totalRows, "offset": offset})
}

func (handlerRef *handler) updateAdmin(ctx *gin.Context) {
	var admin app.UpdateAdminDto

	err := ctx.BindJSON(&admin)
	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = validator.Validate(admin)

	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := handlerRef.UpdateAdmin(admin)

	if err != nil {
		log.Println(err)
		if err == errors.Error404 {
			message := fmt.Sprintf("Can not find admin with id: %d", admin.Id)

			ctx.JSON(http.StatusNotFound, gin.H{"error": message})
			return
		}

		if err == errors.Error409 {
			message := fmt.Sprintf("User with login %s already exists.", admin.Login)
			ctx.JSON(http.StatusConflict, gin.H{"error": message})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, response)
}

func (handlerRef *handler) deleteAdmin(ctx *gin.Context) {
	query := ctx.Request.URL.Query()

	id, err := strconv.Atoi(query.Get("id"))

	if err != nil {
		log.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if id <= 0 {
		message := fmt.Sprintf("Id should be an int more than 0, recieved: %d", id)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": message})
		return
	}

	response, err := handlerRef.DeleteAdmin(id)

	if err != nil {
		log.Println(err)
		if err == errors.Error404 {
			message := fmt.Sprintf("Can not find admin with id: %d", id)

			ctx.JSON(http.StatusNotFound, gin.H{"error": message})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, response)
}
