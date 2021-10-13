import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ListCard from './ListCard.js'
import { GlobalStoreContext } from '../store'
import DeleteModal from './DeleteModal'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/

// const handleAddClick = () => {
//     console.log("add list button clicked");
// }

const ListSelector = () => {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    let listCard = "";
    if (store) {
        listCard = store.idNamePairs.map((pair) => (
            <ListCard
                key={pair._id}
                idNamePair={pair}
                selected={false}
            />
        ))
    }

    let handleAddClick = () => {
        console.log("clicked")
        if(store) {
            console.log(store.idNamePairs);
            console.log(store.idNamePairs[0]["_id"]);
            console.log(store.idNamePairs[0]["name"]);
            console.log(store.newListCounter);
            store.addNewList();
        }
    }

    return (
        <div id="top5-list-selector">
            <div id="list-selector-heading">
                <input
                    onClick={handleAddClick}
                    type="button"
                    id="add-list-button"
                    className="top5-button"
                    value="+" />
                Your Lists
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
                <DeleteModal />
            </div>
        </div>)
}

export default ListSelector;