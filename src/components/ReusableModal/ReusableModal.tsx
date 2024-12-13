import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void;
  title: string;
  initialData?: Record<string, any>;
  fields: { name: string; label: string; type: string; options?: string[] }[];
}

const ReusableModal: React.FC<ModalProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  initialData = {},
  fields,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldType?: string
  ) => {
    const { name, value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldType === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent dividers sx={{ px: 3, py: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          {title}
        </Typography>
        <Grid container spacing={isSmallScreen ? 2 : 3}>
          {fields.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              {field.type === "checkbox" ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      name={field.name}
                      checked={!!formData[field.name]}
                      onChange={(e) => handleChange(e, "checkbox")}
                    />
                  }
                  label={field.label}
                />
              ) : field.type === "radio" ? (
                <RadioGroup
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                >
                  {field.options?.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              ) : (
                <TextField
                  fullWidth
                  name={field.name}
                  label={field.label}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  multiline={field.type === "textarea"}
                  rows={field.type === "textarea" ? 4 : 1}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          color="secondary"
          variant="outlined"
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          sx={{ textTransform: "none" }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReusableModal;
