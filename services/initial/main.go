package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/grigoryevandrey/logistics-app/services/initial/server"
)

func main() {
	log.Println("Init")

	http.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, server.Server())
	})

	log.Println("Created endpoint")
	log.Println("Trying")

	fmt.Println("Var11:", os.Getenv("var1"))

	http.HandleFunc("/hi", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("hi")
		fmt.Fprintf(w, "Hi")
	})

	log.Println("Starting")
	log.Fatal(http.ListenAndServe("0.0.0.0:8080", nil))
}
