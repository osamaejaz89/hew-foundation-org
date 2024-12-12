import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react";
import ConfirmationModal from "../confirmationModal/confirmationModal";
import "./dataTable.scss";

type Props = {
  columns: GridColDef[];
  rows: object[];
  slug: string;
  handleDeleteApi: (id: number) => Promise<void>; // Prop for delete API function
  handleEdit: (row: object) => void; // Prop for edit functionality
};

const DataTable = (props: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setSelectedUserId(id);
    setModalContent(`Are you sure you want to delete User ID: ${id}?`);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUserId !== null) {
      try {
        await props.handleDeleteApi(selectedUserId); // Call the delete API
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

  // const actionColumn: GridColDef = {
  //   field: "action",
  //   headerName: "Action",
  //   width: 250, // Increased width for Edit and Delete actions
  //   renderCell: (params) => {
  //     return (
  //       <div className="action">
  //         {/* <Link to={`/${props.slug}/${params.row.id}`}>
  //           <img src="/view.svg" alt="View" />
  //         </Link> */}
  //         <div
  //           className="edit"
  //           onClick={() => props.handleEdit(params.row)} // Trigger edit handler
  //         >
  //           <img src="/view.svg" alt="View" />
  //         </div>
  //         <div className="delete" onClick={() => handleDelete(params.row.id)}>
  //           <img src="/delete.svg" alt="Delete" />
  //         </div>
  //       </div>
  //     );
  //   },
  // };

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
      <DataGrid
        className="dataGrid"
        rows={props.rows}
        columns={[...props.columns, actionColumn]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
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
