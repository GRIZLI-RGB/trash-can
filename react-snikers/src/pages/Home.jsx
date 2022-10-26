import Card from "../components/Card/Card";

function Home({products, search, onSearch, onAddToCart, onAddToFavorites, cartItems}) {
    return (
        <section className="content">
        <div className="titleBox">
          <h1>{(search !== '') ? `Поиск по запросу: ${search}` : 'Все кроссовки' }</h1>
          <div className="search">
            <img src="/img/search.svg" alt="Search"/>
            <input onChange={onSearch} value={search} type="text" placeholder="Поиск..."/>
          </div>
        </div>
        <div className="products">
          {
            products
            .filter((obj) => obj.title.toLowerCase().includes(search.toLowerCase()) )
            .map((obj, ind) => {
            return (
              <Card
                key={ind}
                onFavorite={(product) => onAddToFavorites(product)}
                onPlus={(product) => onAddToCart(product)}
                isAdd={cartItems.some(item => Number(item.id) === Number(obj.id))}
                {...obj}
              />
            )})
          }
        </div>
        </section>
    )
}

export default Home;