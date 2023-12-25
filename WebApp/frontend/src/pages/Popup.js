import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

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

const dangerStyle = {
  ...style,
  bgcolor: 'error.main', // Use the color that represents danger or error
};

const safeStyle = {
  ...style,
  bgcolor: 'success.main', // Use the color that represents safety or success
};

export default function Popup({ result }) {
  const handleClose = () => setOpen(false);
  const [open, setOpen] = React.useState(false);
  const [modalStyle, setModalStyle] = React.useState(style);

  React.useEffect(() => {
    // Open the modal when the result is passed
    if (result) {
      setOpen(true);

      // Set modal style based on result content
      if (result.class === 'explicit' || result.result === 'FAKE') {
        setModalStyle(dangerStyle);
      } else {
        setModalStyle(safeStyle);
      }
    }
  }, [result]);

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
