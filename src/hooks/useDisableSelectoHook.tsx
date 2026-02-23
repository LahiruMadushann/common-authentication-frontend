"use client"
import { useEffect } from 'react';

type disableHooktype = {
  setDisabled: any;
  selectors: any;
};
export const useDisableSelectoHook = (props: disableHooktype) => {
  const { selectors, setDisabled } = props;
  useEffect(() => {
    if (
      !selectors.selector1 &&
      !selectors.selector2 &&
      !selectors.selector3 &&
      !selectors.option1 &&
      !selectors.option2
    ) {
      setDisabled({
        selector1: false,
        selector2: false,
        selector3: false,
        option1: false,
        option2: false
      });
    } else if (
      selectors.selector1 &&
      !selectors.selector2 &&
      (selectors.option1 || selectors.option2)
    ) {
      setDisabled({
        selector1: false,
        selector2: true,
        selector3: true,
        option1: false,
        option2: false
      });
    } else if (selectors.selector1 && selectors.selector3) {
      setDisabled({
        selector1: false,
        selector2: true,
        selector3: false,
        option1: true,
        option2: true
      });
    } else if (selectors.selector1 && !selectors.option1 && !selectors.option2) {
      setDisabled({
        selector1: false,
        selector2: true,
        selector3: false,
        option1: false,
        option2: false
      });
    } else if (selectors.selector2 && !selectors.selector1 && !selectors.selector3) {
      setDisabled({
        selector1: true,
        selector2: false,
        selector3: true,
        option1: false,
        option2: false
      });
    } else if (!selectors.selector2 && selectors.selector3) {
      setDisabled({
        selector1: false,
        selector2: true,
        selector3: false,
        option1: false,
        option2: false
      });
    }
  }, [selectors]);
};
