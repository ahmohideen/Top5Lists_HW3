import jsTPS_Transaction from "../common/jsTPS.js"

/**
 * ChangeItem_Transaction
 * 
 * This class represents a transaction that updates the text
 * for a given item. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class ChangeItem_Transaction extends jsTPS_Transaction {
    constructor(initStore, initId, initOldText, initNewText) {
        super();
        this.store = initStore;
        this.id = initId;
        this.oldText = initOldText;
        this.newText = initNewText;
    }

    doTransaction() {
        console.log("doing change item transaction...")
        this.store.updateItem(this.id, this.newText);
    }

    undoTransaction() {
        console.log("undoing change item transaction...")
        this.store.updateItem(this.id, this.oldText);
    }
}