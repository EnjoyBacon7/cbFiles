// System imports
import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';

// Upload component
export function CbUpload({ loadFiles }) {

    const navigate = useNavigate();

    let shareId = useParams().shareId;

    const [dragActive, setDragActive] = useState(false);
    const ref = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }

    const handleClick = (e) => {
        ref.current.click();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = [...e.dataTransfer.files];
            handleUpload(files);
        }
    }

    const handleChange = (e) => {
        console.log(ref)
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            const files = [...e.target.files];
            handleUpload(files);
        }
    }

    const handleUpload = (files) => {
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('files', files[i]);
        }
        var request = new XMLHttpRequest();
        request.open('POST', `/api/upload?shareId=${encodeURIComponent(shareId)}`, true);
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                var responseText = JSON.parse(this.response);
                if (responseText.shareId === shareId) {
                    loadFiles();
                } else {
                    // Put a warning toast here
                    navigate('/')
                }
            } else {
                console.log(`Error during upload. Please check your internet connexion and upload file size (< 50MB) ${request.status}`);
            }
        }
        request.send(data);
    }

    return (
        <div className='d-flex flex-column mt-3 test-primary'>
            <Form className='d-flex flex-column' onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleSubmit} onSubmit={(e) => {e.preventDefault()}}>
                <input ref={ref} type='file' className='d-none' onChange={handleChange} multiple />
                <Button id='uploadDiv' variant={`${dragActive ? 'secondary' : 'outline-secondary'} p-5`} onClick={handleClick}>
                    Drag and drop files here
                </Button>
            </Form>
        </div>
    );
}

export default CbUpload;