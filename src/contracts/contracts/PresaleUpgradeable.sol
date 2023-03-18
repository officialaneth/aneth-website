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

interface IStaking {
    function stakeByAdmin(
        address _userAddress,
        uint256 _value,
        uint256 _duration
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

contract PresaleUpgradeable is
    Initializable,
    OwnableUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    using SafeMathUpgradeable for uint256;

    address private _tokenSeller;
    address private _rewardOwner;

    address private _tokenContract;
    address private _stakingContract;
    address private _referralContract;
    address private _usdtContract;
    address private _rewardTokenContract;

    AggregatorV3Interface private _priceFeedOracleAddress;

    uint256 private _pricePerUSD;
    uint256 private _rewardPerUSD;
    uint256 private _minContributionUSD;

    uint256 private _totalTokenSold;
    uint256 private _totalETHRaised;
    uint256 private _totalUSDRaised;

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
    _priceFeedOracleAddress = AggregatorV3Interface(
        0xAB594600376Ec9fD91F8e885dADF0CE036862dE0
    );

    _usdtContract = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F;
    _tokenContract = 0x9C19247BD66F34e07c05beA8895D5D35dD49f253;
    _rewardTokenContract = 0x7F9fD63932babC508FAD2f324EB534D09cfE86F0;
    _referralContract;
    _stakingContract;

    _tokenSeller = 0xB35963E0AB2141cd4aB743e7a35d8772F3Cf0447;
    _rewardOwner = 0xf91e1eD00f015c6Be3FBc6b0d84fBaEF005ec5B5;

    _pricePerUSD = 8500000000000000000;
    _rewardPerUSD = 85000000000000000;

    _isPayReferral = true;
    _isBuyNStake = false;
    _isPayRewardTokens = true;

    _minContributionUSD = 20000000000000000000;

    __Pausable_init();
    __Ownable_init();
    __UUPSUpgradeable_init();
}

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function getPriceFeedOracleAddress() external view returns (address) {
        return address(_priceFeedOracleAddress);
    }

    function setPriceFeedOracleAddressAdmin(
        address _address
    ) external onlyOwner returns (bool) {
        _priceFeedOracleAddress = AggregatorV3Interface(_address);
        return true;
    }

    function getTokenSeller() external view returns (address) {
        return _tokenSeller;
    }

    function setTokenSeller(address _address) external onlyOwner {
        _tokenSeller = _address;
    }

    function getRewardOwners() external view returns (address) {
        return _rewardOwner;
    }

    function setRewardOwner(address _address) external onlyOwner {
        _rewardOwner = _address;
    }

    function getTokenContract()
        external
        view
        returns (
            address tokenAddress,
            string memory name,
            uint256 decimals,
            uint256 totalSupply
        )
    {
        tokenAddress = _tokenContract;
        name = IERC20_EXTENDED(_tokenContract).name();
        decimals = IERC20_EXTENDED(_tokenContract).decimals();
        totalSupply = IERC20Upgradeable(_tokenContract).totalSupply();
    }

    function setTokenContractAdmin(
        address _address
    ) external onlyOwner returns (bool) {
        _tokenContract = _address;
        return true;
    }

    function getStakingContract() external view returns (address) {
        return _stakingContract;
    }

    function setStakingContractAdmin(
        address _address
    ) external onlyOwner returns (bool) {
        _stakingContract = _address;
        return true;
    }

    function getRewardTokenContract()
        external
        view
        returns (
            address tokenAddress,
            string memory name,
            uint256 decimals,
            uint256 totalSupply
        )
    {
        tokenAddress = _rewardTokenContract;
        name = IERC20_EXTENDED(_rewardTokenContract).name();
        decimals = IERC20_EXTENDED(_rewardTokenContract).decimals();
        totalSupply = IERC20Upgradeable(_rewardTokenContract).totalSupply();
    }

    function setRewardTokenContract(
        address _tokenContractAddress
    ) external onlyOwner {
        _rewardTokenContract = _tokenContractAddress;
    }

    function getReferralContract() external view returns (address) {
        return _referralContract;
    }

    function setReferralContract(
        address _address
    ) external onlyOwner returns (address) {
        return _referralContract = _address;
    }

