import React, { useState, useEffect, useRef } from "react";
import { Checkbox} from "antd";
import {CheckboxChangeEvent} from 'antd/es/checkbox';
import { useDisabledStore } from "@/src/stores/disable.store";
import { hasNonNullValues } from "@/src/layouts/matchingConditions/functions/checkNullValues";
import { useSelectAllStore } from "@/src/stores/selectAllStore";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { useSelectedTypeStore } from "@/src/stores/selectors.store";

interface DataItem {
  key: string;
  label: string;
  value: any;
  children?: DataItem[];
}

interface NestedSelectAll {
  [key: string]: {
    all: boolean;
    some: boolean;
  };
}

interface Props {
  data: DataItem[];
  checkedValues: { [key: string]: any };
  setCheckedValues: (values: { [key: string]: any }) => void;
  disabled: boolean;
  type: string;
  modalType: string;
}

// Constants for loading state
const LOADING = 1;
const LOADED = 2;
let itemStatusMap: { [key: number]: number } = {};

// Helper functions
const isItemLoaded = (index: number) => !!itemStatusMap[index];
const loadMoreItems = (startIndex: number, stopIndex: number): Promise<void> => {
  for (let index = startIndex; index <= stopIndex; index++) {
    itemStatusMap[index] = LOADING;
  }
  return new Promise((resolve) =>
    setTimeout(() => {
      for (let index = startIndex; index <= stopIndex; index++) {
        itemStatusMap[index] = LOADED;
      }
      resolve();
    }, 1000)
  );
};

