import { Wrap } from "@chakra-ui/react";
import { StakingInfoContainer } from "../../../../components/StakingUI/StakingInfoContainer";

export const StakingIDCard = ({
  tokenSymbol,
  anusdSymbol,
}: {
  tokenSymbol: string;
  anusdSymbol: string;
}) => {
  const stakings = ["1", "2", "3", "4"];
  return (
    <Wrap w="full" p={2} spacing={10} align="center" justify="center">
      {stakings?.map((stakingID: string, key: number) => {
        return (
          <StakingInfoContainer
            stakingID={stakingID}
            tokenSymbol={tokenSymbol}
            anusdSymbol={anusdSymbol}
            key={key}
          ></StakingInfoContainer>
        );
      })}
    </Wrap>
  );
};
