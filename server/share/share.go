package share

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
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
		fmt.Println(shareId)
		shareId, err = url.QueryUnescape(shareId)
		if err != nil {
			fmt.Println(err)
			return
		}
		sharePath := path.Join("data", "share", shareId)
		files := r.MultipartForm.File["files"]
		fmt.Println(files)

		if _, err := os.Stat(sharePath); os.IsNotExist(err) {
			// Share does not exist
			// Create share
			err := os.MkdirAll(sharePath, os.ModePerm)
			if err != nil {
				fmt.Println(err)
				return
			}
		}

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

func HandleDelete(w http.ResponseWriter, r *http.Request) {

	fmt.Println("Handling delete")
	shareId := r.URL.Query().Get("shareId")
	sharePath := path.Join("data", "share", shareId)

	fileName := r.URL.Query().Get("fileName")
	filePath := path.Join(sharePath, fileName)

	// Delete file
	err := os.Remove(filePath)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println("Share deleted!")
}

func HandleDownload(w http.ResponseWriter, r *http.Request) {

	fmt.Println("Handling download")
	shareId := r.URL.Query().Get("shareId")
	sharePath := path.Join("data", "share", shareId)

	fileName := r.URL.Query().Get("fileName")
	filePath := path.Join(sharePath, fileName)

	// Open file
	file, err := os.Open(filePath)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer file.Close()

	// Get file size
	fileStat, err := file.Stat()
	if err != nil {
		fmt.Println(err)
		return
	}

	// Set headers
	w.Header().Set("Content-Type", "application/octet-stream")
	w.Header().Set("Content-Disposition", "attachment; filename="+fileName)
	w.Header().Set("Content-Length", fmt.Sprint(fileStat.Size()))

	// Send file
	_, err = io.Copy(w, file)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println("File sent!")
}
