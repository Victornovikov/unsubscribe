import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Messages = ({ messages }) => {
  const [expanded, setExpanded] = React.useState(false)
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>

      {messages.map((message) => {
        const hasUnsubscribeLink = message.links.unsubscribeLinks.length > 0
        const hasUnsubscribeHeader = message.unsubscribeHeader ? true : false
        return(
          <Accordion expanded={expanded === message.messageId} onChange={handleChange(message.messageId)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography> 
                {message.from} {message.subject} 
                { hasUnsubscribeLink &&  message.links.unsubscribeLinks.map((link) => <a href={link} target="_blank">⭐️</a>)} { hasUnsubscribeHeader && "✨" }</Typography>
            </AccordionSummary>
            <AccordionDetails>
            {/* https://stackoverflow.com/questions/41928567/div-cannot-appear-as-a-descendant-of-p> */}
              <Typography component={'span'}>
                {/* {message.body} */}
                { hasUnsubscribeHeader && <p> Unsubscribe header: {message.unsubscribeHeader.value}</p> }
                { hasUnsubscribeLink && message.links.unsubscribeLinks.map((link) => <a href={link} target="_blank">Unsubscribe</a>)}
                {/* { !hasUnsubscribeLink && message.links.links.map((link) => <a href={link} target="_blank"> {link} </a>)} */}

                { !hasUnsubscribeLink && !hasUnsubscribeHeader && <p>{message.links.links.map((link) =>  <a href={link.link} target="_blank"> {link.link} </a> )}</p>} 
              </Typography>
            </AccordionDetails>
          </Accordion>
          
        ) 
      })}
    </div>
  )
}

export default Messages