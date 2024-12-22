import { Select } from 'antd';
const { Option } = Select;
import React, { useState, useEffect, useRef, Children } from 'react';
const allOptionValue = `all-${Math.random()}`;

const SelectWithAll = (props) => {
  const {
    mode = 'single',
    allLabel = '全部',
    defaultValue = [],
    children,
    ...rest
  } = props;
  const [innerValue, setInnerValue] = useState(defaultValue);
  const allOptionsRef = useRef();

  useEffect(() => {
    const allOptions = new Set();
    Children.map(children, (child) => {
      if (child.type === Option) {
        allOptions.add(child.props.value);
      }
    });
    allOptionsRef.current = [...allOptions];
  }, [children?.length]);

  const onChange = (currentValue = []) => {
    const value = props.value || innerValue;
    let preIsAll = value?.length > 0 && value?.length === children?.length;
    let newValue = [];
    if (preIsAll) {
      if (!currentValue.includes(allOptionValue)) {
        // 说明是点击 全选option，取消全选
        newValue = [];
      } else {
        // 说明是点击 非全选option，取消点击的 option，同时取消全选 option
        newValue = currentValue.filter((item) => item !== allOptionValue);
      }
    } else {
      if (currentValue.includes(allOptionValue)) {
        // 说明是点击 全选option，全选
        newValue = allOptionsRef.current;
      } else {
        newValue = currentValue;
      }
    }
    setInnerValue(newValue);
    props.onChange?.(newValue);
  };

  const getValue = () => {
    let value = props.value || innerValue;
    return value?.length > 0 && value?.length === children?.length
      ? allOptionValue
      : value;
  };

  return (
    <Select {...rest} mode={mode} value={getValue()} onChange={onChange}>
      <Option value={allOptionValue} key={allOptionValue}>
        {allLabel}
      </Option>
      {children}
    </Select>
  );
};

SelectWithAll.Option = Option;
export default SelectWithAll;