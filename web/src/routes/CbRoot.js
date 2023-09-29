// System imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";

// Local imports
import CbUpload from "../components/CbUpload";
import CbHeader from "../components/CbHeader";

// Root Component
export function CbRoot() {

    // Useful hooks
    const [shareId, setShareId] = useState("");
    const navigate = useNavigate();

    // Evaluate entered shareId
    function handleChange(e) {
        setShareId(e.target.value);
    }

    // Redirect on submit
    function handleRedirect() {
        navigate(`/share/${encodeURIComponent(shareId)}`);
    }

    // Load files placeholder to quiet warnings
    function loadFilesPlaceHolder() {}

    return (
        <div>
            <CbHeader />
            <CbUpload loadFiles={loadFilesPlaceHolder}/>
            <Form className="mt-3" onChange={handleChange} onSubmit={handleRedirect}>
                <Form.Group>
                    <Form.Control type="text" placeholder="Enter Share ID to Retrieve an Existing Share" />
                </Form.Group>
            </Form>
        </div>
    );
}

export default CbRoot;