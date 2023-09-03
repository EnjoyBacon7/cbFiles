// System imports
import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';

// Local imports
import CbUpload from '../components/CbUpload';
import CbFile from '../components/CbFile';
import CbHeader from '../components/CbHeader';

// Share instance component
export function CbShare() {

    const [components, setComponents] = useState([]);
    const shareId = window.location.pathname.split('/')[2];

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
            for (let i = 0; i < files.length; i++) {
                const newComponents = files.map((item) => (
                    <Col className="mt-3" lg={4} key={item.id}>
                        <CbFile fileName={item} loadFiles={loadFiles} />
                    </Col>
                    ));
                setComponents(newComponents);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        loadFiles();
    }, []);

    return (
        <div>
            <CbHeader />
            <CbUpload loadFiles={loadFiles}/>
            <div>
                <Row className='justify-content-center'>
                    {components}
                </Row>
            </div>
        </div>
    );
}

export default CbShare;