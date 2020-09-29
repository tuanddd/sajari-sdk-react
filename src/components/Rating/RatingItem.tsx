/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import tw, { styled, theme } from "twin.macro";
import Box from "../Box";
import { RatingItemProps } from "./types";

const StyledFirstHalf = styled<any, { half: boolean; flipped: boolean }>(Box)`
  ${tw`absolute top-0 w-1/2 h-full overflow-hidden select-none`}
  & > * {
    flex-shrink: 0;
  }
  ${({ flipped }) =>
    flipped ? tw`flex flex-row-reverse right-0` : tw`flex flex-row left-0`};
  color: ${({ half }) => (half ? theme`colors.orange.400` : "inherit")};
`;

const StyledSecondHalf = styled<any, { half: boolean }>(Box)`
  display: flex;
  color: inherit;
`;

export const RatingItem = ({
  character,
  half = false,
  active,
  flipped = false,
  count,
  index
}: RatingItemProps) => {
  const characterNode =
    typeof character === "function" ? character() : character;

  return (
    <Box
      as="li"
      css={
        active && !half
          ? tw`relative m-0 p-0 inline-block text-orange-400`
          : tw`relative m-0 p-0 inline-block text-gray-300`
      }
    >
      <Box aria-setsize={count} aria-posinset={index + 1}>
        <StyledFirstHalf flipped={flipped} half={half}>
          {characterNode}
        </StyledFirstHalf>
        <StyledSecondHalf>{characterNode}</StyledSecondHalf>
      </Box>
    </Box>
  );
};
