// System imports
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";

export function CbShareSearch() {

    // Useful hooks
    const [shareId, setShareId] = useState(useParams().shareId);
    const navigate = useNavigate();

    // Evaluate entered shareId
    function handleChange(e) {
        setShareId(e.target.value);
    }

    // Redirect on submit
    function handleRedirect() {
        fetch(`/api/share/${encodeURIComponent(shareId)}`)
        navigate(`/share/${encodeURIComponent(shareId)}`);
    }

    return (
        <Form className="mt-3" onChange={handleChange} onSubmit={handleRedirect}>
            <Form.Group>
                <Form.Control type="text" placeholder="Enter Share ID to Retrieve an Existing Share" />
            </Form.Group>
        </Form>
    )
}

export default CbShareSearch;