import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal = ({ open, onClose, onConfirm }: ConfirmationModalProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        Are you sure you want to proceed?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal; 