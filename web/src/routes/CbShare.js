// System imports
import React, { useEffect, useState } from 'react';

// Local imports
import CbUpload from '../components/CbUpload';
import CbFiles from '../components/CbFiles';
import CbHeader from '../components/CbHeader';
import CbShareNav from '../components/CbShareNav';

// Share instance component
export function CbShare() {

    const shareId = window.location.pathname.split('/')[2];

    const [viewMode, setViewMode] = useState("list");
    const [fileInfo, setFileInfo] = useState([]);

    function loadFiles() {
        console.log("loading files")
        fetch(`/api/search?shareId=${shareId}`).then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        }).then(data => {
            setFileInfo(data.files)
            console.log(fileInfo)
            
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        loadFiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <CbHeader />
            <CbUpload loadFiles={loadFiles} />
            <CbShareNav changeViewMode={setViewMode} viewMode={viewMode} />
            <CbFiles fileInfo={fileInfo} viewMode={viewMode} loadFiles={loadFiles} />
        </div>
    );
}

export default CbShare;