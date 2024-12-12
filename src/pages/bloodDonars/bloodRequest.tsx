import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import { useState } from "react";
import HorizontalCard from "./horizontalCard";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // React Query hooks
import { toast } from "react-toastify"; // React-Toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS

const donorRequests = [
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

export default function BloodRequest() {
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
      setSelectedDonor(null); // Close modal
      queryClient.invalidateQueries(["donorRequests"]); // Optional: Refresh donor requests
    },
    onError: () => {
      toast.error("Failed to Approve the Request");
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
      setSelectedDonor(null); // Close modal
      queryClient.invalidateQueries(["donorRequests"]); // Optional: Refresh donor requests
    },
    onError: () => {
      toast.error("Failed to Reject the Request");
    },
  });

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Blood Request Requests
      </Typography>

      {/* Donor Cards Grid */}
      <Grid container spacing={3}>
        {donorRequests.map((donor) => (
          <Grid item xs={12} sm={6} key={donor.id}>
            <HorizontalCard donor={donor} onViewDetails={setSelectedDonor} />
          </Grid>
        ))}
      </Grid>

      {/* Modal for Donor Details */}
      {selectedDonor && (
        <Modal
          open={!!selectedDonor}
          onClose={() => setSelectedDonor(null)}
          aria-labelledby="donor-details-modal"
          aria-describedby="donor-details-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Blood Request Details
            </Typography>
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
            <div style={{ marginTop: "20px" }}>
              <Button
                variant="contained"
                color="success"
                sx={{ mr: 2 }}
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
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
}