    function getUSDContract()
        external
        view
        returns (
            address USDAddress,
            string memory USDName,
            uint256 USDDecimals,
            uint256 USDSupply
        )
    {
        USDAddress = _usdtContract;
        USDName = IERC20_EXTENDED(_usdtContract).name();
        USDDecimals = IERC20_EXTENDED(_usdtContract).decimals();
        USDSupply = IERC20Upgradeable(_usdtContract).totalSupply();
    }

    function setUSDContractAdmin(
        address _address
    ) external onlyOwner returns (bool) {
        _usdtContract = _address;
        return true;
    }

    function getPricePerUSD() external view returns (uint256) {
        return _pricePerUSD;
    }

    function getRewardPerUSD() external view returns (uint256) {
        return _rewardPerUSD;
    }

    function setPricePerUSDAdmin(
        uint256 _value
    ) external onlyOwner returns (bool) {
        _pricePerUSD = _value;
        return true;
    }

    function setRewardPerUSDAdmin(
        uint256 _value
    ) external onlyOwner returns (bool) {
        _rewardPerUSD = _value;
        return true;
    }

    function getPresaleAnalystics()
        external
        view
        returns (uint256 tokenSold, uint256 ethRaised, uint256 USDRaised)
    {
        tokenSold = _totalTokenSold;
        ethRaised = _totalETHRaised;
        USDRaised = _totalUSDRaised;
    }

    function _getETH_USDPrice() private view returns (uint256 ETH_USD) {
        (, int ethPrice, , , ) = AggregatorV3Interface(_priceFeedOracleAddress)
            .latestRoundData();
        ETH_USD = uint256(ethPrice) * (10 ** 10);
    }

    function getETH_USDPrice() external view returns (uint256) {
        return _getETH_USDPrice();
    }

    function _getMinContributionETH()
        private
        view
        returns (uint256)
    {
        if (_minContributionUSD == 0) {
           return 0;
        } else {
            uint256 ethPrice = _getETH_USDPrice();
            return _minContributionUSD * 10 ** 18 / ethPrice ;
        }
    }

    function minContribution()
        external
        view
        returns (uint256 minContETH, uint256 minContUSD)
    {
        minContETH = _getMinContributionETH();
        minContUSD = _minContributionUSD;
    }

    function setMinContributionUSDAdmin(
        uint256 _value
    ) external onlyOwner returns (bool) {
        _minContributionUSD = _value;
        return true;
    }

    function isEnabled()
        external
        view
        returns (bool stake, bool referral, bool reward)
    {
        stake = _isBuyNStake;
        referral = _isPayReferral;
        reward = _isPayRewardTokens;
    }

    function setPayReferralAdmin(bool _bool) external onlyOwner returns (bool) {
        _isPayReferral = _bool;
        return true;
    }

    function setBuyAndStakeAdmin(bool _bool) external onlyOwner returns (bool) {
        return _isBuyNStake = _bool;
    }

    function setPayRewardTokensAdmin(bool _bool) external onlyOwner {
        _isPayRewardTokens = _bool;
    }

    function _stake(
        address _address,
        uint256 _tokenValue,
        uint256 _duration
    ) private returns (bool) {
        return
            IStaking(_stakingContract).stakeByAdmin(
                _address,
                _tokenValue,
                _duration
            );
    }

    function _updateTokenSale(
        address _address,
        uint256 _tokenValue,
        uint256 _msgValue,
        string memory currency
    ) private {
        _totalTokenSold += _tokenValue;
        _totalETHRaised += _msgValue;
        emit TokenPurchased(_address, _tokenValue, _msgValue, currency);
    }

    function _getTokensValueETH(
        uint256 _ethValue,
        uint256 _price
    ) private view returns (uint256 tokenValue) {
        uint256 ethPrice = _getETH_USDPrice();
        uint256 ethValue = (_ethValue * ethPrice) /
            (10 ** IERC20_EXTENDED(_tokenContract).decimals());
        tokenValue = ethValue * _price;
        tokenValue =
            tokenValue /
            (10 ** IERC20_EXTENDED(_tokenContract).decimals());
    }

