import React, { useEffect, useState } from 'react';
import { Input } from '@/src/components/input/input';
import { FormItem } from '@/src/components/common/formItem';
import { Form } from '@/src/components/common/form';
import { Col, Row } from '@/src/components/common/grid';
import { Select } from '@/src/components/common/select';
import { Radio } from '@/src/components/common/radio';
import { Checkbox } from '@/src/components/common/checkbox';
import { Button } from 'antd';
import { ScrollSelector } from '@/src/components/common/scrollSelector';
import { MultipleInputList } from '@/src/components/common/multipleInputs';
import { MultipleOptionList } from '@/src/components/common/multipleoption';
import { getMunicipalities } from './functions/filteroutcities';
import { bodyTypes } from '../../data/body_type_master';
import { useGetBrandsHook } from '@/src/hooks/useGetBrands';
import { NestedScrollSelector } from '@/src/components/common/nestedScrollSelector';
import { useMemo } from 'react';
import { distanceList, yearList } from '../../data/yearList';
import { useDisabledStore } from '@/src/stores/disable.store';
import { getValuesAsStringArray } from './functions/checkNullValues';
import { updateShopCondtions } from '@/src/services/shop.service';
import { useFetchShopByIdHook } from '@/src/hooks/useShopHook';
import { useAppStore } from '@/src/stores/app.store';
import { useFetchShopConditonsByIdHook } from '@/src/hooks/useShopCondtionsHook';
import {
  convertArrayToObject,
  convertArrayToObjectWithKeys,
  convertChekedArrayToObject,
  extractChildrenValues,
  findMatchingChildrenValues,
  formatInitial
} from './functions/transfromInitialValues';
import { useSelectAllStore } from '@/src/stores/selectAllStore';
import { containsAllOption, extractValues } from './functions/containAllOptions';
// import { TableLoadingSkeleton } from '../../loading-screens';
import { NewPrefectureList } from '@/src/data/newPrefctureList';
import { setCustomErrorToast, setSuccessToast } from '@/src/utils/notification';
import { AccidentDamageTable } from './components/imovebleTable';
import { useSelectedTypeStore } from '@/src/stores/selectors.store';
import { removeDuplicates, removeDuplicatesNested } from './functions/removeDupicates';
import { useMatchingConditionsStore } from '@/src/stores/matchingCondtions.store';
import {
  bodyListTypes,
  dateOfSalesList,
  InvolvedAccidenCheckList,
  nonSpecializedVehicleProjectList,
  numberOptions
} from './utils/datasets';
import { useDisableSelectoHook } from '@/src/hooks/useDisableSelectoHook';
import { useScrollToTopOnNavigate } from '@/src/hooks/useScrollTop';
import { useTabStore } from '@/src/stores/tabStore';
import { TableLoadingSkeleton } from '@/src/components/loading-screens';

