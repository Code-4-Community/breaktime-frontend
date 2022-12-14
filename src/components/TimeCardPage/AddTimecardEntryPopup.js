import React, {useState} from 'react' 
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'

//https://www.npmjs.com/package/reactjs-popup
/*
    Props:
        - trigger -> function that will trigger the popup showing up 
        - addRow -> callback that will return the added items, if any 
*/
function TimecardPopup(props) {
    /*
        TODO - Prepopulate Date & Hours when manually inputting things 
        Add in removal button? Maybe date can just be a date selector with value pre-selected?
    */
    const handleSubmit = (event) => {
        event.preventDefault(); 
        const formData = {}
        
        for(let idx = 0; idx < event.target.length; idx += 1) {
            const curKey = event.target[idx].getAttribute("columnName"); 
            const value = event.target[idx].value; 
            formData[curKey] = value 
        }
        props.addRow(formData) 
    }   


    return (
        <Popup trigger={props.trigger} position="right center" modal>
            {close => (
                <div>
                    <h3>Add a new entry to timesheet: </h3>
                    <form onSubmit={(event) => {handleSubmit(event); close()}} >
                        {props.columns.map(
                            (column) => (
                                <div key = {column} class="form-group row">
                                    <label key={column} class="col-sm-2 col-form-label">{column}</label>
                                    <div class="col-sm-10"> 
                                    <input key={column} class="form-control" type="text"  columnName={column}/>
                                    </div>
                                </div>  
                            )
                        )}
                        
                        <button type="submit" class="btn btn-primary" >Submit</button>
                        </form>
            </div>
            )}
             



        </Popup>  
    )
}

export default TimecardPopup 