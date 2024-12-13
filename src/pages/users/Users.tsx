import React, { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import "./Users.scss";
import { userRows } from "../../data";
import { toast } from "react-toastify";
import ReusableModal from "../../components/add/Add";

// const columns: GridColDef[] = [
//   { field: "id", headerName: "ID", width: 90 },
//   {
//     field: "img",
//     headerName: "Avatar",
//     width: 100,
//     renderCell: (params) => (
//       <img src={params.row.img || "/noavatar.png"} alt="" />
//     ),
//   },
//   {
//     field: "firstName",
//     type: "string",
//     headerName: "First Name",
//     width: 150,
//   },
//   {
//     field: "lastName",
//     type: "string",
//     headerName: "Last Name",
//     width: 150,
//   },
//   {
//     field: "email",
//     type: "string",
//     headerName: "Email",
//     width: 200,
//   },
//   {
//     field: "phone",
//     type: "string",
//     headerName: "Phone",
//     width: 200,
//   },
//   {
//     field: "createdAt",
//     headerName: "Created At",
//     width: 200,
//     type: "string",
//   },
//   {
//     field: "verified",
//     headerName: "Verified",
//     width: 150,
//     type: "boolean",
//   },
// ];

const fieldConfig = [
  { name: "id", label: "ID", type: "text", width: 90, forGrid: true },
  { name: "img", label: "Avatar", type: "image", width: 100, forGrid: true },
  { name: "firstName", label: "First Name", type: "text", width: 150 },
  { name: "lastName", label: "Last Name", type: "text", width: 150 },
  { name: "email", label: "Email", type: "text", width: 200 },
  { name: "phone", label: "Phone", type: "text", width: 200 },
  { name: "createdAt", label: "Created At", type: "text", width: 200 },
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

const Users = () => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Record<string, any> | null>(null); // For editing

  // Handle Delete User API
  const handleDeleteApi = async (id: number) => {
    try {
      console.log(`Deleting user with ID: ${id}`);
      toast.success(`Deleted user with ID: ${id}`);
      // Replace with actual API call
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };

  // Handle Add or Edit User Logic
  const handleAdd = (data: Record<string, any>) => {
    if (editData) {
      console.log("Updated User Data: ", data);
      toast.success("User updated successfully");
      // Update logic (e.g., API call or state update)
    } else {
      console.log("New User Data: ", data);
      toast.success("User added successfully");
      // Add logic (e.g., API call or state update)
    }
    setEditData(null); // Clear edit data after submission
  };

  // Handle Edit User
  const handleEdit = (row: Record<string, any>) => {
    setEditData(row); // Set the selected row data for editing
    setOpen(true); // Open the modal
  };

  return (
    <div className="users">
      <div className="info">
        <h1>Users</h1>
        <button
          onClick={() => setOpen(true)}
          style={{ width: "15%", height: 30 }}
        >
          Add New User
        </button>
      </div>
      <DataTable
        slug="users"
        columns={columns}
        rows={userRows}
        handleDeleteApi={handleDeleteApi}
        handleEdit={handleEdit} // Pass edit handler
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
};

export default Users;
