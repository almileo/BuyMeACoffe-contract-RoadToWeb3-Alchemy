//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract BuyMeACofee {
    //Event to emit when a Memo is created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //Memo struct - the model of the Memo
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //Memo list
    Memo[] memos;

    //address of the contract deployer
    address payable owner;

    constructor() {
        owner = payable(msg.sender); //casting the address yo payable
    }

    /**
    *@dev buy a coffe for the contract owner
    *@param _name name of the cofee buyer
    *@param _message a msg from the cofee buyer (Memo)
    * */
    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Takes more than 0 ETH to buy a coffe");

        //Add the memo to the array (store it)
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        //Emit a log event when a new memo is created
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    /**
    *@dev send the entire contract balance to the owner address
    * */
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    /**
    *@dev buy a coffe for the contract owner
    * */
    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }
 
}
