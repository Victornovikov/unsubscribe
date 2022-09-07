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
        return(
          <Accordion expanded={expanded === message.messageId} onChange={handleChange(message.messageId)}>
            <AccordionSummary

              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{message.subject}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {message.body}
              </Typography>
            </AccordionDetails>
          </Accordion>
          
        ) 
      })}
    </div>
  )
}

export default Messages