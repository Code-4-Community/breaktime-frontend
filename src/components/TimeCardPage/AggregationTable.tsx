import {
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td
} from '@chakra-ui/react';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import moment, { Moment } from 'moment-timezone';
import { TimeSheetSchema } from '../../schemas/TimesheetSchema'

interface AggregationProps {
	Date: Moment,
	timesheets: TimeSheetSchema[]
}


function AggregationTable(props: AggregationProps) {
	//NOTE: Aggregation is only applying to associate entries currently - TODO is to develop logic for all user types 

	const totalHoursForEachDay = {};

	// add the days in that stretch to dictionary 
	// set all to 0
	// iterate through each sheet and increment accordingly

	const finalDate = moment(props.Date).add(7, 'days');
	const currentDate = moment(props.Date);
	while (currentDate.isBefore(finalDate, 'days')) {
		totalHoursForEachDay[currentDate.format("MM/DD/YY")] = 0;
		currentDate.add(1, 'day');
		//console.log("Date: ", currentDate.format("MM/DD/YY")); 
	}
	props.timesheets.forEach(sheet => {
		if (sheet.TableData !== undefined) {
			sheet.TableData.forEach(entry => {
				if (entry.Associate !== undefined && entry.Associate.Start !== undefined && entry.Associate.End !== undefined) {
					totalHoursForEachDay[moment.unix(entry.Date).format("MM/DD/YY")] += Number(entry.Associate.End - entry.Associate.Start);
				}
				totalHoursForEachDay[moment.unix(entry.Date).format("MM/DD/YY")] += 0;
			});
		}
	});

	const aggregatedRows = Object.entries(totalHoursForEachDay).map(entry =>
	({
		"Date": entry[0],
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
							<Tr key={uuidv4()}>
								<Td>
									{totalRow.Date}
								</Td>
								<Td>
									{(totalRow.Duration / 60).toFixed(2)}
								</Td>
							</Tr>
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