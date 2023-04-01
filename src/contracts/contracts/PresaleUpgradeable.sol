//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

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
}

interface IStaking {
    function stakeByAdmin(
        address _userAddress,
        uint256 _value
    ) external returns (bool);
}

interface IReferral {
    function hasReferrer(address _address) external view returns (bool);

    function addReferrerAdmin(
        address _userAddress,
        address _referrerAddress
    ) external returns (bool);

    function payReferralETHAdmin(
        uint256 _value,
        address _userAddress,
        address _referrerAddress
    ) external returns (bool);

    function payReferralUSDAdmin(
        uint256 _value,
        address _userAddress,
        address _referrerAddress
    ) external returns (bool);

    function getLevelDecimals() external view returns (uint256);

    function getLevelRates()
        external
        view
        returns (
            uint256[] memory presale,
            uint256 totalRatePresale,
            uint256[] memory staking,
            uint256 totalRateStaking
        );

    function getUserReferrerAddress(
        address _address
    ) external view returns (address referrer);
}

interface IUniswapRouter {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory);

    function quote(
        uint amountA,
        uint reserveA,
        uint reserveB
    ) external pure returns (uint amountB);

    function getAmountOut(
        uint amountIn,
        uint reserveIn,
        uint reserveOut
    ) external pure returns (uint amountOut);

    function getAmountIn(
        uint amountOut,
        uint reserveIn,
        uint reserveOut
    ) external pure returns (uint amountIn);

    function getAmountsOut(
        uint amountIn,
        address[] calldata path
    ) external view returns (uint[] memory amounts);

    function getAmountsIn(
        uint amountOut,
        address[] calldata path
    ) external view returns (uint[] memory amounts);
}

