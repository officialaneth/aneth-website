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

    function isAdmin(address _address) external view returns (bool);

    function isManager(address _userAddress) external view returns (bool);
}

interface IStaking {
    function stakeByAdmin(
        address _userAddress,
        uint256 _valueInToken,
        uint256 _valueInANUSD
    ) external;
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

    uint256 private _maxBuyLimitANUSD;

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
        _variableContract = 0x77daaFc7411C911b869C71bf70FE36cCE507845d;
        _rewardPerAUSD = 1000000000000000;
        _minContributionUSD = 20000000000000000000;
        _isBuyNStake = true;
        _isPayReferral = true;
        _isPayRewardTokens = false;

        _maxBuyLimitANUSD = 510000000000000000000;

        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    address[] public admins;

    // modifier onlyAdmin() {
    //     require(IVariables(_variableContract).isAdmin(msg.sender), "You are not admin");
    //     _;
    // }

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
        IVariables variables = IVariables(_variableContract);
        address _msgSender = msg.sender;
        uint256 _adminFees = variables.adminFees();
        uint256 _msgValue = _valueInWei;

        require(
            _msgValue >= _minContributionUSD,
            "AUSD value less then min buy value."
        );

        require(_msgValue <= _maxBuyLimitANUSD, "Max buy limit reached");

        IERC20Upgradeable(variables.anusdContract()).transferFrom(
            _msgSender,
            address(this),
            _msgValue
        );

        uint256[] memory amounts = _buyFromUniswap(
            variables.anusdContract(),
            _msgValue - _adminFees,
            variables.tokenContract(),
            variables.uniswapV2RouterContract()
        );

        if (_isBuyNStake) {
            IStaking(variables.stakingContract()).stakeByAdmin(
                _msgSender,
                amounts[1],
                amounts[0]
            );
        } else {
            IERC20Upgradeable(variables.tokenContract()).transfer(
                _msgSender,
                amounts[1]
            );
        }

        if (_isPayReferral) {
            IReferral(variables.referralContract()).payReferralANUSDAdmin(
                amounts[0],
                _msgSender,
                _referrerAddress
            );
        }

        emit RegistrationFees(variables.adminFees());
    }

    function BuyWithANUSDAdmin(
        address[] calldata _userAddress,
        address[] calldata _referrerAddress,
        uint256[] calldata _valueInUSDDecimals
    ) external {
        require(
            IVariables(_variableContract).isAdmin(msg.sender),
            "You are not admin"
        );
        uint256 length = _userAddress.length;
        IVariables variables = IVariables(_variableContract);

        for (uint256 i; i < length; i++) {
            uint256 _adminFees = variables.adminFees();
            uint256 _msgValue = _valueInUSDDecimals[i] * 10 ** 18;

            uint256[] memory amounts = _buyFromUniswap(
                variables.anusdContract(),
                _msgValue - _adminFees,
                variables.tokenContract(),
                variables.uniswapV2RouterContract()
            );

            if (_isBuyNStake) {
                IStaking(variables.stakingContract()).stakeByAdmin(
                    _userAddress[i],
                    amounts[1],
                    amounts[0]
                );
            }

            if (_isPayReferral) {
                IReferral(variables.referralContract()).payReferralANUSDAdmin(
                    amounts[0],
                    _userAddress[i],
                    _referrerAddress[i]
                );
            }
        }
    }

    function BuyWithANUSDManager(
        address _userAddress,
        address _referrerAddress,
        uint256 _valueInDecimals
    ) external whenNotPaused {
        IVariables variables = IVariables(_variableContract);
        address _msgSender = msg.sender;
        uint256 _adminFees = variables.adminFees();
        uint256 _msgValue = _valueInDecimals * 10 ** 18;

        require(
            variables.isManager(_msgSender),
            "Only managers can call this function."
        );

        require(
            _msgValue >= _minContributionUSD,
            "ANUSD value less then min buy value."
        );

        require(_msgValue <= _maxBuyLimitANUSD, "Max buy limit reached");

        IERC20Upgradeable(variables.anusdContract()).transferFrom(
            _msgSender,
            address(this),
            _msgValue
        );

        uint256[] memory amounts = _buyFromUniswap(
            variables.anusdContract(),
            _msgValue - _adminFees,
            variables.tokenContract(),
            variables.uniswapV2RouterContract()
        );

        if (_isBuyNStake) {
            IStaking(variables.stakingContract()).stakeByAdmin(
                _userAddress,
                amounts[1],
                amounts[0]
            );
        } else {
            IERC20Upgradeable(variables.tokenContract()).transfer(
                _userAddress,
                amounts[1]
            );
        }

        if (_isPayReferral) {
            IReferral(variables.referralContract()).payReferralANUSDAdmin(
                amounts[0],
                _userAddress,
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
            bool isPayRewardTokenEnabled,
            uint256 maxBuyLimitANUSD
        )
    {
        minConUSD = _minContributionUSD;
        isBuyStakeEnabled = _isBuyNStake;
        isPayReferralEnabled = _isPayReferral;
        isPayRewardTokenEnabled = _isPayRewardTokens;
        maxBuyLimitANUSD = _maxBuyLimitANUSD;
    }

    function setCapping(
        uint256 minConUSD,
        bool isBuyNStake,
        bool isPayReferral,
        bool isPayRewardTokens,
        uint256 maxBuyLimitANUSD
    ) external onlyOwner {
        _minContributionUSD = minConUSD;
        _isBuyNStake = isBuyNStake;
        _isPayReferral = isPayReferral;
        _isPayRewardTokens = isPayRewardTokens;
        _maxBuyLimitANUSD = maxBuyLimitANUSD;
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
