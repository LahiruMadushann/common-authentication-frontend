import { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment';
import { useGetAllShopsQuery } from '@/src/services/appraisals.api';
import dayjs from 'dayjs';
import { useTypedSelector } from '@/src/app/store';
import { useLazyGetFilterCSVAppraisalsQuery } from '@/src/app/services/fileControll';

const FilterSectionAppraisals = (props: any) => {
  const [clearStatus, setClearStatus] = useState<null | string>(null);
  const [selectedShopId, setSelectedShopId] = useState('');
  // const { data: shopsList } = useGetAllShopsQuery(undefined);
  const [selectedBuyerStatus, setSelectedBuyerStatus] = useState<string>('all');
  const userId = useTypedSelector(state => state.auth.userId);
  const [getFilterCSVAppraisals] = useLazyGetFilterCSVAppraisalsQuery();
  const [isCSVLoading, setIsCSVLoading] = useState(false);

  const onChangeKeyWordHandler = (e: any) => {
    props.setAppraisalsQueryParams &&
      props.setAppraisalsQueryParams((prevState: any) => ({
        ...prevState,
        kw: e.target.value
      }));
  };

  const onChangePhoneNumber = (e: any) => {
    props.setAppraisalsQueryParams &&
      props.setAppraisalsQueryParams((prevState: any) => ({
        ...prevState,
        phone_no: e.target.value
      }));
  };

  const onChangeDate = (data: any, name: any) => {
    const formattedDate = dayjs(data).format('YYYY/MM/DD');

    props.setAppraisalsQueryParams &&
      props.setAppraisalsQueryParams((prevState: any) => ({
        ...prevState,
        [name]: formattedDate
      }));
  };

  const onClickSearch = () => {
    props.onClickSearch();
  };
  const onClickUploadCSV = async() => {
    setIsCSVLoading(true);
    try {
      const queryParamsWithUserId = {
        ...props.appraisalsQueryParams,
        userId: userId,
        isTestData: userId == 205
      };

      const result = await getFilterCSVAppraisals(queryParamsWithUserId).unwrap();
      
      if (result?.url) {
          setTimeout(() => {
            const link = document.createElement("a");
            link.href = `https://assessed-appraisals-csv.s3.ap-northeast-1.amazonaws.com/filtered-data.csv`;
            link.download = "data.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setIsCSVLoading(false);
          }, 1000);
      } else {
        setIsCSVLoading(false);
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
      setIsCSVLoading(false);
    }
  }
  console.log('User ID:', userId);

  const onClickClear = () => {
    setClearStatus(Math.random().toString());

    const appraisalsClearParams = {
      unsupported: false,
      closed: false,
      not_compatible: false,
      unconnected: false,
      no_connected_assessments: false,
      assessment_reservation: false,
      assessed: false,
      unexecuted: false,
      contracted: false,
      user_complaint: false,
      duplication_of_media: false,
      sale_of_other_companies: false,
      processing: false,
      appointment: false,
      cancelled: false,
      seo: false,
      paid: false,
      paid2: false,
      paid3: false,
      phone: false,
      phone_no: '',
      isTestData: false,
      kw: '',
      offset: 0,
      limit: 20,
      to: '',
      from: '',
      submit_an_application: false,
      recognition_applied: false,
      recognition_not_accepted: false
    };

    props.setAppraisalsQueryParams &&
      props.setAppraisalsQueryParams((prevState: any) => ({
        ...prevState,
        ...appraisalsClearParams
      }));
    props.onClickClear && props.onClickClear(appraisalsClearParams);
  };

  useEffect(() => {
    props.setAppraisalsQueryParams &&
      props.setAppraisalsQueryParams((prevState: any) => ({
        ...prevState,
        unsupported: false,
        closed: false,
        not_compatible: false,
        unconnected: false,
        no_connected_assessments: false,
        assessment_reservation: false,
        assessed: false,
        unexecuted: false,
        isTestData: userId == 205,
        duplication_of_media: false,
        sale_of_other_companies: false,
        submit_an_application: false,
        recognition_applied: false,
        recognition_not_accepted: false,
        contracted: false,
        user_complaint: false,
        processing: false,
        appointment: false,
        cancelled: false,
        from: '',
        to: '',
      }));
  }, []);

  const onChangeBuyerStatus = (event: any) => {
    const status = event.target.value;
    setSelectedBuyerStatus(status);

    props.setAppraisalsQueryParams &&
      props.setAppraisalsQueryParams((prevState: any) => ({
        ...prevState,
        unsupported: status === 'unsupported',
        closed: status === 'unsupported', 
        not_compatible: status === 'not_compatible',
        unconnected: status === 'unconnected',
        no_connected_assessments: status === 'no_connected_assessments',
        assessment_reservation: status === 'assessment_reservation',
        assessed: status === 'assessed',
        unexecuted: status === 'unexecuted',
        contracted: status === 'contracted',
        user_complaint: status === 'user_complaint',
        duplication_of_media: status === 'duplication_of_media',
        sale_of_other_companies: status === 'sale_of_other_companies',
        processing: status === 'processing',
        appointment: status === 'appointment',
        cancelled: status === 'cancelled',
        unsent: status === 'status',
        deleted: status === 'deleted',
        submit_an_application: status === 'submit_an_application',
        recognition_applied: status === 'recognition_applied',
        recognition_not_accepted: status === 'recognition_not_accepted'
      }));
  };
  useEffect(() => {
    props.onClickSearch();
  }, [selectedBuyerStatus]);

  return (
    <Box
      maxWidth="100vw"
      sx={{
        width: '100%',
        paddingTop: '10px',
        paddingBottom: '20px',
        alignContent: 'center',
        marginBottom: '10px'
      }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }} // Stack vertically on small screens, horizontally on larger
        spacing={3}
        justifyContent="space-between"
        alignItems="center">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexGrow: 1 }}>
          <div>
            <FormControl sx={{ minWidth: '180px' }}>
              <InputLabel id="buyer-status-label">買取店ステータス</InputLabel>
              <Select
                labelId="buyer-status-label"
                id="buyer-status-select"
                value={selectedBuyerStatus}
                label="Buyer Status"
                onChange={onChangeBuyerStatus}>
                <MenuItem value="all">全て</MenuItem>
                <MenuItem value="unsupported">未対応</MenuItem>
                <MenuItem value="unconnected">未接続</MenuItem>
                <MenuItem value="no_connected_assessments">接続済み査定無し</MenuItem>
                <MenuItem value="assessment_reservation">查定予約</MenuItem>
                <MenuItem value="assessed">査定済み</MenuItem>
                <MenuItem value="unexecuted">未成約</MenuItem>
                <MenuItem value="contracted">成約済み</MenuItem>
                <MenuItem value="user_complaint">ユーザークレーム</MenuItem>
                <MenuItem value="duplication_of_media">媒体重複</MenuItem>
                <MenuItem value="sale_of_other_companies">他社売却</MenuItem>
                {/* <MenuItem value="processing">対応中</MenuItem>
                <MenuItem value="appointment">アポ確定</MenuItem>
                <MenuItem value="unsent">未送客</MenuItem>
                <MenuItem value="deleted">削除</MenuItem> */}
                <MenuItem value="submit_an_application">却下申請中</MenuItem>
                <MenuItem value="recognition_applied">却下申請承認</MenuItem>
                <MenuItem value="recognition_not_accepted">却下申請棄却</MenuItem>
                <MenuItem value="cancelled">キャンセル済み</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* <FormControl sx={{ minWidth: "200px", width: { xs: "100%", sm: "auto" } }}>
            <InputLabel id="shop-select">Select a Shop</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="shop-select"
              value={selectedShopId}
              label="Select a Shop"
              onChange={(e) => setSelectedShopId(e.target.value)}
            >
              {shopsList &&
                shopsList.length &&
                shopsList.map((item: any) => {
                  return <MenuItem key={item.id} value={item.id}>{item.label}</MenuItem>;
                })}
            </Select>
          </FormControl> */}
        </Stack>

        <Stack direction="column" spacing={3} sx={{ width: '100%', maxWidth: '50%' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              id="outlined-basic"
              name="kw"
              label="キーワード"
              variant="outlined"
              fullWidth
              onChange={onChangeKeyWordHandler}
              value={props.appraisalsQueryParams.kw}
              size="small"
            />
            <Button
              variant="contained"
              onClick={onClickSearch}
              sx={{
                minWidth: '140px', // Ensure both buttons have the same width
                height: '40px', // Ensure consistent height
                backgroundColor: '#FE5B02', // Custom color for search button
                ':hover': {
                  backgroundColor: '#D94A02' // Custom hover color
                }
              }}>
              検索
            </Button>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              id="outlined-basic"
              label="電話番号"
              name="phone_no"
              variant="outlined"
              onChange={onChangePhoneNumber}
              value={props.appraisalsQueryParams.phone_no}
              size="small"
              fullWidth
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                slotProps={{ textField: { size: 'small' } }}
                name="from"
                label="開始日"
                value={
                  props.appraisalsQueryParams.from ? dayjs(props.appraisalsQueryParams.from) : null
                }
                onChange={(value) => {
                  onChangeDate(value, 'from');
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                slotProps={{ textField: { size: 'small' } }}
                name="to"
                label="終了日"
                value={
                  props.appraisalsQueryParams.to ? dayjs(props.appraisalsQueryParams.to) : null
                }
                onChange={(value) => {
                  onChangeDate(value, 'to');
                }}
              />
            </LocalizationProvider>

            <Button
              variant="contained"
              onClick={onClickClear}
              sx={{
                minWidth: '140px', // Ensure both buttons have the same width
                height: '40px', // Ensure consistent height
                backgroundColor: '#8E8E93', // Custom color for clear button
                ':hover': {
                  backgroundColor: '#6B6B70' // Custom hover color
                }
              }}>
              クリア
            </Button>
          </Stack>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            display="flex"
            justifyContent="flex-end"
            spacing={2}
            alignItems="center">
            <Button
              variant="contained"
              onClick={onClickUploadCSV}
              disabled={isCSVLoading}
              sx={{
                minWidth: '140px',
                height: '40px',
                backgroundColor: isCSVLoading ? '#B0B0B0' : '#08234C',
                ':hover': {
                  backgroundColor: isCSVLoading ? '#B0B0B0' : '#031530'
                }
              }}>
              {isCSVLoading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  処理中...
                </>
              ) : (
                'CSV出力'
              )}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FilterSectionAppraisals;
