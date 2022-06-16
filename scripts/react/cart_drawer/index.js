import React, { Component } from 'react';
import { formatMoney } from '@shopify/theme-currency';
import * as Cart from '@shopify/theme-cart';
import store from 'store'

export default class CartDrawer extends React.Component {
  state = {
    cart: JSON.parse(document.querySelector('[data-react-entrypoint="cartdrawer"]').getAttribute('data-cart')),
    general: this.props.settings,
    variants: this.props.variants,
    open: false,
    total: 0,
  };

  updateCart(cart) {
    if (cart) {
      this.setState({
        cart,
        total: cart.total_price
      }, () => {
        window.CartIcon.updateCartIcon(cart);
      });
    } else {
      Cart
        .getState()
        .then(cart => {
          this.setState({
            cart,
            total: cart.total_price
          }, () => {
            window.CartIcon.updateCartIcon(cart);
          })
        })
        .catch((error) =>
          console.log(`There was an error fetching the cart...`, error)
        );
    }
  };

  componentDidMount() {
    window.CartDrawer = this;
    this.setState({ total: this.state.cart.total_price });
  }

  toggleCart(mode) {
    // If on mobile, do not open cart drawer
    if (window.innerWidth < 1025) return;
    let open = mode ? mode : !this.state.open;
    if (open) {
      document.documentElement.classList.add('no-scroll');
    } else {
      document.documentElement.classList.remove('no-scroll');
    }
    this.setState({
      open,
    });
  }

  productAdded(variant) {
    let variants = this.state.variants;
    variants[variant.id] = variant;
    Cart
      .getState()
      .then(cart => {
        this.setState({ cart, variants, total: cart.total_price }, () => {
          this.organizeCart(true);
        });
      })
      .catch((error) =>
        console.log(`There was an error fetching the cart...`, error)
      );
  };

  render() {
    const { general } = this.state;
    return (
      <React.Fragment>
        <div className={`PageOverlay ${this.state.open ? 'is-visible' : ''}`} onClick={() => this.toggleCart(false)}></div>
        <div id="sidebar-cart" className="Drawer Drawer--fromRight Drawer--Cart" aria-hidden={!this.state.open} data-section-id="cart" data-section-type="cart">
          <div className="Drawer__Header Drawer__Header--bordered Drawer__Container">
            <span className="Drawer__Title h4">{general.title}</span>

            <button className="Drawer__Close Icon-Wrapper--clickable" onClick={() => this.toggleCart()} data-drawer-id="sidebar-cart" aria-label={general.close_cart}>
              <svg className="Icon Icon--close" viewBox="0 0 16 14"><path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" /></svg>
            </button>
          </div>
          <form className="Cart Drawer__Content" action={general.cart_url} method="POST" noValidate>
            <div className="Drawer__Main" data-scrollable>
              <div className="Cart__ItemList">
                {this.state.cart.item_count === 0 ? (
                  <p className="Cart__Empty u-h5">{general.empty}</p>
                ) : (
                    <div className="Drawer__Container" style={{ display: 'flex', flexDirection: 'column' }}>
                      <input name="attributes[collection_mobile_items_per_row]" type="hidden" value="" />
                      <input name="attributes[collection_desktop_items_per_row]" type="hidden" value="" />
                      {this.state.cart.items.map((item) => {
                        return (!item.properties['isSample'] && item.quantity) ? (
                          <LineItem key={item.key} item={item} cart={this.state.cart} updateCart={this.updateCart.bind(this)} variants={this.state.variants} general={general}/>
                        ) : null;
                      })}
                    </div>
                  )}
              </div>
            </div>
            {this.state.cart.item_count !== 0 ? (
              <div className="Drawer__Footer" data-drawer-animated-bottom>
                {general.cart_promo_text ? (<p className="Cart__Promo-Text">{general.cart_promo_text}</p>) : null}
                <p className="Cart__Taxes Text--subdued">{general.shipping_and_taxes_notice}</p>
                <a href={general.cart_url} className="Cart__Checkout Button Button--primary Button--full">
                  <span>{general.view_bag}</span>
                  <span className="Button__SeparatorDot">|</span>
                  <span data-money-convertible>{formatMoney(this.state.total, theme.moneyFormat).replace('.00', '')}</span>
                </a>
              </div>
            ) : null}
          </form>
        </div>
      </React.Fragment>
    )
  }
}