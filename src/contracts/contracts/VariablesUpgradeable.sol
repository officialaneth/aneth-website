//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IERC20_EXTENDED {
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint256);
}

contract VariablesUpgradeable is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address private _presaleContract;
    address private _referralContract;
    address private _stakingContract;
    address private _tokenContract;
    address private _anusdContract;
    address private _usdtContract;
    address private _rewardContract;

    address private _uniswapV2Router;

    address private _tokenContractOwner;
    address private _rewardContractOwner;

    uint256 private _adminFees;

    function initialize() public initializer {
        _presaleContract = 0x0c750b915ef0112B204f0f7E6812be292b9936A2;
        _referralContract;
        _stakingContract;
        _tokenContract = 0x89c701DCcC25e48566aF89cAC1e32706c5B55546;
        _anusdContract = 0xe6ffee89beb3bee2785eE88deD4Da74F8a082A78;
        _usdtContract;
        _uniswapV2Router = 0xDE2Db97D54a3c3B008a097B2260633E6cA7DB1AF;
        _adminFees = 2000000000000000000;
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function variableContract() external view returns (address) {
        return address(this);
    }

    function presaleContract() external view returns (address) {
        return _presaleContract;
    }

    function referralContract() external view returns (address) {
        return _referralContract;
    }

    function stakingContract() external view returns (address) {
        return _stakingContract;
    }

    function tokenContract() external view returns (address) {
        return _tokenContract;
    }

    function tokenContractInfo()
        external
        view
        returns (
            address tokenAddress,
            string memory name,
            string memory symbol,
            uint256 decimals
        )
    {
        tokenAddress = _tokenContract;
        name = IERC20_EXTENDED(_tokenContract).name();
        symbol = IERC20_EXTENDED(_tokenContract).symbol();
        decimals = IERC20_EXTENDED(_tokenContract).decimals();
    }

    function anusdContract() external view returns (address) {
        return _anusdContract;
    }

    function anusdContractInfo()
        external
        view
        returns (
            address tokenAddress,
            string memory name,
            string memory symbol,
            uint256 decimals
        )
    {
        tokenAddress = _anusdContract;
        name = IERC20_EXTENDED(_anusdContract).name();
        symbol = IERC20_EXTENDED(_anusdContract).symbol();
        decimals = IERC20_EXTENDED(_anusdContract).decimals();
    }

    function usdtContract() external view returns (address) {
        return _usdtContract;
    }

    function rewardContract() external view returns (address) {
        return _rewardContract;
    }

    function uniswapV2RouterContract() external view returns (address) {
        return _uniswapV2Router;
    }

    function tokenContractOwner() external view returns (address) {
        return _tokenContractOwner;
    }

    function rewardContractOwner() external view returns (address) {
        return _rewardContractOwner;
    }

    function adminFees() external view returns (uint256) {
        return _adminFees;
    }

    function setAdminFees(uint256 _valueInWei) external onlyOwner {
        _adminFees = _valueInWei;
    }

    function setContractAddress(
        address _presale,
        address _referral,
        address _staking,
        address _token,
        address _anusd,
        address _usdt,
        address _reward
    ) external onlyOwner {
        if (_presale != address(0)) {
            _presaleContract = _presale;
        }
        if (_referral != address(0)) {
            _referralContract = _referral;
        }
        if (_staking != address(0)) {
            _stakingContract = _staking;
        }
        if (_token != address(0)) {
            _tokenContract = _token;
        }
        if (_anusd != address(0)) {
            _anusdContract = _anusd;
        }
        if (_usdt != address(0)) {
            _usdtContract = _usdt;
        }
        if (_reward != address(0)) {
            _rewardContract = _reward;
        }
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
