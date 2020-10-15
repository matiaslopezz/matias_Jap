//Declaración de variables a utilizar
let total_per_article = [];
let total_article_count = [];

//Función que muestra la información de los artículos a comprar y transfoma la moneda a pesos uruguayos
function showArticles(array){
    let htmlContentToAppend = "";

    for (let i = 0 ; i < articles.length; i++){
        let article = articles[i]
        total_article_count.push(article.count)
    }
    
    for (let i = 0 ; i < array.length; i++){
        let article = array[i];

        if (article.currency == "USD"){
            total_per_article[i] = article.unitCost*40*total_article_count[i]
        }else if (article.currency == "UYU"){
            total_per_article[i] = article.unitCost*total_article_count[i]
        }

        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="` + article.src + `" alt="` + `" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">`+ article.name +`</h4>
                        <small class="text-muted">` + 'Seleccione la cantidad:' + " " + `<br><input type="number" id="aux`+ i +`" min="1"></input></small>
                        
                    </div>
                    <small class="text-muted">Artículos a comprar: ` + total_article_count[i] + `</small>
                    <p class="mb-1">Precio unitario: ` + article.currency + " " + article.unitCost + `</p>
                    <p class="mb-1">Total por artículo: UYU ` + total_per_article[i] + `</p>                    
                </div>
            </div>
        </div>
        `;    
    }
    document.getElementById('article-list-container').innerHTML = htmlContentToAppend;
    

    for (let i = 0 ; i < array.length; i++){
        document.getElementById("aux"+i).addEventListener("change", (e)=> {
            total_article_count[i] = document.getElementById("aux"+i).value
            showArticles(articles);
            showPrices(articles);
        })
    }

}

// Función que muestra los precios en la sección de pago
function showPrices(array){
    let htmlContentToAppend2 = "";
    let htmlContentToAppend3 = "";
    let htmlContentToAppend4 = "";
    
    for (let i = 0 ; i < array.length; i++){
        let article = array[i];
        
        htmlContentToAppend2 += `
            <div class="list-group-item list-group-item-action">
                <div class="justify-content-between"
                    <ul>
                        <li>`+ article.name + `: UYU ` + total_per_article[i] +`</li>
                    </ul>
                </div>
            </div>
            `
    }

    htmlContentToAppend3 += `
    <p><strong>Subtotal</strong>: UYU: ` + total_per_article.reduce((a, b) => a + b, 0) +`</p>
    `

    htmlContentToAppend4 += `
        <p><strong>Total a pagar</strong>: UYU: ` + total_per_article.reduce((a, b) => a + b, 0) +`</p>
    `
    
    document.getElementById("cost-per-article").innerHTML = htmlContentToAppend2;
    document.getElementById("subtotal").innerHTML = htmlContentToAppend3;
    document.getElementById("total").innerHTML = htmlContentToAppend4;
    
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData("https://japdevdep.github.io/ecommerce-api/cart/654.json")
        .then(function(result){
            if (result.status == 'ok'){
                articles_info = result.data;
                articles = articles_info.articles;

                let total_article_count = [];

                for (let i = 0 ; i < articles.length; i++){
                    let article = articles[i]
                    total_article_count.push(article.count)
                    console.log(total_article_count)
                }   

            }
            showArticles(articles);
            showPrices(articles);
    })
    
});