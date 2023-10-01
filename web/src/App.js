// System imports
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";

// Local imports
import CbRoot from './routes/CbRoot';
import ErrorPage from './routes/error-page';

import CbVersion from './components/CbVersion';
import { NotificationProvider } from './components/CbToastsContext';
import CbToastsContainer from './components/CbToastsContainer';

// Router Initialization
const router = createBrowserRouter([
  {
    path: "/",
    element: <CbRoot isHome={true} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/share/:shareId",
    element: <CbRoot isHome={false} />,
  }
]);

// Main App Component
function App() {

  return (
    <div className='mb-3'>
      <NotificationProvider>
        <Container fluid>
          <Row>
            <Col xs='1' lg='2'></Col>
            <Col xs='22' lg='8'>

              <RouterProvider router={router} />

            </Col>
            <Col xs='1' lg='2'></Col>
          </Row>
        </Container>
        <CbToastsContainer />
        <CbVersion />
      </NotificationProvider>
    </div>
  );
}

export default App;
