import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReusableModal from "../../components/add/Add";
import DataTable from "../../components/dataTable/DataTable";
import { getAllBloodUsers } from "./useBloodApi";
import "./bloodDetails.scss";

const fieldConfig = [
  { name: "id", label: "ID", type: "text", width: 90, forGrid: true },
  { name: "img", label: "Avatar", type: "image", width: 100, forGrid: true },
  { name: "fullName", label: "Full Name", type: "text", width: 150 },
  { name: "bloodGroup", label: "Blood Group", type: "text", width: 120 },
  { name: "age", label: "Age", type: "number", width: 100 },
  { name: "gender", label: "Gender", type: "text", width: 100 },
  { name: "weight", label: "Weight", type: "number", width: 100 },
  { name: "status", label: "Status", type: "text", width: 120 },
  { name: "userType", label: "User Type", type: "text", width: 120 },
  { name: "createdAt", label: "Created At", type: "text", width: 150 },
  { name: "verified", label: "Verified", type: "checkbox", width: 100 },
];

// Function to transform API response data
const transformBloodData = (apiData: any) => {
  if (!apiData || !Array.isArray(apiData)) {
    console.log("Invalid data or no data available");
    return [];
  }

  return apiData.map((item: any) => ({
    _id: item._id,
    id: item._id,
    img: "/noavatar.png",
    fullName: item.fullName || 'N/A',
    bloodGroup: item.bloodGroup || 'N/A',
    age: item.age || 'N/A',
    gender: item.gender || 'N/A',
    weight: item.weight || 'N/A',
    status: item.status || 'N/A',
    userType: item.userType || 'N/A',
    createdAt: new Date(item.createdAt).toLocaleDateString(),
    verified: item.verified || false,
    medicalConditions: item.medicalConditions || 'N/A',
    recentIllness: item.recentIllness || 'N/A',
    lastDonationDate: item.lastDonationDate ? new Date(item.lastDonationDate).toLocaleDateString() : 'N/A'
  }));
};

// Update the columns to include status styling
const columns: GridColDef[] = fieldConfig
  .filter((field) => field.forGrid !== false)
  .map((field) => ({
    field: field.name,
    headerName: field.label,
    width: field.width,
    renderCell: field.name === "img" 
      ? (params) => (
          <div className="avatar-cell">
            <img 
              src={params.row.userType === "Donor" ? "/donor.svg" : "/requester.svg"} 
              alt={params.row.userType} 
              className="avatar-icon"
            />
          </div>
        )
      : field.name === "status"
      ? (params) => (
          <div className={`status-cell ${params.value.toLowerCase()}`}>
            {params.value}
          </div>
        )
      : undefined,
    type: field.type === "checkbox" ? "boolean" : undefined,
  }));

// Generate fields for the form modal from fieldConfig
const fields = fieldConfig
  .filter((field) => field.type !== "image" && field.name !== "id")
  .map(({ name, label, type }) => ({ name, label, type }));

const BloodDetails = () => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Record<string, any> | null>(null); // For editing

  const {
    data: bloodUsers,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = getAllBloodUsers();

  const [bloodUsersDetails, setBloodUsersDetails] = useState<any[]>([]);
  console.log("bloodUsersDetails===========", bloodUsersDetails);
  useEffect(() => {
    if (bloodUsers && Array.isArray(bloodUsers) && bloodUsers.length > 0) {
      setBloodUsersDetails(transformBloodData(bloodUsers));
    } else {
      setBloodUsersDetails([]); // Set to empty array if no valid data
    }
  }, [bloodUsers]); // Dependency array ensures this runs only when bloodUsers change
  
  const handleDeleteApi = async (id: string) => {
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

  // If loading, show loading spinner
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If there's an error, display the error message
  if (isError) {
    return <div>Error: {error?.message || "Failed to fetch data"}</div>;
  }

  return (
    <div className="users">
      <div className="info">
        <h1>Users</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            style={{ height: 35, padding: "0 12px" }}
          >
            {isFetching ? "Refreshing…" : "Refresh"}
          </button>
          <button
            onClick={() => setOpen(true)}
            style={{ width: "20%", height: 35 }}
          >
            Add New Donor/Request
          </button>
        </div>
      </div>
      <DataTable
        slug="bloodDetails"
        columns={columns}
        rows={bloodUsersDetails}
        handleDeleteApi={handleDeleteApi}
        handleEdit={handleEdit}
        loading={isLoading}
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
    </div>
  );
};

export default BloodDetails;
