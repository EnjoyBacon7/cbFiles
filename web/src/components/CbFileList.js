// System imports
import React from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

// Local imports
import isSupported from '../supportedFileTypes';

// File card component
export function CbFileList(props) {

    const downloadElement = document.createElement('a');

    const shareId = window.location.pathname.split('/')[2];
    var fileType;

    function handleIconPath() {
        const fileName = props.fileName;
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

    function handleDelete() {
        const fileName = props.fileName;
        fetch(`/api/delete?shareId=${shareId}&fileName=${fileName}`).then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            props.loadFiles();
        }).catch(error => {
            console.log(error);
        });
    }

    function handleDownload() {
        const fileName = props.fileName;
        fetch(`/api/download?shareId=${shareId}&fileName=${fileName}`).then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.blob();
        }).then(blob => {

            const blobUrl = window.URL.createObjectURL(blob);

            downloadElement.href = blobUrl;
            downloadElement.download = fileName;
            downloadElement.click();

            window.URL.revokeObjectURL(blobUrl);

        }).catch(error => {
            console.log(error);
        });
    }

    return (

        <InputGroup
            className='mt-2'
            style={{ flexWrap: 'nowrap' }}
        >
            <InputGroup.Text>
                <img src={handleIconPath()} alt='' width={35} />
            </InputGroup.Text>
            <InputGroup.Text className='flex-grow-1 overflow-hidden'>
                {props.fileName}
            </InputGroup.Text>
            <Button variant='outline-secondary' onClick={handleDownload}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    fill='currentColor'
                    className='bi bi-download'
                    viewBox='0 0 16 16'
                >
                    <path d='M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z' />
                    <path d='M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z' />
                </svg>
            </Button>
            <Button variant='outline-danger' onClick={handleDelete}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    fill='currentColor'
                    className='bi bi-trash'
                    viewBox='0 0 16 16'
                >
                    <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z' />
                    <path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z' />
                </svg>
            </Button>
        </InputGroup>
    );
}

export default CbFileList;