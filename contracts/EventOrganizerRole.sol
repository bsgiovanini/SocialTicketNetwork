pragma solidity >= 0.4.24;

import "openzeppelin-solidity/contracts/access/Roles.sol";

contract EventOrganizerRole {
     using Roles for Roles.Role;

     Roles.Role private eventOrganizers;

     modifier onlyEventOrganizer() {
       require(eventOrganizers.has(msg.sender), "DOES_NOT_HAVE_ORGANIZER_ROLE");
        _;
    }

    // Define a function 'isConsumer' to check this role
    function isEventOrganizer(address account) public view returns (bool) {
        return eventOrganizers.has(account);
    }

    // Define a function 'addEventOrganizer' that adds this role
    function addEventOrganizer(address account) public {
        _addEventOrganizer(account);
    }

    // Define a function 'renounceEventOrganizer' to renounce this role
    function renounceEventOrganizer() public  onlyEventOrganizer {
        _removeEventOrganizer(msg.sender);
    }

    // Define an internal function '_addEventOrganizer' to add this role, called by 'addEventOrganizer'
    function _addEventOrganizer(address account) internal {
        Roles.add(eventOrganizers, account);
    }

    // Define an internal function '_removeEventOrganizer' to remove this role, called by 'removeEventOrganizer'
    function _removeEventOrganizer(address account) internal {
        Roles.remove(eventOrganizers, account);
    }

}