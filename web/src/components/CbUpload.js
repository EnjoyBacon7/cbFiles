// System imports
import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';

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

    let start = 0;
    let end = 0;

    const uploadFile = (file, start, end) => {
        return new Promise((resolve, reject) => {

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
                    addNotification('Uploading ' + file.name, start / file.size * 100);
                    start = end;
                    end = Math.min(end + chunkSize, file.size);
                    if (start != end && !lastChunkSent) {
                        uploadFile(file, start, end)
                            .then(resolve)
                            .catch(reject);
                    } else {
                        resolve();
                    }
                    lastChunkSent = true
                } else {
                    console.log(`Error during upload. Please check your connection to the sever. err : ${request.status}`);
                    reject(request.status);
                }
            }
            request.send(data);
        });
    }

    const handleUpload = async (files) => {
        for (const file of files) {
            let start = 0;
            let end = Math.min(chunkSize, file.size);
    
            try {
                await uploadFile(file, start, end);
                loadFiles();
            } catch (error) {
                // Handle the error, e.g., retry or show a message
                console.error('An error occurred:', error);
            }
        }
    }

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