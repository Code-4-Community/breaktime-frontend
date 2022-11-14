import Table from 'react-bootstrap/Table' 
import TimecardPopup from './AddTimecardEntryPopup'


function TimeTable(props) {
    return (
    <Table striped borderd hover>
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
                        <td><TimecardPopup trigger={<button>+</button>}/></td>
                        {row.map(
                            (entry) => (
                                <td>{entry}</td>
                            )
                        )}
                    </tr>
                )
            )}
        </tbody>
    </Table>
    );  

}

export default TimeTable; 