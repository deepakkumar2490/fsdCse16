const showData = async() => {
    const productsDiv = document.getElementById("products");
    const res = await fetch("https://dummyjson.com/products");
    const data = await res.json();
    const products = data.products;

    products.map((data)=>{
        const product = document.createElement("div");
        product.innerText = data.title;
        product.id = "product";

        productsDiv.appendChild(product);
        // console.log(data.id);
        // console.log(data.title);
        // document.write(data.id);
        // document.write(data.title);
    });
    
} 