interface ShopConditions {
  domesticOrImport?: 'DOMESTIC' | 'IMPORT' | 'BOTH' | null;
}
export const MatchingConditions = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tab = urlParams.get('tab');
  const [shopType, setShopType] = useState('SPECIAL');
  const [selectedPrefecture, setSelectedPrefecture] = useState('');
  const { editRegisterId, setMainTabIndex, setEditRegisterId, fetchShopType, setFetchShopType } =
    useAppStore();
  const { shop, loading } = useFetchShopByIdHook(editRegisterId);
  const [allowToFetch, setAllowToFetch] = useState(false);
  const { setTabKeyAction } = useTabStore();
  const { shopCondtions } = useFetchShopConditonsByIdHook(
    editRegisterId,
    fetchShopType,
    allowToFetch
  );
  const { selectedStates } = useSelectAllStore();
  const [pageLoading, setPageLoading] = useState(false);
  const [checkedBodyTypes, setCheckedBodyTypes] = useState({});
  const [checkedNGBodyTypes, setCheckedNGBodyTypes] = useState({});
  const [checkedBrandTypes, setCheckedBrandTypes] = useState({});
  const [checkedNGBrandTypes, setCheckedNGBrandTypes] = useState({});
  const { data: brandData, isLoading } = useGetBrandsHook();
  const [checkedNestedBrandList, setCheckNestedBrandList] = useState({});
  const [checkedNGNestedBrandList, setCheckNGNestedBrandList] = useState({});
  const { disabled, setDisabled } = useDisabledStore();
  const [initialValues, setInitialValues] = useState<any>();
  const [immovableOkPattern, setImmovableOkPattern] = useState([]);
  const [initialImmovableState, setInitialImmovableStates] = useState([]);
  const [allShopAuthorized, setAllShopAuthorized] = useState(false);
  const [flipToGeneral, setFlipToGeneral] = useState(false);
  const { selectors, setSelectors } = useSelectedTypeStore();
  const [shopArea, setShopArea] = useState([{ prefectures: '', manicipalities: '' }]);
  const [municipalitiesArray, setMunicipalitiesArray] = useState([]);
  const { setEmailList, emailList } = useMatchingConditionsStore();
  const [notMove, setNotMove] = useState('');
  const [domesticOrImport, setDomesticOrImport] = useState<{
    domestic: boolean;
    import: boolean;
  }>({
    domestic: shopCondtions
      ? (shopCondtions as ShopConditions).domesticOrImport === 'DOMESTIC'
      : true,
    import: shopCondtions ? (shopCondtions as ShopConditions).domesticOrImport === 'IMPORT' : false
  });
  useScrollToTopOnNavigate(editRegisterId);

  useEffect(() => {
    if (shop && shop?.haveBothGeneralAndSpecialConditions) setAllShopAuthorized(true);
  }, [shop]);

  const handleCheckboxChange = (key: any) => (checked: any) => {
    setDomesticOrImport((prevState) => ({
      ...prevState,
      [key]: checked
    }));
  };

  useEffect(() => {
    const initMunicipalities: any = shopArea?.reduce((acc: any, item: any) => {
      if (item?.prefectures) {
        acc[item?.prefectures] = getMunicipalities(item?.prefectures);
      }
      return acc;
    }, {});
    setMunicipalitiesArray(initMunicipalities);
  }, [shopArea]);

  const handlePrefectureChange = (value: any) => {
    setSelectedPrefecture(value);
    const newMunicipalities = getMunicipalities(value);
    setMunicipalitiesArray((prev: any) => ({ ...prev, [value]: newMunicipalities }));
  };

  const { brandsList, nestedBrandsList } = useMemo(() => {
    const nestedList = brandData?.map((brand: any, index: any) => {
      const children = brand.maqh.map((item: any, itemIndex: any) => ({
        key: `${index + 1}-${itemIndex + 1}`,
        label: item.name,
        value: item.name
      }));

      return {
        key: `${index + 1}`,
        label: brand.brand,
        value: brand.brand,
        children: children
      };
    });

    const flatList = nestedList?.map(({ key, label, value }) => ({
      key,
      label,
      value
    }));

    return { brandsList: flatList, nestedBrandsList: nestedList };
  }, [brandData]);

  const uniqueNestedBrandList = removeDuplicatesNested(nestedBrandsList);
  const uniqueBrandList = removeDuplicates(brandsList);

  const yearListTypes = yearList.map((year, index) => ({
    key: index + 1,
    label: year.label,
    value: year.value
  }));

  const distanceListTypes = distanceList.map((distance, index) => ({
    key: index + 1,
    label: distance.label,
    value: distance.value
  }));

  const getStatus = (domesticOrImport: any) => {
    if (domesticOrImport.domestic && domesticOrImport.import) {
      return 'BOTH';
    }
    if (domesticOrImport.domestic) {
      return 'DOMESTIC';
    }
    if (domesticOrImport.import) {
      return 'IMPORT';
    }
    return null;
  };

  const iniital = {
    '1-1': 'Item A1',
    '1-2': 'Item A2',
    '2-1': 'Item B1',
    '2-2': 'Item B2',
    '3-1': 'Item C1',
    '3-2': 'Item C2'
  };

  const initials = {
    1: 'トヨタ',
    6: 'スバル',
    45: 'スバル',
    54: 'トヨタ'
  };

  useEffect(() => {
    setEmailList(shopCondtions ? shopCondtions?.emails : []);
    setShopArea(
      shopCondtions
        ? shopCondtions?.shopArea?.map((area: any) => ({ ...area, id: null }))
        : [{ prefectures: '', manicipalities: '' }]
    );

    setCheckedBodyTypes(
      shopCondtions
        ? containsAllOption(shopCondtions?.okBodyTypes)
          ? convertArrayToObject(extractValues(bodyListTypes, 'value'))
          : convertChekedArrayToObject(bodyTypes, shopCondtions?.okBodyTypes)
        : []
    );
    setCheckedNGBodyTypes(
      shopCondtions
        ? containsAllOption(shopCondtions?.ngBodyTypes)
          ? convertArrayToObject(extractValues(bodyListTypes, 'value'))
          : convertChekedArrayToObject(bodyTypes, shopCondtions?.ngBodyTypes)
        : []
    );

    setCheckedNGBrandTypes(
      shopCondtions
        ? containsAllOption(shopCondtions?.ngMakes)
          ? convertArrayToObject(extractValues(uniqueBrandList, 'value'))
          : convertArrayToObjectWithKeys(uniqueBrandList, shopCondtions?.ngMakes)
        : []
    );
    setCheckedBrandTypes(
      shopCondtions
        ? containsAllOption(shopCondtions?.okMakes)
          ? convertArrayToObject(extractValues(uniqueBrandList, 'value'))
          : convertArrayToObjectWithKeys(uniqueBrandList, shopCondtions?.okMakes)
        : []
    );

    setCheckNestedBrandList(
      shopCondtions
        ? containsAllOption(shopCondtions?.okCarTypes)
          ? extractChildrenValues(uniqueNestedBrandList)
          : findMatchingChildrenValues(uniqueNestedBrandList, shopCondtions?.okCarTypes)
        : {}
    );

    setCheckNGNestedBrandList(
      shopCondtions
        ? containsAllOption(shopCondtions?.ngCarTypes)
          ? extractChildrenValues(uniqueNestedBrandList)
          : findMatchingChildrenValues(uniqueNestedBrandList, shopCondtions?.ngCarTypes)
        : []
    );

    if (shopCondtions) {
      setDomesticOrImport({
        domestic:
          shopCondtions.domesticOrImport === 'DOMESTIC' ||
          shopCondtions.domesticOrImport === 'BOTH' ||
          shopCondtions.domesticOrImport === null
            ? true
            : false,
        import:
          shopCondtions.domesticOrImport === 'IMPORT' || shopCondtions.domesticOrImport === 'BOTH'
            ? true
            : false
      });
      setNotMove(shopCondtions?.notMove);
      setInitialImmovableStates(
        shopCondtions?.immovableOkPattern === null ||
          shopCondtions?.immovableOkPattern === undefined ||
          shopCondtions?.immovableOkPattern?.length === 0
          ? [
              {
                accidentHistory: 'あり(未修理)',
                runnable: '走行不可'
              },
              {
                accidentHistory: 'なし',
                runnable: '走行不可'
              },
              {
                accidentHistory: 'あり(修復済)',
                runnable: '走行不可'
              },
              {
                accidentHistory: 'あり(未修理)',
                runnable: '走行可'
              },
              {
                accidentHistory: '不明',
                runnable: '走行不可'
              }
            ]
          : shopCondtions?.immovableOkPattern
      );
    }
    setInitialValues({
      notSpeciality: shopCondtions ? shopCondtions?.notSpeciality : '',
      notMove: shopCondtions ? shopCondtions?.notMove : '',
      ceilCount: shopCondtions ? shopCondtions?.ceilCount : null,
      yearOkFrom: shopCondtions ? shopCondtions?.yearOkFrom : '',
      yearOkTo: shopCondtions ? shopCondtions?.yearOkTo : '',
      yearNgFrom: shopCondtions ? shopCondtions?.yearNgFrom : '',
      yearNgTo: shopCondtions ? shopCondtions?.yearNgTo : '',
      distanceOkFrom: shopCondtions ? shopCondtions?.distanceOkFrom : '',
      distanceOkTo: shopCondtions ? shopCondtions?.distanceOkTo : '',
      distanceNgFrom: shopCondtions ? shopCondtions?.distanceNgFrom : '',
      distanceNgTo: shopCondtions ? shopCondtions?.distanceNgTo : '',
      saleDateDetermination: shopCondtions ? shopCondtions?.saleDateDetermination : '',
      scaleRank: shopCondtions ? shopCondtions?.scaleRank : '',
      domesticOrImport: {
        import: 'IMPORT',
        domestic: true
      }
    });
  }, [shopCondtions, brandData, fetchShopType, editRegisterId]);

  useEffect(() => {
    setShopType(shop?.storeSubscriptionType);
    if (fetchShopType) {
      setShopType(fetchShopType);
    }
  }, [shop, fetchShopType]);

  useEffect(() => {
    if (shop) {
      if (shop?.haveBothGeneralAndSpecialConditions) {
        setAllShopAuthorized(true);
      } else {
        setAllShopAuthorized(false);
        setAllowToFetch(true);
      }
    }
  }, [shop]);
  // useEffect(() => {
  //   setMainTabIndex(editRegisterId === null);
  // }, [editRegisterId]);

  const onFinish = async (value: any) => {
    const newData = {
      shopId: editRegisterId,
      emails: emailList,
      shopArea: shopArea,
      domesticOrImport: getStatus(domesticOrImport),
      notMove: value.notMove,
      yearOkFrom: value.yearOkFrom,
      yearOkTo: value.yearOkTo,
      yearNgFrom: value.yearNgFrom,
      yearNgTo: value.yearNgTo,
      distanceOkFrom: value.distanceOkFrom,
      distanceOkTo: value.distanceOkTo,
      distanceNgFrom: value.distanceNgFrom,
      distanceNgTo: value.distanceNgTo,
      saleDateDetermination: value.saleDateDetermination,
      scaleRank: value.scaleRank,
      ceilCount: value.ceilCount === '' ? null : value.ceilCount,
      notSpeciality: value.notSpeciality,
      specialCarType: null,
      specialCarMaker: null,
      specialCarModel: null,
      okCarTypes: selectedStates.okCarTypes
      ? ['全て']
      : getValuesAsStringArray(checkedNestedBrandList, brandData),
      okBodyTypes: selectedStates.okBodyTypes ? ['全て'] : getValuesAsStringArray(checkedBodyTypes),
      okMakes: selectedStates.okMakes ? ['全て'] : getValuesAsStringArray(checkedBrandTypes),
      ngCarTypes: selectedStates.ngCarTypes
      ? ['全て']
      : getValuesAsStringArray(checkedNGNestedBrandList, brandData),
      ngBodyTypes: selectedStates.ngBodyTypes
        ? ['全て']
        : getValuesAsStringArray(checkedNGBodyTypes),
      ngMakes: selectedStates.ngMakes ? ['全て'] : getValuesAsStringArray(checkedNGBrandTypes),
      subscriptionType: shopType,
      immovableOkPattern: immovableOkPattern
    };

    try {
      setPageLoading(true);
      const response = await updateShopCondtions(newData);
      setPageLoading(false);
      setSuccessToast('登録が完了しました');
      setEditRegisterId(null);
      setFetchShopType('');
      setTabKeyAction('5');
    } catch (error) {
      console.log(error, 'erroe');
      setPageLoading(false);
      setCustomErrorToast('問題が発生しました');
      setMainTabIndex(false);
    }
  };

  useDisableSelectoHook({ selectors, setDisabled });
  // useEffect(() => {
  //   if (editRegisterId) {
  //     urlParams.set('id', editRegisterId);
  //     window.history.pushState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
  //   }
  // }, [editRegisterId]);

  if (loading || pageLoading) return <TableLoadingSkeleton />;
  return (
    <div className=" w-full h-full   ">
      {shopType == 'SPECIAL' && !flipToGeneral ? (
        <h1 className=" text-white text-center py-1 bg-[#e95412]">専門店マッチング条件</h1>
      ) : (
        <h1 className=" text-white text-center py-1 bg-[#e95412]">一般店マッチング条件</h1>
      )}

      <Form
        onFinish={onFinish}
        className=" flex flex-col gap-0 w-full h-full overflow-y-auto"
        initialValues={initialValues}>
        <Row gutter={[0, 0]} className=" w-full h-full  !mx-0  ">
          <Col span={24} className=" w-full h-full !mx-0">
            <Row className=" w-full flex items-start h-full !bg-[#587c94] border-b-[1px] border-white  !mx-0 md:!-mx-2">
              <Col
                span={24}
                md={6}
                className=" w-full h-full pt-3 md:py-6  text-white  font-bold  px-2 !mx-0">
                <h1 className=" text-sm  w-full h-full px-4 text-center md:text-left   ">
                  メールアドレス
                </h1>
              </Col>
              <Col
                span={24}
                md={18}
                className=" w-full flex bg-white items-start py-2 gap-10  group h-full  px-2 !mx-0">
                <MultipleInputList />
              </Col>
            </Row>
            <Row className=" w-full flex items-start h-full !bg-[#587c94] border-b-[1px] border-white !mx-0 md:!-mx-2">
              <Col
                span={24}
                md={6}
                className=" w-full h-full pt-3 md:py-6  text-white  font-bold  px-2 ">
                <h1 className=" text-sm  w-full h-full px-4 text-center md:text-left ">
                  対象エリア
                </h1>
              </Col>
              <Col
                span={24}
                md={18}
                className=" w-full flex bg-white items-start py-4 gap-10  group h-full  px-2">
                <MultipleOptionList
                  firstOptions={NewPrefectureList}
                  secondOptions={municipalitiesArray}
                  onPrefectureChange={handlePrefectureChange}
                  setInputs={setShopArea}
                  inputs={shopArea?.length ? shopArea : [{ prefectures: '', manicipalities: '' }]}
                />
              </Col>
            </Row>
            <Row className=" w-full flex items-start h-full  !mx-0 md:!-mx-2">
              <Col
                span={24}
                md={6}
                className=" w-full h-full md:min-h-20  !bg-[#587c94] py-4 md:py-6 text-white border-b-[1px] border-white  font-bold  px-2 ">
                <h1 className=" text-sm  w-full px-4  !text-center md:!text-left ">
                  国産車・輸入車
                </h1>
              </Col>
              <Col
                span={24}
                md={18}
                className=" w-full flex  items-start gap-10  group py-6 h-full  px-2">
                <div>
                  <FormItem fullWidth layout="horizontal" className="  text-white w-full ">
                    <Checkbox
                      type="single"
                      value={'DOMESTIC'}
                      label="国産車"
                      typeCheck={false}
                      checked={domesticOrImport.domestic}
                      onChange={handleCheckboxChange('domestic')}
                    />
                  </FormItem>
                </div>
                <div>
                  <FormItem fullWidth layout="horizontal" className="  text-white w-full ">
                    <Checkbox
                      type="single"
                      label="輸入車"
                      value={'IMPORT'}
                      typeCheck={false}
                      onChange={handleCheckboxChange('import')}
                      checked={domesticOrImport.import}
                    />
                  </FormItem>
                </div>
                {!domesticOrImport.domestic && !domesticOrImport.import && (
                  <h1 className="text-red-500">このフィールドは必須です</h1>
                )}
              </Col>
            </Row>

            {isLoading ? (
              <TableLoadingSkeleton />
            ) : (
              <>
                {shopType === 'SPECIAL' && !flipToGeneral && (
                  <Row gutter={[0, 0]} className="">
                    <Col span={24} md={8} className=" ">
                      <div className=" w-full flex flex-col items-start h-full   ">
                        <div className=" text-sm w-full  border-r-[2px] text-center h-20 !bg-[#587c94]  py-6 text-white border-b-[1px] border-white  font-bold    ">
                          メーカーを選択
                        </div>
                        <div className=" w-full flex flex-col items-start border-[2px] border-t-0  border-[#587c94]  group py-6 h-full  px-4">
                          <ScrollSelector
                            hidden
                            data={uniqueBrandList}
                            checkedValues={checkedBrandTypes}
                            setCheckedValues={setCheckedBrandTypes}
                            disabled={disabled.selector1}
                            type={'selector1'}
                            modalType={'okMakes'}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col span={24} md={8} className=" ">
                      <div className=" w-full flex flex-col items-start h-full  ">
                        <label
                          className=" text-sm  w-full border-r-[2px] text-center h-20 !bg-[#587c94]  py-6 text-white border-b-[1px] border-white  font-bold  px-2   "
                          htmlFor="">
                          車種選択
                        </label>
                        <div className=" w-full flex flex-col items-start border-[2px] border-t-0 border-[#587c94]   group py-6 h-full  px-2">
                          <NestedScrollSelector
                            hidden
                            data={uniqueNestedBrandList}
                            checkedValues={checkedNestedBrandList}
                            setCheckedValues={setCheckNestedBrandList}
                            disabled={disabled.selector2}
                            type={'selector2'}
                            modalType={'okCarTypes'}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col span={24} md={8} className="  ">
                      <div className=" w-full flex flex-col items-start h-full  ">
                        <label
                          className=" text-sm  w-full text-center h-20 !bg-[#587c94]  py-6 text-white border-b-[1px] border-white  font-bold  px-2   "
                          htmlFor="">
                          ボディタイプ選択
                        </label>
                        <div className=" w-full flex flex-col items-start  border-[2px] border-t-0 border-[#587c94]  group py-6 h-full  px-2">
                          <ScrollSelector
                            hidden
                            data={bodyListTypes}
                            checkedValues={checkedBodyTypes}
                            setCheckedValues={setCheckedBodyTypes}
                            disabled={disabled.selector3}
                            type={'selector3'}
                            modalType={'okBodyTypes'}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                )}
                {(shopType === 'GENERAL' || flipToGeneral) && (
                  <Row gutter={[0, 0]} className="">
                    <Col span={24} md={8} className=" border border-blue-600">
                      <div className=" w-full flex flex-col items-start h-full  ">
                        <label
                          className=" text-sm  w-full text-center h-20 !bg-[#587c94]  py-6 text-white border-b-[1px] border-white  font-bold  px-2   "
                          htmlFor="">
                          希望メーカーを選択
                        </label>
                        <div className=" w-full flex flex-col items-start   group py-6 h-full  px-2">
                          <ScrollSelector
                            data={uniqueBrandList}
                            checkedValues={checkedBrandTypes}
                            setCheckedValues={setCheckedBrandTypes}
                            modalType={'okMakes'}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col span={24} md={8} className=" border border-blue-600">
                      <div className=" w-full flex flex-col items-start h-full  ">
                        <label
                          className=" text-sm  w-full text-center h-20 !bg-[#587c94]  py-6 text-white border-b-[1px] border-white  font-bold  px-2   "
                          htmlFor="">
                          希望ボディタイプ選択
                        </label>
                        <div className=" w-full flex flex-col items-start   group py-6 h-full  px-2">
                          <ScrollSelector
                            data={bodyListTypes}
                            checkedValues={checkedBodyTypes}
                            setCheckedValues={setCheckedBodyTypes}
                            modalType={'okBodyTypes'}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col span={24} md={8} className=" border border-blue-600">
                      <div className=" w-full flex flex-col items-start h-full  ">
                        <label
                          className=" text-sm  w-full text-center h-20 !bg-[#587c94]  py-6 text-white border-b-[1px] border-white  font-bold  px-2   "
                          htmlFor="">
                          希望車種選択
                        </label>
                        <div className=" w-full flex flex-col items-start   group py-6 h-full  px-2">
                          <NestedScrollSelector
                            data={uniqueNestedBrandList}
                            checkedValues={checkedNestedBrandList}
                            setCheckedValues={setCheckNestedBrandList}
                            modalType={'okCarTypes'}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col span={24} md={8} className=" border border-blue-600">
                      <div className=" w-full flex flex-col items-start h-full  ">
                        <label
                          className=" text-sm  w-full text-center h-20 !bg-[#587c94]  py-6 text-white border-b-[1px] border-white  font-bold  px-2   "
                          htmlFor="">
                          NGメーカーを選択
                        </label>
                        <div className=" w-full flex flex-col items-start   group py-6 h-full  px-2">
                          <ScrollSelector
                            data={uniqueBrandList}
                            checkedValues={checkedNGBrandTypes}
                            setCheckedValues={setCheckedNGBrandTypes}
                            modalType={'ngMakes'}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col span={24} md={8} className=" border border-blue-600">
                      <div className=" w-full flex flex-col items-start h-full  ">
                        <label
                          className=" text-sm  w-full text-center h-20 !bg-[#587c94]  py-6 text-white border-b-[1px] border-white  font-bold  px-2   "
                          htmlFor="">
                          NGボディタイプ選択
                        </label>
                        <div className=" w-full flex flex-col items-start   group py-6 h-full  px-2">
                          <ScrollSelector
                            data={bodyListTypes}
                            checkedValues={checkedNGBodyTypes}
                            setCheckedValues={setCheckedNGBodyTypes}
                            modalType={'ngBodyTypes'}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col span={24} md={8} className=" border border-blue-600">
                      <div className=" w-full flex flex-col items-start h-full  ">
                        <label
                          className=" text-sm  w-full text-center h-20 !bg-[#587c94]  py-6 text-white border-b-[1px] border-white  font-bold  px-2   "
                          htmlFor="">
                          NG車種選択
                        </label>
                        <div className=" w-full flex flex-col items-start   group py-6 h-full  px-2">
                          <NestedScrollSelector
                            data={uniqueNestedBrandList}
                            checkedValues={checkedNGNestedBrandList}
                            setCheckedValues={setCheckNGNestedBrandList}
                            modalType={'ngCarTypes'}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                )}
              </>
            )}
            {shopType === 'SPECIAL' && !flipToGeneral && (
              <>
                <Row className=" w-full flex items-start h-full  border-b-[1px] border-white pb-2 md:pb-0  !mx-0 md:!-mx-2">
                  <Col span={24} md={6} className=" !bg-[#587c94]">
                    <div className=" w-full flex flex-col items-start h-full  ">
                      <h1 className=" text-sm  w-full py-3 md:h-20   md:py-6 text-white text-center md:text-left   font-bold  px-4   ">
                        年式
                      </h1>
                    </div>
                  </Col>

                  <Col span={11} md={8} className=" flex items-cente mt-2 ">
                    <FormItem
                      fullWidth
                      layout="horizontal"
                      className="  text-white w-full  "
                      name="yearOkFrom">
                      <Select
                        options={yearListTypes}
                        fullWidth
                        className=" h-16 w-full bg-[#fff9c5]"
                        disable={disabled.option1}
                        onChange={(e, d) => {
                          setSelectors({
                            ...selectors,
                            option1: true
                          });
                          setInitialValues({
                            ...initialValues,
                            yearOkFrom: e
                          });
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={2} md={2} className=" flex items-center justify-center w-full mt-8 ">
                    {selectors.option1 ? (
                      <>
                        {' '}
                        <button
                          className=" w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center"
                          onClick={() => {
                            setInitialValues({
                              ...initialValues,
                              yearOkFrom: '',
                              yearOkTo: ''
                            });

                            setSelectors({
                              ...selectors,
                              option1: false
                            });
                          }}>
                          X
                        </button>
                      </>
                    ) : (
                      <>~</>
                    )}
                  </Col>
                  <Col span={11} md={8} className=" flex items-center mt-2 ">
                    <FormItem
                      fullWidth
                      layout="horizontal"
                      className="  text-white w-full  "
                      name="yearOkTo">
                      <Select
                        options={yearListTypes}
                        fullWidth
                        className=" h-16 w-full bg-[#fff9c5]"
                        disable={disabled.option1}
                        onChange={(e, d) => {
                          setSelectors({
                            ...selectors,
                            option1: true
                          });
                          setInitialValues({
                            ...initialValues,
                            yearOkTo: e
                          });
                        }}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row className=" w-full flex items-start h-full  border-b-[1px] border-white pb-2 md:pb-0  !mx-0 md:!-mx-2">
                  <Col span={24} md={6} className=" !bg-[#587c94]">
                    <div className=" w-full flex flex-col items-start h-full  ">
                      <label
                        className=" text-sm  w-full  md:h-20 py-3 text-center md:text-left   md:py-6 text-white  font-bold  px-4  "
                        htmlFor="">
                        走行距離
                      </label>
                    </div>
                  </Col>

                  <Col span={11} md={8} className=" flex items-center mt-2">
                    <FormItem
                      fullWidth
                      layout="horizontal"
                      className="  text-white w-full  "
                      name="distanceOkFrom">
                      <Select
                        options={distanceListTypes}
                        fullWidth
                        className=" h-16 w-full bg-[#fff9c5]"
                        disable={disabled.option2}
                        onChange={(e, d) => {
                          setSelectors({
                            ...selectors,
                            option2: true
                          });
                          setInitialValues({
                            ...initialValues,
                            distanceOkFrom: e
                          });
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col span={2} className=" flex items-center justify-center w-full h-full  mt-8">
                    {selectors.option2 ? (
                      <>
                        {' '}
                        <button
                          className=" w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center"
                          onClick={() => {
                            setSelectors({
                              ...selectors,
                              option2: false
                            });
                            setInitialValues({
                              ...initialValues,
                              distanceOkFrom: '',
                              distanceOkTo: ''
                            });
                          }}>
                          X
                        </button>
                      </>
                    ) : (
                      <>~</>
                    )}
                  </Col>
                  <Col span={11} md={8} className=" flex items-center mt-2">
                    <FormItem
                      fullWidth
                      layout="horizontal"
                      className="  text-white w-full  "
                      name="distanceOkTo">
                      <Select
                        options={distanceListTypes}
                        fullWidth
                        className=" h-16 w-full bg-[#fff9c5]"
                        disable={disabled.option2}
                        onChange={(e, d) => {
                          setSelectors({
                            ...selectors,
                            option2: true
                          });
                          setInitialValues({
                            ...initialValues,
                            distanceOkTo: e
                          });
                        }}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </>
            )}

            <Row className=" w-full flex items-start h-full !bg-[#587c94] border-b-[1px] border-white !mx-0 md:!-mx-2 ">
              <Col
                span={24}
                md={6}
                className=" w-full h-full py-3 md:py-6  text-white  font-bold  px-2 ">
                <h1 className=" text-sm  w-full h-full px-4 text-center md:text-left   ">
                  不動車・事故現状車
                </h1>
              </Col>

              <Col
                span={24}
                md={18}
                className=" w-full flex flex-col bg-white border-white border items-center md:items-start  pt-3 md:py-4 md:pt-6 h-full  px-0">
                {' '}
                <FormItem
                  fullWidth
                  layout="horizontal"
                  className="  text-white w-full flex items-center"
                  name="notMove"
                  rules={[
                    {
                      required: true,
                      message: 'このフィールドは必須です'
                    }
                  ]}>
                  <Radio
                    optionType="default"
                    options={InvolvedAccidenCheckList}
                    className="w-full  py-2"
                    onChange={(e) => setNotMove(e.target.value)}
                  />
                </FormItem>
                {notMove === 'OK' && (
                  <div className=" w-full ">
                    <AccidentDamageTable
                      immovableOkPattern={immovableOkPattern}
                      setImmovableOkPattern={setImmovableOkPattern}
                      initialState={initialImmovableState}
                    />
                  </div>
                )}
              </Col>
            </Row>
            {shopType === 'SPECIAL' && !flipToGeneral && (
              <Row className=" w-full flex items-start h-full  border-b-[1px] border-white  !mx-0 md:!-mx-2">
                <Col
                  span={24}
                  md={6}
                  className=" w-full h-full  py-6  text-white !bg-[#587c94] font-bold  px-2 ">
                  <h1 className=" text-sm  w-full h-full px-4  text-center md:text-left  ">
                    専門外車両案件
                  </h1>
                </Col>
                <Col span={24} md={18}>
                  <FormItem
                    fullWidth
                    layout="horizontal"
                    className="  text-white w-full "
                    name="notSpeciality">
                    <Radio
                      optionType="default"
                      options={nonSpecializedVehicleProjectList}
                      // label="営業時間"
                      className="w-full  py-2"
                    />
                  </FormItem>
                </Col>
              </Row>
            )}
            {(shopType === 'GENERAL' || flipToGeneral) && (
              <Row className=" w-full flex items-start h-full  border-b-[1px] border-white  ">
                <Col
                  span={24}
                  md={6}
                  className=" w-full h-full  py-6  text-white !bg-[#587c94] font-bold  px-2 ">
                  <h1 className=" text-sm  w-full h-full px-4 text-center md:text-left   ">
                    {' '}
                    買取店規模
                  </h1>
                </Col>

                <Col span={24} md={18}>
                  {' '}
                  <FormItem
                    fullWidth
                    layout="horizontal"
                    className="  text-white w-full "
                    name="scaleRank">
                    <Radio
                      optionType="default"
                      options={numberOptions}
                      // label="営業時間"
                      className="w-full  py-2"
                    />
                  </FormItem>
                </Col>
              </Row>
            )}
            <Row className=" w-full flex items-start h-full  border-b-[1px] border-white !mx-0 md:!-mx-2 ">
              <Col
                span={24}
                md={6}
                className=" w-full h-full  py-6  text-white !bg-[#587c94] font-bold  px-2 ">
                <h1 className=" text-sm  w-full h-full px-4  text-center md:text-left  ">
                  月間上限数
                </h1>
              </Col>

              <Col span={24} md={8} className=" flex items-center h-full pb-2 md:pb-0  ">
                <FormItem
                  fullWidth
                  layout="horizontal"
                  name="ceilCount"
                  className="text-white w-full"
                  rules={[
                    {
                      pattern: /^[1-9]\d*$/,
                      message: '0より大きい値を入力'
                    }
                  ]}>
                  <Input className="w-full bg-[#fff9c5] py-2" />
                </FormItem>
              </Col>
            </Row>
            <Row className=" w-full flex items-start h-full  border-b-[1px] border-white !mx-0 md:!-mx-2 ">
              <Col
                span={24}
                md={6}
                className=" w-full h-full  py-6  text-white !bg-[#587c94] font-bold  px-2 ">
                <h1 className=" text-sm  w-full h-full px-4 text-center md:text-left   ">
                  {' '}
                  売却時期未定
                </h1>
              </Col>

              <Col span={24} md={18} className=" flex items-center h-full  ">
                <FormItem
                  fullWidth
                  layout="horizontal"
                  className="  text-white w-full "
                  name="saleDateDetermination">
                  <Radio
                    optionType="default"
                    options={dateOfSalesList}
                    // label="営業時間"
                    className="w-full  py-2"
                  />
                </FormItem>
              </Col>
            </Row>

            {(shopType === 'GENERAL' || flipToGeneral) && (
              <>
                <Row className=" w-full flex items-start h-full  border-b-[1px] border-white mx-0 md:!-mx-2 ">
                  <Col span={24} md={6} className=" !bg-[#587c94]">
                    <div className=" w-full flex flex-col items-start h-full  ">
                      <label
                        className=" text-sm  w-full  h-20   py-6 text-white text-center md:text-left    font-bold  md:px-4   "
                        htmlFor="">
                        希望年式
                      </label>
                    </div>
                  </Col>
                  <Col span={24} md={18} className=" flex flex-col md:flex-row items-center ">
                    <Col
                      span={24}
                      md={9}
                      className=" flex items-center  gap-x-4 md:gap-0 pb-2 md:pb-0  ">
                      <FormItem
                        fullWidth
                        layout="horizontal"
                        className="  text-white w-full "
                        name="yearOkFrom">
                        <Select
                          options={yearListTypes}
                          fullWidth
                          className=" h-12 w-full bg-[#fff9c5]"
                        />
                      </FormItem>
                      <h1>~</h1>
                      <FormItem
                        fullWidth
                        layout="horizontal"
                        className="  text-white w-full "
                        name="yearOkTo">
                        <Select
                          options={yearListTypes}
                          fullWidth
                          className=" h-12 w-full bg-[#fff9c5]"
                        />
                      </FormItem>
                    </Col>
                    <Col span={24} md={6} className=" !bg-[#587c94] w-full">
                      <div className=" w-full flex flex-col items-start h-full   ">
                        <h1 className=" text-sm  w-full  h-20   py-6 text-white text-center md:text-left  font-bold  md:px-4   ">
                          NG年式
                        </h1>
                      </div>
                    </Col>
                    <Col
                      span={24}
                      md={9}
                      className=" flex items-center gap-x-4 md:gap-0 pb-2 md:pb-0  ">
                      <FormItem
                        fullWidth
                        layout="horizontal"
                        className="  text-white w-full "
                        name="yearNgFrom">
                        <Select
                          options={yearListTypes}
                          fullWidth
                          className=" h-12 w-full bg-[#fff9c5]"
                        />
                      </FormItem>
                      <h1>~</h1>
                      <FormItem
                        fullWidth
                        layout="horizontal"
                        className="  text-white w-full "
                        name="yearNgTo">
                        <Select
                          options={yearListTypes}
                          fullWidth
                          className=" h-12 w-full bg-[#fff9c5]"
                        />
                      </FormItem>
                    </Col>
                  </Col>
                </Row>
                <Row className=" w-full flex items-start h-full  border-b-[1px] border-white  ">
                  <Col span={24} md={6} className=" !bg-[#587c94]">
                    <div className=" w-full flex flex-col items-start h-full  ">
                      <label
                        className=" text-sm  w-full  h-20   py-6 text-white text-center md:text-left   font-bold  px-4  "
                        htmlFor="">
                        希望走行距離
                      </label>
                    </div>
                  </Col>
                  <Col span={24} md={18} className=" flex flex-col md:flex-row items-center ">
                    <Col
                      span={24}
                      md={9}
                      className=" flex items-center gap-x-4 md:gap-0 pb-2 md:pb-0   ">
                      <FormItem
                        fullWidth
                        layout="horizontal"
                        className="  text-white w-full "
                        name="distanceOkFrom">
                        <Select
                          options={distanceList}
                          fullWidth
                          className=" h-12 w-full bg-[#fff9c5]"
                        />
                      </FormItem>
                      <h1>~</h1>
                      <FormItem
                        fullWidth
                        layout="horizontal"
                        className="  text-white w-full "
                        name="distanceOkTo">
                        <Select
                          options={distanceList}
                          fullWidth
                          className=" h-12 w-full bg-[#fff9c5]"
                        />
                      </FormItem>
                    </Col>
                    <Col span={24} md={6} className=" !bg-[#587c94] w-full">
                      <div className=" w-full flex flex-col items-start h-full  ">
                        <label
                          className=" text-sm  w-full  h-20   py-6 text-white text-center md:text-left    font-bold  px-4   "
                          htmlFor="">
                          NG走行距離
                        </label>
                      </div>
                    </Col>
                    <Col
                      span={24}
                      md={9}
                      className=" flex items-center gap-x-4 md:gap-0 pb-2 md:pb-0  ">
                      <FormItem
                        fullWidth
                        layout="horizontal"
                        className="  text-white w-full "
                        name="distanceNgFrom">
                        <Select
                          options={distanceList}
                          fullWidth
                          className=" h-12 w-full bg-[#fff9c5]"
                        />
                      </FormItem>
                      <h1>~</h1>
                      <FormItem
                        fullWidth
                        layout="horizontal"
                        className="  text-white w-full "
                        name="distanceNgTo">
                        <Select
                          options={distanceList}
                          fullWidth
                          className=" h-12 w-full bg-[#fff9c5]"
                        />
                      </FormItem>
                    </Col>
                  </Col>
                </Row>
              </>
            )}
          </Col>
        </Row>
        <div className=" w-full flex items-center justify-center ">
          <Button
            htmlType="submit"
            className=" bg-orange-500 text-white  px-12 !py-6 my-10 rounded-md w-full max-w-[300px]"
            disabled={!domesticOrImport.domestic && !domesticOrImport.import}>
            登録する
          </Button>
        </div>
      </Form>

      {allShopAuthorized && (
        <div className=" w-screen h-screen fixed bg-transparent top-0 left-0 z-[80] backdrop-blur-md">
          <div className=" w-full h-full flex items-center justify-center ">
            <div className=" bg-white flex flex-col items-center justify-center gap-4 md:w-4/12 h-[20vh] p-4 shadow-sm shadow-[#f25f2a] border-[#f25f2a] border ">
              <h1>どちらのマッチング条件を選択しますか？ </h1>
              <div className=" flex items-center gap-4">
                <Button
                  className=" !text-[#f25f2a] !font-bold !border-2 !border-[#f25f2a]"
                  onClick={() => {
                    setFlipToGeneral(false);
                    setAllShopAuthorized(false);
                    setFetchShopType('SPECIAL');
                    setAllowToFetch(true);
                  }}>
                  専門店
                </Button>
                <Button
                  className=" !text-[#f25f2a] !font-bold !border-2 !border-[#f25f2a]"
                  onClick={() => {
                    setFlipToGeneral(true);
                    setAllShopAuthorized(false);
                    setFetchShopType('GENERAL');
                    setAllowToFetch(true);
                  }}>
                  一般店
                </Button>
              </div>
            </div>

            <div></div>
          </div>
        </div>
      )}
    </div>
  );
};
