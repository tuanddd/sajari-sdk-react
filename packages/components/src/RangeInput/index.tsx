/** @jsx jsx */
import { jsx } from '@emotion/core';
import { AriaTextFieldOptions, useTextField } from '@react-aria/textfield';
import React from 'react';
import { useRanger } from 'react-ranger';
import tw from 'twin.macro';

import { __DEV__ } from '../utils/assertion';
import { Input } from './input';
import { Handle, Segment, Track, ValueTip } from './styled';
import { RangeInputProps } from './types';

const RangeInput = React.forwardRef(
  (
    { filter, leftInput: leftInputFunc, rightInput: rightInputFunc }: RangeInputProps,
    ref?: React.Ref<HTMLDivElement>,
  ) => {
    const limit = filter.limit();
    const [min, max] = limit;
    const [range, setRange] = React.useState(filter.getRange());
    const { getTrackProps, segments, handles } = useRanger({
      stepSize: 1,
      min,
      max,
      values: range,
      onChange: setRange,
    });
    const leftRef = React.useRef(null);
    const rightRef = React.useRef(null);

    const handleRangeInputChange = (left: boolean) => (v: string) => {
      const value = parseInt(v, 10);
      setRange((r) => (left ? [Number.isNaN(value) ? min : value, r[1]] : [r[0], Number.isNaN(value) ? max : value]));
    };

    const handleSwitchRange = () => {
      const [from, to] = range;
      if (from > to) {
        setRange([to, from]);
      }
    };

    React.useEffect(() => {
      filter.set(range[0], range[1]);
    }, [range]);

    const inputProps = {
      min,
      max,
      type: 'number',
      inputMode: 'numeric' as AriaTextFieldOptions['inputMode'],
      onBlur: handleSwitchRange,
      css: tw`w-10`,
    };

    const leftInputProps = {
      ...inputProps,
      value: range[0].toString(),
      onChange: handleRangeInputChange(true),
    };

    const rightInputProps = {
      ...inputProps,
      value: range[1].toString(),
      onChange: handleRangeInputChange(false),
    };

    const leftInput = leftInputFunc ? (
      leftInputFunc({
        getCustomInputProps: useTextField.bind(undefined, leftInputProps, leftRef),
      })
    ) : (
      <Input {...leftInputProps} label="Range input left bound" />
    );

    const rightInput = rightInputFunc ? (
      rightInputFunc({
        getCustomInputProps: useTextField.bind(undefined, rightInputProps, rightRef),
      })
    ) : (
      <Input {...rightInputProps} label="Range input right bound" />
    );

    return (
      <div ref={ref} css={tw`flex flex-col`}>
        <Track {...getTrackProps()}>
          {segments.map(({ getSegmentProps }, i) => (
            <Segment index={i} {...getSegmentProps()} />
          ))}
          {handles.map(({ value, active, getHandleProps }) => (
            <button
              type="button"
              {...getHandleProps({
                style: { appearance: 'none', border: 'none', background: 'transparent', outline: 'none' },
              })}
            >
              <Handle active={active}>
                <ValueTip>{value}</ValueTip>
              </Handle>
            </button>
          ))}
        </Track>
        <div css={tw`flex flex-col items-center justify-between sm:flex-row`}>
          {leftInput}
          &ndash;
          {rightInput}
        </div>
      </div>
    );
  },
);

if (__DEV__) {
  RangeInput.displayName = 'RangeInput';
}

export default RangeInput;
export type { RangeInputProps };
