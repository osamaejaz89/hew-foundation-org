import { Box, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import { useState } from "react";
import HorizontalCard from "./horizontalCard";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // React Query hooks
import { toast } from "react-toastify"; // React-Toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS

const bloodDonarRequests = [
  {
    id: 1,
    name: "John Doe",
    bloodGroup: "O+",
    requiredDate: "2024-12-15",
    email: "john@example.com",
    phone: "123-456-7890",
    hospitalAddress: "City Hospital, Street 10",
    city: "New York",
  },
  {
    id: 2,
    name: "Jane Smith",
    bloodGroup: "A-",
    requiredDate: "2024-12-20",
    email: "jane@example.com",
    phone: "987-654-3210",
    hospitalAddress: "Care Medical, Main Avenue",
    city: "Los Angeles",
  },
  {
    id: 3,
    name: "Michael Johnson",
    bloodGroup: "B+",
    requiredDate: "2024-12-18",
    email: "michael@example.com",
    phone: "555-123-4567",
    hospitalAddress: "Saint Mary's Hospital",
    city: "Chicago",
  },
];

export default function BloodDonorRequest() {
  const [selectedDonor, setSelectedDonor] = useState<any>(null);

  const queryClient = useQueryClient(); // For query invalidation or cache updates

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: async (donorId: number) => {
      const response = await fetch(`/api/approve/${donorId}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to approve the request");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Request Approved Successfully!");
      queryClient.invalidateQueries(["donorRequests"]); // Optional: Refresh donor requests
      setSelectedDonor(false); // Close modal
    },
    onError: () => {
      toast.error("Failed to Approve the Request");
      setSelectedDonor(false); // Close modal
    },
  });

  // Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: async (donorId: number) => {
      const response = await fetch(`/api/reject/${donorId}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to reject the request");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Request Rejected Successfully!");
      queryClient.invalidateQueries(["donorRequests"]); // Optional: Refresh donor requests
      setSelectedDonor(false); // Close modal
    },
    onError: () => {
      toast.error("Failed to Reject the Request");
      setSelectedDonor(false); // Close modal
    },
  });

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Blood Donor Requests
      </Typography>

      {/* Donor Cards Grid */}
      {/* <Grid container spacing={3}>
        {bloodDonarRequests.map((donor) => (
          <Grid item xs={12} sm={6} key={donor.id}>
            <HorizontalCard donor={donor} onViewDetails={setSelectedDonor} />
          </Grid>
        ))}
      </Grid> */}

      {/* Dialog for Donor Details */}
      <Dialog
        open={!!selectedDonor}
        onClose={() => setSelectedDonor(false)}
        aria-labelledby="donor-details-dialog"
        aria-describedby="donor-details-description"
      >
        <DialogTitle>Blood Donor Details</DialogTitle>
        <DialogContent>
          {selectedDonor && (
            <Box>
              <Typography variant="body1">
                <strong>Name:</strong> {selectedDonor.name}
              </Typography>
              <Typography variant="body1">
                <strong>Blood Group:</strong> {selectedDonor.bloodGroup}
              </Typography>
              <Typography variant="body1">
                <strong>Required Date:</strong> {selectedDonor.requiredDate}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {selectedDonor.email}
              </Typography>
              <Typography variant="body1">
                <strong>Phone:</strong> {selectedDonor.phone}
              </Typography>
              <Typography variant="body1">
                <strong>Hospital Address:</strong> {selectedDonor.hospitalAddress}
              </Typography>
              <Typography variant="body1">
                <strong>City:</strong> {selectedDonor.city}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={() => approveMutation.mutate(selectedDonor.id)}
            disabled={approveMutation.isLoading}
          >
            {approveMutation.isLoading ? "Approving..." : "Approve"}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => rejectMutation.mutate(selectedDonor.id)}
            disabled={rejectMutation.isLoading}
          >
            {rejectMutation.isLoading ? "Rejecting..." : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
