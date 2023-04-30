import {
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer,
} from '@chakra-ui/react';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const exampleAggregationRows = [
	{ StartDate: 1681012800, Duration: 254 },
	{ StartDate: 1681099200, Duration: 0 },
	{ StartDate: 1681185600, Duration: 0 },
	{ StartDate: 1681272000, Duration: 0 },
	{ StartDate: 1681358400, Duration: 268 },
	{ StartDate: 1681444800, Duration: 0 },
	{ StartDate: 1681531200, Duration: 0 }
]

function AggregationTable(props) {

	const totalHoursForEachDay = {};

	// add the days in that stretch to dictionary 
	// set all to 0
	// iterate through each sheet and increment accordingly

	const finalDate = moment(props.startDate).add(7, 'days');
	const currentDate = moment(props.startDate);
	while (currentDate.isBefore(finalDate, 'days')) {
		totalHoursForEachDay[currentDate.format("MM/DD/YY")] = 0;
		currentDate.add(1, 'day');
		//console.log("Date: ", currentDate.format("MM/DD/YY")); 
	}

	props.timesheets.forEach(sheet => {
		sheet.TableData.forEach(entry => {
			if (entry.Duration !== undefined) {
				totalHoursForEachDay[moment.unix(entry.StartDate).format("MM/DD/YY")] += Number(entry.Duration);
			}
			totalHoursForEachDay[moment.unix(entry.StartDate).format("MM/DD/YY")] += 0;
		});
	});

	const aggregatedRows = Object.entries(totalHoursForEachDay).map(entry =>
	({
		"StartDate": moment(entry[0]).unix(),
		"Duration": Number(entry[1])
	}));

	const totalHours = aggregatedRows.reduce((acc, row) => acc + row.Duration, 0);

	return (
		<Table>
			<Thead>
				<Tr>
					<Th key={0}>Date</Th>
					<Th key={1}>Hours</Th>
				</Tr>
			</Thead>
			<Tbody>
				{aggregatedRows.map(
					(totalRow) => {
						return (
							<tr key={uuidv4()}>
								<td>
									{moment.unix(totalRow.StartDate).format("MM/DD/YYYY")}
								</td>
								<td>
									{(totalRow.Duration / 60).toFixed(2)}
								</td>
							</tr>
						)
					}
				)}
				<Tr>
					<Td>
						Total Hours
					</Td>
					<Td>
						{(totalHours / 60).toFixed(2)}
					</Td>
				</Tr>
			</Tbody>
		</Table>
	);
}

export default AggregationTable;