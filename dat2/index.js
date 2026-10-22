const getproductsData = async () =>{
    const res = await fetch("https://dummyjson.com/products");
    const data = await res.json();
    return data.products;
}
const HeaderComponent = ()=>{
    return(<div style={{
        textAlign:"center",
        backgroundColor:"black",
        color:"white"
    }}>
        <h1>E-Commerce page</h1>
    </div>)
}
const ProductComponent = (props)=> {
    console.log(props.products);

    return (<div id ="prod-container">
        {props.products.map((product)=>
        <div key={product.id}>
           <img src={product.thumbnail} alt={product.title}></img>
           <h1>{product.title}</h1> 
        
        </div>)}
    </div>)
}
const FooterComponent =()=>{
    return(<div style={{
        textAlign:"center",
        backgroundColor:"black",
        color:"white"
    }}>
        <h1>Copyright all rights are reserved.</h1>
    </div>)
}
const App = async ()=>{
    const root = ReactDOM.createRoot(document.getElementById("root"));
    let products = await getproductsData()
    const reactElement=(<>
    <HeaderComponent/>
    <ProductComponent products={products}/>
    <FooterComponent/>
    </>)
    root.render(reactElement);
}
App();

