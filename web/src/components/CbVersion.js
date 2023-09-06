import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';

export function CbVersion() {

    const [hovered, setHovered] = useState(false);

    function handleMouseEnter() {
        setHovered(true);
    }

    function handleMouseLeave() {
        setHovered(false);
    }

    return (
        <Card 
        id='version-card'
        style={{width: '10rem', opacity: hovered ? 1 : 0, transition: 'opacity 0.4s'}}
        className='fixed-bottom m-3'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
            <Card.Body>
                <Card.Text className='text-center'>
                    Version <a href='http://www.staggeringbeauty.com' style={{textDecoration: 'none'}}>🦄</a>.1.0.0
                </Card.Text>
            </Card.Body>
        </Card>
    )
}
export default CbVersion;