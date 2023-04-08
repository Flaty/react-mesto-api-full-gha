import React from 'react';

const PopupWithForm = ({ title, name, children, isOpen, onClose, btnText, onSubmit }) => {

    return (
        <div className={`popup ${isOpen ? 'popup_active' : ''}`}  id={`popup_${name}`}>
            <div className="popup__form-container">
                <button className="popup__escape-button" id={`${name}_close`} type="button" onClick={onClose}/>
                <form className="popup__form" name={`${name}_form`} id={`${name}_form`} onSubmit={onSubmit}>
                    <h2 className="popup__form-title">{title}</h2>
                    {children}
                    <button className="popup__save-button" type="submit">{btnText}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PopupWithForm;
