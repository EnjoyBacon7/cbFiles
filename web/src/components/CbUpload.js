// System imports
import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// Upload component
export function CbUpload({ loadFiles }) {

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

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = [...e.dataTransfer.files];
            handleUpload(files);
        }
    }

    const handleClick = (e) => {
        ref.current.click();
        if (e.target.files && e.target.files.length > 0) {
            const files = [...e.target.files];
            handleUpload(files);
        }
    }

    const handleChange = (e) => {
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
        fetch('/api/upload?shareId=' + encodeURIComponent(shareId), {
            method: 'POST',
            body: data
        }).then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        }).then(data => {
        }).catch(error => {
            console.log(error);
        });
    }

    return (
        <div className='d-flex flex-column mt-3 test-primary'>
            <Form className='d-flex flex-column' onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleSubmit} onSubmit={(e) => e.preventDefault()}>
                <input ref={ref} type='file' className='d-none' onChange={handleChange} multiple />
                <Button id='uploadDiv' variant={`${dragActive ? 'secondary' : 'outline-secondary'} p-5`} onClick={handleClick}>
                    Drag and drop files here
                </Button>
            </Form>
        </div>
    );
}

export default CbUpload;