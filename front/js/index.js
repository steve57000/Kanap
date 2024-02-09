apiConnect();
countTotalQuantityCart();

function apiConnect() {
    fetch('http://localhost:3000/api/products')
       .then(function(res) {
          return res.json();
       })
       .catch(function(err) {
          let items = document.querySelector("#items");
          items.innerHTML = "C'est frustrant !! <br/>Nous ne sommes pas parvenu à afficher nos canapés <br/>Erreur HTML : " + err.message;
          items.style.color = "#fbbcbc";
       })
       .then(function(resApi) {
           for (let id in resApi) {
               const sofa = resApi[id];

               let productLink = document.createElement("a");
               document.getElementById("items").appendChild(productLink);
               productLink.href = `product.html?id=${ sofa._id }`;

               let sofaImg = document.createElement("article");
               productLink.appendChild(sofaImg);

               let linkImg = document.createElement("img");
               sofaImg.appendChild(linkImg);
               linkImg.src = sofa.imageUrl;
               linkImg.alt = sofa.altTxt;

               let productInfosDiv = document.createElement("h3");
               sofaImg.appendChild(productInfosDiv);
               productInfosDiv.classList.add("productName");
               productInfosDiv.innerHTML = sofa.name;

               let sofaDescription = document.createElement("p");
               sofaImg.appendChild(sofaDescription);
               sofaDescription.classList.add("productDescription");
               sofaDescription.innerHTML = sofa.description;
           }
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
    }else {
        totalQuantity.style.display = "none";
    }
}
