import { Toast, ToastContainer } from 'react-bootstrap';

import { useNotification } from './CbToastsContext';

import React, { useState, useEffect } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar'

function CbToastsContainer() {
    const { notifications, removeNotification } = useNotification();

    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setRefresh(!refresh);
        }, 1000);
        return () => clearInterval(timer);
    }, [refresh]);

    return (
        <ToastContainer className="p-3" position='bottom-end'>
            {notifications.map((notification) => (
                <Toast onClose={() => { removeNotification(notification.id) }}>
                    <Toast.Header>
                        <strong className="me-auto">Upload in progress...</strong>
                        <small>
                            {toastAge(notification)}
                        </small>

                    </Toast.Header>
                    <Toast.Body>
                        <ProgressBar animated={notification.progress !== 100} variant={notification.progress !== 100 ? "info" : "success"} now={notification.progress} />
                    </Toast.Body>
                </Toast>
            ))}
        </ToastContainer>
    );
}

export default CbToastsContainer;

function toastAge(notification) {

    const ageSeconds = Math.floor((Date.now() - notification.age) / 1000);
    const ageMinutes = Math.floor(ageSeconds / 60);

    if (ageSeconds < 60) {
        return `${ageSeconds} seconds ago`
    }
    else {
        return `${ageMinutes} minutes ago`
    }
}