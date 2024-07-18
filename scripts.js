document.addEventListener('DOMContentLoaded', () => {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const categoryHeading = document.getElementById('category-heading');
    const searchBar = document.getElementById('search-bar');

    // Load cart from localStorage
    const loadCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        return cart;
    };

    // Save cart to localStorage
    const saveCart = (cart) => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const updateCartDisplay = () => {
        const cart = loadCart();
        cartCount.textContent = cart.length;

        if (cartItems && cartTotal) {
            cartItems.innerHTML = '';
            let total = 0;
            cart.forEach((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `${item.name} - $${item.price.toFixed(2)} <button class="remove-from-cart" data-index="${index}">Remove</button>`;
                cartItems.appendChild(li);
                total += item.price;
            });
            cartTotal.textContent = total.toFixed(2);

            // Add event listeners to "Remove" buttons
            document.querySelectorAll('.remove-from-cart').forEach(button => {
                button.addEventListener('click', event => {
                    const index = event.target.getAttribute('data-index');
                    const cart = loadCart();
                    cart.splice(index, 1);
                    saveCart(cart);
                    updateCartDisplay();
                });
            });
        }
    };

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', event => {
            const product = event.target.closest('.product');
            const productId = product.getAttribute('data-id');
            const productName = product.getAttribute('data-name');
            const productPrice = parseFloat(product.getAttribute('data-price'));

            const cartItem = {
                id: productId,
                name: productName,
                price: productPrice
            };

            const cart = loadCart();
            cart.push(cartItem);
            saveCart(cart);
            updateCartDisplay();
        });
    });

    // Add event listeners to dropdown menu
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const category = event.target.getAttribute('data-category');
            showCategory(category);
        });
    });

    // Show category based on selection
    const showCategory = (category) => {
        document.querySelectorAll('.product').forEach(product => {
            if (product.classList.contains(category)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });

        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        categoryHeading.textContent = `Our ${categoryName} Selection`;
    };

    // Initial cart display update
    updateCartDisplay();

    // Show coffee products by default
    showCategory('coffee');

    // Search functionality
    searchBar.addEventListener('input', (event) => {
        const searchText = event.target.value.toLowerCase();
        document.querySelectorAll('.product').forEach(product => {
            const productName = product.getAttribute('data-name').toLowerCase();
            if (productName.includes(searchText)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });

        if (searchText === '') {
            showCategory(document.querySelector('.dropdown-content a.active').getAttribute('data-category'));
        }
    });

    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', event => {
            document.querySelectorAll('.dropdown-content a').forEach(link => link.classList.remove('active'));
            event.target.classList.add('active');
        });
    });
});