export const NestedScrollSelector: React.FC<Props> = (props) => {
  const [selectAll, setSelectAll] = useState(false);
  const [nestedSelectAll, setNestedSelectAll] = useState<NestedSelectAll>({});
  const { setSelecteAllAction } = useSelectAllStore();
  const { selectors, setSelectors } = useSelectedTypeStore();
  const [disableAll, setDisableAll] = useState(false);
  const [checkedValues, setChekedValues] = useState<{ [key: string]: any }>({});

  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

  // Refs to store checked values and initial values
  const checkedValuesRef = useRef<{ [key: string]: any }>({});
  const initialCheckedValuesRef = useRef<{ [key: string]: any }>({});
  const prevSelectAllRef = useRef(false);

  const handleUncheckAll = () => {
    setSelectAll(false);
    setDisableAll(false);
    // Uncheck all items
    const updatedCheckedValues: { [key: string]: any } = {};
    props.data.forEach((item) => {
      updatedCheckedValues[item.key] = null;
    });

    checkedValuesRef.current = updatedCheckedValues;
    props.setCheckedValues(updatedCheckedValues);
    handleUpdate();
  };

  const handleToggleExpand = (key: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    // Initialize initial values
    initialCheckedValuesRef.current = props.checkedValues || {};
    checkedValuesRef.current = { ...initialCheckedValuesRef.current };

    if (Object.keys(checkedValues).length === 0) {
      setChekedValues(checkedValuesRef.current);
    }
    // Update select-all state and nested select-all state
    const allChecked = props.data.every((item) =>
      item.children
        ? item.children.every(
            (child) =>
              checkedValuesRef.current[child.key] !== null &&
              checkedValuesRef.current[child.key] !== undefined
          )
        : checkedValuesRef.current[item.key] !== null &&
          checkedValuesRef.current[item.key] !== undefined
    );
    if (allChecked !== selectAll) {
      setSelectAll(allChecked);
      setDisableAll(true);
      prevSelectAllRef.current = allChecked;
    }
    const newSelectAllAction = checkAllSelectors(allChecked, props.modalType);
    if (Object.keys(newSelectAllAction).length > 0) {
      setSelecteAllAction(newSelectAllAction);
    }

    // Update nested select-all state
    const updatedNestedSelectAll: NestedSelectAll = {};
    props.data.forEach((item) => {
      if (item.children) {
        const allChildrenChecked = item.children.every(
          (child) =>
            checkedValuesRef.current[child.key] !== null &&
            checkedValuesRef.current[child.key] !== undefined
        );
        const someChildrenChecked = item.children.some(
          (child) =>
            checkedValuesRef.current[child.key] !== null &&
            checkedValuesRef.current[child.key] !== undefined
        );
        updatedNestedSelectAll[item.key] = {
          all: allChildrenChecked,
          some: someChildrenChecked,
        };
      }
    });
    setNestedSelectAll(updatedNestedSelectAll);
  }, [
    props.checkedValues,
    checkedValues,
    props.data,
    props.modalType,
    selectAll,
    disableAll,
  ]);

  const checkAllSelectors = (allChecked: boolean, type: string) => {
    const newSelectAllAction: { [key: string]: boolean } = {};
    if (prevSelectAllRef.current !== allChecked) {
      switch (type) {
        case "okMakes":
          newSelectAllAction.okMakes = allChecked;
          break;
        case "okCarTypes":
          newSelectAllAction.okCarTypes = allChecked;
          break;
        case "okBodyTypes":
          newSelectAllAction.okBodyTypes = allChecked;
          break;
        case "ngCarTypes":
          newSelectAllAction.ngCarTypes = allChecked;
          break;
        case "ngBodyTypes":
          newSelectAllAction.ngBodyTypes = allChecked;
          break;
        case "ngMakes":
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
    if (
      props.type === "selector2" &&
      hasNonNullValues(checkedValuesRef.current)
    ) {
      setSelectors({
        ...selectors,
        selector2: true,
      });
    } else if (
      !hasNonNullValues(checkedValuesRef.current) &&
      props.type === "selector2"
    ) {
      setSelectors({
        ...selectors,
        selector2: false,
      });
    }
    const newSelectAllAction = checkAllSelectors(false, props.modalType);
    if (Object.keys(newSelectAllAction).length > 0) {
      setSelecteAllAction(newSelectAllAction);
    }

    // Transform checked values to the desired format
    const transformedValues = transformCheckedValues();
    console.log("Transformed Values:", transformedValues);
    // Use `transformedValues` to send the request or update the state
  };

  const transformCheckedValues = () => {
    const transformed: { [key: string]: any[] } = {
      okCarTypes: [],
      specialCarType: [],
      ngCarTypes: [],
    };
    props.data.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          if (checkedValuesRef.current[child.key]) {
            transformed[props.modalType].push({
              carType: child.label, // Use the label for carType
              carMaker: item.label,
            });
          }
        });
      } else if (checkedValuesRef.current[item.key]) {
        transformed[props.modalType].push({
          carType: item.label, // Use the label for carType
          carMaker: item.label,
        });
      }
    });
    return transformed;
  };

  const handleCheckboxChange = (item: DataItem, e: CheckboxChangeEvent) => {
    const updatedCheckedValues: { [key: string]: any } = {
      ...checkedValuesRef.current,
      [item.key]: e.target.checked ? item.value : null,
    };
    checkedValuesRef.current = updatedCheckedValues;
    props.setCheckedValues(updatedCheckedValues);
    handleUpdate();
  };

  const handleNestedCheckboxChange = (parentItem: DataItem | null, child: DataItem, e: CheckboxChangeEvent) => {
    const updatedCheckedValues: { [key: string]: any } = {
      ...checkedValuesRef.current,
      [child.key]: e.target.checked ? child.value : null,
    };
    checkedValuesRef.current = updatedCheckedValues;
    props.setCheckedValues(updatedCheckedValues);
    handleUpdate();
  };

  const handleSelectAllChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    const updatedCheckedValues: { [key: string]: any } = {};
    props.data.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          updatedCheckedValues[child.key] = checked ? child.value : null;
        });
      } else {
        updatedCheckedValues[item.key] = checked ? item.value : null;
      }
    });
    checkedValuesRef.current = updatedCheckedValues;
    props.setCheckedValues(updatedCheckedValues);
    setDisableAll(!disableAll);
    handleUpdate();
  };

  const handleNestedSelectAllChange = (parentItem: DataItem, e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    setNestedSelectAll((prev) => ({
      ...prev,
      [parentItem.key]: {
        all: checked,
        some: checked,
      },
    }));
    const updatedCheckedValues: { [key: string]: any } = {};
    parentItem.children?.forEach((child) => {
      updatedCheckedValues[child.key] = checked ? child.value : null;
    });
    checkedValuesRef.current = {
      ...checkedValuesRef.current,
      ...updatedCheckedValues,
    };
    props.setCheckedValues(updatedCheckedValues);
    handleUpdate();
  };

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = props.data[index];
    let content;

    if (itemStatusMap[index] === LOADED) {
      content = (
        <div key={item.key} style={style}>
          <Checkbox
            checked={
              item.children
                ? nestedSelectAll[item.key]?.all || false
                : checkedValuesRef.current[item.key] !== null &&
                  checkedValuesRef.current[item.key] !== undefined
            }
            indeterminate={item.children && nestedSelectAll[item.key]?.some}
            onChange={(e) =>
              item.children
                ? handleNestedSelectAllChange(item, e)
                : handleCheckboxChange(item, e)
            }
            disabled={props.disabled}
          >
            {item.label}
          </Checkbox>
          {item.children && (
            <div className="pl-4">
              {item.children.map((child) => (
                <div key={child.key} className="w-full">
                  <Checkbox
                    checked={
                      checkedValuesRef.current[child.key] !== null &&
                      checkedValuesRef.current[child.key] !== undefined
                    }
                    onChange={(e) =>
                      handleNestedCheckboxChange(item, child, e)
                    }
                    disabled={props.disabled}
                  >
                    {child.label}
                  </Checkbox>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    } else {
      content = <div style={style}>Loading...</div>;
    }

    return content;
  };

  const renderChildren = (children: DataItem[]) => (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={children.length}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <List
          height={200}
          itemCount={children.length}
          itemSize={18}
          onItemsRendered={onItemsRendered}
          ref={ref}
          width="100%"
        >
          {({ index, style }) => {
            const child = children[index];
            return (
              <div key={child.key} style={style} className="w-full">
                <Checkbox
                  checked={
                    checkedValuesRef.current[child.key] !== null &&
                    checkedValuesRef.current[child.key] !== undefined
                  }
                  onChange={(e) =>
                    handleNestedCheckboxChange(null, child, e)
                  }
                  disabled={props.disabled || disableAll}
                >
                  {child.label}
                </Checkbox>
              </div>
            );
          }}
        </List>
      )}
    </InfiniteLoader>
  );

  return (
    <>
      <h1
        className=" w-full text-left cursor-pointer "
        onClick={handleUncheckAll}
      >
        選択解除
      </h1>
      <div className="w-full border-[1px] border-blue-400 my-2">
        <div className="w-full p-4">
          <Checkbox
            checked={selectAll}
            onChange={handleSelectAllChange}
            disabled={props.disabled}
          >
            すべて選択
          </Checkbox>
        </div>
        <div className="w-full p-4 mb-2 h-[30rem] overflow-y-auto">
          {props.data.map((item) => (
            <div key={item.key} className="w-full">
              <Checkbox
                className={`${item.children ? "hide-checkbox" : ""}`} // Apply the class conditionally
                checked={
                  item.children
                    ? nestedSelectAll[item.key]?.all || false
                    : checkedValuesRef.current[item.key] !== null &&
                      checkedValuesRef.current[item.key] !== undefined
                }
                indeterminate={item.children && nestedSelectAll[item.key]?.some}
                onChange={(e) =>
                  item.children
                    ? handleToggleExpand(item.key)
                    : handleCheckboxChange(item, e)
                }
                disabled={props.disabled || disableAll}
              >
                {item.label}
              </Checkbox>
              {expandedItems[item.key] && item.children && (
                <div className="pl-4">{renderChildren(item.children)}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};