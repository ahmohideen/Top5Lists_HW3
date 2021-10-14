import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [draggedTo, setDraggedTo] = useState(0);
    const [toggle, setToggle] = useState(true)
    const [ text, setText ] = useState(props.text);
    let [ oldText, setOldText] = useState(props.text);
    //let toggle = true;

    function handleDragStart(event) {
        event.dataTransfer.setData("item", event.target.id);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("item");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveItemTransaction(sourceId, targetId);
    }

    function toggleEdit(e) {
        setToggle(!toggle);
        console.log("edit button pressed");
        console.log(toggle);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            handleBlur(event);
        }
    }

    function handleBlur(event) {
        console.log(text);
        console.log("within blur");
        console.log(event.target.id);
        let id = parseInt((event.target.id).split("-")[2]) - 1;
        console.log(id);
        console.log(text);
        console.log(oldText);
        //aight, id and text are correct
        store.addUpdateItemTransaction(id, props.oldText, text);
        setOldText(text);
        setToggle(!toggle);
    }

    function handleUpdate(event) {
        //let text = event.target.value;
        setText(event.target.value);

    }

    let { index } = props;
    let itemClass = "top5-item";
    if (draggedTo) {
        itemClass = "top5-item-dragged-to";
    }
    if (toggle){
    return (
            <div
                id={'item-' + (index + 1)}
                className={itemClass}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                draggable="true"
            >
                <input
                    onClick={toggleEdit}
                    type="button"
                    id={"edit-item-" + index + 1}
                    className="list-card-button"
                    value={"\u270E"}
                />
                {text}
            </div>)
    }
    else {
        return(
            <input
                id={'list-text-' + (index + 1)}
                class="top5-item"
                type='text'
                onKeyPress={handleKeyPress}
                onBlur={handleBlur}
                onChange={handleUpdate}
                defaultValue={text}
            /> 
        )
    }    
}

export default Top5Item;