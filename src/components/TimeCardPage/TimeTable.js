import Table from 'react-bootstrap/Table' 
import TimecardPopup from './AddTimecardEntryPopup'

//Can expand upon this further by specifying input types - to allow only dates, numbers, etc for the input https://www.w3schools.com/bootstrap/bootstrap_forms_inputs.asp 


function TimeTable(props) {



    return (
    <Table striped bordered hover>
        <thead>
            <tr>
                <th></th>
                {props.columns.map(
                    (column) => (
                        <th>{column}</th>
                    ) 
                )}
            </tr>
        </thead>
        <tbody>
            {props.rows.map(
                (row) => ( 
                    <tr>
                        <td ><TimecardPopup trigger={<button>+</button>} columns={props.columns} row={row} addRow={props.addRow}/></td>
                        {
                            props.columns.map(
                                (colKey) => (
                                    <td contentEditable={true}>{row[colKey]}</td> 
                                )
                            ) 
                        }
                        {/* {row.map(
                            (entry) => (
                                <td contentEditable="true">{entry}</td>
                            )
                        )} */}
                    </tr>
                )
            )}
        </tbody>
    </Table>
    );  

}

export default TimeTable; 