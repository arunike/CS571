import { useContext, useState, useEffect } from "react";
import BadgerBudsDataContext from "../../../contexts/BadgerBudsDataContext";
import { Button, Col, Row } from 'react-bootstrap';

export default function BadgerBudsBasket(props) {
    const buds = useContext(BadgerBudsDataContext);
    const [savedCatIds, setSavedCatIds] = useState(JSON.parse(sessionStorage.getItem('savedCatIds') || "[]"));
    const adoptedCatIds = JSON.parse(sessionStorage.getItem('adoptedCatIds') || "[]");
    const [updateTrigger, setUpdateTrigger] = useState(false);

    useEffect(() => {
        setSavedCatIds(JSON.parse(sessionStorage.getItem('savedCatIds') || "[]"));
    }, [updateTrigger]);

    const savedBuddies = buds.filter(bud => savedCatIds.includes(bud.id));

    const handleUnselect = (catId, catName) => {
        alert(`${catName} has been removed from your basket!`);

        const updatedSavedCatIds = savedCatIds.filter(id => id !== catId);
        sessionStorage.setItem('savedCatIds', JSON.stringify(updatedSavedCatIds));

        setUpdateTrigger(prev => !prev);
    };

    const handleAdopt = (catId, catName) => {
        alert(`${catName} has been adopted!`);
        
        const newAdoptedCatIds = [...adoptedCatIds, catId];
        sessionStorage.setItem('adoptedCatIds', JSON.stringify(newAdoptedCatIds));

        const updatedSavedCatIds = savedCatIds.filter(id => id !== catId);
        sessionStorage.setItem('savedCatIds', JSON.stringify(updatedSavedCatIds));

        setUpdateTrigger(prev => !prev);
    };

    return (
        <div>
            <h1>Badger Buds Basket</h1>
            <p>These cute cats could be all yours!</p>
            {savedBuddies.length === 0 ? (
                <p>You have no buds in your basket!</p>
                ) : (
                <>
                    <Row>
                        {savedBuddies.map(bud => (
                            <Col key={bud.id} xs={12} md={6} lg={4} xl={3}>
                                <div key={props.id} className="saved-buddy display-box display-box-view">
                                    <img src={`https://raw.githubusercontent.com/CS571-F23/hw5-api-static-content/main/cats/${bud.imgIds[0]}`} alt={`A picture of ${bud.name}`} />
                                    
                                    <h2>{bud.name}</h2>

                                    <div className="bud-actions">
                                        <Button onClick={() => handleUnselect(bud.id, bud.name)}>Unselect</Button>
                                        <Button className="adopt-button" onClick={() => handleAdopt(bud.id, bud.name)}>Adopt</Button>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </div>
    );
}
