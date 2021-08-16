import React, { useRef, useEffect, useCallback } from "react";
import "./modal.css";

const Modal = ({ showModal, setShowModal, children }) => {
  const modalRef = useRef();
  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };
  const KeyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }
    },
    [setShowModal, showModal]
  );
  useEffect(() => {
    document.addEventListener("keydown", KeyPress);
    return () => document.addEventListener("keydown", KeyPress);
  }, [KeyPress]);
  return (
    <>
      {showModal !== false ? (
        <div className="modal-bg" ref={modalRef} onClick={closeModal}>
          <div className="modal">
            {children}
            <i
              onClick={(e) => setShowModal((prev) => !prev)}
              className="fa fa-times close-btn"
            ></i>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