    function _getTokensValueUSD(
        uint256 _USDValue,
        uint256 _price
    ) private view returns (uint256 tokenValue) {
        tokenValue =
            (_USDValue * _price) /
            10 ** IERC20_EXTENDED(_usdtContract).decimals();
    }

    function _transferTokensFrom(
        address _tokenContractAddress,
        address _ownerAddress,
        address _to,
        uint256 _tokenValue
    ) private {
        IERC20Upgradeable(_tokenContractAddress).transferFrom(
            _ownerAddress,
            _to,
            _tokenValue
        );
    }

    function _getTotalReferralLevelRate() private view returns (uint256) {
        (, uint256 totalRatePresale, , ) = IReferral(_referralContract)
            .getLevelRates();
        return totalRatePresale;
    }

    function BuyWithETH(
        address _referrer,
        uint256 _duration
    ) public payable whenNotPaused {
        address _msgSender = msg.sender;
        uint256 _msgValue = msg.value;

        require(
            _msgValue >= _getMinContributionETH(),
            "Eth Value is less than minContributionETH."
        );

        uint256 _tokenValue = _getTokensValueETH(_msgValue, _pricePerUSD);
        uint256 _rewardValue = _getTokensValueETH(_msgValue, _rewardPerUSD);

        if (_isBuyNStake) {
            _stake(_msgSender, _tokenValue, _duration);
        } else {
            _transferTokensFrom(
                _tokenContract,
                _tokenSeller,
                _msgSender,
                _tokenValue
            );
        }

        if (_isPayReferral) {
            payable(_referralContract).transfer(
                _msgValue.mul(_getTotalReferralLevelRate() * 100 / IReferral(_referralContract).getLevelDecimals()).div(100)
            );

            IReferral(_referralContract).payReferralETHAdmin(
                _msgValue, 
                _msgSender,
                _referrer
            );
        }

        if (_isPayRewardTokens) {
            _transferTokensFrom(
                _rewardTokenContract,
                _rewardOwner,
                _msgSender,
                _rewardValue
            );
            emit RewardTokenDistributed(
                _msgSender,
                _rewardValue,
                _rewardTokenContract
            );
        }

        _updateTokenSale(_msgSender, _tokenValue, _msgValue, "ETH");
        payable(_tokenSeller).transfer(address(this).balance);
    }

    function BuyWithUSD(
        address _referrer,
        uint256 _value,
        uint256 _duration
    ) external whenNotPaused {
        require(
            _value >= (_minContributionUSD/10**18) * 10**IERC20_EXTENDED(_usdtContract).decimals() ,
            "USD value less then min buy value."
        );
        address _msgSender = msg.sender;
        uint256 _tokenValue = _getTokensValueUSD(_value, _pricePerUSD);
        uint256 _rewardValue = _getTokensValueUSD(_value, _rewardPerUSD);

        _transferTokensFrom(_usdtContract, _msgSender, address(this), _value);

        if (_isBuyNStake) {
            _stake(_msgSender, _tokenValue, _duration);
        } else {
            _transferTokensFrom(
                _tokenContract,
                _tokenSeller,
                _msgSender,
                _tokenValue
            );
        }

        if (_isPayReferral) {
            IERC20Upgradeable(_usdtContract).transfer(
                _referralContract,
                 _value.mul(_getTotalReferralLevelRate() * 100 / IReferral(_referralContract).getLevelDecimals()).div(100)
            );
            IReferral(_referralContract).payReferralUSDAdmin(
                _value,
                _msgSender,
                _referrer
            );
        }

        if (_isPayRewardTokens) {
            _transferTokensFrom(
                _rewardTokenContract,
                _rewardOwner,
                _msgSender,
                _rewardValue
            );
            emit RewardTokenDistributed(
                _msgSender,
                _rewardValue,
                _rewardTokenContract
            );
        }

        _updateTokenSale(_msgSender, _tokenValue, _value, "USDT");
        IERC20Upgradeable(_usdtContract).transfer(_tokenSeller, IERC20Upgradeable(_usdtContract).balanceOf(address(this)));
    }

    function pauseAdmin() external onlyOwner {
        _pause();
    }

    function unpauseAdmin() external onlyOwner {
        _unpause();
    }

    function transferETH(
        address _address,
        uint256 _value
    ) external onlyOwner {
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