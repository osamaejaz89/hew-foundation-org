import { Modal, Box, Typography, Button } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const VerificationModal = ({ open, onClose, onConfirm }: Props) => {
  return (
    <Modal 
      open={open} 
      onClose={onClose}
      aria-labelledby="verification-modal-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}>
        <Typography id="verification-modal-title" variant="h6" component="h2" mb={2}>
          User Verification
        </Typography>
        <Typography mb={3}>
          Do you want to approve this user?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="contained" color="primary">
            Approve
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default VerificationModal; 