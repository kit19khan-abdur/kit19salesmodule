// Sample data for segmentation criteria
export const sampleSegments = [
    {
        id: 1,
        searchName: 'animesh1',
        createdOn: '01-Nov-2021 22:17:58',
        criteria: 'Lead',
        createdBy: 'kmukesh343',
        status: 'inactive',
        count: 245
    },
    {
        id: 2,
        searchName: 'TestAll',
        createdOn: '05-Nov-2021 22:31:55',
        criteria: 'Lead',
        createdBy: 'kmukesh343',
        status: 'inactive',
        count: 189
    },
    {
        id: 3,
        searchName: 'asd',
        createdOn: '01-Nov-2021 22:20:38',
        criteria: 'All',
        createdBy: 'kmukesh343',
        status: 'active',
        count: 532
    },
    {
        id: 4,
        searchName: 'All Conversions',
        createdOn: '16-Mar-2020 19:01:07',
        criteria: 'Conversion',
        createdBy: 'sms19',
        status: 'active',
        count: 78
    },
    {
        id: 5,
        searchName: 'All Enquiries',
        createdOn: '16-Mar-2020 19:01:07',
        criteria: 'Enquiry',
        createdBy: 'sms19',
        status: 'active',
        count: 423
    },
    {
        id: 6,
        searchName: 'All Leads',
        createdOn: '16-Mar-2020 19:01:07',
        criteria: 'Lead',
        createdBy: 'sms19',
        status: 'active',
        count: 1247
    },
    {
        id: 7,
        searchName: 'tyui - Enquiries',
        createdOn: '16-Mar-2020 19:01:07',
        criteria: 'Enquiry',
        createdBy: 'sms19',
        status: 'active',
        count: 56
    },
    {
        id: 8,
        searchName: 'Unsubscribe',
        createdOn: '16-Mar-2020 19:01:07',
        criteria: 'Lead',
        createdBy: 'kmukesh343',
        status: 'active',
        count: 34
    },
    {
        id: 9,
        searchName: 'Unsubscribe - Default',
        createdOn: '31-Oct-2020 15:11:10',
        criteria: 'All',
        createdBy: '34594-Mohit.cheema',
        status: 'active',
        count: 892
    },
    {
        id: 10,
        searchName: 'Unsubscribe - Default',
        createdOn: '31-Oct-2020 15:39:04',
        criteria: 'All',
        createdBy: '34594-Manish.Singh',
        status: 'active',
        count: 671
    }
];

// Table columns configuration
export const tableColumns = [
    { key: 'searchName', label: 'Search Name', sortable: true },
    { key: 'createdOn', label: 'Created On', sortable: true },
    { key: 'criteria', label: 'Criteria', sortable: true },
    { key: 'createdBy', label: 'Created By', sortable: true },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'count', label: 'Count', sortable: true },
    { key: 'action', label: 'Action', sortable: false }
];

// Status options
export const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
];
