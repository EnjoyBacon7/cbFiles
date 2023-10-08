import ToggleButton from 'react-bootstrap/ToggleButton';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

export function CbShareNav({ changeViewMode, viewMode, setSearchTerms }) {

    function handleChange(e) {
        setSearchTerms(e.target.value)
    }

    function handleSubmit() {
        console.log('submitting');
    }

    return (
        <div>
            <InputGroup className="mt-3">
                <FormControl
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    placeholder='Search Here'
                    aria-label="file search field"
                />
                <ToggleButton
                    id="list-btn"
                    type="checkbox"
                    variant="outline-secondary"
                    value="list"
                    checked={viewMode === 'list'}
                    onChange={() => changeViewMode('list')}
                    className='d-flex justify-content-center align-items-center'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list-ul" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                    </svg>
                </ToggleButton>
                <ToggleButton
                    id="gallery-btn"
                    type="checkbox"
                    variant="outline-secondary"
                    value="gallery"
                    checked={viewMode === 'gallery'}
                    onChange={() => changeViewMode('gallery')}
                    className='d-flex justify-content-center align-items-center'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-grid-fill" viewBox="0 0 16 16">
                        <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z" />
                    </svg>
                </ToggleButton>
            </InputGroup>
        </div>
    );
}

export default CbShareNav;
