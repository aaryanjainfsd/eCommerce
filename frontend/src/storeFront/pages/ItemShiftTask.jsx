import { set } from "firebase/database";
import "../../assets/css/itemShiftTask.css";
import { useState } from "react";

function ItemShiftTask() {
    const [leftItems, setLeftItems] = useState([
        { id: "itm-101", name: "Dell Wireless Mouse" },
        { id: "itm-102", name: "Logitech Mechanical Keyboard" },
        { id: "itm-103", name: "USB-C Power Adapter 65W" },
        { id: "itm-104", name: 'Samsung 27" LED Monitor' },
        { id: "itm-105", name: "Aluminum Laptop Stand" },
    ]);
    const [rightItems, setRightItems] = useState([]);

    const [selectedLeft, setSelectedLeft] = useState([]);
    const [selectedRight, setSelectedRight] = useState([]);

    function toggleLeftItem(itemId) {
        setSelectedLeft([...selectedLeft, itemId]);
    }

    function toggleRightItem(itemId) {
        setSelectedRight([...selectedRight, itemId]);
    }

    function moveToRight() {
        const itemsToMove = [];
        const remainingItems = [];
        leftItems.forEach((item) => {
            if (selectedLeft.includes(item.id)) {
                itemsToMove.push(item);
            } else {
                remainingItems.push(item);
            }
        });
        setRightItems([...rightItems, ...itemsToMove]);
        setLeftItems(remainingItems);
        setSelectedLeft([]);
    }

    function moveToLeft() {
        const itemsToMove = [];
        const remainingItems = [];

        rightItems.forEach((item) => {
            if (selectedRight.includes(item.id)) {
                itemsToMove.push(item);
            } else {
                remainingItems.push(item);
            }
        });
        setLeftItems([...leftItems, ...itemsToMove]);
        setRightItems(remainingItems);
        setSelectedRight([]);
    }

    return (
        <div className="page">
            <div className="card">
                <h1 className="pageTitle">Item Assignment</h1>
                <p className="pageSubtitle">
                    Select items and move them between lists
                </p>

                <div className="layout">
                    {/* Left Panel */}
                    <div className="panel">
                        <div className="panelHeader">Available Items</div>
                        <ul className="panelBody">
                            {leftItems.map((item) => {
                                return (
                                    <li key={item.id}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                onChange={() =>
                                                    toggleLeftItem(item.id)
                                                }
                                            />
                                            {item.name}
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="actions">
                        <button className="actionBtn" onClick={moveToRight}>
                            →
                        </button>
                        <button className="actionBtn" onClick={moveToLeft}>
                            ←
                        </button>
                    </div>

                    {/* Right Panel */}
                    <div className="panel">
                        <div className="panelHeader">Assigned Items</div>
                        <ul className="panelBody">
                            {rightItems.map((item) => {
                                return (
                                    <li key={item.id}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                onChange={() =>
                                                    toggleRightItem(item.id)
                                                }
                                            />
                                            {item.name}
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemShiftTask;
