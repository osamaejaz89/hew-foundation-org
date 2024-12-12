import React, { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import AddModal from "../../components/add/Add";
import "./bloodDetails.scss";
import { donarsRows } from "../../data";
import { toast } from "react-toastify";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "img",
    headerName: "Avatar",
    width: 100,
    renderCell: (params) => (
      <img src={params.row.img || "/noavatar.png"} alt="" />
    ),
  },
  {
    field: "donarName",
    headerName: "User Name",
    width: 150,
  },
  { field: "email", headerName: "Email", width: 200 },
  { field: "phone", headerName: "Phone", width: 200 },
  { field: "createdAt", headerName: "Created At", width: 200 },
  { field: "userType", headerName: "User Type", width: 100 },
  { field: "verified", headerName: "Verified", type: "boolean", width: 150 },
];

const BloodDetails = () => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Record<string, any> | null>(null); // For editing

  const handleDeleteApi = async (id: number) => {
    try {
      console.log(`Deleting donor with ID: ${id}`);
      toast.success(`Deleted donor with ID: ${id}`);
      // Replace with actual API call
    } catch (error) {
      console.error("Error deleting donor:", error);
      toast.error("Error deleting donor");
    }
  };

  const handleAdd = (data: Record<string, any>) => {
    if (editData) {
      console.log("Updated Donor Data: ", data);
      toast.success("Donor updated successfully");
      // Update logic (e.g., API call or state update)
    } else {
      console.log("New Donor Data: ", data);
      toast.success("Donor added successfully");
      // Add logic (e.g., API call or state update)
    }
    setEditData(null); // Clear edit data after submission
  };

  const handleEdit = (row: Record<string, any>) => {
    setEditData(row); // Set the selected row data for editing
    setOpen(true); // Open the modal
  };

  return (
    <div className="users">
      <div className="info">
        <h1>Blood Details</h1>
        <button onClick={() => setOpen(true)}>Add New Donar/Request</button>
      </div>
      <DataTable
        slug="bloodDetails"
        columns={columns}
        rows={donarsRows}
        handleDeleteApi={handleDeleteApi}
        handleEdit={handleEdit} // Pass edit handler
      />
      <AddModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditData(null); // Reset editData on modal close
        }}
        onSubmit={handleAdd}
        title={editData ? "Edit Donor" : "Add New Donor"}
        columns={columns}
        btnName={editData ? "Update Donor" : "Add Donor"}
        initialData={editData || undefined} // Pass initial data for editing
      />
    </div>
  );
};

export default BloodDetails;
