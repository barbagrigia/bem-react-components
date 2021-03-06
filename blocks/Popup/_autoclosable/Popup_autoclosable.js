import {declMod} from 'bem-react-core';
import React from 'react';

export default declMod({ autoclosable: true }, {
    block : 'Popup',

    willInit() {
        this.__base.apply(this, arguments);

        this._isClickInside = false;

        this._onClick = this._onClick.bind(this);
        this._onDocumentClick = this._onDocumentClick.bind(this);
        this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    },

    mods({ autoclosable }) {
        return { ...this.__base.apply(this, arguments), autoclosable };
    },

    didUpdate({ visible }) {
        if(visible !== this.props.visible) {
            if(visible) {
                document.removeEventListener('click', this._onDocumentClick);
                document.removeEventListener('keydown', this._onDocumentKeyDown);
            } else {
                document.addEventListener('click', this._onDocumentClick);
                document.addEventListener('keydown', this._onDocumentKeyDown);
            }
        }
        this.__base.apply(this, arguments);
    },

    attrs({ visible }) {
        const res = this.__base.apply(this, arguments);

        if (visible) {
            return {
                ...res,
                onClick: this._onClick,
            }
        }
        return res;
    },

    _onClick() {
        this._isClickInside = true;
    },

    _onDocumentClick() {
        this._isClickInside || this.props.onVisibleChange(false);
        this._isClickInside = false;
    },

    _onDocumentKeyDown(e) {
        if (e.key === 'Escape') {
            // NOTE: we call `preventDefault()` to prevent desktop Safari from exiting the full screen mode
            e.preventDefault();
            this.props.onVisibleChange(false);
        }
    }
});
