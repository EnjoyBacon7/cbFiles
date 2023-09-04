import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import CbFileGallery from "./CbFileGallery";
import CbFileList from "./CbFileList";

export function CbFiles({ key, viewMode }) {

    const shareId = window.location.pathname.split('/')[2];
    const [components, setComponents] = useState([]);

    function loadFiles() {
        setComponents([]);
        console.log("loading files")
        fetch(`/api/search?shareId=${shareId}`).then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        }).then(data => {
            const files = data.files;
            console.log(viewMode)
            if (viewMode === "gallery") {
                console.log("testGallery")
                for (let i = 0; i < files.length; i++) {
                    const newComponents = files.map((item) => (
                        <Col className="mt-3" lg={4} key={item.id}>
                            <CbFileGallery fileName={item} loadFiles={loadFiles} />
                        </Col>
                    ));
                    setComponents(
                        <Row className='justify-content-center'>
                            {newComponents}
                        </Row>
                    );
                }
            } else if (viewMode === "list") {
                console.log("testList")
                for (let i = 0; i < files.length; i++) {
                    const newComponents = files.map((item) => (
                        <CbFileList fileName={item} loadFiles={loadFiles} />
                    ));
                    setComponents(
                        <div className="pt-2">
                            {newComponents}
                        </div>
                    );
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        loadFiles();
    }, [viewMode]);

    return (
        <div>
            {components}
        </div>
    );
}
export default CbFiles;