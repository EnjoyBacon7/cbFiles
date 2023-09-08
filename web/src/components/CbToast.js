import React, { useState, useEffect } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import Spinner from 'react-bootstrap/Spinner'
import ProgressBar from 'react-bootstrap/ProgressBar'

export function CbToasts() {

    const [notigicationStack, setNotificationStack] = useState()

    return (
        <ToastContainer
            className="p-3"
            position="bottom-end"
        >
            <CbToast />
        </ToastContainer>
    )
}

export default CbToasts

export function CbToast({ progress }) {

    const [show, setShow] = useState(true);
    const [notificationAge, setNotificationAge] = useState(0);
    const [appearance, setAppearance] = useState(Date.now())

    function toggleShow() {
        setShow(!show);
    }

    const timerID = setInterval(() => { setNotificationAge(Math.floor((Date.now() - appearance) / 1000)) }, 1000)

    return (

        <Toast show={show} onClose={toggleShow}>
            <Toast.Header>
                <strong className="me-auto">Upload in progress...</strong>
                <small>{(notificationAge < 60) ? (notificationAge + " seconds") : (Math.floor(notificationAge / 60) + " minutes")} ago</small>
            </Toast.Header>
            <Toast.Body>
                <ProgressBar animated now={progress} />
            </Toast.Body>
        </Toast>

    )
}