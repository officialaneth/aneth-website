import { ChevronRightIcon } from "@chakra-ui/icons";
import { Button, Heading, Text, VStack, Wrap } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useNavigate } from "react-router-dom";
import { StakingInfoContainer } from "../../../../components/StakingUI/StakingInfoContainer";
import { StakingInfoV2Container } from "../../../../components/StakingUI/StakingInfoV2Container";
import { TokenSymbol } from "../../../../constants";

export const StakingIDCardV2 = ({
  tokenSymbol,
  anusdSymbol,
  stakingIDs,
}: {
  tokenSymbol: string;
  anusdSymbol: string;
  stakingIDs: BigNumber[] | [];
}) => {
  return (
    <Wrap w="full" p={2} spacing={10} align="center" justify="center">
      {stakingIDs.map((stakingID: BigNumber, key: number) => {
        return (
          <StakingInfoV2Container
            stakingID={stakingID?.toString()}
            tokenSymbol={tokenSymbol}
            anusdSymbol={anusdSymbol}
            key={key}
          ></StakingInfoV2Container>
        );
      })}
    </Wrap>
  );
};
