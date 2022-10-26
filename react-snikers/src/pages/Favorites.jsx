import Card from "../components/Card/Card";

function Favorites({favorites, onAddToFavorites}) {
    return (
        <section className="content">
        <div className="titleBox">
          <h1>Мои закладки</h1>
        </div>
        <div className="products">
        {
            favorites
            .map((obj, ind) => {
            return (
              <Card
                key={ind}
                isFavorite={true}
                onFavorite={(product) => onAddToFavorites(product)}
                {...obj}
                // onPlus={(product) => onAddToCart(product)}
              />
            )})
          }
        </div>
        </section>
    )
}

export default Favorites;