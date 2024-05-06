// -------------------------------------------------------------------------
// Root element called by App.js. Handles main views
// -------------------------------------------------------------------------

// System imports
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

import { useNotification } from "../components/CbToastsContext";

// Local imports
import CbUpload from "../components/CbUpload";
import CbHeader from "../components/CbHeader";
import CbShareNav from "../components/CbShareNav";
import CbFiles from "../components/CbFiles";
import CbShareSearch from "../components/CbShareSearch";
import CbShareHistoryList from "../components/CbShareHistoryList";

// Root Component
export function CbRoot({ isHome }) {

    // Useful hooks
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    // Hooks if in share
    const [viewMode, setViewMode] = useState("list");
    const [fileInfo, setFileInfo] = useState([]);
    const [searchTerms, setSearchTerms] = useState(null);

    function loadFiles() {
        const shareId_forLoad = window.location.pathname.split('/')[2]; // Use useRef instead?

        fetch(`/api/search?shareId=${shareId_forLoad}`, {
            method: 'GET',
        }).then(response => response.json())
            .then(data => {
                if (data.exists) {
                    setFileInfo(data.files);
                } else {
                    // Put a warning toast here
                    addNotification(uuidv4(), 2, 0, "This share does not exist server-side.");
                    // Remove the share from local storage (if it exists)
                    var prevShares = JSON.parse(localStorage.getItem('recentShares')) || {};
                    delete prevShares[shareId_forLoad];
                    localStorage.setItem('recentShares', JSON.stringify(prevShares));
                    navigate('/')
                }
            })
            .catch((error) => {
                // Put a warning toast here
                navigate('/')
            });
    }

    useEffect(() => {
        if (!isHome) {
            setFileInfo([]);
            loadFiles();

            // Add this share to the list of previously accessed shares
            const shareId = window.location.pathname.split('/')[2];
            var prevShares = JSON.parse(localStorage.getItem('recentShares')) || {};
            console.log(prevShares);
            prevShares[shareId] = new Date().toISOString();
            console.log(prevShares);
            localStorage.setItem('recentShares', JSON.stringify(prevShares));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHome]);

    return (
        <div>
            <CbHeader />
            <CbUpload loadFiles={loadFiles} />
            {isHome ?
                <>
                    <CbShareSearch />
                    <CbShareHistoryList />
                </>
                :
                <div>
                    <CbShareNav changeViewMode={setViewMode} viewMode={viewMode} setSearchTerms={setSearchTerms} />
                    <CbFiles fileInfo={fileInfo} viewMode={viewMode} loadFiles={loadFiles} searchTerms={searchTerms} />
                </div>
            }
        </div>
    );
}

export default CbRoot;