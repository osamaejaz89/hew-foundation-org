import React, { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import { toast } from "react-toastify";
<<<<<<< Updated upstream
import ReusableModal from "../../components/add/Add";
=======
import ReusableModal from "../../components/ReusableModal/ReusableModal";
>>>>>>> Stashed changes
import { bloodListing } from "../../data";
import "./bloodDetails.scss";

const fieldConfig = [
  { name: "id", label: "ID", type: "text", width: 90, forGrid: true },
  { name: "img", label: "Avatar", type: "image", width: 100, forGrid: true },
  { name: "donarName", label: "Donor Name", type: "text", width: 150 },
  { name: "email", label: "Email", type: "email", width: 200 },
  { name: "phone", label: "Phone", type: "text", width: 200 },
  { name: "createdAt", label: "Created At", type: "text", width: 200 },
  { name: "userType", label: "User Type", type: "text", width: 100 },
  { name: "verified", label: "Verified", type: "checkbox", width: 150 },
];

// Generate GridColDef from fieldConfig
const columns: GridColDef[] = fieldConfig
  .filter((field) => field.forGrid !== false)
  .map((field) => ({
    field: field.name,
    headerName: field.label,
    width: field.width,
    renderCell:
      field.name === "img"
        ? (params) => <img src={params.row.img || "/noavatar.png"} alt="" />
        : undefined,
    type: field.type === "checkbox" ? "boolean" : undefined,
  }));

// Generate fields for the form modal from fieldConfig
const fields = fieldConfig
  .filter((field) => field.type !== "image" && field.name !== "id")
  .map(({ name, label, type }) => ({ name, label, type }));

const BloodDetails = () => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Record<string, any> | null>(null);

  const handleDeleteApi = async (id: number) => {
    try {
      console.log(`Deleting donor with ID: ${id}`);
      toast.success(`Deleted donor with ID: ${id}`);
    } catch (error) {
      console.error("Error deleting donor:", error);
      toast.error("Error deleting donor");
    }
  };

  const handleAdd = (data: Record<string, any>) => {
    console.log(data, "gayayay");
    if (editData) {
      toast.success("Donor updated successfully");
    } else {
      toast.success("Donor added successfully");
    }
    setEditData(null);
  };

  const handleEdit = (row: Record<string, any>) => {
    setEditData(row);
    setOpen(true);
  };

  return (
    <div className="users">
      <div className="info">
        <h1>Users</h1>
        <button
          onClick={() => setOpen(true)}
          style={{ width: "20%", height: 35 }}
        >
          Add New Donor/Request
        </button>
      </div>
      <DataTable
        slug="bloodDetails"
        columns={columns}
        rows={bloodListing}
        handleDeleteApi={handleDeleteApi}
        handleEdit={handleEdit}
      />
      <ReusableModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditData(null);
        }}
        onSubmit={handleAdd}
        title={editData ? "Edit Donor" : "Add Donor"}
        initialData={editData || {}}
        fields={fields}
      />
    </div>
  );
}
export default BloodDetails;