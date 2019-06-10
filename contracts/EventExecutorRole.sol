pragma solidity >= 0.4.24;

import "openzeppelin-solidity/contracts/access/Roles.sol";

contract EventExecutorRole  {
     using Roles for Roles.Role;

     Roles.Role private eventExecutors;

     modifier onlyEventExecutors() {
       require(eventExecutors.has(msg.sender), "DOES_NOT_HAVE_EXECUTOR_ROLE");
        _;
    }

    // Define a function 'isConsumer' to check this role
    function isEventExecutors(address account) public view returns (bool) {
        require(eventExecutors.has(account), "DOES_NOT_HAVE_EXECUTOR_ROLE");
    }

    // Define a function 'addEventExecutors' that adds this role
    function addEventExecutors(address account) public {
        _addEventExecutors(account);
    }

    // Define a function 'renounceEventExecutors' to renounce this role
    function renounceEventExecutors() public  onlyEventExecutors {
        _removeEventExecutors(msg.sender);
    }

    // Define an internal function '_addEventExecutors' to add this role, called by 'addEventExecutors'
    function _addEventExecutors(address account) internal {
        Roles.add(eventExecutors, account);
    }

    // Define an internal function '_removeEventExecutors' to remove this role, called by 'removeEventExecutors'
    function _removeEventExecutors(address account) internal {
        Roles.remove(eventExecutors, account);
    }

}