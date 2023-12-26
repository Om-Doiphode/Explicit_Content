import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

// Default modal style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// Style for danger or error result
const dangerStyle = {
  ...style,
  bgcolor: 'error.main', // Use the color that represents danger or error
};

// Style for safe or success result
const safeStyle = {
  ...style,
  bgcolor: 'success.main', // Use the color that represents safety or success
};

// Popup component definition
export default function Popup({ result }) {
  // Function to close the modal
  const handleClose = () => setOpen(false);

  // State to manage the modal open/close state
  const [open, setOpen] = React.useState(false);

  // State to manage the modal style based on the result content
  const [modalStyle, setModalStyle] = React.useState(style);

  // Effect to open the modal when the result is passed and set the modal style
  React.useEffect(() => {
    // Open the modal when the result is passed
    if (result) {
      setOpen(true);

      // Set modal style based on result content
      if (result.category === 'explicit' || result.result === 'FAKE') {
        setModalStyle(dangerStyle);
      } else {
        setModalStyle(safeStyle);
      }
    }
  }, [result]);

  // Render the modal component
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Box sx={{fontSize:"1.5em"}}>
              {Object.keys(result).map((key) => (
                <div key={key}>{result[key]}</div>
              ))}
            </Box>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
