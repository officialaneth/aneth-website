// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IERC20_EXTENDED {
    function name() external view returns (string memory);

    function decimals() external view returns (uint256);
}

interface IVariables {
    function referralContract() external view returns (address);

    function stakingContract() external view returns (address);

    function tokenContract() external view returns (address);

    function anusdContract() external view returns (address);

    function usdtContract() external view returns (address);

    function uniswapV2RouterContract() external view returns (address);

    function tokenContractOwner() external view returns (address);

    function rewardContract() external view returns (address);

    function rewardContractOwner() external view returns (address);

    function adminFees() external view returns (uint256);
}

struct StructAccount {
    address referrer;
    address[] referee;
    address[] team;
    uint256[] topUp;
    uint256 selfBusiness;
    uint256 directBusiness;
    uint256 totalBusiness;
    uint256[] rewardsPaidReferral;
    uint256[] rewardsPaidGlobal;
    uint256[] rewardPaidPassive;
    bool isInGlobalID;
}

struct StructRewards {
    uint8 id;
    uint256 selfBusinessLimit;
    uint256 directBusinessLimit;
    uint256 teamBusinessLimit;
    string rankName;
    string rewardName;
    uint256 appraisal;
    uint256 topUpValueLimit;
    uint256 topUp;
}

contract RewardsUpgradeable is
    Initializable,
    PausableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address private _variablesContract;
    mapping(uint8 => StructRewards) public rewards;

    function initialize() public initializer {
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
