// Глобальный массив товаров каталога (id, название, цена и категория).
const products = [
    {id: 1, name: "ASUS VivoBook", price: 45990, category: "study"},
    {id: 2, name: "Lenovo IdeaPad", price: 51990, category: "work"},
    {id: 3, name: "HP Pavilion", price: 56990, category: "study"},
    {id: 4, name: "Dell Inspiron", price: 68990, category: "power"}
];

// Глобальная корзина: сюда добавляются выбранные товары.
let cart = [];

// Получаем ссылки на элементы страницы.
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const productCards = document.querySelectorAll(".product-card");
const addButtons = document.querySelectorAll(".add-to-cart");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const cartCounter = document.querySelector("#cartCounter");
const categoryFilter = document.querySelector("#categoryFilter");
const resetFilter = document.querySelector("#resetFilter");
const clearCartButton = document.querySelector("#clearCart");
const payButton = document.querySelector("#payButton");

// Форматирует число в цену вида "45 990".
const formatPrice = (price) => `${price.toLocaleString("ru-RU")} ₽`;

// Считает общую стоимость всех товаров в корзине.
const calculateTotal = () => cart.reduce((total, item) => total + item.price, 0);

// Возвращает правильную форму слова "товар" для счётчика.
const getItemsLabel = (count) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return "товаров";
    }

    if (lastDigit === 1) {
        return "товар";
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
        return "товара";
    }

    return "товаров";
};

// Обновляет текст счётчика "Сейчас в корзине".
const updateCounter = () => {
    if (!cartCounter) {
        return;
    }

    cartCounter.textContent = `${cart.length} ${getItemsLabel(cart.length)}`;
};

// Создаёт HTML-элемент одного товара в корзине.
const createCartItem = (item, index) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
        <div>
            <p class="cart-item__title">${item.name}</p>
            <p class="cart-item__price">${formatPrice(item.price)}</p>
        </div>
        <button class="cart-item__remove" data-index="${index}" type="button">Убрать</button>
    `;

    return cartItem;
};

// Перерисовывает корзину, сумму и кнопки удаления после каждого изменения.
const renderCart = () => {
    if (!cartItems || !cartTotal) {
        return;
    }

    if (cart.length === 0) {
        cartItems.innerHTML = "<p class='cart-empty'>Пока тут пусто. Добавь товар из каталога.</p>";
        cartTotal.textContent = "Итого: 0 ₽";
        updateCounter();
        return;
    }

    cartItems.innerHTML = "";
    cart.forEach((item, index) => {
        cartItems.append(createCartItem(item, index));
    });

    cartTotal.textContent = `Итого: ${formatPrice(calculateTotal())}`;
    updateCounter();

    // Находим все кнопки удаления в уже обновлённой корзине и вешаем обработчики.
    const removeButtons = document.querySelectorAll(".cart-item__remove");
    removeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const itemIndex = Number(button.dataset.index);
            cart.splice(itemIndex, 1);
            renderCart();
        });
    });
};

// Добавляет товар в корзину по id и обновляет блок корзины.
const addToCart = (productId) => {
    const product = products.find((item) => item.id === productId);
    if (!product) {
        return;
    }

    cart.push(product);
    renderCart();
};

// Применяет фильтр: показывает только товары выбранной категории.
const applyFilter = () => {
    if (!categoryFilter) {
        return;
    }

    const selectedCategory = categoryFilter.value;

    productCards.forEach((card) => {
        const productColumn = card.closest(".product-column");
        const shouldShow = selectedCategory === "all" || selectedCategory === card.dataset.category;

        if (productColumn) {
            productColumn.classList.toggle("is-hidden", !shouldShow);
        }
    });
};

// Инициализирует все обработчики каталога: фильтр, корзина, оплата.
const initCatalog = () => {
    if (!productCards.length) {
        return;
    }

    addButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const productCard = button.closest(".product-card");
            if (!productCard) {
                return;
            }

            addToCart(Number(productCard.dataset.id));
        });
    });

    if (categoryFilter) {
        categoryFilter.addEventListener("change", applyFilter);
    }

    if (resetFilter && categoryFilter) {
        resetFilter.addEventListener("click", () => {
            categoryFilter.value = "all";
            applyFilter();
        });
    }

    if (clearCartButton) {
        clearCartButton.addEventListener("click", () => {
            cart = [];
            renderCart();
        });
    }

    if (payButton) {
        payButton.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Корзина пуста");
                return;
            }

            alert("Покупка прошла успешно");
            cart = [];
            renderCart();
        });
    }

    renderCart();
};

// Закрывает мобильное меню (если оно есть на странице).
const closeMobileMenu = () => {
    if (!navToggle || !siteNav) {
        return;
    }

    navToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
};

// Инициализирует открытие/закрытие мобильного меню (если такое меню используется).
const initMobileMenu = () => {
    if (!navToggle || !siteNav) {
        return;
    }

    navToggle.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeMobileMenu();
        }
    });
};

// Точки входа: запускаем меню и каталог после загрузки файла.
initMobileMenu();
initCatalog();
