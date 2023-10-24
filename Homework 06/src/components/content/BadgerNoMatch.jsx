import { Link } from "react-router-dom";

function BadgerNoMatch() {
    return (
        <div>
            <h2>That's a 404.</h2>
            <p>Uh oh, looks like you're lost!</p>
            <p>
                <Link to="/">Back to safety.</Link>
            </p>
        </div>
    );
}

export default BadgerNoMatch;
