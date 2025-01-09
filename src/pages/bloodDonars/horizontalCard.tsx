import React from "react";
import { Card, CardContent, Grid, Typography, Button } from "@mui/material";
import { Bloodtype as BloodIcon } from "@mui/icons-material";

// Props type definition
// interface Donor {
//   _id: string;
//   donorName: string;
//   bloodGroup: string;
//   dateOfDonation: string;
//   contactNumber: string;
//   email: string;
//   address: string;
//   isAvailableForDonation: boolean;
//   lastDonationDate: string;
//   donationsCount: number;
//   healthConditions: string;
//   verified: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

interface CardProps {
  donor: any;
  onViewDetails: (donor: any) => void;
  currentPagePath?: string;
}

const HorizontalCard: React.FC<CardProps> = ({
  donor,
  onViewDetails,
  currentPagePath,
}) => {
  // console.log(currentPagePath);
  //console.log(donor);
  const checkPagePath = currentPagePath === "/bloodRequest";
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3, padding: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          {/* Blood Icon */}
          <Grid item>
            <BloodIcon fontSize="large" />
          </Grid>
          {/* Donor Info */}
          <Grid item xs>
            <Typography variant="h6" gutterBottom>
              {checkPagePath ? donor?.contactPerson : donor?.donorName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Blood Group: {donor.bloodGroup}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentPagePath === "/bloodRequest"
                ? "Required Date"
                : "Date of Donation"}
              :{" "}
              {new Date(
                checkPagePath ? donor?.requiredDate : donor.dateOfDonation
              ).toLocaleDateString()}
            </Typography>
            {checkPagePath ? null : (
              <Typography variant="body2" color="text.secondary">
                Address: {donor.address}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              Status:{" "}
              <Typography
                component="span"
                sx={{
                  color:
                    donor?.status === "Approved"
                      ? "success.main"
                      : donor?.status === "Pending"
                      ? "main.secondary"
                      : "error.main",
                }}
              >
                {donor.status}
              </Typography>
            </Typography>

            <Button
              variant="contained"
              style={{ backgroundColor: "#f50057", color: "#fff" }}
              sx={{ mt: 1 }}
              onClick={() => onViewDetails(donor)}
            >
              View Details
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default HorizontalCard;
