package main

import (
	"fmt"
	"io/fs"
	"net/http"
	"os"
	"strings"

	"github.com/EnjoyBacon7/cbFiles/server/share"
)

type hookedResponseWriter struct {
	http.ResponseWriter
	got404 bool
}

func (hrw *hookedResponseWriter) WriteHeader(status int) {
	fmt.Println("WriteHeader")
	if status == http.StatusNotFound {
		// Don't actually write the 404 header, just set a flag.
		hrw.got404 = true
	} else {
		hrw.ResponseWriter.WriteHeader(status)
	}
}

func (hrw *hookedResponseWriter) Write(p []byte) (int, error) {
	fmt.Println("Write")
	if hrw.got404 {
		// No-op, but pretend that we wrote len(p) bytes to the writer.
		return len(p), nil
	}

	return hrw.ResponseWriter.Write(p)
}

func intercept404(handler, on404 http.Handler) http.Handler {
	fmt.Println("intercept404")
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hookedWriter := &hookedResponseWriter{ResponseWriter: w}
		handler.ServeHTTP(hookedWriter, r)

		if hookedWriter.got404 {
			on404.ServeHTTP(w, r)
		}
	})
}

func serveFileContents(file string, files http.FileSystem) http.HandlerFunc {
	fmt.Println("serveFileContents")
	return func(w http.ResponseWriter, r *http.Request) {
		// Restrict only to instances where the browser is looking for an HTML file
		if !strings.Contains(r.Header.Get("Accept"), "text/html") {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprint(w, "404 not found")

			return
		}

		// Open the file and return its contents using http.ServeContent
		index, err := files.Open(file)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprintf(w, "%s not found", file)

			return
		}

		fi, err := index.Stat()
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprintf(w, "%s not found", file)

			return
		}

		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		http.ServeContent(w, r, fi.Name(), fi.ModTime(), index)
	}
}

func main() {
	var frontend fs.FS = os.DirFS("./web/build")
	httpFS := http.FS(frontend)
	fileServer := http.FileServer(httpFS)
	serveIndex := serveFileContents("index.html", httpFS)

	http.HandleFunc("/api/search", share.HandleSearch)
	http.HandleFunc("/api/upload", share.HandleUpload)
	http.HandleFunc("/api/delete", share.HandleDelete)
	http.HandleFunc("/api/download", share.HandleDownload)
	http.Handle("/", intercept404(fileServer, serveIndex))

	http.ListenAndServe(":8080", nil)
}
