//Función que nos devuelve los parámetros URL a elección
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}

//Función que añade las imágenes (son 5) del producto al HTML
function showImagesGallery(array){

    let htmlContentToAppend = "";
    let htmlContentToAppend_2= "";

    // Consideramos las primeras 3 -para su posterior uso en un carrusel-
    for(let i = 0; i < array.length-2; i++){
        let imageSrc = array[i];

        htmlContentToAppend += `
            <div class="col-lg-3 col-md-4 col-6">
                <div class="d-block mb-4 h-100">
                    <img class="img-fluid img-thumbnail" src="` + imageSrc + `" alt="">
                </div>
            </div>`

        document.getElementById("product-images").innerHTML = htmlContentToAppend;
    }

    // Consideramos las últimas 2 -para su posterior uso en un carrusel-
    for(let i = 3; i < array.length; i++){
        let imageSrc = array[i];

        htmlContentToAppend_2 += `
        <div class="col-lg-3 col-md-4 col-6">
            <div class="d-block mb-4 h-100">
                <img class="img-fluid img-thumbnail" src="` + imageSrc + `" alt="">
            </div>
        </div>`


        document.getElementById("product-images-2").innerHTML = htmlContentToAppend_2;
    }
}

//Función que añade los comentarios y puntuaciones del producto al HTML
function showComments(array){

    let htmlContentToAppend = "";

    array.forEach(function(comment) {
        let rating = '';

        for (let i = 1; i <= comment.score; i++) {
            rating += `<span class="fa fa-star checked"></span>`;
        }
                    
        for (let i = comment.score + 1; i <= 5; i++) {
            rating += `<span class="fa fa-star unchecked"></span>`;
        }
    
        htmlContentToAppend += 

        `<div class="row list-group-item list-group-item-action">
            <div class="col">
                <div class="d-flex w-100 justify-content-between">
                    <p class=""><strong>`+ comment.user +`</strong><p>
                    <small class="text-muted">`+ comment.dateTime + ` </small>
                </div>
                <p class="mb-1">` + comment.description + `</p>
                <p class="mb-1">${rating}</p>
            </div>
        </div>`

    })

    document.getElementById("product-comment-container").innerHTML = htmlContentToAppend;
}

//Agregar puntuación a la reseña
var list=['one','two','three','four','five'];

list.forEach(function(element, posicion) {
    document.getElementById(element).addEventListener("click", function(){
        for (let i = 0; i < list.length; i++) {
            var cls=document.getElementById(element).className;
            var star = document.getElementById(list[i]);

            if(posicion >= i && cls.includes("unchecked")) {
                star.classList.remove("unchecked");
                star.classList.add("checked");
            }   
            else if (posicion < i && cls.includes("checked")) {
                star.classList.remove("checked");
                star.classList.add("unchecked");
            }
        }
        sessionStorage.setItem('rating', posicion);
    });            
});

//Enviar un nuevo comentario
document.getElementById('send-comment').addEventListener('click', function (e){
    var currentDate = new Date();
    var dateTime = currentDate.getFullYear() + "-"
            + (currentDate.getMonth()+1) + "-"
            + currentDate.getDate() + " "
            + currentDate.getHours() + ":"  
            + currentDate.getMinutes() + ":" 
            + currentDate.getSeconds();

    let newComment = {
        score: parseInt(sessionStorage.getItem('rating'))+1,
        description: document.getElementById('comment').value,
        user: sessionStorage.getItem('logeado'),
        dateTime: dateTime
    }

    product_comments.push(newComment);
    showComments(product_comments);
    document.getElementById('comment').value = '';
});


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    //Petición a la URL que contiene la información del producto
    getJSONData(PRODUCT_INFO_URL)
        .then(function(result){
            if (result.status == 'ok'){
                product_info = result.data;
                
                related_products = product_info.relatedProducts;
                
                //let productName = document.getElementById("productName");
                let productName = getQueryVariable("producto"); //El nombre del producto lo obtenemos de la URL
                let productDescription = document.getElementById("productDescription");
                let productCost = document.getElementById("productCost");
                let productSoldCount = document.getElementById("productSoldCount");

                //productName.innerHTML = product_info.name;
                document.getElementById("productName").innerHTML = productName.replace(/%20/g," "); //Reemplazamos los '%20' por espacios vacíos
                productDescription.innerHTML = product_info.description;
                productCost.innerHTML = "USD:" + " " + product_info.cost;
                productSoldCount.innerHTML = product_info.soldCount;

                showImagesGallery(product_info.images);
            }
    
        //Petición a la URL que contiene los productos y muestra aquellos que están relacionados
        getJSONData(PRODUCTS_URL).then(function (result) {
            let htmlContentToAppend = '';

            if (result.status === "ok") {
                for (let i = 0; i < result.data.length; i++) {
                    let element = result.data[i];
                    
                    if (related_products.includes(i)) {
                        htmlContentToAppend += `
                        <a href="product-info.html?producto=` + element.name + `" class="list-group-item list-group-item-action">
                        <div class="row">
                            <div class="col-3">
                                <img src="` + element.imgSrc + `" alt="` + `" class="img-thumbnail">
                            </div>
                            <div class="col">
                                <div class="d-flex w-100 justify-content-between">
                                    <h4 class="mb-1">`+ element.name +`</h4>
                                    <small class="text-muted">` + 'Artículos vendidos:' + " " + element.soldCount + ` </small>
                                </div>
                                <p class="mb-1">` + element.description + `</p>
                                <p class="mb-1">` + element.currency + " " + element.cost + `</p>
                            </div>
                        </div>
                    </div>
                    </a>`

                    document.getElementById('related-products').innerHTML = htmlContentToAppend;
                    }
                }
            }
        });  
    }) 

    //Petición a la URL que contiene los comentarios y puntuaciones sobre el producto
    getJSONData(PRODUCT_INFO_COMMENTS_URL)
    .then(function(result){
        if (result.status == 'ok'){
            product_comments = result.data;
            
            showComments(product_comments);
        }
    })
});