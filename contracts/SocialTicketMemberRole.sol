pragma solidity >= 0.4.24;

import "openzeppelin-solidity/contracts/access/Roles.sol";

contract SocialTicketMemberRole {
     using Roles for Roles.Role;

     Roles.Role private socialMembers;

     modifier onlySocialMember() {
       require(socialMembers.has(msg.sender), "DOES_NOT_HAVE_MEMBER_ROLE");
        _;
    }

    // Define a function 'isConsumer' to check this role
    function isSocialMember(address account) public view returns (bool) {
        return socialMembers.has(account);
    }

    // Define a function 'addSocialMember' that adds this role
    function addSocialMember(address account) public {
        _addSocialMember(account);
    }

    // Define a function 'renounceSocialMember' to renounce this role
    function renounceSocialMember() public  onlySocialMember {
        _removeSocialMember(msg.sender);
    }

    // Define an internal function '_addSocialMember' to add this role, called by 'addSocialMember'
    function _addSocialMember(address account) internal {
        Roles.add(socialMembers, account);
    }

    // Define an internal function '_removeSocialMember' to remove this role, called by 'removeSocialMember'
    function _removeSocialMember(address account) internal {
        Roles.remove(socialMembers, account);
    }

}