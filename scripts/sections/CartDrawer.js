import React from 'react';
import { render } from 'react-dom';
import MiniCart from '../react/cart_drawer';

export default class DrawerCart {
  constructor(section) {
    this.el = section.el;
    this.sectionId = section.id;
    this.type = section.type;
    this.data = section.data;

    this.selectors = {
      cartEl: '[data-react-entrypoint="cartdrawer"]',
    };

    this.cartContainer = document.querySelector(this.selectors.cartEl);

    this._init();
  }

  _init() {
    console.log(`Section Loaded. Type: ${this.type}`);

    this._renderCart();
  }

  _renderCart() {
    if (this.cartContainer) {
      const { settings_data, variant_data } = this.data;
      render(
        <MiniCart
          settings={settings_data}
          variants={variant_data}
        />
        ,
        this.cartContainer
      );
    }
  }
}