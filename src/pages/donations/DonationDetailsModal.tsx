import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Grid,
    IconButton,
    Box,
    Divider,
    TextField,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import ImageModal from "./ImageModal";
import { Donation } from "../../types/donation";

interface DonationDetailsModalProps {
    open: boolean;
    donation: Donation | null;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
    loading: boolean;
    remarks: string;
    onRemarksChange: (value: string) => void;
}

const DonationDetailsModal = ({
    open,
    donation,
    onClose,
    onApprove,
    onReject,
    loading,
    remarks,
    onRemarksChange
}: DonationDetailsModalProps) => {
    const [imageModalOpen, setImageModalOpen] = useState(false);

    if (!donation) return null;

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        bgcolor: '#fff'
                    }
                }}
            >
                <DialogTitle sx={{
                    borderBottom: '1px solid #e0e0e0',
                    m: 0,
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                        Donation Details
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        {/* Donor Information Section */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{
                                fontWeight: 600,
                                color: '#1976d2',
                                mb: 2
                            }}>
                                Donor Information
                            </Typography>
                            <Box sx={{
                                bgcolor: '#f8f9fa',
                                p: 2,
                                borderRadius: 1
                            }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Donor Name
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {donation.user?.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Email
                                        </Typography>
                                        <Typography variant="body1">
                                            {donation.user?.email}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        {/* Donation Details Section */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{
                                fontWeight: 600,
                                color: '#1976d2',
                                mb: 2
                            }}>
                                Donation Details
                            </Typography>
                            <Box sx={{
                                bgcolor: '#f8f9fa',
                                p: 2,
                                borderRadius: 1
                            }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Amount
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {donation?.amount} {donation?.currency}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Type
                                        </Typography>
                                        <Typography variant="body1">
                                            {donation?.donationType}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Status
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: donation.status === 'Approved' ? '#28a745' :
                                                    donation.status === 'Rejected' ? '#dc3545' : '#ffc107'
                                            }}
                                        >
                                            {donation?.status}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Date
                                        </Typography>
                                        <Typography variant="body1">
                                            {new Date(donation?.createdAt).toLocaleString()}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        {/* User Details Section */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{
                                fontWeight: 600,
                                color: '#1976d2',
                                mb: 2
                            }}>
                                User Details
                            </Typography>
                            <Box sx={{
                                bgcolor: '#f8f9fa',
                                p: 2,
                                borderRadius: 1
                            }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Phone
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {donation?.user?.phone}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            CNIC
                                        </Typography>
                                        <Typography variant="body1">
                                            {donation?.user?.cnic}
                                        </Typography>
                                    </Grid>


                                </Grid>
                            </Box>
                        </Grid>

                        {/* Receipt Section */}
                        {donation?.receiptUrl && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{
                                    fontWeight: 600,
                                    color: '#1976d2',
                                    mb: 2
                                }}>
                                    Receipt
                                </Typography>
                                <Box
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': { opacity: 0.9 }
                                    }}
                                    onClick={() => setImageModalOpen(true)}
                                >
                                    <img
                                        src={donation?.receiptUrl}
                                        alt="Receipt"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: 200,
                                            objectFit: 'cover',
                                            borderRadius: 8,
                                            border: '1px solid #e0e0e0'
                                        }}
                                    />
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Remarks"
                        value={remarks}
                        onChange={(e) => onRemarksChange(e.target.value)}
                        sx={{ 
                            mt: 3,
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#fff',
                                '& fieldset': {
                                    borderColor: '#e0e0e0',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#1976d2',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#666',
                            }
                        }}
                        placeholder="Enter your remarks here..."
                    />
                </DialogContent>

                <DialogActions sx={{
                    p: 2.5,
                    borderTop: '1px solid #e0e0e0',
                    gap: 1
                }}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{
                            minWidth: 100,
                            borderColor: '#e0e0e0',
                            color: '#666'
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        onClick={onApprove}
                        variant="contained"
                        color="success"
                        disabled={loading || donation.status === 'Verified'}
                        sx={{ minWidth: 100 }}
                    >
                        {loading ? 'Processing...' : 'Approve'}
                    </Button>
                    <Button
                        onClick={onReject}
                        variant="contained"
                        color="error"
                        disabled={loading || donation.status === 'Rejected'}
                        sx={{ minWidth: 100 }}
                    >
                        {loading ? 'Processing...' : 'Reject'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Image Modal for Receipt */}
            <ImageModal
                open={imageModalOpen}
                onClose={() => setImageModalOpen(false)}
                imageUrl={donation?.receiptUrl || ''}
            />
        </>
    );
};

export default DonationDetailsModal; 