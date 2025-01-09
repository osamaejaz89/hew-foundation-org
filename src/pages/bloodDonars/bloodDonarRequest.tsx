import {
  Box,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { useState } from "react";
import HorizontalCard from "./horizontalCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getBloodDonar, useApprovedRejectBloodDonor } from "./useBloodApi";

export default function BloodDonorRequest() {
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const queryClient = useQueryClient();

  const approveRejectMutation = useApprovedRejectBloodDonor(selectedDonor?._id);
  const handleApproval = (isApproved: boolean) => {
    approveRejectMutation.mutate(
      {
        isApproved,
        adminRemarks: isApproved ? "Approved by admin" : "Rejected by admin",
      },
      {
        onSuccess: () => {
          toast.success(
            isApproved
              ? "Request Approved Successfully!"
              : "Request Rejected Successfully!"
          );
          setSelectedDonor(null); // Close modal
          queryClient.invalidateQueries(["blood/donor-request/"]); // Refresh blood requests
        },
        onError: () => {
          toast.error(
            isApproved
              ? "Failed to Approve the Request"
              : "Failed to Reject the Request"
          );
        },
      }
    );
  };

  const {
    data: donarRequestsData,
    isLoading,
    isError,
    error,
  } = getBloodDonar({
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
    staleTime: 1000,
    cacheTime: 300000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !donarRequestsData)
    return <div>Error: {error?.message || "Failed to fetch data"}</div>;

  const donorRequests = donarRequestsData?.bloodDonorRequests || [];
  console.log("donorRequests", donorRequests);

  return (
    <div style={{ padding: "20px" }}>
      {/* <Typography variant="h4" gutterBottom>
        Blood Donor Requests
      </Typography> */}

      {/* Donor Cards Grid */}
      <Grid container spacing={3}>
        {donorRequests.length > 0 ? (
          donorRequests.map((donor: any) => (
            <Grid item xs={12} sm={6} key={donor._id}>
              <HorizontalCard donor={donor} onViewDetails={setSelectedDonor} />
            </Grid>
          ))
        ) : (
          <Typography
            variant="body1"
            style={{ textAlign: "center", width: "100%" }}
          >
            No data available
          </Typography>
        )}
      </Grid>

      {/* Dialog for Donor Details */}
      <Dialog
        open={!!selectedDonor}
        onClose={() => setSelectedDonor(null)}
        aria-labelledby="donor-details-dialog"
        aria-describedby="donor-details-description"
        maxWidth="md" // Change to "lg" or a custom value for larger sizes
        fullWidth // Ensures the dialog uses the full width of the screen up to the maxWidth
        sx={{
          "& .MuiDialog-paper": {
            width: "40%", // You can adjust this percentage or use specific pixel values
            height: "70%", // You can adjust this value
            maxWidth: "none", // Disable default maxWidth constraints
            padding: "20px", // Add padding to the dialog content
          },
        }}
      >
        <DialogTitle>Blood Donor Details</DialogTitle>
        <DialogContent>
          {selectedDonor && (
            <Box>
              <Typography variant="body1">
                <strong>Name:</strong> {selectedDonor.fullName}
              </Typography>
              <Typography variant="body1">
                <strong>Blood Group:</strong> {selectedDonor.bloodGroup}
              </Typography>
              <Typography variant="body1">
                <strong>Gender:</strong> {selectedDonor.gender}
              </Typography>
              <Typography variant="body1">
                <strong>Age:</strong> {selectedDonor.age}
              </Typography>
              <Typography variant="body1">
                <strong>Last Donation Date:</strong>{" "}
                {new Date(selectedDonor.lastDonationDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                <strong>Medical Conditions:</strong>{" "}
                {selectedDonor.medicalConditions || "None"}
              </Typography>
              <Typography variant="body1">
                <strong>Recent Illness:</strong> {selectedDonor.recentIllness}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong>{" "}
                <Typography
                  component="span"
                  sx={{
                    color:
                      selectedDonor?.status === "Approved"
                        ? "success.main"
                        : selectedDonor?.status === "Pending"
                        ? "main.secondary"
                        : "error.main",
                  }}
                >
                  {selectedDonor.status}
                </Typography>
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions style={{ justifyContent: "center", padding: "20px" }}>
          <Button
            variant="contained"
            sx={{ mr: 2, width: "40%" }}
            color="success"
            onClick={() => handleApproval(true)}
            disabled={approveRejectMutation.isLoading}
          >
            {approveRejectMutation.isLoading ? "Approving..." : "Approve"}
          </Button>
          <Button
            variant="contained"
            sx={{ ml: 2, width: "40%" }}
            color="error"
            onClick={() => handleApproval(false)}
            disabled={approveRejectMutation.isLoading}
          >
            {approveRejectMutation.isLoading ? "Rejecting..." : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
