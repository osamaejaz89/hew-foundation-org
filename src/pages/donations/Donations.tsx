import { useState } from "react";
import DataTable from "../../components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import { useDonations, useApproveDonation } from "./useDonationApi";
import DonationDetailsModal from "./DonationDetailsModal";
import { toast } from "react-toastify";
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import "./donations.scss";
import { Donation } from "../../types/donation";
import { Box, IconButton, FormControl, InputLabel, Select, MenuItem, Stack, TextField, SelectChangeEvent, Divider, Tooltip } from "@mui/material";
import RemarksHistoryModal from './RemarksHistoryModal';

// Update the type definition
type FilterType = 'All' | 'Zakat' | 'Fitrah' | 'Others' | 'Pending' | 'Verified' | 'Rejected';

const Donations = () => {
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
    const [filterType, setFilterType] = useState<FilterType>('All');
    const [searchText, setSearchText] = useState('');
    const [dataTableSearch, setDataTableSearch] = useState('');
    const [remarks, setRemarks] = useState<string>('');
    const [remarksModalData, setRemarksModalData] = useState<{
        open: boolean;
        remarks: string;
        donationInfo: any;
    }>({
        open: false,
        remarks: '',
        donationInfo: null
    });

    const { data: donations = [], isLoading } = useDonations();
    const approveMutation = useApproveDonation(selectedDonation?._id);

    // Update the filter logic
    const filteredDonations = donations.filter(donation => {
        const matchesType = filterType === 'All' ||
            (filterType === 'Pending' ? donation.status === 'Pending' :
                filterType === 'Verified' ? donation.status === 'Verified' :
                    filterType === 'Rejected' ? donation.status === 'Rejected' :
                        donation.donationType === filterType);

        const matchesMainSearch = searchText === '' ||
            donation.user.name.toLowerCase().includes(searchText.toLowerCase()) ||
            donation.user.phone.includes(searchText) ||
            donation.amount.toString().includes(searchText);

        const matchesTableSearch = dataTableSearch === '' ||
            Object.values(donation).some(value =>
                value?.toString().toLowerCase().includes(dataTableSearch.toLowerCase())
            );

        return matchesType && matchesMainSearch && matchesTableSearch;
    });

    const handleFilterChange = (event: SelectChangeEvent<FilterType>) => {
        setFilterType(event.target.value as FilterType);
    };

    const handleViewDetails = (row: Donation) => {
        setSelectedDonation(row);
    };

    const handleApproval = async (isApproved: boolean) => {
        if (!selectedDonation?._id) return;

        try {
            await approveMutation.mutateAsync({
                status: isApproved ? 'Verified' : 'Rejected',
                remarks: remarks,
                name: selectedDonation?.user.name,
                email: selectedDonation?.user.email
            });
            toast.success(`Donation ${isApproved ? 'approved' : 'rejected'} successfully`);
            setSelectedDonation(null);
            setRemarks('');
        } catch (error) {
            toast.error('Failed to update donation status');
        }
    };

    const columns: GridColDef[] = [
        {
            field: "user.name",
            headerName: "Name",
            width: 150,
            renderCell: (params) => params.row.user.name
        },
        {
            field: "amount",
            headerName: "Amount",
            width: 120,
            renderCell: (params) => `${params.row.amount} ${params.row.currency}`
        },
        {
            field: "user.phone",
            headerName: "Phone",
            width: 150,
            renderCell: (params) => params.row.user.phone
        },
        {
            field: "donationType",
            headerName: "Type",
            width: 120
        },
        {
            field: "status",
            headerName: "Status",
            width: 120,
            renderCell: (params) => (
                <span className={`status-cell ${params.row.status}`}>
                    {params.row.status}
                </span>
            )
        },
        {
            field: "createdAt",
            headerName: "Date",
            width: 180,
            renderCell: (params) => new Date(params.row.createdAt).toLocaleDateString()
        },
        {
            field: "remarks",
            headerName: "Remarks",
            width: 110,
            sortable: false,
            disableColumnMenu: true,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {params.row.remarks ? (
                        <Tooltip title="View Remarks" arrow placement="top">
                            <IconButton
                                size="small"
                                sx={{
                                    padding: '2px',
                                    color: '#666',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                    }
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setRemarksModalData({
                                        open: true,
                                        remarks: params.row.remarks,
                                        donationInfo: {
                                            amount: params.row.amount,
                                            currency: params.row.currency,
                                            status: params.row.status,
                                            donationType: params.row.donationType
                                        }
                                    });
                                }}
                            >
                                <CommentIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ) : null}
                </Box>
            )
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 100,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                    }}
                >
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            handleViewDetails(params.row);
                        }}
                        size="small"
                        sx={{
                            color: '#1976d2',
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.04)'
                            }
                        }}
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                </Box>
            )
        }
    ];

    return (
        <div className="donations">
            <div className="info">
                <h1>Donations Management</h1>
            </div>

            {/* Hide the top search if DataTable search is being used */}
            {dataTableSearch === '' && (
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        mb: 3,
                        px: 1,
                        py: 2,
                        backgroundColor: '#fff',
                        borderRadius: 1,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                >

                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Filter by Type/Status</InputLabel>
                        <Select
                            value={filterType}
                            label="Filter by Type/Status"
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="All">All Donations</MenuItem>
                            <Divider />
                            <MenuItem
                                sx={{
                                    color: '#1976d2',
                                    fontWeight: 500,
                                    backgroundColor: '#f8f9fa',
                                    pointerEvents: 'none', // Makes it non-clickable
                                    cursor: 'default'      // Changes cursor to default
                                }}
                            >
                                By Type
                            </MenuItem>
                            <MenuItem value="Zakat">Zakat</MenuItem>
                            <MenuItem value="Fitrah">Fitrah</MenuItem>
                            <MenuItem value="Others">Others</MenuItem>
                            <Divider />
                            <MenuItem
                                sx={{
                                    color: '#1976d2',
                                    fontWeight: 500,
                                    backgroundColor: '#f8f9fa',
                                    pointerEvents: 'none', // Makes it non-clickable
                                    cursor: 'default'      // Changes cursor to default
                                }}
                            >
                                By Status
                            </MenuItem>
                            <MenuItem value="Pending" sx={{ color: '#ffc107' }}>Pending</MenuItem>
                            <MenuItem value="Verified" sx={{ color: '#28a745' }}>Verified</MenuItem>
                            <MenuItem value="Rejected" sx={{ color: '#dc3545' }}>Rejected</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            )}

            <DataTable
                columns={columns}
                rows={filteredDonations}
                slug="donations"
                handleDeleteApi={() => Promise.resolve()}
                handleEdit={() => { }}
                loading={isLoading}
                getRowId={(row: Donation) => row._id}
                onSearchChange={(value: any) => {
                    setDataTableSearch(value);
                    setSearchText('');
                }}
            />

            <DonationDetailsModal
                open={!!selectedDonation}
                donation={selectedDonation}
                onClose={() => {
                    setSelectedDonation(null);
                    setRemarks('');
                }}
                onApprove={() => handleApproval(true)}
                onReject={() => handleApproval(false)}
                loading={approveMutation.isLoading}
                remarks={remarks}
                onRemarksChange={(value: string) => setRemarks(value)}
            />

            <RemarksHistoryModal
                open={remarksModalData.open}
                onClose={() => setRemarksModalData(prev => ({ ...prev, open: false }))}
                remarks={remarksModalData.remarks}
                donationInfo={remarksModalData.donationInfo}
            />
        </div>
    );
};

export default Donations; 