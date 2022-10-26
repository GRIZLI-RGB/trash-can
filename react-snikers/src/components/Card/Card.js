import { useState } from 'react';
import styles from './Card.module.scss';
import ContentLoader from "react-content-loader"

function Card({id, title, image, price, onPlus, onFavorite, isFavorite=false, isAdd=false, isLoading=false}) {

  const [checked, setChecked] = useState(isAdd);
  const [favorite, setFavorite] = useState(isFavorite);

  const clickPlus = () => {
    onPlus({id, title, image, price});
    setChecked(!checked);
  }

  const clickFavorite = () => {
    onFavorite({id, title, image, price});
    setFavorite(!favorite);
  }

    return (
        <div className={styles.card}>
          {
            isLoading ? <ContentLoader 
            speed={2}
            width={155}
            height={250}
            viewBox="0 0 155 250"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="0" y="0" rx="10" ry="10" width="150" height="90" /> 
            <rect x="0" y="105" rx="10" ry="10" width="150" height="15" /> 
            <rect x="0" y="125" rx="10" ry="10" width="100" height="15" /> 
            <rect x="0" y="151" rx="10" ry="10" width="80" height="25" /> 
            <rect x="118" y="145" rx="10" ry="10" width="32" height="32" />
          </ContentLoader>
          :
          <>
            <div className={styles.favorite}>
              <img onClick={clickFavorite} src={favorite ? "/img/liked.svg" : "/img/unliked.svg"} alt=""/>
            </div>
            <img src={image} alt="" width="133" height="112"/>
            <h5 className={styles.cardTitle}>{title}</h5>
            <div className={styles.cardBottom}>
              <div>
                <p>Цена:</p>
                <b>{price} руб.</b>
              </div>
              <img onClick={clickPlus} className={styles.btnAddToCart} src={ checked ? "/img/btn-good.svg" : "/img/plus.svg" }alt="Plus" width="11" height="11"/>
            </div>
            </>
          }
        </div>
    )
}

export default Card;