import CbShare from './components/CbShare';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './App.css';

function App() {
  return (
    <Container>
      <Row>
        <Col></Col>
        <Col xs='6'>
          <CbShare />
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

export default App;
