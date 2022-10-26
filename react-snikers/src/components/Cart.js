function Cart({onCloseCart, onRemove, items=[]}) {
    return (
        <aside className="asideShadow">
            <div className="aside">
                <h2>Корзина
                    <img onClick={onCloseCart} className="removeImg" src="/img/btn-remove.svg" alt=""/>
                </h2>
                <div className="cartItems">
                    {items.map((obj, ind) => (
                        <div className="cartItem" key={ind}>
                        <img src={obj.image} alt="" width="70" height="70"/>
                        <div>
                            <p>{obj.title}</p>
                            <b>{obj.price} руб.</b>
                        </div>
                        <img onClick={() => onRemove(obj['id'])} className="removeImg" src="/img/btn-remove.svg" alt=""/>
                        </div>
                    ))}
                </div>
                <div>
                    <ul className="cartList">
                    <li>
                        <span>Итого:</span>
                        <div></div>
                        <b>21 498 руб.</b>
                    </li>
                    <li>
                        <span>Налог 5%:</span>
                        <div></div>
                        <b>1074 руб.</b>
                    </li>
                    </ul>
                    <button className="goCart">Оформить заказ
                    <img src="/img/arrow.svg" alt=""/>
                    </button>
                </div>
            </div>
      </aside>
    )
}

export default Cart;