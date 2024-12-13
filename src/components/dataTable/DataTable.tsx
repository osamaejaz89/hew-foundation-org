import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react";
import ConfirmationModal from "../confirmationModal/confirmationModal";
import "./dataTable.scss";

type Props = {
  columns: GridColDef[];
  rows: object[];
  slug: string;
  handleDeleteApi: (id: number) => Promise<void>;
  handleEdit: (row: object) => void;
};

const CustomSearchBox = ({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className="customSearchBox">
      <input
        type="text"
        placeholder="Search..."
        onChange={handleChange}
        style={{
          backgroundColor: "#fff",
          padding: "5px 15px",
          fontSize: "14px",
          borderRadius: "0px",
          border: "1px solid #ccc",
          color: "#000",
          width: "200px", // Set width of the search box
        }}
      />
    </div>
  );
};

const DataTable = (props: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter rows based on the search query
  const filteredRows = props.rows.filter((row) => {
    return Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleDelete = (id: number) => {
    setSelectedUserId(id);
    setModalContent(`Are you sure you want to delete User ID: ${id}?`);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUserId !== null) {
      try {
        await props.handleDeleteApi(selectedUserId);
        console.log(`Deleted user with ID: ${selectedUserId}`);
      } catch (error) {
        console.error("Error deleting user:", error);
      } finally {
        setIsModalOpen(false);
        setSelectedUserId(null);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const actionColumn: GridColDef = {
    field: "action",
    headerName: "Action",
    width: 250,
    renderCell: (params) => {
      return (
        <div className="action">
          <div className="edit" onClick={() => props.handleEdit(params.row)}>
            <img src="/view.svg" alt="View" />
          </div>
          <div className="delete" onClick={() => handleDelete(params.row.id)}>
            <img src="/delete.svg" alt="Delete" />
          </div>
        </div>
      );
    },
  };

  return (
    <div className="dataTable">
      {/* Custom Search Box */}
      <CustomSearchBox onSearch={setSearchQuery} />

      <DataGrid
        className="dataGrid"
        rows={filteredRows}
        columns={[...props.columns, actionColumn]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
        sx={{
          "& .MuiDataGrid-footerContainer": {
            width: "100%", // Full width
            paddingRight: "40px", // Right
            overflow: "hidden", // Hide overflow
          },
          "& .MuiDataGrid-footer": {
            color: "#000", // Footer text color
          },

          ".MuiTablePagination-actions": {
            color: "blue", // Change arrow
            display: "flex",
            overflow: "hidden",
            flexDirection: "row",
            paddingRight: 10,
          },
          ".MuiTablePagination-actions button": {
            borderRadius: "50%", // Round buttons
            backgroundColor: "#ffff", // Background color
            "&:hover": {
              backgroundColor: "#d3d3d3", // Hover effect
            },
          },
          ".MuiSvgIcon-root": {
            fontSize: "1.5rem", // Increase arrow size
          },
        }}
      />

      {isModalOpen && (
        <ConfirmationModal
          open={isModalOpen}
          message={modalContent}
          onConfirm={handleDeleteConfirm}
          onCancel={handleModalClose}
        />
      )}
    </div>
  );
};

export default DataTable;
