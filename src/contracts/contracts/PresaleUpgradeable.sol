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

    function adminFees() external view returns (uint256);
}

interface IStaking {
    function stakeByAdmin(address _userAddress, uint256 _value) external;
}

interface IReferral {
    function payReferralANUSDAdmin(
        uint256 _value,
        address _userAddress,
        address _referrerAddress
    ) external;
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

    address private _variableContract;

    uint256 private _rewardPerAUSD;
    uint256 private _minContributionUSD;

    uint256 private _totalTokenSold;
    uint256 private _totalAUSDRaised;

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

    event RegistrationFees(uint256 amount);

    function initialize() external initializer {
        _variableContract = 0xbE5153baa3756402b08fD830E7b5F00a76E68231;
        _rewardPerAUSD = 1000000000000000;
        _minContributionUSD = 20000000000000000000;
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
        return _variableContract;
    }

    function setVariablesContract(address _contractAddress) external onlyOwner {
        _variableContract = _contractAddress;
    }

    function _buyFromUniswap(
        address _tokenInContract,
        uint256 _tokenInAmount,
        address _tokenOutContract,
        address _uniswapV2Router
    ) private returns (uint256[] memory) {
        address[] memory tokensContracts = new address[](2);
        tokensContracts[0] = _tokenInContract;
        tokensContracts[1] = _tokenOutContract;

        IERC20Upgradeable(_tokenInContract).approve(
            _uniswapV2Router,
            _tokenInAmount
        );

        uint[] memory amounts = IUniswapRouter(_uniswapV2Router)
            .swapExactTokensForTokens(
                _tokenInAmount,
                1,
                tokensContracts,
                address(this),
                block.timestamp + 100
            );

        return amounts;
    }

    function BuyWithANUSD(
        address _referrerAddress,
        uint256 _valueInWei
    ) external whenNotPaused {
        address _msgSender = msg.sender;
        uint256 _msgValue = _valueInWei;
        IVariables variables = IVariables(_variableContract);

        require(
            _msgValue >= _minContributionUSD,
            "AUSD value less then min buy value."
        );

        IERC20Upgradeable(variables.anusdContract()).transferFrom(
            _msgSender,
            address(this),
            _msgValue
        );

        uint256[] memory amounts = _buyFromUniswap(
            variables.anusdContract(),
            _msgValue - variables.adminFees(),
            variables.tokenContract(),
            variables.uniswapV2RouterContract()
        );

        if (_isBuyNStake) {
            IStaking(variables.stakingContract()).stakeByAdmin(
                _msgSender,
                amounts[1]
            );
        } else {
            IERC20Upgradeable(variables.tokenContract()).transfer(
                _msgSender,
                amounts[1]
            );
        }

        if (_isPayReferral) {
            IReferral(variables.referralContract()).payReferralANUSDAdmin(
                _msgValue,
                _msgSender,
                _referrerAddress
            );
        }

        emit RegistrationFees(variables.adminFees());
    }

    function getCapping()
        external
        view
        returns (
            uint256 minConUSD,
            bool isBuyStakeEnabled,
            bool isPayReferralEnabled,
            bool isPayRewardTokenEnabled
        )
    {
        minConUSD = _minContributionUSD;
        isBuyStakeEnabled = _isBuyNStake;
        isPayReferralEnabled = _isPayReferral;
        isPayRewardTokenEnabled = _isPayRewardTokens;
    }

    function setCapping(
        uint256 minConUSD,
        bool isBuyNStake,
        bool isPayReferral,
        bool isPayRewardTokens
    ) external onlyOwner {
        _minContributionUSD = minConUSD;
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
