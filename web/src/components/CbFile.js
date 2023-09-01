import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

export function CbFile(props) {
    return(
        <div className="mt-3">
            <Card>
                <Card.Body className="text-center pt-3 pb-3 ps-0 pe-0">
                    <Image src="./fileIcons/png.png" width={150} />
                    <Card.Title className="m-0">{props.fileName}</Card.Title>
                </Card.Body>
            </Card>
        </div>
    );
}

export default CbFile;

