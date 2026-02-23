import React, { useState, useEffect, useRef } from 'react';
import { Checkbox } from 'antd';
import { hasNonNullValues } from '@/src/layouts/matchingConditions/functions/checkNullValues';
import { useSelectAllStore } from '../../stores/selectAllStore';
import { useSelectedTypeStore } from '../../stores/selectors.store';

interface ScrollSelectorProps {
  data: any[];
  checkedValues: Record<string, any>;
  setCheckedValues: (values: Record<string, any>) => void;
  disabled?: boolean;
  type?: string;
  modalType?: string;
  hidden?: boolean;
}

export const ScrollSelector = (props: ScrollSelectorProps) => {
  const [selectAll, setSelectAll] = useState(false);
  const { setSelecteAllAction } = useSelectAllStore();
  const [checkedValues, setChekedValues] = useState({});
  const { setSelectors, selectors } = useSelectedTypeStore();

  // Refs to store checked values, initial values, and previous values
  const checkedValuesRef = useRef<any>({});
  const initialCheckedValuesRef = useRef({});
  const prevSelectAllRef = useRef(false);

  const handleUncheckAll = () => {
    setSelectAll(false);

    // Uncheck all items
    const updatedCheckedValues: any = {};
    props.data.forEach((item: any) => {
      updatedCheckedValues[item.key] = null;
    });

    checkedValuesRef.current = updatedCheckedValues;
    props.setCheckedValues(updatedCheckedValues);
    handleUpdate();
  };

  // Update refs and state on props change
  useEffect(() => {
    initialCheckedValuesRef.current = props.checkedValues || {};
    checkedValuesRef.current = { ...initialCheckedValuesRef.current };
    if (Object.keys(checkedValues).length == 0) {
      setChekedValues(checkedValuesRef.current);
    }
    // Check if all items are selected based on initial values
    const allChecked = props.data.every((item: any) => checkedValuesRef.current[item.key]);
    if (allChecked !== selectAll) {
      setSelectAll(allChecked);
      prevSelectAllRef.current = allChecked;
    }

    const newSelectAllAction = checkAllSelectors(allChecked, props.modalType);
    if (Object.keys(newSelectAllAction).length > 0) {
      setSelecteAllAction(newSelectAllAction);
    }
  }, [props.checkedValues, props.data, props.modalType, selectAll]);

  const checkAllSelectors = (allChecked: any, type: any) => {
    const newSelectAllAction: any = {};
    if (prevSelectAllRef.current !== allChecked) {
      switch (type) {
        case 'okMakes':
          newSelectAllAction.okMakes = allChecked;
          break;
        case 'okCarTypes':
          newSelectAllAction.okCarTypes = allChecked;
          break;
        case 'okBodyTypes':
          newSelectAllAction.okBodyTypes = allChecked;
          break;
        case 'ngCarTypes':
          newSelectAllAction.ngCarTypes = allChecked;
          break;
        case 'ngBodyTypes':
          newSelectAllAction.ngBodyTypes = allChecked;
          break;
        case 'ngMakes':
          newSelectAllAction.ngMakes = allChecked;
          break;
        default:
          break;
      }
      prevSelectAllRef.current = allChecked;
    }
    return newSelectAllAction;
  };

  useEffect(() => {
    if (Object.keys(checkedValues).length > 0) {
      handleUpdate();
    }
  }, [checkedValues]);

  const handleUpdate = () => {
    if (props.type === 'selector1' && hasNonNullValues(checkedValuesRef.current)) {
      setSelectors({
        ...selectors,
        selector1: true
      });
    } else if (!hasNonNullValues(checkedValuesRef.current) && props.type === 'selector1') {
      setSelectors({
        ...selectors,
        selector1: false
      });
    }

    if (props.type === 'selector3' && hasNonNullValues(checkedValuesRef.current)) {
      setSelectors({
        ...selectors,
        selector3: true
      });
    } else if (!hasNonNullValues(checkedValuesRef.current) && props.type === 'selector3') {
      setSelectors({
        ...selectors,
        selector3: false
      });
    }

    const newSelectAllAction = checkAllSelectors(false, props.modalType);
    if (Object.keys(newSelectAllAction).length > 0) {
      setSelecteAllAction(newSelectAllAction);
    }
  };

  const handleCheckboxChange = (item: any, checked: any) => {
    const updatedCheckedValues = {
      ...checkedValuesRef.current,
      [item.key]: checked ? item.value : null
    };

    checkedValuesRef.current = updatedCheckedValues;
    props.setCheckedValues(updatedCheckedValues);
    handleUpdate();
  };

  const handleSelectAllChange = (e: any) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    const updatedCheckedValues: any = {};
    props.data.forEach((item: any) => {
      updatedCheckedValues[item.key] = checked ? item.value : null;
    });

    checkedValuesRef.current = updatedCheckedValues;
    props.setCheckedValues(updatedCheckedValues);
    handleUpdate();
  };

  return (
    <>
      <h1 className=" w-full text-left cursor-pointer " onClick={handleUncheckAll}>
        選択解除
      </h1>
      <div className="w-full border-[1px] border-blue-400 my-2">
        <div className={`${props?.hidden ? '!hidden' : 'w-full p-4'}`}>
          <Checkbox checked={selectAll} onChange={handleSelectAllChange} disabled={props.disabled}>
            すべて選択
          </Checkbox>
        </div>
        <div className="w-full p-4 mb-2 h-[30rem] overflow-y-auto">
          {props.data.map((item: any) => (
            <div key={item.key} className="w-full">
              <Checkbox
                checked={
                  checkedValuesRef.current[item.key] !== null &&
                  checkedValuesRef.current[item.key] !== undefined
                }
                onChange={(e) => handleCheckboxChange(item, e.target.checked)}
                disabled={props.disabled}>
                {item.label}
              </Checkbox>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
