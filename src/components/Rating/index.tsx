/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import tw, { styled } from "twin.macro";
import { Star } from "../../assets/icons";
import Box from "../Box";
import { RatingItem } from "./RatingItem";
import { RatingProps } from "./types";

const StyledBox = styled<any, { flipped: boolean }>(Box)`
  ${({ flipped }) =>
    flipped
      ? tw`inline-flex flex-row-reverse items-center space-x-1 space-x-reverse`
      : tw`inline-flex items-center space-x-1`};
`;

const Rating = React.forwardRef(
  (
    {
      value,
      children,
      character = <Star css={tw`fill-current`} />,
      max = 5,
      direction = "ltr"
    }: RatingProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const isHalf = Math.round(value) - value !== 0;
    const remainder = max - Math.ceil(value);
    const flipped = direction === "rtl";

    return (
      <StyledBox flipped={flipped} ref={ref}>
        {Array.from(Array(Math.floor(value))).map((k, i) => (
          <RatingItem
            index={i}
            count={max}
            character={character}
            active={true}
          />
        ))}
        {isHalf ? (
          <RatingItem
            index={Math.ceil(value) - Math.floor(value)}
            count={max}
            flipped={flipped}
            character={character}
            active={true}
            half={true}
          />
        ) : null}
        {Array.from(Array(remainder)).map((k, i) => (
          <RatingItem
            index={i}
            count={max}
            character={character}
            active={false}
          />
        ))}
        <span css={tw`sr-only`}>{`${value} stars`}</span>
        {children ? children : null}
      </StyledBox>
    );
  }
);

export default Rating;
