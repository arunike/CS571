import { Col, Container, Row } from "react-bootstrap";

export default function BadgerBudsLanding(props) {

    return <div>
        <h1>About Badger Buddies!</h1>
        <br/>
        <Container fluid={true}>
            <Row>
                <Col xs={12} lg={4} xl={6}>
                    <p>Badger Buddies is a proxy website (built by you!) for cats on <a href="https://www.madisoncatproject.org/">The Madison Cat Project</a>.</p>
                    <p>This information is current as of <strong>September 30th, 2023.</strong></p>
                    <p>Interested in adopting a cat? <a target="_blank" href="https://www.madisoncatproject.org/browse-indoor">See them here!</a></p>
                    <h3>From the Madison Cat Project...</h3>
                    <p>"Madison Cat Project saves cats through partnerships with other shelters and our community. Whether it’s partnering with area shelters to bring in cats who need another chance or supporting farmers and other folks who need help managing their outdoor cat colonies by offering affordable spay/neuter surgeries and rehoming options, we help hundreds of cats (and people) each year!"</p>
                </Col>
                <Col xs={12} lg={8} xl={6}>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/RK65p_-n3z0?si=ta9VsCE5d72Sjtk6" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                </Col>
            </Row>
        </Container>
    </div>
}