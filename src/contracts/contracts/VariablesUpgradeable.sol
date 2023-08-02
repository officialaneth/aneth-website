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

    mapping(address => bool) private _isAdmin;

    address private _monthlyRewardsContract;
    address[] public adminsList;

    address[] private _managersList;

    mapping(address => bool) private _isManager;

    function initialize() public initializer {
        _presaleContract = 0x5e8F3980E638fC5df657E33194cE428936d635a0;
        _referralContract = 0x58469D0d27aAE15cf611966b89E072E49d359097;
        _stakingContract = 0xB361d6D49694161c413E60E140309F20AF19CefD;
        _tokenContract = 0xda0948903D239FB9EA25B73B573800630f863520;
        _anusdContract = 0xe7377edE6E9Ab141807959C80e2a1A3795d19173;
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
        address _uniswapRouter,
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
        if (_uniswapRouter != address(0)) {
            _uniswapV2Router = _uniswapRouter;
        }
        if (_reward != address(0)) {
            _rewardContract = _reward;
        }
    }

    function getAdminsList() external view returns (address[] memory) {
        return adminsList;
    }

    function isAdmin(address _address) external view returns (bool) {
        return _isAdmin[_address];
    }

    function addAdmin(address _address) external {
        require(
            _isAdmin[msg.sender] || msg.sender == owner(),
            "Only Admin or owner can call this function."
        );
        require(!_isAdmin[_address], "Address is already admin.");
        _isAdmin[_address] = true;
        adminsList.push(_address);
    }

    function removeAdmin(address _address) external {
        require(
            _isAdmin[msg.sender] || msg.sender == owner(),
            "Only Admin or owner can call this function."
        );
        require(_isAdmin[_address], "Address is not admin.");
        _isAdmin[_address] = false;
        uint8 adminsListCount = uint8(adminsList.length);

        for (uint i; i < adminsListCount; ++i) {
            if (_isAdmin[_address]) {
                adminsList[i] = adminsList[adminsList.length - 1];
                adminsList.pop();
            }

            if (
                adminsList.length < adminsListCount &&
                i == adminsList.length - 1
            ) {
                break;
            }
        }
    }

    function isManager(address _userAddress) external view returns (bool) {
        return _isManager[_userAddress];
    }

    function getManagers() external view returns (address[] memory) {
        return _managersList;
    }

    function addManager(address _address) external {
        require(
            _isAdmin[msg.sender] || msg.sender == owner(),
            "Only Admin or owner can call this function."
        );
        require(!_isManager[_address], "Address is already manager.");
        _isManager[_address] = true;
        _managersList.push(_address);
    }

    function removeManager(address _address) external {
        require(
            _isAdmin[msg.sender] || msg.sender == owner(),
            "Only Admin or owner can call this function."
        );
        require(_isManager[_address], "Address is not manager.");
        _isManager[_address] = false;
        uint8 managersList = uint8(_managersList.length);

        for (uint i; i < managersList; ++i) {
            if (_isAdmin[_address]) {
                _managersList[i] = _managersList[_managersList.length - 1];
                _managersList.pop();
            }

            if (
                _managersList.length < managersList &&
                i == _managersList.length - 1
            ) {
                break;
            }
        }
    }

    function getMonthlyRewardsContract() external view returns (address) {
        return _monthlyRewardsContract;
    }

    function setMonthlyRewardsContract(
        address _contractAddress
    ) external onlyOwner {
        _monthlyRewardsContract = _contractAddress;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
