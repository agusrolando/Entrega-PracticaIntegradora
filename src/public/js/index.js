const socket = io()
const prodTitle = document.getElementById('title')
const prodPrice = document.getElementById('price')
const form = document.getElementById('form')
const productsDOM = document.getElementById('products')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const product = {
        title : prodTitle.value,
        price : prodPrice.value
    }
    socket.emit('addProduct', product)
})

function productsList(products) {
    return products.map(product => {
        return( `<div>
        <p>Title: ${product.title}</p>
        <p>Price: $${product.price}</p>
        <br>
        </div>`)
    })
}

socket.on('showProducts', data => {
    console.log(data)
    const products = productsList(data)
    productsDOM.innerHTML = products
   
})