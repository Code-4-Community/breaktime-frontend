import React from 'react' 
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'

//https://www.npmjs.com/package/reactjs-popup
/*
    Props:
        - trigger -> function that will trigger the popup showing up 
        - onEntry -> callback that will return the added items, if any 
*/
function TimecardPopup(props) {




    return (
        <Popup trigger={props.trigger} position="right center" modal>
            <h3>Add a new entry to timesheet: </h3>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"/>
                <label class="form-check-label" for="flexRadioDefault1">
                    Default radio
                </label>
                </div>
                <div class="form-check">
                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked/>
                <label class="form-check-label" for="flexRadioDefault2">
                    Default checked radio
                </label>
                </div>

        </Popup>  
    )
}

export default TimecardPopup 