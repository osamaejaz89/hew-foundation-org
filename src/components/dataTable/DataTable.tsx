import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import "./dataTable.scss";

interface Props {
  columns: GridColDef[];
  rows: any[];
  slug: string;
  handleDeleteApi: (id: string) => Promise<void>;
  handleEdit: (row: Record<string, any>) => void;
  loading?: boolean;
  getRowId?: (row: any) => string | number;
  onSearchChange?: (value: string) => void;
}

const DataTable = (props: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter rows based on search query
  const filteredRows = props.rows.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="data-table-container">
      <div className="table-header">
        <div className="search-box">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
        </div>
      </div>

      <DataGrid
        className="data-grid"
        rows={filteredRows}
        columns={props.columns}
        getRowId={props.getRowId}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
          sorting: {
            sortModel: [{ field: 'verified', sort: 'asc' }],
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        loading={props.loading}
        autoHeight
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #f0f0f0',
            padding: '12px 16px',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f8f9fa',
            borderBottom: '2px solid #e9ecef',
            borderRadius: '8px 8px 0 0',
          },
          '& .MuiDataGrid-columnHeader': {
            padding: '16px',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #e0e0e0',
            backgroundColor: '#fff',
            padding: '10px 0',
          },
          '& .MuiTablePagination-root': {
            color: '#333',
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            margin: 0,
          },
          '& .MuiTablePagination-select': {
            padding: '0 8px',
          },
          '& .MuiTablePagination-actions': {
            marginLeft: '20px',
            '& button': {
              padding: '4px',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
              '&.Mui-disabled': {
                opacity: 0.3,
              },
            },
          },
          '& .MuiSelect-select': {
            backgroundColor: '#fff',
            borderRadius: '4px',
            padding: '4px 32px 4px 8px !important',
            '&:focus': {
              backgroundColor: '#fff',
            },
          },
          '& .MuiTablePagination-toolbar': {
            minHeight: '52px',
            alignItems: 'center',
            '& > *': {
              flex: 'none',
            },
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#f8f9fa',
          },
          '& .MuiDataGrid-row.Mui-selected': {
            backgroundColor: '#e3f2fd',
            '&:hover': {
              backgroundColor: '#e3f2fd',
            },
          },
        }}
      />
    </div>
  );
};

export default DataTable;
