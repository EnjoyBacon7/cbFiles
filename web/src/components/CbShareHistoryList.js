import { useEffect, useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";

export function CbShareHistoryList() {

    const [shareHistoryComponents, setShareHistoryComponents] = useState([]);

    useEffect(() => {
        // Load the list of previously accessed shares
        const prevShares = JSON.parse(localStorage.getItem('recentShares')) || {};

        // Create a list of share history components
        const tmp_shareHistoryComponents = [];
        for (const [shareId, lastAccessed] of Object.entries(prevShares)) {
            const str_lastAccessed = "Last accessed on " + new Date(lastAccessed).toLocaleString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            tmp_shareHistoryComponents.push(<CbShareHistory shareId={shareId} lastAccessed={str_lastAccessed} />);
        }

        setShareHistoryComponents(tmp_shareHistoryComponents);

    }, []);

    return (
        <div className="mt-4">
            {shareHistoryComponents}
        </div>
    )
}

export default CbShareHistoryList;

function CbShareHistory({ shareId, lastAccessed }) {

    const navigate = useNavigate();

    return (
        <div>
            <InputGroup className="mt-2">
                <InputGroup.Text className="fw-bold" variant="secondary" disabled>
                    {shareId}
                </InputGroup.Text>
                <InputGroup.Text className="text-muted flex-grow-1">
                    {lastAccessed}
                </InputGroup.Text>
                <Button
                    variant="outline-secondary"
                    className='d-flex justify-content-center align-items-center'
                    onClick={() => {
                        navigate(`/share/${encodeURIComponent(shareId)}`);
                    }}
                >
                    <EnterSVG />
                </Button>
            </InputGroup>
        </div>
    )
}

function EnterSVG() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-caret-right"
            viewBox="0 0 16 16"
        >
            <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753" />
        </svg>
    )
}