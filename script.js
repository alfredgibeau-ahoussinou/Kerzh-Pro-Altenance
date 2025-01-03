// Au début du fichier, ajoutez cette fonction pour charger le menu
async function loadMenu() {
    try {
        const response = await fetch('menu.html');
        const menuHtml = await response.text();
        document.getElementById('menu-container').innerHTML = menuHtml;
        
        // Vérifier le débordement après le chargement du menu
        checkMenuOverflow();
        
        // Vérifier à nouveau lors du redimensionnement de la fenêtre
        window.addEventListener('resize', checkMenuOverflow);

        // Réinitialiser l'écouteur d'événements du panier
        const cart = document.querySelector('.cart');
        cart.addEventListener('click', function() {
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    } catch (error) {
        console.error('Erreur lors du chargement du menu:', error);
    }
}

// Après le chargement du menu dans la fonction loadMenu()
function checkMenuOverflow() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        // Forcer un reflow pour obtenir les bonnes dimensions
        navLinks.offsetHeight;
        
        // Vérifier si le menu déborde
        const isOverflowing = navLinks.scrollWidth > navLinks.clientWidth;
        console.log('Menu overflow:', isOverflowing, 'scrollWidth:', navLinks.scrollWidth, 'clientWidth:', navLinks.clientWidth);
        
        navLinks.classList.toggle('has-overflow', isOverflowing);
        
        const navPrev = document.querySelector('.nav-prev');
        const navNext = document.querySelector('.nav-next');

        if (navPrev && navNext) {
            // S'assurer que les boutons sont visibles si nécessaire
            if (isOverflowing) {
                navPrev.style.display = 'flex';
                navNext.style.display = 'flex';
            }

            // Gérer le clic sur le bouton précédent
            navPrev.onclick = () => {
                navLinks.scrollBy({
                    left: -200,
                    behavior: 'smooth'
                });
            };

            // Gérer le clic sur le bouton suivant
            navNext.onclick = () => {
                navLinks.scrollBy({
                    left: 200,
                    behavior: 'smooth'
                });
            };

            // Gérer la visibilité des boutons pendant le défilement
            navLinks.addEventListener('scroll', () => {
                const isAtStart = navLinks.scrollLeft <= 0;
                const isAtEnd = navLinks.scrollLeft + navLinks.clientWidth >= navLinks.scrollWidth - 50;
                
                navPrev.style.opacity = isAtStart ? '0.3' : '1';
                navNext.style.opacity = isAtEnd ? '0.3' : '1';
            });

            // Vérifier la position initiale
            navPrev.style.opacity = '0.3';
            
            // Forcer une vérification initiale du défilement
            navLinks.dispatchEvent(new Event('scroll'));
        }
    }
}

// Dans la fonction checkMenuOverflow, ajoutez :
function initDropdownMenu() {
    const dropBtn = document.querySelector('.dropbtn');
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    const overlay = document.querySelector('.dropdown-overlay');
    let isOpen = false;

    // Gérer le clic sur le bouton
    dropBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen = !isOpen;
        
        if (isOpen) {
            dropdown.classList.add('active');
            document.body.style.overflow = 'hidden'; // Empêcher le défilement
            
            // Animer les liens avec un délai
            const links = dropdownContent.querySelectorAll('a');
            links.forEach((link, index) => {
                link.style.opacity = '0';
                link.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    link.style.opacity = '1';
                    link.style.transform = 'translateY(0)';
                }, 100 + (index * 50));
            });
        } else {
            closeMenu();
        }
    });

    // Fermer le menu au clic sur l'overlay
    overlay.addEventListener('click', closeMenu);

    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
            closeMenu();
        }
    });

    function closeMenu() {
        isOpen = false;
        dropdown.classList.remove('active');
        document.body.style.overflow = '';
        
        const links = dropdownContent.querySelectorAll('a');
        links.forEach(link => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(20px)';
        });
    }
}

// Modifiez l'événement DOMContentLoaded existant
document.addEventListener('DOMContentLoaded', async function() {
    // Charger d'abord le menu
    await loadMenu();
    
    // Initialiser AOS et le reste du code
    AOS.init({
        duration: 1000,
        once: true
    });

    // Données des catégories
    const categories = [
        { name: 'Fruits', image: 'images/fruits.png' },
        { name: 'Légumes', image: 'images/epicerie-salee.png' },
        { name: 'Épices', image: 'images/boissons.png' },
        { name: 'Bio', image: 'bio.jpg' },
        // Ajoutez d'autres catégories selon vos besoins
    ];

    // Création des cercles de catégories
    const categoryContainer = document.querySelector('.category-circles');
    categories.forEach(category => {
        const circle = document.createElement('div');
        circle.className = 'category-circle';
        circle.innerHTML = `
            <img src="images/${category.image}" alt="${category.name}">
            <p>${category.name}</p>
        `;
        categoryContainer.appendChild(circle);
    });

    // Création des cartes de produits
    const productsGrid = document.querySelector('.products-grid');
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="images/${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
                <button>Ajouter au panier</button>
            </div>
        `;
        productsGrid.appendChild(card);
    });

    // Initialiser le menu déroulant
    initDropdownMenu();
});

// Ajouter une vérification après un court délai pour s'assurer que tout est chargé
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(checkMenuOverflow, 100);
    window.addEventListener('resize', checkMenuOverflow);
}); 