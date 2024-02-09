let sofas = JSON.parse(localStorage.getItem("products"));

const input = document.querySelector(".cart__order__form");
input.addEventListener("input", (e) => {
    e.preventDefault();
    let inputRef = e.target; // je récupère l'objet input cliqué
    // je compare l'id de l'input aux id du formulaire, s'il existe :
    if (inputRef.id === "firstName" || "lastName" || "address" || "city" || "email") {
        errorTxtColor(inputRef); // je lance ma fonction avec mon objet récupérer en paramètre
    }
});

const order = document.getElementById("order");
order.addEventListener("click", submitForm);

// Liste Regex
const regex = {
    firstName: /^[a-z ,.'-]+$/i,
    lastName: /^[a-z ,.'-]+$/i,
    address: /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]{5,60}$/,
    city: /^[a-zA-Z\u0080-\u024F]+(?:([ \-']|(\. ))[a-zA-Z\u0080-\u024F]+)*$/,
    email: /^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$/,
}

displayCart();

function displayCart() {

    // Pour chaque objet dans le tableau copié du localStorage, on crée les articles de l'affichage du panier et on les remplit avec les données du tableau.
    if (sofas) {
        sofas.forEach(sofa => {
            // Dans le dom , je sélectionne l'id où intégrer mes articles
            let cart = document.getElementById("cart__items");
            // j'intègre mon article
            let productRow = document.createElement("article");
            productRow.classList.add("cart__item");
            productRow.setAttribute("data-id", sofa._id);
            cart.appendChild(productRow);

            let divImg = document.createElement("div");
            divImg.classList.add("cart__item__img");
            productRow.appendChild(divImg);

            let productImg = document.createElement("img");
            divImg.appendChild(productImg);
            productImg.src = sofa.imageUrl;
            productImg.alt = sofa.alt;

            let itemContent = document.createElement('div');
            productRow.appendChild(itemContent);
            itemContent.classList.add("cart_item__content");

            let itemTitlePrice = document.createElement("div");
            itemContent.appendChild(itemTitlePrice);
            itemTitlePrice.classList.add("cart_item__content__titlePrice");

            let itemTitle = document.createElement("h2");
            itemTitle.innerHTML = sofa.name;
            itemTitlePrice.appendChild(itemTitle);

            let itemColor = document.createElement("p");
            itemColor.innerHTML = sofa.colors;
            itemTitlePrice.appendChild(itemColor);

            let itemPrice = document.createElement("p");
            itemPrice.innerHTML = sofa.price * sofa.quantity + " &euro;";
            itemTitlePrice.appendChild(itemPrice);
            itemPrice.classList.add("price");

            let itemSettings = document.createElement("div");
            itemContent.appendChild(itemSettings);
            itemSettings.classList.add("cart__item__content__settings");

            let itemSettingsQuantity = document.createElement("div");
            itemSettings.appendChild(itemSettingsQuantity);
            itemSettingsQuantity.classList.add("cart__item__content__settings__quantity");

            let itemQuantity = document.createElement("p");
            itemSettingsQuantity.appendChild(itemQuantity);
            itemQuantity.innerHTML = "Qté :";

            let itemQuantityInput = document.createElement("input");
            itemSettingsQuantity.appendChild(itemQuantityInput);
            itemQuantityInput.type = "number";
            itemQuantityInput.name = "itemQuantity";
            itemQuantityInput.min = "1";
            itemQuantityInput.max = "100";
            itemQuantityInput.value = sofa.quantity;
            itemQuantityInput.classList.add("itemQuantity");

            let itemDivRemove = document.createElement("div");
            itemSettings.appendChild(itemDivRemove);
            itemDivRemove.classList.add("cart__item__content__settings__delete");

            let itemRemove = document.createElement("p");
            itemDivRemove.appendChild(itemRemove);
            itemDivRemove.classList.add("deleteItem");
            itemRemove.innerHTML = "supprimer";

            countTotalQuantityCart();
            countTotalInCart();

            itemQuantityInput.addEventListener("change", (e) => {
                e.preventDefault();
                itemPrice.innerHTML = sofa.price * itemQuantityInput.value + " &euro;";
                countTotalInCart();
                countTotalQuantityCart();
                if (localStorage.getItem("products")) {
                    let productIndex = sofas.findIndex((item => item._id === sofa._id && sofa.colors === item.colors));
                    if (productIndex !== -1) {
                        sofas[productIndex].quantity = itemQuantityInput.value;
                    }
                }
                localStorage.setItem("products", JSON.stringify(sofas));
            })

            itemRemove.addEventListener("click", (e) => {
                e.preventDefault();
                if (sofa._id === sofa._id) {
                    let productIndex = sofas.indexOf(sofa);
                    let deleteConfirm = window.confirm("Voulez-vous vraiment supprimer l'article ? ?");

                    if (deleteConfirm === true) {
                        cart.removeChild(productRow);
                        sofas.splice(productIndex, 1);
                    }
                    if (sofas.length === 0) {
                        localStorage.clear();
                        location.href = "./cart.html";
                    }
                }
                countTotalQuantityCart();
                countTotalInCart();
                localStorage.setItem("products", JSON.stringify(sofas));
            });
        });
    }
    else {
        let cartEmpty = document.querySelector("#cartAndFormContainer > h1");
        cartEmpty.innerHTML = "Votre panier est vide";
    }
}

function countTotalInCart() {
    let arrayOfPrice = [];
    let totalPrice = document.querySelector("span#totalPrice");
    let productPriceAccordingToQuantity = document.querySelectorAll(".price");

    for (let price in productPriceAccordingToQuantity) {
        arrayOfPrice.push(productPriceAccordingToQuantity[price].innerHTML);
    }

    arrayOfPrice = arrayOfPrice.filter((el) => {
        return el !== undefined;
    });
    arrayOfPrice = arrayOfPrice.map((x) => parseFloat(x));

    // Additionner les valeurs du tableau pour avoir le prix total
    const reducer = (acc, currentVal) => acc + currentVal;
    arrayOfPrice = arrayOfPrice.reduce(reducer);

    // Affichage du prix total
    totalPrice.innerText = new Intl.NumberFormat().format(arrayOfPrice);

}

// Affichage de la quantité total
function countTotalQuantityCart() {
    let totalQuantity = document.getElementById("totalQuantity");
    let productQuantityAccordingToQuantity = document.getElementsByClassName("itemQuantity");
    let quantityTotal = 0 ;

    for (let i = 0; i < productQuantityAccordingToQuantity.length; i++){
        quantityTotal += Number(productQuantityAccordingToQuantity[i].value) ;
    }

    totalQuantity.innerText = new Intl.NumberFormat().format(quantityTotal) ;
}

function errorTxtColor(inputRef) {
    // Je crée ma liste de message d'erreur
    const error = {
        firstNameErrorMsg: "&#9940; Vous devez saisir un Prénom valide",
        lastNameErrorMsg: "&#9940; Vous devez saisir un Nom valide",
        addressErrorMsg: "&#9940; Vous devez saisir une adresse valide",
        cityErrorMsg: "&#9940; Vous devez saisir une ville valide",
        emailErrorMsg: "&#9940; Vous devez saisir un Mail valide",
        requiredDataField: "&#9940; Ce champs ne peut être vide",
    }
    // On récupère l'élément où afficher le message d'erreur
    let txtErrorMsg = inputRef.id + "ErrorMsg";
    let addTxtMsgError = document.getElementById(txtErrorMsg);
    // On récupère le regex a tester
    let regexTest = regex[inputRef.id];

    if (regexTest.test(inputRef.value) === true ) { // Si la valeur de l'input est correct
        inputRef.style.backgroundColor = "white";
        inputRef.style.border = "none";
        inputRef.style.animation = "none";
        addTxtMsgError.innerHTML = "";
    }
    else {  // Sinon on crée le texte d'erreur correspondant
        inputRef.style.backgroundColor = "#fbbcbc";
        inputRef.style.border = "2px solid D97878FF";
        addTxtMsgError.innerHTML = error[txtErrorMsg];
    }
}

// évènement au clic du bouton commander
function submitForm(event) {
    event.preventDefault();
    if (localStorage.getItem("products") === null) {
        let popUp = confirm("Votre panier semble vide. Voulez-vous retourner à l'accueil voir nos produits ?");
        if (popUp === true) {
            location.href = "./index.html";
        }
    }
    else {
        let regexOk = 0;
        // création d'un tableau afin de récupérer les données de l'utilisateur
        let contact = {
            firstName: document.getElementById('firstName'),
            lastName: document.getElementById('lastName'),
            address: document.getElementById('address'),
            city: document.getElementById('city'),
            email: document.getElementById('email'),
        }
        let contactValue = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            email: document.getElementById('email').value,
        }

        // Je vérifie chacune des données de mon tableau contact
        for (let input in contact) {
            let controlInput = contact[input];
            let regexTest = regex[controlInput.id];
            // Je test la longueur du champ de saisie et le regex correspondant
            if (regexTest.test(controlInput.value) === true && controlInput.value.length >= 3 )
            {
                regexOk += 1; // s'il est valide, j'incrémente ma variable de 1
            }
        }
        if (regexOk === 5 ) {
            let products = [];

            // boucle du tableau du localStorage afin de récupérer les id et les intégrer dans mon tableau products
            sofas.forEach(order => {
                products.push(order._id)
            });

            let pageOrder = {contactValue, contact, products,};

            // je fais appel à l'api order pour envoyer mes tableaux
            fetch(('http://localhost:3000/api/products/order'), {
                method: "POST",
                headers: {
                    'Accept': 'application/json', 'Content-type': 'application/json'
                },
                body: JSON.stringify(pageOrder)
            })
                .then(res => {
                    return res.json();
                })
                .then((data) => {
                    window.location.href = `confirmation.html?orderId=${data['orderId']}`;
                })
                .catch((error) => {
                    alert(error);
                })
        }
        else {
            inputNone();
        }
    }
}

function inputNone() {
    let emptyInput = document.querySelectorAll('.cart__order__form__question > p');
    for (let i = 0; i < emptyInput.length; i++) {
        let emptyInputId = emptyInput[i].id;
        let errorMsgId = document.getElementById(emptyInputId);
        let errorInputId = errorMsgId.previousElementSibling;

        if (errorInputId.value === "" || errorInputId.value.length <= 2 ) {
            errorInputId.style.backgroundColor = "#fbbcbc";
            switch (emptyInputId) {
                case 'firstNameErrorMsg':
                    errorMsgId.innerHTML = "&#10060; Vous devez saisir vôtre prénom, 3 caractères minimum";
                    break;
                case 'lastNameErrorMsg':
                    errorMsgId.innerHTML = "&#10060; Vous devez saisir vôtre nom, 3 caractères minimum";
                    break;
                case 'addressErrorMsg':
                    errorMsgId.innerHTML = "&#10060;Vous devez saisir vôtre adresse, 3 caractères minimum";
                    break;
                case 'cityErrorMsg':
                    errorMsgId.innerHTML = "&#10060; Vous devez saisir vôtre ville, 3 caractères minimum";
                    break;
                case 'emailErrorMsg':
                    errorMsgId.innerHTML = "&#10060; Vous devez saisir vôtre email, 3 caractères minimum";
                    break;
                default:
                    errorTxtColor(errorInputId);
                    break;
            }
        }
    }
}



