package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path"
)

// ------------------------------------------------------------
// Upload handler
// ------------------------------------------------------------
func HandleUpload(w http.ResponseWriter, r *http.Request) {

	fmt.Println("Upload request received :")

	// Parse data from request
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		fmt.Println(err)
		return
	}
	files := r.MultipartForm.File["files"]

	// Obtain shareId from URL
	shareId := r.URL.Query().Get("shareId")
	shareId, err = url.QueryUnescape(shareId)
	if err != nil {
		fmt.Println(err)
		return
	}

	if shareId == "undefined" {
		shareId = createShareDir(w, r)
		if shareId == "" {
			fmt.Println("Error creating share")
			return
		}
	}

	fmt.Println(" Order for", len(files), "files to", shareId)

	// Text manipulation to obtain path
	sharePath := path.Join("data", "share", shareId)

	// Check if share does not exist
	if _, err := os.Stat(sharePath); os.IsNotExist(err) {
		// If so, create the corresponding directory
		err := os.MkdirAll(sharePath, os.ModePerm)
		if err != nil {
			fmt.Println(err)
			return
		}
	}

	// Iterate through files Upload
	for index, fileHeader := range files {
		// Open file
		file, err := fileHeader.Open()
		if err != nil {
			fmt.Println(err)
			return
		}
		defer file.Close()

		fmt.Println(" Uploading file (", index, ") ...")
		fmt.Println("  Name:", fileHeader.Filename)

		// Create file at path location
		out, err := os.Create(path.Join(sharePath, fileHeader.Filename))
		if err != nil {
			fmt.Println(err)
			return
		}
		defer out.Close()

		// Copy file data into file
		_, err = io.Copy(out, file)
		if err != nil {
			fmt.Println(err)
			return
		}

		// Confirm file upload
		fmt.Println(" File uploaded!")
	}

	// Build response JSON (in case of a created share)
	responseData := map[string]interface{}{
		"shareId": shareId,
	}

	// Marshal response...
	responseJSON, err := json.Marshal(responseData)
	if err != nil {
		fmt.Println(err)
		return
	}

	// ...and send it
	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)

	fmt.Println("Upload complete!")

}

// ------------------------------------------------------------
// Share search handler
// ------------------------------------------------------------
func HandleSearch(w http.ResponseWriter, r *http.Request) {

	fmt.Println("Search request received :")

	// Obtain shareId and Path from URL
	shareId := r.URL.Query().Get("shareId")
	sharePath := path.Join("data", "share", shareId)

	fmt.Println(" Searching for share", shareId)

	// Check if file exists
	var filesJSON []string
	var responseData interface{}
	if _, err := os.Stat(sharePath); !os.IsNotExist(err) {
		// Share exists

		// Get files info
		files, err := os.ReadDir(sharePath)
		if err != nil {
			fmt.Println(err)
			return
		}

		fmt.Println(" Share exists with", len(files), "files")

		// Append file names to JSON array
		for _, file := range files {
			filesJSON = append(filesJSON, file.Name())
		}

		// If there are no files, set JSON array to empty string
		if len(filesJSON) == 0 {
			filesJSON = []string{}
		}

		// Build response JSON with "exists" flag
		responseData = map[string]interface{}{
			"exists": 1,
			"files":  filesJSON,
		}

	} else {
		// Share does not exist

		// Return empty JSON array with "exists" flag set to 0
		responseData = map[string]interface{}{
			"exists": 0,
			"files":  filesJSON,
		}

		fmt.Println(" Share does not exist")
	}

	// Marshal response...
	responseJSON, err := json.Marshal(responseData)
	if err != nil {
		fmt.Println(err)
		return
	}

	// ...and send it
	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)

	fmt.Println("Response sent!")
}

// ------------------------------------------------------------
// Share delete handler
// ------------------------------------------------------------
func HandleDelete(w http.ResponseWriter, r *http.Request) {

	fmt.Println("Delete request received :")

	// Obtain shareId and Path from URL
	shareId := r.URL.Query().Get("shareId")
	sharePath := path.Join("data", "share", shareId)

	// Obtain fileName and filePath from URL
	fileName := r.URL.Query().Get("fileName")
	filePath := path.Join(sharePath, fileName)

	fmt.Println(" Deleting file", fileName, "from share", shareId, "...")

	// Delete file
	err := os.Remove(filePath)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println("File deleted!")
}

// ------------------------------------------------------------
// Share download handler
// ------------------------------------------------------------
func HandleDownload(w http.ResponseWriter, r *http.Request) {

	fmt.Println("Download request received :")

	// Obtain shareId and Path from URL
	shareId := r.URL.Query().Get("shareId")
	sharePath := path.Join("data", "share", shareId)

	// Obtain fileName and filePath from URL
	fileName := r.URL.Query().Get("fileName")
	filePath := path.Join(sharePath, fileName)

	fmt.Println(" Downloading file", fileName, "from share", shareId, "...")

	// Open file
	file, err := os.Open(filePath)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer file.Close()

	// Get file info
	fileStat, err := file.Stat()
	if err != nil {
		fmt.Println(err)
		return
	}

	// Set headers for response...
	w.Header().Set("Content-Type", "application/octet-stream")
	w.Header().Set("Content-Disposition", "attachment; filename="+fileName)
	w.Header().Set("Content-Length", fmt.Sprint(fileStat.Size()))

	// ...and send it
	_, err = io.Copy(w, file)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println("File sent!")
}

// ------------------------------------------------------------
// Share creation
// ------------------------------------------------------------
func HandleCreate(w http.ResponseWriter, r *http.Request) {

	fmt.Println("Share creation request received :")

	// Obtain shareId and Path from URL
	shareId := r.URL.Query().Get("shareId")
	sharePath := path.Join("data", "share", shareId)

	fmt.Println(" Creating share", shareId, "...")

	// Create share
	err := os.MkdirAll(sharePath, os.ModePerm)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println("Share created!")
}
