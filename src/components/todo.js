import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../components/modal";
import "./todo.css";

//getDataFromLocalStorage
const getLocalItems = () => {
  let list = localStorage.getItem("list");

  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};
//getDataFromLocalStorage

const Todo = () => {
  //setHooks
  const [inputData, setInputData] = useState("");
  const [items, setItems] = useState(getLocalItems());
  const [toggleSubmit, setToggleSubmit] = useState(true);
  const [isEditItem, setIsEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  //addItem
  const addItem = () => {
    if (!inputData) {
      console.log("EMPTY!");
    } else if (inputData && !toggleSubmit) {
      setItems(
        items.map((item) => {
          if (item.id === isEditItem) {
            return { ...item, name: inputData };
          }
          return item;
        })
      );
      setToggleSubmit(true);
      setInputData("");
      setIsEditItem(null);
    } else {
      const allInputData = {
        id: new Date().getTime().toString(),
        name: inputData,
      };
      setItems([...items, allInputData]);
      setInputData("");

      if ((items.length + 1) % 5 === 0) {
        showMostCountVideo();
      } else {
      }
    }
  };
  //addItem

  //Call
  const showMostCountVideo = () => {
    setShowModal(true);
    axios("http://api.aparat.com/fa/v1/video/video/mostViewedVideos").then(
      (response) => {
        const data = response.data;
        const maxNumber = data.reduce(
          (max, data) => (max = max > data.visit_cnt ? max : data.visit_cnt),
          0
        );
        console.log("All Data:", data);
        console.log("max Number:", maxNumber);

        const maxCount = data.find((item) => {
          if (item.id === maxNumber) {
            return item.preview_src;
          }
        });
        console.log("res:", maxCount.preview_src);
      }
    );
  };
  //Call

  //deleteItem
  const deleteItem = (index) => {
    const updatedItems = items.filter((item) => {
      return item.id !== index;
    });
    setItems(updatedItems);
  };
  //deleteItem

  //editItem
  const editItem = (id) => {
    let editedItems = items.find((item) => {
      return item.id === id;
    });

    setToggleSubmit(false);
    setInputData(editedItems.name);
    setIsEditItem(id);
  };
  //editItem
  //removeAll
  const removeAll = () => {
    setItems([]);
  };
  //removeAll

  //addDataToLocalStorage
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(items));
  }, [items]);
  //addDataToLocalStorage

  return (
    <div className="main">
      <div className="todo-app">
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          children={removeAll}
        >
          <h1>پربازدیدترین ویدئوی روز</h1>
          <iframe
            title="most"
            src="https://static.cdn.asset.aparat.com/avt/36420365_15s.mp4"
          ></iframe>
        </Modal>
        <h1>لیست‌ کارهای روزانه</h1>
        <div className="add-box">
          <input
            placeholder="کارهای خود را وارد نمایید"
            type="text"
            value={inputData}
            name="addInput"
            onChange={(e) => setInputData(e.target.value)}
          ></input>

          {toggleSubmit ? (
            <i onClick={addItem} className="fa fa-plus todo-btn"></i>
          ) : (
            <i onClick={addItem} className="fa fa-save todo-btn"></i>
          )}
        </div>
        {inputData === "" && items.length === 0 ? (
          <p className="handy-req">لطفا فیلد بالا را پر کنید</p>
        ) : null}
        <div className="todo-list">
          {items.map((item) => (
            <div className="todo-item" key={item.id}>
              <h3>{item.name}</h3>
              <div className="todo-btn">
                <i
                  onClick={() => editItem(item.id)}
                  className="fa fa-edit todo-btn"
                ></i>
                <i
                  onClick={() => deleteItem(item.id)}
                  className="fa fa-trash-alt todo-btn"
                ></i>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 ? (
          <div className="remove-all">
            <p onClick={() => removeAll()}>حذف همه موارد</p>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Todo;
