import React, {useState, useEffect} from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

//https://react-bootstrap.github.io/components/cards/



export default function SubmitCard(props) {

    const [submitted, setSubmitted] = useState(false); 
    const [submitDate, setSubmitDate] = useState(null); 

    useEffect(() => {
        //TODO - API Call to determine if the table has been submitted or not.
        //Will set submitted? here and also submitDate if it was submitted to grab the date 
        
    },[])

    const submitAction = () => {
        setSubmitted(!submitted); 
        const currentTime = new Date(); 
        setSubmitDate(currentTime.toString()); 
    }

    return (
        <div className="col-md-2" style={{ display: "flex", justifyContent: 'flex-end'}}>
            <Card 
                bg={submitted ? 'success' : 'secondary'}
                text="white"
                key="submit_description"
                className="mb-2 text-center"
            > 
                <Card.Header>{submitted ? "Submitted!": "Not Submitted"}</Card.Header>
                <Card.Body>
                    <Button variant={submitted?'light':'light'} onClick={submitAction}>{submitted? "Resubmit" : "Submit!"}</Button>
                </Card.Body>
                {submitted && <Card.Footer>
                    {submitDate}
                        
                    </Card.Footer>}
            </Card>  
        </div>
    )

}
