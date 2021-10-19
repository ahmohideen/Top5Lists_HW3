import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveItem_Transaction from '../transactions/MoveItem_Transaction'
import ChangeItem_Transaction from '../transactions/ChangeItem_Transaction';
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    ADD_NEW_LIST: "ADD_NEW_LIST",
    DELETE_MARKED_LIST: "DELETE_MARKED_LIST",
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    SET_ITEM_EDIT_ACTIVE: "SET_ITEM_EDIT_ACTIVE",
    SET_LIST_MARKED_FOR_DELETION: "SET_LIST_MARKED_FOR_DELETION",
    GET_TOP_5_LIST_BY_ID: "GET_TOP_5_LIST_BY_ID"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();
let counter = 0;//jesus christ

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        itemActive: false,
        listMarkedForDeletion: null
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            //CREATE NEW LIST
            case GlobalStoreActionType.ADD_NEW_LIST: {
                return setStore({
                    idNamePairs: payload.idNamePairs,//this should also be payload?
                    currentList: payload.top5List,
                    newListCounter: store.newListCounter+1,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                })
            }

            case GlobalStoreActionType.DELETE_MARKED_LIST: {
                return setStore({
                    idNamePairs: payload,//this should also be payload?
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                })
            }

            case GlobalStoreActionType.GET_TOP_5_LIST_BY_ID: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: payload
                });
            }

            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.top5List,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: false,
                    listMarkedForDeletion: null
                });
            }
            // START EDITING A LIST ITEM
            case GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: true,
                    listMarkedForDeletion: null
                });
            }

            case GlobalStoreActionType.SET_LIST_MARKED_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload.id,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: payload.name
                });
            }

            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    //THIS FUNCTION IS FOR ADDING A NEW LIST
    store.addNewList = function () {
        async function asyncAddNewList() {
            let payload = { 
                "name": "Untitled"+counter,
                "items": ["?", "?", "?", "?", "?"]
            }
            counter = counter+1;
            let response = await api.createTop5List(payload);
            console.log(response);
            if(response.data.success) {
                console.log("new list has been created in database!");
                let top5List = response.data.top5List;
                let temp = {
                    _id: response.data.top5List["_id"],
                    name: response.data.top5List["name"]
                }
                console.log(store.newListCounter);
                console.log("Temp payload: "+temp);
                console.log(store.idNamePairs);
                let tempArray = store.idNamePairs;
                tempArray.push(temp);
                console.log(temp);
                //i think we immediately switch into editing mode when we make a new list
                //gotta use this --> GlobalStoreActionType.ADD_NEW_LIST at some point
                
                //we need a payload for this too i think
                storeReducer({
                    type: GlobalStoreActionType.ADD_NEW_LIST,
                    payload: {
                        idNamePairs: tempArray,
                        top5List: null
                    }
                });
                store.setCurrentList(temp["_id"]);
            }
        }

        asyncAddNewList();
    }

    store.deleteMarkedList = function (id) {
        async function asyncDeleteMarkedList(id) {
            // await api.deleteTop5ListById(id).then(response => api.deleteTop5ListById(id))
            // .then(response=> {
            //     console.log('The response is: ' + response);
            //     return true;
            // })
            //await api.deleteTop5ListById(id).then
            let response = await api.deleteTop5ListById(id);
            if(response.data.success){
                console.log("list has been deleted!");
                console.log(response.data);
                let deleteID = response.data._id;
                console.log(id);
                //let indexToDeleteAt = store.idNamePairs.findIndex(item => item["_id"]===id);
                //console.log(indexToDeleteAt);
                let deleteIndex = 0;
                for(let x = 0; x < store.idNamePairs.length; x++){
                    let temp = store.idNamePairs[x]["_id"];
                    if(id === temp){
                        console.log("found")
                        console.log(store.idNamePairs[x]);
                        deleteIndex = x;
                    }
                }
                store.idNamePairs.splice(deleteIndex, 1);
                console.log(store.idNamePairs);
                storeReducer({
                    type: GlobalStoreActionType.DELETE_MARKED_LIST,
                    payload: store.idNamePairs
                });
                
            }
        }
        asyncDeleteMarkedList(id);
        store.hideDeleteListModal();
    }

    store.getTop5ListById = function (id) {
        async function asyncGetTop5ListById (id) {
            let response = await api.getTop5ListById(id);
            if(response.data.success) {
                console.log(response.data);
                
                let payload = response.data.top5List;
                console.log(payload);
                //GET_TOP_5_LIST_BY_ID
                storeReducer({
                    type: GlobalStoreActionType.GET_TOP_5_LIST_BY_ID,
                    payload: payload
                });
            }
        }
        asyncGetTop5ListById(id);
    }

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;
                top5List.name = newName;
                async function updateList(top5List) {
                    response = await api.updateTop5ListById(top5List._id, top5List);
                    if (response.data.success) {
                        async function getListPairs(top5List) {
                            response = await api.getTop5ListPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        top5List: top5List
                                    }
                                });
                            }
                        }
                        getListPairs(top5List);
                    }
                }
                updateList(top5List);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getTop5ListPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getTop5ListById(id);
            if (response.data.success) {
                let top5List = response.data.top5List;

                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: top5List
                    });
                    store.history.push("/top5list/" + top5List._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.setListMarkedForDeletion = function (name, id) {
        console.log("within store" + name);
        
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_MARKED_FOR_DELETION,
            payload: {
                name: name,
                id: id
            }
        });
        return true;
    }

    store.addMoveItemTransaction = function (start, end) {
        let transaction = new MoveItem_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    store.addUpdateItemTransaction = function (id, oldText, newText) {
        console.log(id);
        console.log(oldText);
        console.log(newText);
        let transaction = new ChangeItem_Transaction(store, id, oldText, newText);
        tps.addTransaction(transaction);
    }
    store.moveItem = function (start, end) {
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = store.currentList.items[start];
            for (let i = start; i < end; i++) {
                store.currentList.items[i] = store.currentList.items[i + 1];
            }
            store.currentList.items[end] = temp;
        }
        else if (start > end) {
            let temp = store.currentList.items[start];
            for (let i = start; i > end; i--) {
                store.currentList.items[i] = store.currentList.items[i - 1];
            }
            store.currentList.items[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.updateItem = function(id, text) {
        store.currentList.items[id] = text;
        store.updateCurrentList();
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
        store.updateToolbarButtons();
    }
    store.redo = function () {
        tps.doTransaction();
        store.updateToolbarButtons();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.setIsItemEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE,
            payload: null
        });
    }

    store.hideDeleteListModal = function () {
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
    }

    store.disableButton = (id) => {
        let button = document.getElementById(id);
        button.classList.add("top5-button-disabled");

    }

    store.enableButton = (id) => {
        let button = document.getElementById(id);
        button.classList.remove("top5-button-disabled");
    }
    
    store.updateToolbarButtons = () => {
        if (!this.tps.hasTransactionToUndo()) {
            this.disableButton("undo-button");
        }
        else {
            console.log("updating...");
            this.enableButton("undo-button");
        }

        if (!this.tps.hasTransactionToRedo()) {
            this.disableButton("redo-button");
        }
        else {
            console.log("updating...");
            this.enableButton("redo-button");
        }
        
        if(this.state.currentList != null){
            this.enableButton("close-button")
        }
        else{
            this.disableButton("close-button")
        }
        //sum for add list? idk
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}