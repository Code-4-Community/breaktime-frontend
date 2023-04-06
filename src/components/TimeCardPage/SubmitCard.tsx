import React, { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

//https://react-bootstrap.github.io/components/cards/




export default function SubmitCard(props) {

    const [submitted, setSubmitted] = useState(false);
    const [submitDate, setSubmitDate] = useState(null);
    const [state, setState] = useState('Rejected');
    const [rejected, setRejected] = useState(true);
    const [report_type, setReport] = useState('this is rejected');

    const model = {
        AuthorUUID: "XXXX",
        Type: "Report / Comment, etc",
        Timestamp: "",
        Content: "invalid hours"
    }


    useEffect(() => {
        //TODO - API Call to determine if the table has been submitted or not.
        //Will set submitted? here and also submitDate if it was submitted to grab the date 
        setReport(model.Content)
    }, [])

    const submitAction = () => {
        setSubmitted(!submitted);
        const currentTime = new Date();
        setSubmitDate(currentTime.toString());
    }



    //setReport(model.Content)

    return (
        <div className="col-md-2" style={{ display: "flex", justifyContent: 'flex-end' }}>
            <Card
                bg={(state === 'Completed') ? 'success' : ((state === 'In-Review: Employer' || state === 'In-Review: Breaktime') ? 'warning' : 'danger')}
                text="white"
                key="submit_description"
                className="mb-2 text-center"
            >
                <Card.Header>{submitted ? "Submitted!" : "Not Submitted"}</Card.Header>
                <Card.Body>
                    <Button variant={submitted ? 'light' : 'light'} onClick={submitAction}>{submitted ? "Resubmit" : "Submit!"}</Button>
                </Card.Body>
                {(submitted && rejected) && <Card.Footer text="white">
                    {report_type}

                </Card.Footer>}
                {submitted && <Card.Footer text="white">
                    {submitDate}

                </Card.Footer>}
            </Card>

        </div>
    )

}
