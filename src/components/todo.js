import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Modal from "../components/modal";
import "./todo.css";

//GET_DATA_FROM_LOCALSTORAGE
const getLocalItems = () => {
  let list = localStorage.getItem("list");

  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};
//GET_DATA_FROM_LOCALSTORAGE

const Todo = () => {
  //SET_HOOKS
  const [inputData, setInputData] = useState("");
  const [items, setItems] = useState(getLocalItems());
  const [toggleSubmit, setToggleSubmit] = useState(true);
  const [isEditItem, setIsEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [MostViewdVideo, setMostViewdVideo] = useState("");
  const [MostViewdVideoTitle, setMostViewdVideoTitle] = useState("");

  const inputRef = useRef(false);

  //ADD_ITEM
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
  //ADD_ITEM

  //CALL_API
  const showMostCountVideo = () => {
    setShowModal(true);
    axios("http://api.aparat.com/fa/v1/video/video/mostViewedVideos").then(
      (response) => {
        const myResponse = response.data;
        const siData = myResponse.data;

        var mostViewedArray = [];
        siData.forEach((item) => {
          mostViewedArray.push(item.attributes.visit_cnt);
        });

        const maxNumber = Math.max(...mostViewedArray);

        const maxCount = siData.find((item) => {
          if (Number(item.attributes.visit_cnt) === maxNumber) {
            return item.attributes.visit_cnt;
          }
        });

        setMostViewdVideo(maxCount.attributes.preview_src);
        setMostViewdVideoTitle(maxCount.attributes.title);
      }
    );
  };
  //CALL_API

  //DELETE_ITEM
  const deleteItem = (index) => {
    const updatedItems = items.filter((item) => {
      return item.id !== index;
    });
    setItems(updatedItems);
  };
  //DELETE_ITEM

  //EDIT_ITEM
  const editItem = (id) => {
    let editedItems = items.find((item) => {
      return item.id === id;
    });

    setToggleSubmit(false);
    setInputData(editedItems.name);
    setIsEditItem(id);
  };
  //EDIT_ITEM

  //REMOVE_ALL
  const removeAll = () => {
    setItems([]);
  };
  //REMOVE_ALL

  //ADD_DATA_TO_LOCALSTORAGE
  useEffect(() => {
    inputRef.current.focus();
    localStorage.setItem("list", JSON.stringify(items));
  }, [items]);
  //ADD_DATA_TO_LOCALSTORAGE

  return (
    <div className="main">
      <div className="todo-app">
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          children={removeAll}
        >
          <h1>پربازدیدترین ویدئوی روز</h1>
          <p>{MostViewdVideoTitle}</p>
          <iframe title={MostViewdVideoTitle} src={MostViewdVideo}></iframe>
        </Modal>
        <h1>لیست‌ کارهای روزانه</h1>
        <div className="add-box">
          <input
            placeholder="کارهای خود را وارد نمایید"
            type="text"
            value={inputData}
            name="addInput"
            ref={inputRef}
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
