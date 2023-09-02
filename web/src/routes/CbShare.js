// System imports
import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';

// Local imports
import CbUpload from '../components/CbUpload';
import CbFile from '../components/CbFile';

// Share instance component
export function CbShare() {

    const [components, setComponents] = useState([]);
    const shareId = window.location.pathname.split('/')[2];

    useEffect(() => {
        fetch(`/api?shareId=${shareId}`).then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        }).then(data => {
            const files = data.files;
            console.log(files, files.length);
            for (let i = 0; i < files.length; i++) {
                const newComponents = files.map((item) => (
                    <Col className="mt-3" lg={4} key={item.id}>
                        <CbFile fileName={item} />
                    </Col>
                    ));
                setComponents(newComponents);
            }
        }).catch(error => {
            console.log(error);
        });
    }, [shareId]);

    return (
        <div>
            <CbUpload />
            <div>
                <Row className='justify-content-center'>
                    {components}
                </Row>
            </div>
        </div>
    );
}

export default CbShare;