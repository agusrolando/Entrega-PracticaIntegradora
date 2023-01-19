const socket = io()

const prodTitle = document.getElementById('title')
const prodPrice = document.getElementById('price')
const addBtn = document.getElementById('addBtn')
const productsDOM = document.getElementById('products')

addBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const title = prodTitle.value.trim()
    const price = prodPrice.value.trim()
    if(title.length > 0 && price.length > 0 ) {
        socket.emit('addProduct', {title,price})
    }
})


socket.on('showProducts', data => {
    let products = ''
    data.forEach(product => {
        products += `<div>
        <p>ID: ${product.id}</p>
        <p>Title: ${product.title}</p>
        <p>Price: $${product.price}</p>
        <br>
    </div>`
    })
    productsDOM.innerHTML = products
})