import React, {useState, useEffect} from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

//https://react-bootstrap.github.io/components/cards/


export default function SubmitCard(props) {

    const CardState = {
        Rejected: "Rejected",
        InReviewEmployer: "In Review - Employer",
        InReviewBreaktime: "In Review - Breaktime",
        Completed: "Completed"
    }
      

    const [submitted, setSubmitted] = useState(false); 
    const [submitDate, setSubmitDate] = useState(null); 
    const [state, setState] = useState<CardState>(CardState.Rejected); 
    const [rejected, setRejected] = useState(true);
    const [reportType, setReportType] = useState<String>('this is rejected'); 


    useEffect(() => {
        //TODO - API Call to determine if the table has been submitted or not.
        //Will set submitted? here and also submitDate if it was submitted to grab the date 
        setReportType(props.comment)        
    },[])

    const submitAction = () => {
        setSubmitted(!submitted); 
        const currentTime = new Date(); 
        setSubmitDate(currentTime.toString()); 
    }

    return (
        <div class="col-md-2" style={{ display: "flex", justifyContent: 'flex-end'}}>
            <Card 
                bg={(state === CardState.Completed) ? 'success' : ((state === CardState.InReviewBreaktime|| state === CardState.InReviewEmployer) ? 'warning' : 'danger') }
                text="white"
                key="submit_description"
                className="mb-2 text-center"
            > 
                <Card.Header>{submitted ? "Submitted!": "Not Submitted"}</Card.Header>
                <Card.Body>
                    <Button variant={submitted?'light':'light'} onClick={submitAction}>{submitted? "Resubmit" : "Submit!"}</Button>
                </Card.Body>
                {(submitted && rejected) && <Card.Footer text="white">
                    {reportType}
                        
                    </Card.Footer>}
                {submitted && <Card.Footer text="white">
                    {submitDate}
                        
                    </Card.Footer>}
            </Card>  

        </div>
    )

}
