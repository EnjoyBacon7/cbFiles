// -------------------------------------------------------------------------
// Root element called by App.js. Handles main views
// -------------------------------------------------------------------------

// System imports
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Local imports
import CbUpload from "../components/CbUpload";
import CbHeader from "../components/CbHeader";
import CbShareNav from "../components/CbShareNav";
import CbFiles from "../components/CbFiles";
import CbShareSearch from "../components/CbShareSearch";

// Root Component
export function CbRoot({ isHome }) {

    // Useful hooks
    const navigate = useNavigate();
    // Hooks if in share
    const [viewMode, setViewMode] = useState("list");
    const [fileInfo, setFileInfo] = useState([]);

    function loadFiles() {
        const shareId_forLoad = window.location.pathname.split('/')[2]; // Use useRef instead?
        var request = new XMLHttpRequest();
        request.open('GET', `/api/search?shareId=${shareId_forLoad}`, true);
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                var data = JSON.parse(this.response);
                if (data.exists) {
                    setFileInfo(data.files);
                } else {
                    // Put a warning toast here
                    navigate('/')
                }
            } else {
                // Put a warning toast here
                navigate('/')
            }
        }
        request.send();
    }

    useEffect(() => {
        if (!isHome) {
            setFileInfo([]);
            loadFiles();
        }
    }, [isHome]);

    return (
        <div>
            <CbHeader />
            <CbUpload loadFiles={loadFiles} />
            {isHome ?
                <CbShareSearch />
                :
                <div>
                    <CbShareNav changeViewMode={setViewMode} viewMode={viewMode} />
                    <CbFiles fileInfo={fileInfo} viewMode={viewMode} loadFiles={loadFiles} />
                </div>
            }
        </div>
    );
}

export default CbRoot;