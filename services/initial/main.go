package main

import (
	"log"

	"github.com/grigoryevandrey/logistics-app/services/initial/server"
)

func main() {
	log.Println("Setting proxy server port", server.Server())
}