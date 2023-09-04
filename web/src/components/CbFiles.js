import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState, useEffect } from "react";

import CbFileGallery from "./CbFileGallery";
import CbFileList from "./CbFileList";

export function CbFiles({ fileInfo, viewMode, loadFiles }) {

    const [components, setComponents] = useState([]);

    useEffect(() => {
            if (viewMode === "gallery") {
                for (let i = 0; i < fileInfo.length; i++) {
                    const newComponents = fileInfo.map((item) => (
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
                for (let i = 0; i < fileInfo.length; i++) {
                    const newComponents = fileInfo.map((item) => (
                        <CbFileList fileName={item} loadFiles={loadFiles} />
                    ));
                    setComponents(
                        <div className="pt-2">
                            {newComponents}
                        </div>
                    );
                }
            }
            
    }, [fileInfo, viewMode, loadFiles]);

    return (
        <div>
            {components}
        </div>
    );
}
export default CbFiles;