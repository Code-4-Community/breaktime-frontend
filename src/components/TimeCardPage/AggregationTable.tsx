import Table from 'react-bootstrap/Table';
import React, {useEffect, useState} from 'react'; 
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const exampleAggregationRows = [
	{StartDate: 1681012800, Duration: 254},  
	{StartDate: 1681099200, Duration: 0},
	{StartDate: 1681185600, Duration: 0},
	{StartDate: 1681272000, Duration: 0},
	{StartDate: 1681358400, Duration: 268},
	{StartDate: 1681444800, Duration: 0},
	{StartDate: 1681531200, Duration: 0}
]

function AggregationTable(props) {

	const totalHours = props.rows.reduce((acc, row) => acc + row.Duration, 0);

	return (
		<Table striped bordered hover>
			<thead>
				<tr>
					<th key={0}>Date</th>
					<th key={1}>Hours</th>
				</tr>
			</thead>
			<tbody>
				{props.rows.map(
					(totalRow) => {
						return (
						<tr key={uuidv4()}>
							<td>
								{totalRow.StartDate}
							</td>
							<td>
								{totalRow.Duration}
							</td>
						</tr>	
					)}
				)}
			<tr>
				<td>
					Total Hours
				</td>
				<td>
					{totalHours}
				</td>
			</tr>
			</tbody>
		</Table>
	);
}

export default AggregationTable;