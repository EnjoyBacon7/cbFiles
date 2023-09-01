import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';

export function CbShare() {
    return(
        <div className='mt-3'>
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

export default CbShare;