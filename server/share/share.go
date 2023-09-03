package share

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path"
)

func HandleUpload(w http.ResponseWriter, r *http.Request) {

	fmt.Println("Handling upload")
	switch r.Method {
	case "POST":
		err := r.ParseMultipartForm(10 << 20) // 10 MB
		if err != nil {
			fmt.Println(err)
			return
		}

		shareId := r.URL.Query().Get("shareId")
		sharePath := path.Join("data", "share", shareId)
		files := r.MultipartForm.File["files"]
		fmt.Println(files)
		for index, fileHeader := range files {
			file, err := fileHeader.Open()
			if err != nil {
				fmt.Println(err)
				return
			}
			defer file.Close()
			fmt.Println("Uploading file", index, "to", sharePath)

			// Create file
			out, err := os.Create(path.Join(sharePath, fileHeader.Filename))
			if err != nil {
				fmt.Println(err)
				return
			}
			defer out.Close()

			// Write file
			_, err = io.Copy(out, file)
			if err != nil {
				fmt.Println(err)
				return
			}

			fmt.Println("File uploaded!")
		}
	}
}

func HandleSearch(w http.ResponseWriter, r *http.Request) {

	fmt.Println("Handling search")
	switch r.Method {
	case "GET":
		shareId := r.URL.Query().Get("shareId")
		sharePath := path.Join("data", "share", shareId)

		if _, err := os.Stat(sharePath); !os.IsNotExist(err) {
			// Share exists

			// Return files in share as JSON
			files, err := os.ReadDir(sharePath)
			if err != nil {
				fmt.Println(err)
				return
			}

			var filesJSON []string
			for _, file := range files {
				filesJSON = append(filesJSON, file.Name())
			}

			responseData := map[string][]string{
				"files": filesJSON,
			}

			responseJSON, err := json.Marshal(responseData)
			if err != nil {
				fmt.Println(err)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			w.Write(responseJSON)
			fmt.Println("Share exists")
			return

		} else {

			// Return empty JSON array
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte("[]"))
			fmt.Println("Share does not exist")
			return
		}
	case "POST":
		fmt.Println("POST on /api/search not supported")
	}
}
