package web

import (
	"embed"
	"io/fs"
	"os"
)

//go:embed build
var Embedded_reactApp embed.FS

func GetUiFs() fs.FS {
	//embedRoot, err := fs.Sub(EMBED_UI, "ui")
	embedRoot, err := fs.Sub(Embedded_reactApp, "build")
	if err != nil {
		os.Exit(1)
	}
	return embedRoot
	// return http.FileServer(http.FS(embedRoot))
}