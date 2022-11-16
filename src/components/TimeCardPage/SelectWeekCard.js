import React, {useState, useEffect} from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import DatePicker from 'react-date-picker';


export default function DateCard(props) {
    return (<div>
        <Card
            bg="secondary"
            text="white"
            className="mb-2"
            key="date-selector-card"

        >
            <Card.Header>Timesheet for {props.user}</Card.Header>
            <Card.Body>
                <span style={{backgroundColor:"white"}}>
                    <DatePicker onChange={props.onDateChange} value={props.date}/>
                </span>
                
                <p>Selected Week: <br/>TODO Calculate week from selected date</p>
            </Card.Body>
        </Card>
    </div>)
}


