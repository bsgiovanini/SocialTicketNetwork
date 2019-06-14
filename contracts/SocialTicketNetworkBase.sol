pragma solidity >= 0.4.24;


import "./SocialTicketNetworkAccessControl.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract SocialTicketNetworkBase is Ownable, SocialTicketNetworkAccessControl {

    uint public barCode;

    enum State
    {
        Generated,  // 0
        OnSale,  // 1
        Sold,     // 2
        OnSocialSale,    // 3
        SocialSold,       // 4
        Finished,    // 5
        Expired   // 6
    }

    struct Ticket {
        //uint    sku;  // Stock Keeping Unit (SKU)
        uint    barCode; // Universal Product Code (UPC), generated by the Farmer, goes on the package, can be verified by the Consumer
        address payable ownerID;  // Metamask-Ethereum address of the current owner as the ticket moves through 7 stages
        address payable eventOrganizerID; // Metamask-Ethereum address of the Farmer
        string    eventName;  // Product ID potentially a combination of upc + sku
        string  ticketNotes; // Product Notes
        State   ticketState;  // Product State as represented in the enum above
        address payable lastSocialMemberID;
        address payable executerID; // Metamask-Ethereum address of the Retailer
    }

    struct TicketOwnershipHistory {
        uint barCode;
        address payable ownerID;
        uint256 ticketPrice;
    }

    mapping (uint => Ticket) public tickets;
    mapping (uint => uint256) public ticketsForSale;
    mapping (uint => uint256) public ticketsForSocialSale;
    mapping (uint => TicketOwnershipHistory[]) public ticketsOwnershipHistory;

    event Generated(uint barCode);
    event OnSale(uint barCode);
    event Sold(uint barCode);
    event OnSocialSale(uint barCode);
    event SocialSold(uint barCode);
    event Finished(uint barCode);
    event Expired(uint barCode);

      // Define a modifer that checks to see if msg.sender == owner of the contract
    function isOwner(address _address) public view returns (bool) {
        return _address == owner();
    }

    // Define a modifer that verifies the Caller
    modifier verifyCaller (address _address) {
        require(msg.sender == _address, "SENDER IS NOT THE CALLER");
        _;
    }

     modifier paidEnough(uint _price) {
        require(msg.value >= _price, "PAID VALUE IS NOT ENOUGH");
        _;
    }

    modifier ticketOwner(uint _barCode, address _address) {
        require(tickets[_barCode].ownerID == _address, "TICKET NOT OWNED BY THE ADDRESS");
        _;
    }

    // Define a modifier that checks if an item.state of a upc is Harvested
    modifier generated(uint _barCode) {
        require(tickets[_barCode].ticketState == State.Generated, "TICKET STATE NOT GENERATED");
        _;
    }

    modifier onSale(uint _barCode) {
        require(tickets[_barCode].ticketState == State.OnSale, "TICKET STATE NOT ON SALE");
        _;
    }

    modifier sold(uint _barCode) {
        require(tickets[_barCode].ticketState == State.Sold, "TICKET STATE NOT SOLD");
        _;
    }

    modifier onSocialSale(uint _barCode) {
        require(tickets[_barCode].ticketState == State.OnSocialSale, "TICKET STATE NOT ON SOCIAL SALE");
        _;
    }

    modifier socialSold(uint _barCode) {
        require(tickets[_barCode].ticketState == State.SocialSold, "TICKET STATE NOT SOCIAL SOLD");
        _;
    }

    modifier ticketHasOwner(uint _barCode) {
        require(
            tickets[_barCode].ticketState == State.SocialSold || tickets[_barCode].ticketState == State.Sold,
            "TICKET STATE NOT SOCIAL SOLD");
        _;
    }

    modifier notFinished(uint _barCode) {
        require(tickets[_barCode].ticketState != State.Finished, "TICKET STATE IS FINISHED");
        _;
    }

    modifier notExpired(uint _barCode) {
        require(tickets[_barCode].ticketState != State.Expired, "TICKET STATE IS EXPIRED");
        _;
    }


    constructor() Ownable() public payable {
        barCode = 0;
    }

    function kill() public {
        if (msg.sender == owner()) {
            address payable owner = address(uint160(owner()));
            selfdestruct(owner);
        }
    }

    function generateTicket(
        string memory _eventName,
        string memory _ticketNotes
    ) public onlyEventOrganizer verifyCaller(msg.sender) {
        barCode = barCode + 1;

        require(tickets[barCode].barCode == 0, "TICKET ALREADY CREATED");

        Ticket memory tkt = Ticket(
            barCode,
            msg.sender,
            msg.sender,
            _eventName,
            _ticketNotes,
            State.Generated,
            address(0),
            address(0)
        );

        tickets[barCode] = tkt;

        emit Generated(barCode);
    }

    function putTicketOnSale(uint _barCode, uint _ticketPrice) public
        onlyEventOrganizer
        verifyCaller(msg.sender)
        generated(_barCode)
        ticketOwner(_barCode, msg.sender)
        notExpired(_barCode)
        notFinished(_barCode) {

        ticketsForSale[_barCode] = _ticketPrice;
        tickets[_barCode].ticketState = State.OnSale;
        emit OnSale(_barCode);
    }

    function buyTicket(uint _barCode) public
        onlySocialMember
        verifyCaller(msg.sender)
        onSale(_barCode)
        paidEnough(ticketsForSale[_barCode])
        notExpired(_barCode)
        notFinished(_barCode) payable {

        tickets[_barCode].ownerID = msg.sender;
        tickets[_barCode].ticketState = State.Sold;

        uint256 _price = ticketsForSale[_barCode];
        ticketsOwnershipHistory[_barCode].push(TicketOwnershipHistory(_barCode, msg.sender, _price));
        tickets[_barCode].eventOrganizerID.transfer(_price);
        uint256 amountToReturn = msg.value - _price;
        msg.sender.transfer(amountToReturn);
        delete ticketsForSale[_barCode];

        emit Sold(_barCode);
    }

    function socialPutTicketOnSale(uint _barCode, uint _ticketPrice) public
        onlySocialMember
        verifyCaller(msg.sender)
        notExpired(_barCode)
        notFinished(_barCode)
        ticketOwner(_barCode, msg.sender) {
            ticketsForSocialSale[_barCode] = _ticketPrice;
            tickets[_barCode].ticketState = State.OnSocialSale;
            emit OnSocialSale(_barCode);
        }

    function socialBuyTicket(uint _barCode) public
        onlySocialMember
        verifyCaller(msg.sender)
        onSocialSale(_barCode)
        paidEnough(ticketsForSocialSale[_barCode])
        notFinished(_barCode)
        notExpired(_barCode) payable {

        tickets[_barCode].lastSocialMemberID = tickets[_barCode].ownerID;
        tickets[_barCode].ownerID = msg.sender;
        tickets[_barCode].ticketState = State.SocialSold;

        uint256 _price = ticketsForSocialSale[_barCode];
        ticketsOwnershipHistory[_barCode].push(TicketOwnershipHistory(_barCode, msg.sender, _price));
        tickets[_barCode].lastSocialMemberID.transfer(msg.value);
        uint256 amountToReturn = msg.value - _price;
        msg.sender.transfer(amountToReturn);

        delete ticketsForSocialSale[_barCode];

        emit SocialSold(_barCode);
    }

    function receiveTicket(uint _barCode)  public
        onlyEventExecutors
        ticketHasOwner(_barCode)
        verifyCaller(msg.sender)
        notExpired(_barCode) {
        tickets[_barCode].ownerID = msg.sender;
        tickets[_barCode].ticketState = State.Finished;
        emit Finished(_barCode);
    }

    function expireTicket(uint _barCode) public
        onlyEventOrganizer
        notFinished(_barCode)
        verifyCaller(msg.sender) {

        tickets[_barCode].ownerID = msg.sender;
        tickets[_barCode].ticketState = State.Expired;
        emit Expired(_barCode);
    }
}