package share

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path"
)

func HandleAPI(w http.ResponseWriter, r *http.Request) {

}

func HandleSearch(w http.ResponseWriter, r *http.Request) {
	
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

		return

	} else {

		// Return empty JSON array
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte("[]"))
		return
	}
}
