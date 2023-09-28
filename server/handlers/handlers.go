package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path"
)

// ------------------------------------------------------------
// Upload handler
// ------------------------------------------------------------
func HandleUpload(w http.ResponseWriter, r *http.Request) {

	fmt.Println("Chunk upload request received :")

	// Obtain shareId and Path from URL
	shareId := r.URL.Query().Get("shareId")
	if (shareId == "") {
		shareId = createShareDir(w, r)
		if (shareId == "") {
			fmt.Println(" Created share has no name (Error in share creation")
			return
		} else {
			fmt.Println(" New share created with id", shareId)
		}
	}
	
	sharePath := path.Join("data", "share", shareId)
	if _, err := os.Stat(sharePath); os.IsNotExist(err) {
		fmt.Println(" The share does not exist, creation is done from Home page. Canceling upload")
		return
	}

	err := r.ParseMultipartForm(1024 * 1024) // Limiting chunk size to 1MB
	if err != nil {
		fmt.Println(" Error parsing multipart form :")
		fmt.Println("  ", err)
		return
	}

	// Retrieve chunk file and file Name
	fileName := r.FormValue("fileName")
	fileChunk, _, err := r.FormFile("fileChunk")
	if err != nil {
		fmt.Println(" Error retrieving chunk file :")
		fmt.Println("  ", err)
		return
	}
	defer fileChunk.Close()

	tempFilePath := path.Join(sharePath, fileName)
	tempFile, err := os.OpenFile(tempFilePath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		fmt.Println(" Error opening or creating temp file :")
		fmt.Println("  ", err)
		return
	}
	defer tempFile.Close()

	_, err = io.Copy(tempFile, fileChunk)
	if err != nil {
		fmt.Println(" Error copying chunk file to temp file :")
		fmt.Println("  ", err)
		return
	}

	

	fmt.Println("Chunk uploaded!")


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
func createShareDir(w http.ResponseWriter, r *http.Request) string {

	fmt.Println("Share creation request received :")
	res, err := http.Get("https://random-word-api.herokuapp.com/word?number=2")
	if err != nil {
		fmt.Println(" Could not reach random word api :")
		fmt.Println("  ", err)
		return ""
	}
	defer res.Body.Close()

	// Decode JSON response
	var words []string
	err = json.NewDecoder(res.Body).Decode(&words)
	if err != nil {
		fmt.Println(err)
		return ""
	}

	// Build shareId from words
	shareId := words[0] + "-" + words[1]
	sharePath := path.Join("data", "share", shareId)

	// Check if share already exists
	if _, err := os.Stat(sharePath); !os.IsNotExist(err) {
		// If so, return error
		fmt.Println(" Share already exists")
		return ""
	}

	fmt.Println(" Creating share", shareId, "...")

	// Create share
	err = os.MkdirAll(sharePath, os.ModePerm)
	if err != nil {
		fmt.Println(err)
		return ""
	}

	fmt.Println("Share created!")
	return shareId
}
