import React from "react";
import { Card, CardContent, Grid, Typography, Button } from "@mui/material";
import { Bloodtype as BloodIcon } from "@mui/icons-material";

// Props type definition
interface CardProps {
  donor: {
    id: number;
    name: string;
    bloodGroup: string;
    requiredDate: string;
    hospitalAddress: string;
  };
  onViewDetails: (donor: any) => void;
}

const HorizontalCard: React.FC<CardProps> = ({ donor, onViewDetails }) => {
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
              {donor.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Blood Group: {donor.bloodGroup}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Required Date: {donor.requiredDate}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hospital Address: {donor.hospitalAddress}
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
