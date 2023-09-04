// System imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Local imports
import CbRoot from './routes/CbRoot';
import ErrorPage from './routes/error-page';
import CbShare from './routes/CbShare';

// Router Initialization
const router = createBrowserRouter([
  {
    path: "/",
    element: <CbRoot />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/share/:shareId",
    element: <CbShare />,
  }
]);

// Main App Component
function App() {
  return (
    <Container fluid>
      <Row>
        <Col xs='1' lg='2'></Col>
        <Col xs='22' lg='8'>

          <RouterProvider router={router} />

        </Col>
        <Col xs='1' lg='2'></Col>
      </Row>
    </Container>
  );
}

export default App;
