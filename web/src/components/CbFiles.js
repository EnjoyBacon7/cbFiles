// System imports
import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

// Local imports
import isSupported from '../supportedFileTypes';
import InputGroup from 'react-bootstrap/InputGroup';

// ------------------------------------------------------------------
// Files card parent component
// ------------------------------------------------------------------
export function CbFiles({ fileInfo, viewMode, loadFiles }) {

    const [components, setComponents] = useState([]);

    useEffect(() => {
        if (viewMode === "gallery") {
            const newComponents = fileInfo.map((item) => (
                <CbFileGallery fileName={item} loadFiles={loadFiles} />
            ));

            setComponents(
                <Row className='justify-content-center'>
                    {newComponents}
                </Row>
            );
        } else if (viewMode === "list") {
            const newComponents = fileInfo.map((item) => (
                <CbFileList fileName={item} loadFiles={loadFiles} />
            ));
            setComponents(
                <div className="pt-2">
                    {newComponents}
                </div>
            );
        }

    }, [fileInfo, viewMode, loadFiles]);

    return (
        <div>
            {components}
        </div>
    );
}
export default CbFiles;

// ------------------------------------------------------------------
// List style file component
// ------------------------------------------------------------------
function CbFileList(props) {

    const shareId = window.location.pathname.split('/')[2];

    return (

        <InputGroup
            className='mt-2'
            style={{ flexWrap: 'nowrap' }}
        >
            <InputGroup.Text>
                <img src={handleIconPath(props.fileName)} alt='' width={30} />
            </InputGroup.Text>
            <InputGroup.Text className='flex-grow-1 overflow-hidden'>
                {props.fileName}
            </InputGroup.Text>
            <Button variant='outline-secondary' onClick={() => handleDownload(shareId, props.fileName)}>
                <DownloadSVG />
            </Button>
            <Button variant='outline-danger' onClick={() => handleDelete(shareId, props.fileName, props.loadFiles)}>
                <DeleteSVG />
            </Button>
        </InputGroup>
    );
}




// ------------------------------------------------------------------
// Gallery style file card component
// ------------------------------------------------------------------
function CbFileGallery(props) {

    const [isShown, setIsShown] = useState(false);
    const shareId = window.location.pathname.split('/')[2];

    return (
        <Col className="mt-3" lg={4}>
            <Card
                className="text-center pt-3 pb-3 ps-0 pe-0"
                onMouseEnter={() => setIsShown(true)}
                onMouseLeave={() => setIsShown(false)}>
                <Card.Body>
                    <Image src={handleIconPath(props.fileName)} width={150} />
                    <Card.Title className="m-0">{props.fileName}</Card.Title>
                </Card.Body>
                {isShown && (
                    <div className='position-absolute top-0 end-0 m-2'>
                        <ButtonGroup>
                            <Button variant='outline-secondary' onClick={() => handleDownload(shareId, props.fileName)}>
                                <DownloadSVG />
                            </Button>
                            <Button variant='outline-danger' onClick={() => handleDelete(shareId, props.fileName, props.loadFiles)}>
                                <DeleteSVG />
                            </Button>
                        </ButtonGroup>
                    </div>
                )}
            </Card>
        </Col>
    );
}

// ------------------------------------------------------------------
// General File functions
// ------------------------------------------------------------------

const downloadElement = document.createElement('a');
const shareId = window.location.pathname.split('/')[2];
var fileType;

function handleIconPath(fileName) {
    if (fileName && fileName.includes('.')) {
        fileType = fileName.split('.').slice(-1);
        fileType = fileType[0];
    } else {
        return '../fileIcons/file.png';
    }
    if (isSupported(fileType)) {
        return `../fileIcons/${fileType}.png`;
    } else {
        return '../fileIcons/file.png';
    }
}

function handleDelete(shareId, fileName, loadFiles) {
    var request = new XMLHttpRequest();
    request.open('DELETE', `/api/delete?shareId=${encodeURIComponent(shareId)}&fileName=${encodeURIComponent(fileName)}`, true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            loadFiles();
        } else {
            console.log(`Network response was not ok ${request.status}`);
        }
    }
    request.send();
}

function handleDownload(shareId, fileName) {
    var request = new XMLHttpRequest();
    request.open('GET', `/api/download?shareId=${encodeURIComponent(shareId)}&fileName=${encodeURIComponent(fileName)}`, true);
    request.responseType = 'blob';
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            const blob = request.response;
            const blobUrl = window.URL.createObjectURL(blob);

            downloadElement.href = blobUrl;
            downloadElement.download = fileName;
            downloadElement.click();

            window.URL.revokeObjectURL(blobUrl);
        } else {
            console.log(`Network response was not ok ${request.status}`);
        }
    }
    request.send();
}

function DownloadSVG() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-download"
            viewBox="0 0 16 16"
        >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
        </svg>
    )
}

function DeleteSVG() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-trash"
            viewBox="0 0 16 16"
        >
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
        </svg>
    )
}