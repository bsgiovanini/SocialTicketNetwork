pragma solidity >= 0.4.24;

import "./EventExecutorRole.sol";
import "./EventOrganizerRole.sol";
import "./SocialTicketMemberRole.sol";
contract SocialTicketNetworkAccessControl is EventExecutorRole, EventOrganizerRole, SocialTicketMemberRole {

}