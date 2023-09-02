// Local imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CbUpload from "../components/CbUpload";
import Form from "react-bootstrap/Form";

// Root Component
export function CbRoot() {

    const [shareId, setShareId] = useState("");
    const navigate = useNavigate();

    function handleChange(e) {
        setShareId(e.target.value);
    }

    function handleRedirect() {
        navigate(`/share/${shareId}`);
    }


    return (
        <div>
            <CbUpload />
            <Form className="mt-3" onChange={handleChange} onSubmit={handleRedirect}>
                <Form.Group>
                    <Form.Control type="text" placeholder="Enter Share ID to Retrieve an Existing Share" />
                </Form.Group>
            </Form>
        </div>
    );
}

export default CbRoot;