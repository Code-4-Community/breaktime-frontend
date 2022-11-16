import Table from 'react-bootstrap/Table' 
import TimecardPopup from './AddTimecardEntryPopup'

//Can expand upon this further by specifying input types - to allow only dates, numbers, etc for the input https://www.w3schools.com/bootstrap/bootstrap_forms_inputs.asp 


function TimeTable(props) {

    const onCellChange = (event, rowIndex, colKey) => {
        props.updateCell(rowIndex, colKey, event.target.value)
    }

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
                (row, index) => ( 
                    <tr >
                        <td><TimecardPopup trigger={<button>+</button>} columns={props.columns} row={row} addRow={props.addRow}/></td>
                        {
                            props.columns.map(
                                (colKey) => (
                                    <td>
                                        <input defaultValue={row[colKey]} onChange={(event) => onCellChange(event, index, colKey)}/>
                                    </td>
                                )
                            ) 
                        }
                    
                    </tr>
                )
            )}
        </tbody>
    </Table>
    );  

}

export default TimeTable; 