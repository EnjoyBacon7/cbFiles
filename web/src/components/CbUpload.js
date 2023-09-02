// System imports
import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// Upload component
export function CbUpload() {

    let shareId = useParams().shareId;

    const [dragActive, setDragActive] = useState(false);
    const ref = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave'){
            setDragActive(false);
        }
    }

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = [...e.dataTransfer.files];
            console.log(files);
            handleUpload(files);
        }
    }

    const handleClick = (e) => {
        ref.current.click();
    }

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            const files = [...e.target.files];
            console.log(files);
            handleUpload(files);
        }
    }

    const handleUpload = (files) => {
        console.log('/upload/share/' + shareId)
        files.forEach(file => {
            const data = new FormData();
            data.append('file', file);
            fetch('/api/share/' + shareId, {
                method: 'POST',
                body: data
            }).then(response => {
                console.log(response);
            }).catch(error => {
                console.log(error);
            });
        });
    }

    return (
        <div className='d-flex flex-column'>
            <Form className='d-flex flex-column' onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onSubmit={(e) => e.preventDefault()}>
                <input ref={ref} type='file' className='d-none' onChange={handleChange} multiple />
                <Button id='uploadDiv' variant={`${dragActive ? 'secondary' : 'outline-secondary'} p-5`} onClick={handleClick}>
                    Add Files Here
                </Button>
            </Form>
        </div>
    );
}

export default CbUpload;