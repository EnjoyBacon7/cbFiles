import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';

import CbFile from './CbFile';

export function CbShare() {
    return (
        <div className='mt-3'>
            <div>
                <Card>
                    <Card.Body className='text-center'>
                        <Row>
                            <Col xs='8' className='my-auto'>Drag and Drop your files here or...</Col>
                            <Col xs='4' className='my-auto'><Button variant='primary' className=''>Upload</Button></Col>
                        </Row>
                    </Card.Body>
                </Card>
            </div>
            <div>
                <Row>
                    <Col><CbFile fileName="test"/></Col>
                    <Col><CbFile /></Col>
                    <Col><CbFile /></Col>
                </Row>
            </div>
        </div>
    );
}

export default CbShare;