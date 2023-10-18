import { Link } from "react-router-dom";

export default function BadgerBudsNoMatch(props) {

    return (
        <div>
            <h2>That's a 404.</h2>
            <p>Uh oh, looks like you've taken a wrong turn!</p>
            <p>
                <Link to="/">Back to safety.</Link>
            </p>
        </div>
    );
}
