package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/grigoryevandrey/logistics-app/services/initial/server"
)

func main() {
	message := server.Server()

	log.Println(message)

    http.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request){
        fmt.Fprint(w, message)
    })

	if err := http.ListenAndServe("0.0.0.0:8080", nil); err != nil {
        log.Fatal(err)
    }
}