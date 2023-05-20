// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IVariables {}

contract ContactDetailsUpgradeable is
    Initializable,
    PausableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address public variablesContract;

    struct Account {
        uint32 userId;
        string name;
        uint256 contactNumber;
        address userAddress;
    }

    uint32 public totalUsers;

    mapping(address => Account) private accounts;
    mapping(uint32 => address) public idToAddress;

    address[] public admins;

    modifier onlyAdmin() {
        for (uint8 i; i < admins.length; i++) {
            if (msg.sender == admins[i]) {
                _;
                break;
            } else if (i == admins.length - 1) {
                require(msg.sender == admins[i], "You are not admin");
            }
        }
    }

    function setAdmin(address _adminAddress) external onlyAdmin {
        admins.push(_adminAddress);
    }

    function initialize() public initializer {
        admins.push(msg.sender);
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function addUserDetails(
        string memory _name,
        uint256 _contactNumber
    ) external {
        Account storage userAccount = accounts[msg.sender];

        if (userAccount.userId == 0) {
            totalUsers++;
            idToAddress[totalUsers] = msg.sender;
            userAccount.userId = totalUsers;
        }

        userAccount.name = _name;
        userAccount.contactNumber = _contactNumber;
        userAccount.userAddress = msg.sender;
    }

    function addUserDetailsAdmin(
        address[] calldata _userAddress,
        string[] calldata _name,
        uint256[] calldata _contactNumber
    ) external onlyAdmin {
        for (uint8 i; i < _userAddress.length; i++) {
            Account storage userAccount = accounts[_userAddress[i]];

            if (userAccount.userId == 0) {
                totalUsers++;
                idToAddress[totalUsers] = _userAddress[i];
                userAccount.userId = totalUsers;
            }

            userAccount.name = _name[i];
            userAccount.contactNumber = _contactNumber[i];
            userAccount.userAddress = _userAddress[i];
        }
    }

    function getUsersDetails(
        address _userAddress
    ) external view returns (Account memory details) {
        details = accounts[_userAddress];
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
