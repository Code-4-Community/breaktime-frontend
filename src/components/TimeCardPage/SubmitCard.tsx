import React, { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import CommentModal from './CommentModal';

//https://react-bootstrap.github.io/components/cards/



export default function SubmitCard(props) {

    const CardState = {
        Rejected: "Rejected",
        InReviewEmployer: "In Review - Employer",
        InReviewBreaktime: "In Review - Breaktime",
        Completed: "Completed",
        Unsubmitted: "Unsubmitted"
    }

    const [submitted, setSubmitted] = useState(false);
    const [submitDate, setSubmitDate] = useState(null);
    const [state, setState] = useState(CardState.Unsubmitted);
    const [rejected, setRejected] = useState(false);

    useEffect(() => {
        //TODO - API Call to determine if the table has been submitted or not.
        //Will set submitted? here and also submitDate if it was submitted to grab the date     
    }, [props.comment])

    const submitAction = () => {
        setSubmitted(!submitted);
        const currentTime = new Date();
        setSubmitDate(currentTime.toString());
        if (state === CardState.Unsubmitted) {
            setState(CardState.InReviewEmployer);
        }
        else {
            setState(CardState.Unsubmitted);
        }
    }

    return (
        <div className="col-md-2" style={{ display: "flex", justifyContent: 'flex-end' }}>
            <Card
                bg={(state === CardState.Completed) ? 'success' : ((state === CardState.InReviewBreaktime || state === CardState.InReviewEmployer) ? 'warning' : 'danger')}
                text="white"
                key="submit_description"
                className="mb-2 text-center">
                <Card.Body>
                    <Button variant={submitted ? 'light' : 'light'} onClick={submitAction}>{submitted ? "Resubmit" : "Submit!"}</Button>

                </Card.Body>
                {(submitted && rejected) && <Card.Footer>
                    {props.content}

                </Card.Footer>}
                {submitted && <Card.Footer>
                    {submitDate}
                    {state}
                    <CommentModal></CommentModal>
                </Card.Footer>}
            </Card>

        </div >
    )

}
