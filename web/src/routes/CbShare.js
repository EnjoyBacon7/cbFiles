// System imports
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';

// Local imports
import CbUpload from '../components/CbUpload';
import CbFile from '../components/CbFile';

// Share instance component
export function CbShare() {
    return (
        <div className='mt-3'>
            <CbUpload />
            <div>
                <Row className='justify-content-center'>
                    <Col lg={4}><CbFile fileName='test'/></Col>
                    <Col lg={4}><CbFile /></Col>
                    <Col lg={4}><CbFile/></Col>
                    <Col lg={4}><CbFile /></Col>
                    <Col lg={4}><CbFile/></Col>
                    <Col lg={4}><CbFile /></Col>
                    <Col lg={4}><CbFile/></Col>
                    <Col lg={4}><CbFile /></Col>
                    <Col lg={4}><CbFile/></Col>
                    <Col lg={4}><CbFile /></Col>
                    <Col lg={4}><CbFile/></Col>
                    <Col lg={4}><CbFile /></Col>
                    <Col lg={4}><CbFile/></Col>
                    <Col lg={4}><CbFile /></Col>
                    <Col lg={4}><CbFile/></Col>
                    <Col lg={4}><CbFile /></Col>
                    <Col lg={4}><CbFile /></Col>
                </Row>
            </div>
        </div>
    );
}

export default CbShare;