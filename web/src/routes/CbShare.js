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
        fetch(`/api/search?shareId=${shareId}`).then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        }).then(data => {
            console.log(data);
            if (data.exists) {
                setFileInfo(data.files);
            } else {
                createShare();
            }
            
        }).catch(error => {
            console.log(error);
        });
    }

    function createShare() {
        fetch(`/api/create?shareId=${shareId}`).then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            loadFiles();
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