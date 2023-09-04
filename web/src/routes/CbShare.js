// System imports
import React, { useState } from 'react';

// Local imports
import CbUpload from '../components/CbUpload';
import CbFiles from '../components/CbFiles';
import CbHeader from '../components/CbHeader';
import CbShareNav from '../components/CbShareNav';

// Share instance component
export function CbShare() {

    const [filesReloaded, setFilesReloaded] = useState(false);
    const [viewMode, setViewMode] = useState("list");

    function reloadCbFilescomponent() {
        setFilesReloaded(!filesReloaded);
    }

    function changeViewMode(mode) {
        setViewMode(mode);
    }

    return (
        <div>
            <CbHeader />
            <CbUpload reloadCbFilescomponent={reloadCbFilescomponent} />
            <CbShareNav changeViewMode={changeViewMode} viewMode={viewMode} />
            <CbFiles key={filesReloaded} viewMode={viewMode} />
        </div>
    );
}

export default CbShare;