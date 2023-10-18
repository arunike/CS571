import { useState } from 'react';
import { Button, Carousel } from 'react-bootstrap';

function BadgerBudSummary({ bud, saveCat }) {
    const [showDetails, setShowDetails] = useState(false);

    const prettyPrintAge = (months) => {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        let ageString = '';

        if (years > 0) {
            ageString += `${years} year${years > 1 ? 's' : ''}`;
        }

        if (remainingMonths > 0) {
            if (years > 0) ageString += ' and ';
            ageString += `${remainingMonths} month${remainingMonths > 1 ? 's' : ''} old`;
        }

        return ageString;
    };

    const renderImages = () => {
        if (showDetails) {
            return (
                <Carousel className='custom-carousel'>
                    {bud.imgIds.map((imgId, index) => (
                        <Carousel.Item key={index}>
                            <img src={`https://raw.githubusercontent.com/CS571-F23/hw5-api-static-content/main/cats/${imgId}`} alt={`Image ${index + 1}`} />
                        </Carousel.Item>
                    ))}
                </Carousel>
            );
        } else {
            return <img src={`https://raw.githubusercontent.com/CS571-F23/hw5-api-static-content/main/cats/${bud.imgIds[0]}`} alt={bud.name} />;
        }
    };

    return (
        <div className={`display-box ${showDetails ? 'expanded' : ''}`}>
            {renderImages()}

            <h2>{bud.name}</h2>
            
            {showDetails ? (
                <div className='detail-padding'>
                    <p> <strong>Gender:</strong> {bud.gender}</p>
                    <p><strong>Breed:</strong> {bud.breed}</p>
                    <p> <strong>Age:</strong> {prettyPrintAge(bud.age)}</p>
                    {bud.description && <p className="detail-padding"><strong>Description:</strong> {bud.description}</p>}
                </div>
            ) : null}

            <div className="bud-actions">
                <Button onClick={() => setShowDetails(!showDetails)}>{showDetails ? "Show Less" : "Show More"}</Button>
                <Button className="save-button" onClick={() => saveCat(bud.id, bud.name)}>Save</Button>
            </div>
        </div>
    );
}

export default BadgerBudSummary;
