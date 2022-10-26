import { Link } from "react-router-dom";

function Header(props) {
    return (
        <header>
            <div className="headerLeft">
            <img src="/img/logo.png" alt="" width="40" height="40"/>
            <Link to="/">
                <div className="headerInfo">
                    <h3>React Sneakers</h3>
                    <p>Магазин лучших кроссовок</p>
                </div>
            </Link>
            </div>
            <ul className="headerRight">
            <li onClick={props.onOpenCart}>
                <img src="/img/cart.svg" alt="" width="18" height="18"/>
                <span>1205 руб.</span>
            </li>
            <li>
                <Link to="/favorites">
                    <img src="/img/favourites.svg" alt="" width="21" height="19"/>
                </Link>
            </li>
            <li>
                <img src="/img/user.svg" alt="" width="20" height="20"/>
            </li>
          </ul>
        </header>
    )
}

export default Header;