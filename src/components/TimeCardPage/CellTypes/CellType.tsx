import React, {useState } from 'react'; 

import {CellType} from '../types'; 
import { Select } from '@chakra-ui/react'; 


interface TypeProps {
    value: CellType; 
    setType: Function; 
} 

export function TypeCell(props:TypeProps) {

    const [cellType, setType] = useState(props.value); 

    const onChange = (event) => {
        const newType = CellType[event.target.value]; 
        setType(newType); 
        props.setType("Type",newType);  
    } 

    return <Select onChange={onChange} value={cellType}>
        {Object.values(CellType).map((entry) => (<option key={entry}>{entry}</option>))}
    </Select>

}