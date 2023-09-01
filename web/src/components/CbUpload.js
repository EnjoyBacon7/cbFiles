// System imports
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// Upload component
export function CbUpload() {
    return (
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
    );
}

export default CbUpload;