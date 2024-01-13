// System imports
import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// Local imports
import { useNotification } from './CbToastsContext';

// Upload component
export function CbUpload({ loadFiles }) {

    // Importing hooks
    const { addNotification } = useNotification();
    const navigate = useNavigate();

    // Getting shareId from url
    let shareId = useParams().shareId;

    // Setting up states
    const [dragActive, setDragActive] = useState(false);
    const ref = useRef(null);


    // Outline color of upload div
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }

    // On drop, upload files
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = [...e.dataTransfer.files];
            handleUpload(files);
        }
    }

    // Simulate click on input file
    const handleClick = (e) => {
        ref.current.value = null;
        ref.current.click();
    }

    // On click, upload files
    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            const files = [...e.target.files];
            handleUpload(files);
        }
    }

    // Set chunk size limit: 1MB
    const chunkSize = 1024 * 1024;

    const uploadFile = (file, start, end, callback, uploadId) => {

        // Ceate form data using chunk info and shareId
        const chunk = file.slice(start, end);
        const data = new FormData();
        data.append('fileName', file.name);
        data.append('fileChunk', chunk);
        data.append('shareId', shareId);

        let lastChunkSent = false;
        // Create request and send it
        var request = new XMLHttpRequest();
        request.open('POST', `/api/upload?shareId=${encodeURIComponent(shareId)}`, true);
        request.onreadystatechange = function () {
            if (request.status >= 200 && request.status < 400) {
                addNotification(uploadId, 1, start / file.size * 100);
                start = end;
                end = Math.min(end + chunkSize, file.size);
                if (start !== end && !lastChunkSent) {
                    uploadFile(file, start, end, callback, uploadId)
                }
                if (start === end && !lastChunkSent) {
                    callback();
                }
                lastChunkSent = true
            } else {
                console.log(`Error during upload of file ` + file.name + `. Please check your connection to the sever. err : ${request.status}`);
            }
        }
        request.send(data);
    }

    const handleUpload = (files) => {

        let uploadId = uuidv4();

        const uploadNextFile = () => {
            if (files.length > 0) {
                let start = 0;
                let end = Math.min(chunkSize, files[0].size);

                uploadFile(files.pop(), start, end, () => {
                    loadFiles(); // Load files after each file is uploaded
                    uploadNextFile(); // Upload the next file
                }, uploadId);
            }
        };

        if(shareId === undefined) {
            // Send a request to create a new share
            var request = new XMLHttpRequest();
            request.open('POST', `/api/create`, true);
            request.onload = function () {
                if (request.status >= 200 && request.status < 400) {
                    var data = JSON.parse(this.response);
                    shareId = data.shareId;
                    navigate(`/share/${shareId}`);
                    uploadNextFile();
                } else {
                    // Put a warning toast here
                    navigate('/')
                }
            }
            request.send();
        } else {
            // Start uploading the first file
            uploadNextFile();
        }
    };

    return (
        <div className='d-flex flex-column mt-3 test-primary'>
            <Form className='d-flex flex-column' onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onSubmit={(e) => { e.preventDefault() }}>
                <input ref={ref} type='file' className='d-none' onChange={handleChange} multiple />
                <Button id='uploadDiv' variant={`${dragActive ? 'secondary' : 'outline-secondary'} p-5`} onClick={handleClick}>
                    Drag and drop files here
                </Button>
            </Form>
        </div>
    );
}


export default CbUpload;