import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
/*
    This modal is shown when the user asks to delete a list. Note 
    that before this is shown a list has to be marked for deletion,
    which means its id has to be known so that we can retrieve its
    information and display its name in this modal. If the user presses
    confirm, it will be deleted.
    
    @author McKilla Gorilla
*/
function DeleteModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if (store.currentList) {
        //name = store.currentList.name;
        //name = store.listMarkedForDeletion;
        console.log(store.listMarkedForDeletion);
    }
    function handleDeleteList(event) {
        console.log(store.listMarkedForDeletion);
        console.log(store.currentList);
        console.log(event.target);
        console.log("delete clicked");
        let listID = store.currentList;
        console.log(listID)
        console.log(store.listMarkedForDeletion);
        store.deleteMarkedList(listID);
    }
    function handleCloseModal(event) {
        console.log("close clicked")
        store.hideDeleteListModal();
    }
    return (
        <div
            className="modal"
            id="delete-modal"
            data-animation="slideInOutLeft">
            <div className="modal-dialog">
                <header className="dialog-header">
                    Delete the {store.listMarkedForDeletion} Top 5 List?
                </header>
                <div id="confirm-cancel-container">
                    <button
                        id="dialog-yes-button"
                        className="modal-button"
                        onClick={handleDeleteList}
                    >Confirm</button>
                    <button
                        id="dialog-no-button"
                        className="modal-button"
                        onClick={handleCloseModal}
                    >Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;