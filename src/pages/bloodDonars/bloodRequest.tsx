import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useApproveRejectBloodRequest } from "./useBloodApi";
import { toast } from "react-toastify";
import { getBloodRequest } from "./useBloodApi";
import HorizontalCard from "./horizontalCard";

interface BloodRequest {
  id: string;
  contactPerson: string;
  patientName: string;
  bloodGroup: string;
  requiredDate: string;
  donor?: {
    email: string;
    phone: string;
  };
}

export default function BloodRequest() {
  const [selectedDonor, setSelectedDonor] = useState<any>(null);

  const queryClient = useQueryClient(); // For query invalidation or cache updates

  const approveRejectMutation = useApproveRejectBloodRequest(
    selectedDonor?._id
  );
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
          queryClient.invalidateQueries(["blood-requests/requests"]);
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

  // const {
  //   data: bloodRequestsData,
  //   isLoading,
  //   isError,
  //   error,
  // } = getBloodRequest();
  const {
    data: bloodRequestsData = [] as BloodRequest[], 
    isLoading,
    isError,
    error,
  } = getBloodRequest({
    refetchInterval: 15000, // Poll for updates every 15 seconds
    refetchOnWindowFocus: true, // Refetch on window focus
  });

  // console.table("bloodRequestsData", bloodRequestsData);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  const location = useLocation();
  const path = location.pathname.toString();
  const checkPagePath = path === "/bloodRequest";

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Blood requests
      </Typography>

      {/* Donor Cards Grid */}
      <Grid container spacing={3}>
        {bloodRequestsData.map((donor: BloodRequest) => (
          <Grid item xs={12} sm={6} key={donor.id}>
            <HorizontalCard
              donor={donor}
              onViewDetails={setSelectedDonor}
              currentPagePath={path}
            />
          </Grid>
        ))}
      </Grid>

      {/* Modal for Donor Details */}
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
        <DialogContent>
          {selectedDonor && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Blood Request Details
              </Typography>

              <Typography variant="body1">
                <strong>Contact person:</strong>
                {checkPagePath
                  ? selectedDonor?.contactPerson
                  : selectedDonor.name}
              </Typography>
              <Typography variant="body1">
                <strong>Patient Name:</strong>{" "}
                {checkPagePath
                  ? selectedDonor?.patientName
                  : selectedDonor.name}
              </Typography>
              <Typography variant="body1">
                <strong>Blood Group:</strong> {selectedDonor.bloodGroup}
              </Typography>
              <Typography variant="body1">
                {/* <strong>Required Date:</strong> {selectedDonor.requiredDate} */}
                <strong>Required Date:</strong>{" "}
                {new Date(
                  checkPagePath
                    ? selectedDonor?.requiredDate
                    : selectedDonor.dateOfDonation
                ).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {selectedDonor?.donor?.email}
              </Typography>
              <Typography variant="body1">
                <strong>Phone:</strong> {selectedDonor?.donor?.phone}
              </Typography>
              <Typography variant="body1">
                <strong>Hospital Address:</strong> {selectedDonor.hospital}
              </Typography>
              <Typography variant="body1">
                <strong>City:</strong> {selectedDonor?.location}
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
            {approveRejectMutation.isLoading &&
            approveRejectMutation.variables?.isApproved
              ? "Approving..."
              : "Approve"}
          </Button>
          <Button
            variant="contained"
            sx={{ ml: 2, width: "40%" }}
            color="error"
            onClick={() => handleApproval(false)}
            disabled={approveRejectMutation.isLoading}
          >
            {approveRejectMutation.isLoading &&
            !approveRejectMutation.variables?.isApproved
              ? "Rejecting..."
              : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// {selectedDonor && (
//   <Modal
//     open={!!selectedDonor}
//     onClose={() => setSelectedDonor(null)}
//     aria-labelledby="donor-details-modal"
//     aria-describedby="donor-details-description"
//   >
//     <Box
//       sx={{
//         position: "absolute",
//         top: "50%",
//         left: "50%",
//         transform: "translate(-50%, -50%)",
//         width: 400,
//         bgcolor: "background.paper",
//         borderRadius: 2,
//         boxShadow: 24,
//         p: 4,
//       }}
//     >
//       <Typography variant="h6" gutterBottom>
//         Blood Request Details
//       </Typography>
//       <Typography variant="body1">
//         <strong>Contact person:</strong>{" "}
//         {checkPagePath
//           ? selectedDonor?.contactPerson
//           : selectedDonor.name}
//       </Typography>
//       <Typography variant="body1">
//         <strong>Patient Name:</strong>{" "}
//         {checkPagePath ? selectedDonor?.patientName : selectedDonor.name}
//       </Typography>
//       <Typography variant="body1">
//         <strong>Blood Group:</strong> {selectedDonor.bloodGroup}
//       </Typography>
//       <Typography variant="body1">
//         {/* <strong>Required Date:</strong> {selectedDonor.requiredDate} */}
//         <strong>Required Date:</strong>{" "}
//         {new Date(
//           checkPagePath
//             ? selectedDonor?.requiredDate
//             : selectedDonor.dateOfDonation
//         ).toLocaleDateString()}
//       </Typography>
//       <Typography variant="body1">
//         <strong>Email:</strong> {selectedDonor?.donor?.email}
//       </Typography>
//       <Typography variant="body1">
//         <strong>Phone:</strong> {selectedDonor?.donor?.phone}
//       </Typography>
//       <Typography variant="body1">
//         <strong>Hospital Address:</strong> {selectedDonor.hospital}
//       </Typography>
//       <Typography variant="body1">
//         <strong>City:</strong> {selectedDonor?.location}
//       </Typography>
//       <div style={{ marginTop: "20px" }}>
//         <Button
//           variant="contained"
//           color="success"
//           sx={{ mr: 2 }}
//           onClick={() => handleApproval(true)}
//           disabled={approveRejectMutation.isLoading}
//         >
//           {approveRejectMutation.isLoading &&
//           approveRejectMutation.variables?.isApproved
//             ? "Approving..."
//             : "Approve"}
//         </Button>
//         <Button
//           variant="contained"
//           color="error"
//           onClick={() => handleApproval(false)}
//           disabled={approveRejectMutation.isLoading}
//         >
//           {approveRejectMutation.isLoading &&
//           !approveRejectMutation.variables?.isApproved
//             ? "Rejecting..."
//             : "Reject"}
//         </Button>
//       </div>
//     </Box>
//   </Modal>
// )}
