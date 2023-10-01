// System imports
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Form from "react-bootstrap/Form";

// Local imports
import CbUpload from "../components/CbUpload";
import CbHeader from "../components/CbHeader";
import CbShareNav from "../components/CbShareNav";
import CbFiles from "../components/CbFiles";

// Root Component
export function CbRoot( { isHome } ) {

    // Useful hooks
    const [shareId, setShareId] = useState(useParams().shareId);
    console.log(shareId)
    console.log(isHome)
    const navigate = useNavigate();
    // Hooks if in share
    const [viewMode, setViewMode] = useState("list");
    const [fileInfo, setFileInfo] = useState([]);

    // Evaluate entered shareId
    function handleChange(e) {
        setShareId(e.target.value);
    }

    // Redirect on submit
    function handleRedirect() {
        navigate(`/share/${encodeURIComponent(shareId)}`);
    }

    function loadFiles() {
        const shareId_forLoad = window.location.pathname.split('/')[2]; // Use useRef instead?
        console.log("loadFiles")
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
        console.log("useEffect")
    }, [isHome]);

    return (
        <div>
            <CbHeader />
            <CbUpload loadFiles={loadFiles} />
            {isHome ?
                <Form className="mt-3" onChange={handleChange} onSubmit={handleRedirect}>
                    <Form.Group>
                        <Form.Control type="text" placeholder="Enter Share ID to Retrieve an Existing Share" />
                    </Form.Group>
                </Form>
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