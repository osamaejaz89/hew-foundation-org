import { Dialog, DialogTitle, DialogContent, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface RemarksHistoryModalProps {
    open: boolean;
    onClose: () => void;
    remarks: string;
    donationInfo: {
        amount: number;
        currency: string;
        status: string;
        donationType: string;
    } | null;
}

const RemarksHistoryModal = ({ open, onClose, remarks, donationInfo }: RemarksHistoryModalProps) => {
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle sx={{ m: 0, p: 2, bgcolor: '#f8f9fa' }}>
                Remarks History
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                {donationInfo && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Donation Details
                        </Typography>
                        <Box sx={{ 
                            p: 1.5, 
                            bgcolor: '#f8f9fa', 
                            borderRadius: 1,
                            mt: 1
                        }}>
                            <Typography variant="body2">
                                Amount: {donationInfo.amount} {donationInfo.currency}
                            </Typography>
                            <Typography variant="body2">
                                Type: {donationInfo.donationType}
                            </Typography>
                            <Typography variant="body2">
                                Status: <span style={{ 
                                    color: donationInfo.status === 'Verified' ? '#28a745' : 
                                           donationInfo.status === 'Rejected' ? '#dc3545' : '#ffc107'
                                }}>
                                    {donationInfo.status}
                                </span>
                            </Typography>
                        </Box>
                    </Box>
                )}
                <Typography variant="subtitle2" color="text.secondary">
                    Admin Remarks
                </Typography>
                <Box sx={{ 
                    p: 2, 
                    bgcolor: '#f8f9fa', 
                    borderRadius: 1,
                    mt: 1,
                    minHeight: '80px'
                }}>
                    <Typography variant="body2">
                        {remarks || 'No remarks available'}
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default RemarksHistoryModal; 