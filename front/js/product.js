let params = new URL(document.location).searchParams;
let id = params.get("id");

const productCardImg = document.querySelector(".item__img");
const productCardName = document.querySelector("#title");
const productCardDescription = document.querySelector(".item__content__description");
const productCardPrice = document.querySelector("#price");
const sofasNumber = document.querySelector("#itemQuantity");
const colorSelect = document.querySelector("#color-select");

main();

function main() {
    getArticles ();
    addToCart();
    countTotalQuantityCart();
}


function getArticles() {
    // On récupère uniquement le produit dont on a besoin via le paramètre dans la requête
    fetch(`http://localhost:3000/api/products/${ id }`)
        .then(function (res) {
            return res.json();
        })
        .catch((err) => {
            let items = document.querySelector(".limitedWidthBlock");
            items.innerHTML =
                'Nous ne sommes pas parvenu à afficher nos Produits<br>Si le problème persiste, contactez-nous.<br>' + err.message;
        })

        .then(function (resApi) {
            // On place les données reçues via l'API aux bons endroits sur la page
            let article = resApi;

            productCardName.innerHTML = article.name;
            productCardImg.src = article.imageUrl;
            productCardImg.alt = article.altTxt;
            productCardDescription.innerText = article.description;
            productCardPrice.innerText = article.price;

            // On charge l'image et son attribut alt
            let linkImg = document.createElement("img");
            productCardImg.appendChild(linkImg);
            linkImg.src = article.imageUrl;
            linkImg.alt = article.altTxt;

            let colorSelect = document.getElementById("color-select");
            for (let i = 0; i < article.colors.length; i++) {
                let option = document.createElement("option");
                option.innerText = article.colors[i];
                colorSelect.appendChild(option);
            }
        });
}

function addSuccessfully() {
    // On crée le message d'ajout au panier réussi
    let txtAdd = document.querySelector(".item__content__successMessage");
    let txtCreate = document.createElement("p");
    txtCreate.innerHTML = "Ajout au panier réussi";
    txtCreate.style.color = "yellowgreen";
    txtAdd.appendChild(txtCreate);

    // On l'efface quelque secondes plus tard
     setTimeout( function() {
        document.querySelector('.item__content__successMessage').innerHTML = "";
    },1000);
}
function addToCart() {
    const addToCartBtn = document.querySelector(".item__content__addButton");
    // Evenement au clic du bouton ajouter au panier
    addToCartBtn.addEventListener("click", (e) => {
        e.preventDefault();
        addSuccessfully();

        // Si une couleur de produit est choisi ainsi qu'une quantité comprise entre 1-99 je crée l'objet
        if (sofasNumber.value > 0 && sofasNumber.value < 100 && colorSelect.value !== "") {
            // ------ Création du produit qui sera ajouté au panier
            let productAdded = {
                name: productCardName.innerHTML,
                price: Number(productCardPrice.innerHTML),
                quantity: Number(sofasNumber.value),
                _id: id,
                colors: colorSelect.value,
                imageUrl: productCardImg.src,
                alt: productCardImg.alt,
            };
            // Création du tableau pour récupérer les données
            let productsRegisteredInLocalStorage = [];
            // Si le localStorage contient un produit
            if (localStorage.getItem("products")) {
                // Les données sont transférées dans le tableau
                productsRegisteredInLocalStorage = JSON.parse(localStorage.getItem("products"));
                // On vérifie si un produit a le meme id et meme couleur
                let productIndex = productsRegisteredInLocalStorage.findIndex((item=> item._id === productAdded._id && productAdded.colors === item.colors));
                // Si id et couleur identique on ajoute la quantité
                if (productIndex !== -1) {
                    productsRegisteredInLocalStorage[productIndex].quantity += productAdded.quantity;
                }
                // Sinon si , j'ajoute le  nouveau produit dans le tableau
                else if (productIndex === -1) {
                    productsRegisteredInLocalStorage.push(productAdded);
                }
                // J'envoi les données du tableau au localStorage
                localStorage.setItem("products", JSON.stringify(productsRegisteredInLocalStorage));
            }
            // si le localStorage est vide j'ajoute le nouveau produit
            else {
                productsRegisteredInLocalStorage.push(productAdded);
                localStorage.setItem("products", JSON.stringify(productsRegisteredInLocalStorage));
            }

        }
        // si quantité invalide et couleur non sélectionné je crée une alerte et aucun objet produit n'est créer
        else {

            if (colorSelect.value === "") {
                if(sofasNumber.value > 0 && sofasNumber.value < 100) {
                    alert("Please select a sofa color");
                }
                else {
                    alert("Please select a sofa color and  a quantity sofa (1-99)");
                }
            }
            else {
                alert("Please select a quantity sofa (1-99)");
            }
        }
        countTotalQuantityCart();
    });
}
function countTotalQuantityCart() {
    let totalQuantity = document.querySelector(".panierQuantity");

    // On push chaque quantité du DOM dans un tableau
    let productQuantityAccordingToQuantity = JSON.parse(localStorage.getItem("products"));
    let quantityTotal = 0 ;
    if (productQuantityAccordingToQuantity)  {
        for (let i = 0; i < productQuantityAccordingToQuantity.length; i++){
            quantityTotal += Number(productQuantityAccordingToQuantity[i].quantity) ;
        }
        // Affichage du prix total
        totalQuantity.innerText = quantityTotal ;
        totalQuantity.style.display = "flex";
    }
}


