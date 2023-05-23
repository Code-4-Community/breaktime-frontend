import moment from 'moment-timezone';
import React, {useState, useEffect} from 'react'; 

import {CommentSchema} from '../../../schemas/RowSchema'; 

import * as cellTypes from '../types'; 
import {TIMEZONE} from '../../../constants'; 
import { v4 as uuidv4 } from 'uuid';


interface CommentProps {
    comments: CommentSchema[] | undefined; 
    setComment: Function; 
} 

export function CommentCell(props:CommentProps) {

    const [comments, setComments] = useState(props.comments); 

    //TODO - Eventually refactor to handle multiple comments / process for grabbing user 
    useEffect(() => {
        // If empty, create stubbed empty one to leave our comments at - eventually refactor to just add this to the end as the current users comments?
        if (props.comments === undefined || props.comments.length === 0) {
            //Create one empty comment 
            setComments([CommentSchema.parse({
                UUID: uuidv4(),
                AuthorID:"<TODO Fill this in at some point>", 
                Type: cellTypes.CommentType.Comment, 
                Timestamp: moment().tz(TIMEZONE).unix(), 
                Content:"", 
                State: cellTypes.CellStatus.Active, 
            })]); 
        } 
    }, []);  
    

    const onUpdate = (event) => {
        comments[0].Content = event.target.value; 
        props.setComment("Comment", comments); 
    } 

    if (comments !== undefined && comments.length > 0) {
        return <input defaultValue={comments[0].Content} onChange={onUpdate} />
    } else {
        return <input placeholder="Any comments?" onChange={onUpdate} />
    }

}