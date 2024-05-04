package main

import (
	"fmt"
	"net/http"

	// Importing web package
	// Importing handlers package
	"github.com/EnjoyBacon7/cbFiles/server/handlers"
)

// ------------------------------------------------------------
// Main Go Routing Logic
// ------------------------------------------------------------

func main() {

	http.HandleFunc("/api/search", handlers.HandleSearch)
	http.HandleFunc("/api/upload", handlers.HandleUpload)
	http.HandleFunc("/api/create", handlers.HandleCreate)
	http.HandleFunc("/api/delete", handlers.HandleDelete)
	http.HandleFunc("/api/download", handlers.HandleDownload)
	// Handle any other request by serving the static file
	http.Handle("/", http.FileServer(http.Dir("web/build")))

	fmt.Println("Starting server on port 8080")
	http.ListenAndServe(":8080", nil)
}
