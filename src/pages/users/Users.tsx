import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useState } from "react";
import { toast } from "react-toastify";
import ReusableModal from "../../components/add/Add";
import DataTable from "../../components/dataTable/DataTable";
import "./users.scss";
import { useUserApi } from '../../hooks/useUserApi';
import { useQueryClient } from '@tanstack/react-query';
import VerificationModal from "../../components/verificationModal/VerificationModal";
import { User } from '@/types/user';

// Add type for params
interface GridParams extends GridRenderCellParams {
  row: User;
}

const Users = () => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Record<string, any> | null>(null);
  const queryClient = useQueryClient();
  const { getUsers, deleteUser, addUser, updateUser, verifyUser } = useUserApi();
  const [verificationModal, setVerificationModal] = useState({
    open: false,
    userId: null as string | null
  });

  const handleVerificationClick = (userId: string) => {
    console.log("Verification clicked for user:", userId);
    setVerificationModal({
      open: true,
      userId
    });
  };

  // Move fieldConfig inside component
  const fieldConfig = [
    { 
      name: "index", 
      label: "ID", 
      type: "text", 
      width: 90, 
      forGrid: true,
      renderCell: (params: GridRenderCellParams) => params.id
    },
    { 
      name: "img", 
      label: "Avatar", 
      type: "image", 
      width: 100, 
      forGrid: true,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.row) return null;
        return (
          <div className="avatar-cell">
            <img 
              src="/noavatar.png" 
              alt="User Avatar" 
              className="avatar-image"
            />
          </div>
        );
      }
    },
    { name: "name", label: "Name", type: "text", width: 200 },
    { name: "email", label: "Email", type: "text", width: 200 },
    { name: "phone", label: "Phone", type: "text", width: 200 },
    { 
      name: "createdAt", 
      label: "Created At", 
      type: "text", 
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        const date = new Date(params.row.createdAt);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      }
    },
    { name: "verified", label: "Verified", type: "checkbox", width: 150 },
    { 
      name: "status", 
      label: "Status", 
      type: "text", 
      width: 150,
      forGrid: true,
      renderCell: (params: GridRenderCellParams) => {
        const isVerified = params.row.verified;
        return (
          <div 
            className={`status-cell ${isVerified ? 'approved' : 'pending'}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!isVerified) {
                handleVerificationClick(params.row._id);
              }
            }}
          >
            {isVerified ? 'Approved' : 'Pending'}
          </div>
        );
      }
    },
    { 
      name: "actions", 
      label: "Actions", 
      type: "actions", 
      width: 120, 
      forGrid: true,
      renderCell: (params: GridParams) => (
        <div className="action-cell">
          <div className="edit-button" onClick={() => handleEdit(params.row)}>
            <img src="/view.svg" alt="Edit" />
          </div>
          <div className="delete-button" onClick={() => handleDeleteApi(params.row._id)}>
            <img src="/delete.svg" alt="Delete" />
          </div>
        </div>
      )
    },
  ];

  // Move columns generation inside component
  const columns: GridColDef[] = fieldConfig
    .filter((field) => field.forGrid !== false)
    .map((field) => ({
      field: field.name,
      headerName: field.label,
      width: field.width,
      renderCell: field.renderCell,
      type: field.type === "checkbox" ? "boolean" : undefined,
    }));

  // Move fields generation inside component
  const fields = fieldConfig
    .filter((field) => field.type !== "image" && field.name !== "id")
    .map(({ name, label, type }) => ({ name, label, type }));

  // Handle Delete User API
  const handleDeleteApi = async (id: string) => {
    try {
      await deleteUser.mutateAsync(id);
      toast.success(`Deleted user successfully`);
      queryClient.invalidateQueries(['list-users']);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };

  // Handle Add or Edit User Logic
  const handleAdd = async (data: Record<string, any>) => {
    try {
      if (editData) {
        await updateUser.mutateAsync({ id: editData._id, ...data });
        toast.success("User updated successfully");
      } else {
        await addUser.mutateAsync(data);
        toast.success("User added successfully");
      }
      queryClient.invalidateQueries(['list-users']);
      setOpen(false);
      setEditData(null);
    } catch (error) {
      toast.error("Error processing user data");
    }
  };

  // Handle Edit User
  const handleEdit = (row: Record<string, any>) => {
    setEditData(row); // Set the selected row data for editing
    setOpen(true); // Open the modal
  };

  const handleVerifyUser = async () => {
    try {
      if (verificationModal.userId) {
        console.log("Attempting to verify user:", verificationModal.userId);
        
        const result = await verifyUser.mutateAsync(verificationModal.userId);
        console.log("Verification result:", result);
        
        toast.success("User verified successfully");
        await queryClient.invalidateQueries(['list-users']);
        await getUsers.refetch();
        
        setVerificationModal({ open: false, userId: null });
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Error verifying user");
    }
  };

  // Transform and sort the data to show pending users at top
  const transformUserData = (users: any[]) => {
    return users
      .map(user => ({
        ...user,
        id: user._id
      }))
      .sort((a, b) => {
        // Sort by verification status (pending first)
        if (!a.verified && b.verified) return -1;
        if (a.verified && !b.verified) return 1;
        
        // If verification status is same, sort by date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  };

  return (
    <div className="users">
      <div className="info">
        <h1>Users</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => getUsers.refetch()}
            disabled={getUsers.isFetching}
            style={{ height: 30, padding: "0 12px" }}
          >
            {getUsers.isFetching ? "Refreshing…" : "Refresh"}
          </button>
          <button
            onClick={() => setOpen(true)}
            style={{ width: "15%", height: 30 }}
          >
            Add New User
          </button>
        </div>
      </div>
      <DataTable
        slug="users"
        columns={columns}
        rows={transformUserData(getUsers.data?.data || [])}
        handleDeleteApi={handleDeleteApi}
        handleEdit={handleEdit}
        loading={getUsers.isLoading}
        getRowId={(row) => row._id}
      />
      <ReusableModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditData(null);
        }}
        onSubmit={handleAdd}
        initialData={editData || {}}
        fields={fields}
      />
      <VerificationModal
        open={verificationModal.open}
        onClose={() => setVerificationModal({ open: false, userId: null })}
        onConfirm={handleVerifyUser}
      />
    </div>
  );
};

export default Users;
