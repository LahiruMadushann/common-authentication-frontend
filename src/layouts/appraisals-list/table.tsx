import { useEffect, useMemo, useRef, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import ButtonComponent from '../../components/button-v2';
import { ModalComponent } from '../../components/modal-v2';
import { statusTypeFilter } from '../../utils/status-type-filter';
import moment from 'moment';
import { getColorForStatusType } from '../../utils/colorFilter';
import { Box, Button, CircularProgress, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import AssessmentRequestDetailsLayout from '../assessment-request-details';
import { useBackend } from '../../hooks/useBackend';
import { useNavigate } from 'react-router-dom';
import { useTabStore } from '@/src/stores/tabStore';
import { useApprisialStore } from '@/src/stores/apprisials.store';
import { BuyerRejection } from '../singleApprisialCompo/buyerRejection';
import { formatPostalCode } from '@/src/utils/formatPostalcode';
import { formatPhoneNumber } from '@/src/utils/formatPhoneNumber';

export default function AppraisalsTable(props: any) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedAppraisal = useRef(null);
  const { setTabKeyAction, tabKey } = useTabStore();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const selectedRejectionRow = useRef<any>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const selectedAppraisalId = useRef<string | null>(null);
  const [shouldRefreshTable, setShouldRefreshTable] = useState(false);
  const isInitialMount = useRef(true);
  
  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem('appraisals-table-column-order');
    return saved ? JSON.parse(saved) : [];
  });

  const { setSingleAprisialAction } = useApprisialStore();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleOpen = () => {
    setTabKeyAction('4');
    setSingleAprisialAction(selectedAppraisal?.current);
  };

  const handleClose = () => setIsOpen(false);
  const handleConfirmationClose = () => setIsConfirmationOpen(false);
  const api = useBackend();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20
  });

  const scrollToTop = () => {
    const tableContainer = document.querySelector('.material-react-table-body');
    if (tableContainer) {
      tableContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (props.onChangePagination) {
      props.onChangePagination(pagination.pageIndex, pagination.pageSize);
      
      if (pagination.pageIndex !== 0) {
        scrollToTop();
      }
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    if (tabKey == '1') {
      setShouldRefreshTable(true);
    }
  }, [tabKey]); 

  useEffect(() => {
    if (shouldRefreshTable) {
      props.onChangePagination(pagination.pageIndex, pagination.pageSize);
      setShouldRefreshTable(false); 
    }
  }, [shouldRefreshTable]);

  const handleColumnOrderChange = (newColumnOrder: string[]) => {
    setColumnOrder(newColumnOrder);
    localStorage.setItem('appraisals-table-column-order', JSON.stringify(newColumnOrder));
  };

  const handleRejectionConfirm = () => {
    // Add null and undefined checks
    if (!selectedRejectionRow.current?.original) {
      console.error('No row selected for rejection');
      setIsConfirmationOpen(false);
      return;
    }
  
    const row = selectedRejectionRow.current.original;
    
    // Add additional null checks for nested properties
    const appraisalId = row.appraisalid?.content;
    const shopId = row.shops?.shops[0]?.shopid?.content;
  
    if (!appraisalId || !shopId) {
      console.error('Missing appraisal or shop ID', { appraisalId, shopId });
      setIsConfirmationOpen(false);
      return;
    }
  
    const body = {
      appraisalId,
      shopId,
      isRejectedByShop: true
    };
  
    api
      .rejected_by_shop(body)
      .then(() => {
        props.onRejectedByShopSuccess && props.onRejectedByShopSuccess();
        
        // Safely update is_rejected_by_shop
        if (row.shops?.shops[0]) {
          row.shops.shops[0].is_rejected_by_shop = true;
        }
        
        setIsConfirmationOpen(false);
      })
      .catch((error) => {
        console.error('Rejection failed', error);
        setIsConfirmationOpen(false);
      });
  };
  
  const handleRejectionPopup = (row: any) => {
    if (row.original.shops?.shops[0]?.is_rejected_by_shop) return;  
    selectedRejectionRow.current = row;
    selectedAppraisalId.current = row.original.appraisalid?.content;
    setIsPopupOpen(true);
  };

  const handleRejectionComplete = () => {
    setShouldRefreshTable(true);
    props.onRejectedByShopSuccess && props.onRejectedByShopSuccess();
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const formatCarTraveledDistance = (value: string) => {
    if (value === "～900000000km") {
      return "210,000Km以上";
    }
    return value;
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'applicationDate',
        enableHiding: false,
        maxSize: 100,
        header: '申請日時',
        Cell: ({ row }: { row: any }) => (
          <span>
            {row.original.supplement?.requestYMD
              ? moment(row.original.supplement?.requestYMD).format('L HH:mm:ss')
              : '_'}
          </span>
        )
      },
      {
        accessorKey: 'introductionDateTime',
        enableHiding: false,
        maxSize: 100,
        header: '紹介日時',
        Cell: ({ row }: { row: any }) => (
          <span>
            {row.original.assessed?.emailSendTime
              ? moment(row.original.assessed?.emailSendTime).format('L HH:mm:ss')
              : '_'}
          </span>
        )
      },
      {
        accessorKey: 'buyerStatus',
        enableHiding: false,
        maxSize: 120,
        header: '買取店ステータス',
        Cell: ({ row }: { row: any }) => {
          const statusLabel = statusTypeFilter(row.original?.assessed?.assessedStatus);
          const buttonColor = getColorForStatusType(row.original?.assessed?.assessedStatus);

          return statusLabel ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}>
              <Button
                variant="outlined"
                sx={{
                  color: buttonColor,
                  borderColor: buttonColor,
                  borderRadius: '3px',
                  borderWidth: '2px',
                  minWidth: '100px',
                  fontSize: '0.75rem',
                  padding: '5px 10px',
                  textTransform: 'none',
                  '&:hover': {
                    color: buttonColor,
                    borderColor: buttonColor,
                    backgroundColor: 'transparent',
                    borderWidth: '2px'
                  }
                }}>
                {statusLabel}
              </Button>
            </div>
          ) : (
            '_'
          );
        }
      },
      {
        accessorKey: 'name',
        enableHiding: false,
        maxSize: 100,
        header: 'お客様名',
        Cell: ({ row }: { row: any }) => (
          <span>{row.original.customer?.name ? row.original.customer.name : '_'}</span>
        )
      },
      {
        accessorKey: 'address',
        enableHiding: false,
        maxSize: 180,
        header: '住所',
        Cell: ({ row }: { row: any }) => {
          const customer = row.original.customer;
          const addressParts = [
            customer?.post_number ? `〒${formatPostalCode(customer.post_number)}` : null,
            customer?.prefecture,
            customer?.municipalities,
            customer?.address
          ].filter(Boolean);
      
          return <span>{addressParts.join(' ')}</span>;
        }
      },
      {
        accessorKey: 'car_maker',
        enableHiding: false,
        maxSize: 100,
        header: 'メーカー名',
        Cell: ({ row }: { row: any }) => (
          <span>{row.original.car?.car_maker ? row.original.car?.car_maker : '_'}</span>
        )
      },
      {
        accessorKey: 'car_type',
        enableHiding: false,
        maxSize: 100,
        header: '車種名',
        Cell: ({ row }: { row: any }) => (
          <span>{row.original.car?.car_type ? row.original.car?.car_type : '_'}</span>
        )
      },
      {
        accessorKey: 'phone',
        enableHiding: false,
        maxSize: 150,
        header: '電話番号',
        Cell: ({ row }: { row: any }) => (
          <span>
            {row.original.customer?.phone?.content ? formatPhoneNumber(row.original.customer?.phone?.content) : '_'}
          </span>
        )
      },
      {
        accessorKey: 'email',
        enableHiding: false,
        maxSize: 40,
        header: 'メールアドレス', 
        Cell: ({ row }: { row: any }) => (
          <span>
            {row.original.customer?.email?.content ? row.original.customer?.email?.content : '_'}
          </span>
        )
      },
      {
        accessorKey: 'dateOfAssessment',
        enableHiding: false,
        maxSize: 100,
        header: '査定候補日',
        Cell: ({ row }: { row: any }) => (
          <span>
            {row.original?.aDates[0]
              ? moment(row.original?.aDates[0]).format('YYYY/MM/DD')
              : '要調整'}
          </span>
        )
      },
      {
        accessorKey: 'grade',
        enableHiding: false,
        maxSize: 180,
        header: 'グレード',
        Cell: ({ row }: { row: any }) => (
          <span>{row.original.car?.grade ? row.original.car?.grade : '_'}</span>
        )
      },
      {
        accessorKey: 'year',
        enableHiding: false,
        maxSize: 90,
        header: '年式',
        Cell: ({ row }: { row: any }) => (
          <span>{row.original.car?.car_model_year ? row.original.car?.car_model_year : '_'}</span>
        )
      },
      {
        accessorKey: 'distance',
        enableHiding: false,
        maxSize: 160,
        header: '距離',
        Cell: ({ row }: { row: any }) => (
          <span>{row.original.car?.car_traveled_distance ? formatCarTraveledDistance(row.original.car?.car_traveled_distance) : '_'}</span>
        )
      },
      {
        accessorKey: 'body_color',
        enableHiding: false,
        maxSize: 90,
        header: 'ボディカラー',
        Cell: ({ row }: { row: any }) => (
          <span>{row.original.car?.body_color ? row.original.car?.body_color : '_'}</span>
        )
      },
      {
        accessorKey: 'time_of_sale',
        enableHiding: false,
        maxSize: 90,
        header: '売却時期',
        Cell: ({ row }: { row: any }) => (
          <span>{row.original.car?.desire_date ? row.original.car?.desire_date : '_'}</span>
        )
      },
      {
        accessorKey: 'loan_balance',
        enableHiding: false,
        maxSize: 90,
        header: 'ローン残債',
        Cell: ({ row }: { row: any }) => (
          <span>{row.original.car?.loan ? row.original.car?.loan : '_'}</span>
        )
      },
      {
        accessorKey: 'actionButtons',
        enableHiding: false,
        header: '',
        maxSize: 90,
        enableColumnOrdering: false, 
        enableColumnDragging: false,
        Cell: ({ row }: { row: any }) => {
          return (
            <div className="each_column buttons">
              <Stack direction={'row'} spacing={2}>
                <Button
                  variant="contained"
                  className="details-appraisals-btn"
                  onClick={() => {
                    selectedAppraisal.current = row.original;
                    handleOpen();
                  }}>
                  詳細
                </Button>
              </Stack>
            </div>
          );
        }
      }
    ],
    []
  );

  const CustomPaginationComponent = ({ table, isPaginationLoading }) => {
    const {
      getState,
      setPageIndex,
      getPageCount,
      nextPage,
      previousPage,
      setPageSize,
      getPrePaginationRowModel
    } = table;
    
    const { pagination } = getState();
    const { pageIndex, pageSize } = pagination;
    const pageCount = getPageCount();
    
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-end', 
        py: 1,
        gap: 2
      }}>
        {isPaginationLoading && (
          <CircularProgress size={24} />
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            disabled={pageIndex === 0 || isPaginationLoading}
            onClick={() => previousPage()}
          >
            前へ
          </Button>
          
          <Typography variant="body2">
            {`${pageIndex + 1} / ${Math.max(pageCount, 1)}`}
          </Typography>
          
          <Button
            variant="outlined"
            size="small"
            disabled={(pageIndex >= pageCount - 1) || isPaginationLoading}
            onClick={() => nextPage()}
          >
            次へ
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">
            ページあたりの行数:
          </Typography>
          
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
            }}
            disabled={isPaginationLoading}
            style={{
              padding: '5px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          >
            {[10, 20, 30, 40, 50].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </Box>
      </Box>
    );
  };

  const table = useMaterialReactTable({
    columns,
    data: props.data,
    getSubRows: (row) => row.branches,
    enableExpanding: false,
    enableRowSelection: false,
    enableColumnOrdering: true, 
    enableGlobalFilter: false,
    enableTopToolbar: false,
    enableSorting: false,
    enableFilters: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableColumnDragging: true, 
    displayColumnDefOptions: {
      'mrt-row-drag': {
        enableColumnOrdering: false,
      },
    },
    rowCount: props.rowCount,
    
    state: {
      pagination,
      isLoading: props.isPaginationLoading,
      columnOrder, 
    },
    
    onColumnOrderChange: handleColumnOrderChange,
    
    initialState: {
      columnPinning: {
        right: isSmallScreen ? [] : ['actionButtons'], 
      }
    },
    muiTableContainerProps: {
      sx: {
        overflowX: 'auto',
        maxWidth: '100%',
      },
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    localization: {
      rowsPerPage: 'ページあたりの行数',
      of: 'の'
    },
    muiTableHeadRowProps: {
      style: { background: '#ebf9ff' }
    },
    muiTableBodyRowProps: {
      className: 'striped-row'
    },
    renderBottomToolbar: (): JSX.Element => 
      CustomPaginationComponent({ 
        table, 
        isPaginationLoading: props.isPaginationLoading || props.pagination 
      }),
  });

  return (
    <>
    <div className="material-react-table-body appraisals-table">
      <MaterialReactTable table={table} />
      <ModalComponent isOpen={isOpen} handleClose={handleClose}>
        <AssessmentRequestDetailsLayout
          handleClose={handleClose}
          data={selectedAppraisal.current}
        />
      </ModalComponent>
      <ModalComponent 
        isOpen={isConfirmationOpen} 
        handleClose={handleConfirmationClose}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          p: 3, 
          textAlign: 'center' 
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            却下申請をしますか？
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleRejectionConfirm}
            >
              はい
            </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={handleConfirmationClose}
            >
              いいえ
            </Button>
          </Stack>
        </Box>
      </ModalComponent>
    </div>
    
    <BuyerRejection 
          isOpen={isPopupOpen} 
          togglePopup={togglePopup} 
          appraisalId={selectedAppraisalId.current || ''} 
          onRejectionComplete={handleRejectionComplete}
        />
    </>
  );
}