contract PresaleUpgradeable is
    Initializable,
    OwnableUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    using SafeMathUpgradeable for uint256;

    address private _variableContrtact;

    uint256 private _rewardPerAUSD;
    uint256 private _minContributionUSD;

    uint256 private _totalTokenSold;
    uint256 private _totalAUSDRaised;

    uint256 private _adminFees;

    bool private _isBuyNStake;
    bool private _isPayReferral;
    bool private _isPayRewardTokens;

    receive() external payable {}

    event TokenPurchased(
        address indexed from,
        uint256 indexed tokenValue,
        uint256 indexed ethValue,
        string currency
    );

    event RewardTokenDistributed(
        address indexed to,
        uint256 indexed tokenValue,
        address indexed rewardTokenContract
    );

    function initialize() external initializer {
        _variableContrtact = 0x64f0F2FA59a92Df28bE30876958023A69689D88c;
        _rewardPerAUSD = 1000000000000000;
        _minContributionUSD = 20000000000000000000;
        _adminFees = 2000000000000000000;
        _isBuyNStake = false;
        _isPayReferral = false;
        _isPayRewardTokens = false;
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function getAnalystics()
        external
        view
        returns (uint256 tokenSold, uint256 ausdRaised)
    {
        tokenSold = _totalTokenSold;
        ausdRaised = _totalAUSDRaised;
    }

    function getVariablesContract() external view returns (address) {
        return _variableContrtact;
    }

    function setVariablesContract(address _contractAddress) external onlyOwner {
        _variableContrtact = _contractAddress;
    }

    function _stake(
        address _address,
        uint256 _tokenValue
    ) private returns (bool) {
        return
            IStaking(IVariables(_variableContrtact).stakingContract())
                .stakeByAdmin(_address, _tokenValue);
    }

    function buyFromUniswap(
        address _tokenInContract,
        uint256 _tokenInAmount,
        address _tokenOutContract
    ) private returns (uint256[] memory) {
        address[] memory tokensContracts = new address[](2);
        tokensContracts[0] = _tokenInContract;
        tokensContracts[1] = _tokenOutContract;

        IERC20Upgradeable(_tokenInContract).approve(
            IVariables(_variableContrtact).uniswapV2RouterContract(),
            _tokenInAmount
        );

        uint[] memory amounts = IUniswapRouter(
            IVariables(_variableContrtact).uniswapV2RouterContract()
        ).swapExactTokensForTokens(
                _tokenInAmount,
                1,
                tokensContracts,
                address(this),
                block.timestamp + 100
            );

        return amounts;
    }

    function BuyWithANUSD(
        // address _referrer,
        uint256 _valueInWei
    ) external whenNotPaused {
        address _msgSender = msg.sender;
        uint256 _msgValue = _valueInWei;

        require(
            _msgValue >= _minContributionUSD,
            "AUSD value less then min buy value."
        );

        IERC20Upgradeable(IVariables(_variableContrtact).anusdContract())
            .transferFrom(_msgSender, address(this), _msgValue);

        // uint256 _rewardValue = _msgValue *
        //     (_rewardPerAUSD /
        //         IERC20_EXTENDED(IVariables(_variableContrtact).rewardContract())
        //             .decimals());

        // uint256[] memory amounts =

        buyFromUniswap(
            IVariables(_variableContrtact).anusdContract(),
            _msgValue - _adminFees,
            IVariables(_variableContrtact).tokenContract()
        );

        // if (_isPayReferral) {
        //     IERC20Upgradeable(IVariables(_variableContrtact).anusdContract())
        //         .transfer(
        //             IVariables(_variableContrtact).referralContract(),
        //             _msgValue
        //         );

        //     IReferral(IVariables(_variableContrtact).referralContract())
        //         .payReferralUSDAdmin(_msgValue, _msgSender, _referrer);
        // }

        // if (_isBuyNStake) {
        //     _stake(_msgSender, amounts[1]);
        // } else {
        //     IERC20Upgradeable(IVariables(_variableContrtact).tokenContract())
        //         .transfer(_msgSender, amounts[1]);
        // }

        // if (
        //     IERC20Upgradeable(IVariables(_variableContrtact).rewardContract())
        //         .allowance(
        //             IVariables(_variableContrtact).rewardContractOwner(),
        //             address(this)
        //         ) < _rewardValue
        // ) {
        //     _isPayRewardTokens = false;
        // }

        // if (_isPayRewardTokens) {
        //     IERC20Upgradeable(IVariables(_variableContrtact).rewardContract())
        //         .transferFrom(
        //             IVariables(_variableContrtact).rewardContractOwner(),
        //             _msgSender,
        //             _rewardValue
        //         );
        //     emit RewardTokenDistributed(
        //         _msgSender,
        //         _rewardValue,
        //         IVariables(_variableContrtact).rewardContract()
        //     );
        // }
    }

    function getCapping()
        external
        view
        returns (
            uint256 minConUSD,
            uint256 adminFees,
            bool isBuyStakeEnabled,
            bool isPayReferralEnabled,
            bool isPayRewardTokenEnabled
        )
    {
        minConUSD = _minContributionUSD;

        adminFees = _adminFees;

        isBuyStakeEnabled = _isBuyNStake;
        isPayReferralEnabled = _isPayReferral;
        isPayRewardTokenEnabled = _isPayRewardTokens;
    }

    function setCapping(
        uint256 minConUSD,
        uint256 adminFees,
        bool isBuyNStake,
        bool isPayReferral,
        bool isPayRewardTokens
    ) external onlyOwner {
        _minContributionUSD = minConUSD;
        _adminFees = adminFees;
        _isBuyNStake = isBuyNStake;
        _isPayReferral = isPayReferral;
        _isPayRewardTokens = isPayRewardTokens;
    }

    function pauseAdmin() external onlyOwner {
        _pause();
    }

    function unpauseAdmin() external onlyOwner {
        _unpause();
    }

    function transferETH(address _address, uint256 _value) external onlyOwner {
        payable(_address).transfer(_value);
    }

    function withdrawETH() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function withdrawTokens(
        address _tokenAddress,
        uint256 _value
    ) external onlyOwner {
        IERC20Upgradeable(_tokenAddress).transfer(msg.sender, _value);
    }
}
