//Declaración de variables a utilizar
let total_per_article = [];
let total_article_count = [];
let delivery_costs = [];
var total_delivery_cost = undefined;
var total_article = undefined;
var total_payment = undefined;
let USDtoUYU = 40;
let standardPercentage = 0.05;
let expressPercentage = 0.07;
let premiumPercentage = 0.15;
let newArray = [];

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
            total_per_article[i] = article.unitCost*USDtoUYU*total_article_count[i]
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
                        <small class="text-muted">` + 'Seleccione la cantidad:' + " " + `<br><input type="number" id="aux`+ i +`" min="1" value="` + article.count +`"></input></small>
                    </div>
                    <small class="text-muted" id="article-count` + i + `">Artículos a comprar: ` + total_article_count[i] + `</small>
                    <p class="mb-1">Precio unitario: ` + article.currency + " " + article.unitCost.toLocaleString() + `</p>
                    <p class="mb-1" id="subtotal` + i +`">Total por artículo: UYU ` + total_per_article[i].toLocaleString() + `</p>                    
                </div>
                <div class="mb-1">
                    <input type="button" id="remove` + i + `" style="background-color:crimson; border-radius:2rem; color:white; border-color:black; height:40px" value="Quitar"></input>
                </div>
            </div>  
            </div>
        </div>
        `;
    }

    document.getElementById('article-list-container').innerHTML = htmlContentToAppend;

    articleUpdate(array);
}

//Función que muestra los costos a pagar por artículo
function showCosts(array){
    let htmlContentToAppend2 = "";
    let htmlContentToAppend3 = "";
    let htmlContentToAppend4 = "";
    let htmlContentToAppend5 = "";

    for (let i = 0 ; i < array.length; i++){
        let article = array[i];
        
        htmlContentToAppend2 += `
            <div class="list-group-item list-group-item-action">
                <div class="justify-content-between"
                    <ul>
                        <li>`+ article.name + `: UYU ` + total_per_article[i].toLocaleString() +`</li>
                    </ul>
                </div>
            </div>
        `;
    }

    total_article = total_per_article.reduce((a, b) => a + b, 0);

    htmlContentToAppend3 += `
        <p><strong>Subtotal</strong>: UYU ` + " " +  + total_article + `</p>
    `
    total_delivery_cost = delivery_costs.reduce((a, b) => a + b, 0);
    total_payment = total_article + total_delivery_cost;
    
    htmlContentToAppend4 = `
        <p><strong>Costo de envio</strong>: UYU ` + total_delivery_cost + `</p> 
    `   
    htmlContentToAppend5 = `
        <p><strong>Total a pagar</strong>: UYU ` + total_payment + `</p>
    `
    document.getElementById("cost-per-article").innerHTML = htmlContentToAppend2;
    document.getElementById("subtotal").innerHTML = htmlContentToAppend3;
    document.getElementById("delivery-cost").innerHTML = htmlContentToAppend4;
    document.getElementById("total").innerHTML = htmlContentToAppend5;
}

//Función que actualiza el carrito y los costos al cambiar la cantidad de artículos a comprar
function articleUpdate(array){
    for (let i = 0 ; i < array.length; i++){
        let article = array[i];
        
        document.getElementById("aux"+i).addEventListener("input", (e)=> {
            total_article_count[i] = document.getElementById("aux"+i).value;

            if (article.currency == "USD"){
                total_per_article[i] = article.unitCost*USDtoUYU*total_article_count[i]
            }else if (article.currency == "UYU"){
                total_per_article[i] = article.unitCost*total_article_count[i]
            }

            document.getElementById("subtotal"+i).innerHTML = `
                <p class="mb-1">Total por artículo: UYU ` + total_per_article[i].toLocaleString() + `</p>
            `
            document.getElementById("article-count"+i).innerHTML = `
                Artículos a comprar: ` + total_article_count[i] + `
            `

            if (document.getElementById("standard").checked){
                delivery_costs[i] = standardPercentage*total_per_article[i]
                document.getElementById("delivery-cost").innerHTML = `
                    <p><strong>Costo de envio</strong>: UYU ` + total_delivery_cost + `</p> 
                `
            } else if (document.getElementById("express").checked){
                delivery_costs[i] = expressPercentage*total_per_article[i]
                document.getElementById("delivery-cost").innerHTML = `
                    <p><strong>Costo de envio</strong>: UYU ` + total_delivery_cost + `</p> 
                `
            } else if (document.getElementById("premium").checked){
                delivery_costs[i] = premiumPercentage*total_per_article[i]
                document.getElementById("delivery-cost").innerHTML = `
                    <p><strong>Costo de envio</strong>: UYU ` + total_delivery_cost + `</p> 
                `
            }
            showCosts(array);
        })
    }
}

//Función que calcula y muestra el costo de envío y actualiza el costo total a pagar
function totalPayment(array){
    for (let i = 0 ; i < array.length; i++){
        
        //Envio estándar
        document.getElementById("standard").addEventListener("click", (e)=>{
            delivery_costs[i] = standardPercentage*total_per_article[i]
            total_delivery_cost = delivery_costs.reduce((a, b) => a + b, 0);
            total_payment = total_article + total_delivery_cost;
            
            htmlContentToAppend4 = `
                <p id="delivery-cost"><strong>Costo de envio</strong>: UYU ` + total_delivery_cost + `</p> 
            `   
            htmlContentToAppend5 = `
                <p><strong>Total a pagar</strong>: UYU ` + total_payment + `</p>
            `
            document.getElementById("delivery-cost").innerHTML = htmlContentToAppend4;
            document.getElementById("total").innerHTML = htmlContentToAppend5;
        })

        //Envio express
        document.getElementById("express").addEventListener("click", (e)=>{
            delivery_costs[i] = expressPercentage*total_per_article[i]
            total_delivery_cost = delivery_costs.reduce((a, b) => a + b, 0);
            total_payment = total_article + total_delivery_cost;

            htmlContentToAppend4 = `
                <p id="delivery-cost"><strong>Costo de envio</strong>: UYU ` + total_delivery_cost + `</p> 
            ` 
            htmlContentToAppend5 = `
                <p><strong>Total a pagar</strong>: UYU ` + total_payment + `</p>
            `
            document.getElementById("delivery-cost").innerHTML = htmlContentToAppend4;
            document.getElementById("total").innerHTML = htmlContentToAppend5;
        })

        //Envio premium
        document.getElementById("premium").addEventListener("click", (e)=>{
            delivery_costs[i] = premiumPercentage*total_per_article[i]
            total_delivery_cost = delivery_costs.reduce((a, b) => a + b, 0);
            total_payment = total_article + total_delivery_cost;

            htmlContentToAppend4 = `
                <p id="delivery-cost"><strong>Costo de envio</strong>: UYU ` + total_delivery_cost + `</p> 
            ` 
            htmlContentToAppend5 = `
                <p><strong>Total a pagar</strong>: UYU ` + total_payment + `</p>
            `
            document.getElementById("delivery-cost").innerHTML = htmlContentToAppend4;
            document.getElementById("total").innerHTML = htmlContentToAppend5;
        })
    }
}

//Función que quita artículos del carrito
function removeArticle(array){
    for (let i = 0; i < array.length; i++){
        document.getElementById("remove"+i).addEventListener("click", (e)=>{

            let newArray = array.splice(i-1,1);

            //Condicional para que se vuelva a elegir un tipo de envío luego de quitar un elemento del carrito;
            //evitamos el problema que tenemos al eliminar el primer producto ya que el segundo hereda la cantidad
            //del primero alterando el costo de envío: cuando article_count = 0, total_delivery_cost = 25.000.
            if (document.getElementById("standard").checked || document.getElementById("express").checked ||
                document.getElementById("premium").checked){

                document.getElementById("standard").checked = false
                document.getElementById("express").checked = false
                document.getElementById("premium").checked = false
            }

            total_per_article = []
            total_article_count = []
            //delete delivery_costs[i]
            delivery_costs = []

            for (let i = 0; i < array.length; i++){
                document.getElementById("standard").addEventListener("click", (e)=>{
                    delete delivery_costs[i+1] //Para evitar el misterioso NaN del delivery_costs antiguo.
                    delivery_costs[i] = standardPercentage*total_per_article[i]
                    console.log("costo de envio:"+delivery_costs)
                })
                document.getElementById("express").addEventListener("click", (e)=>{
                    delete delivery_costs[i+1]
                    delivery_costs[i] = expressPercentage*total_per_article[i]
                })
                document.getElementById("premium").addEventListener("click", (e)=>{
                    delete delivery_costs[i+1]
                    delivery_costs[i] = premiumPercentage*total_per_article[i]
                })
            }
            
            showArticles(newArray);
            showCosts(newArray);
            totalPayment(newArray);
            articleUpdate(newArray);
            
        })  
    }
}

//Función que habilita y deshabilita las formas de pago según la selección
function validatePayForm(){
    let bank_transfer_count = document.getElementById("bank-transfer-count");
    let credit_card_number = document.getElementById("credit-card-number");
    let month_expiring_date = document.getElementById("month-expiring-date");
    let year_expiring_date = document.getElementById("year-expiring-date");
    let security_number = document.getElementById("security-number");

    if (document.getElementById("credit-card").checked){
        bank_transfer_count.disabled = true
        credit_card_number.disabled = false
        month_expiring_date.disabled = false
        year_expiring_date.disabled = false
        security_number.disabled = false
    } else if (document.getElementById("bank-transfer").checked){
        credit_card_number.disabled = true
        month_expiring_date.disabled = true
        year_expiring_date.disabled = true
        security_number.disabled = true
        bank_transfer_count.disabled = false
    }
}


cart_form.addEventListener('click',(e)=>{ //cambiar a submit al final
    // Validación dirección de envío
    var country = /^[A-Z][a-z]+$/;
    var countryInput = document.getElementById("country")
    if (!country.test(countryInput.value)){
        alert("El país no es válido.")
        e.preventDefault();
    }
    
    var street = /^[A-Z][a-zA-Zñ]+$/
    var streetInput = document.getElementById("street")
    if (!street.test(streetInput.value)){
        alert("La calle no es válida.")
        e.preventDefault();
    }

    var number = /\d{3,4}/
    var numberInput = document.getElementById("number")
    if (!number.test(numberInput.value)){
        alert("El número de puerta no es válido.")
        e.preventDefault();
    }

    //Validación tipo de envío
    var standardInput = document.getElementById("standard");
    var expressInput = document.getElementById("express");
    var premiumInput = document.getElementById("premium");

    if (standardInput.checked == false && expressInput.checked == false && premiumInput.checked == false){
        alert("Seleccione un tipo de envío.")
        e.preventDefault();
    }
    
    //Validación forma de pago
    var credit_cardInput = document.getElementById("credit-card");
    var bank_transferInput = document.getElementById("bank-transfer");

    if (credit_cardInput.checked == false && bank_transferInput.checked == false){
        alert("Seleccione una forma de pago.")
        e.preventDefault();
    }

    if (credit_cardInput.checked){
        var credit_card_numberInput = document.getElementById("credit-card-number");
        var security_numberInput = document.getElementById("security-number");
        var year_expiring_dateInput = document.getElementById("year-expiring-date");

        var credit_card_number = /[0-9]{12}/
        if (!credit_card_number.test(credit_card_numberInput.value)){
            alert("El número de tarjeta de crédito no es válido.")
            e.preventDefault();
        }

        var security_number = /\d{3}/
        if (!security_number.test(security_numberInput.value)){
            alert("El código de seguridad no es válido.")
            e.preventDefault();
        }

        if (year_expiring_dateInput.value < 2020){
            alert("El año de vencimiento no es válido.")
            e.preventDefault();
        }
        
    }

    if (bank_transferInput.checked){
        var bank_transfer_countInput = document.getElementById("bank-transfer-count");

        var bank_transfer_count = /[0-9]{5}/
        if (!bank_transfer_count.test(bank_transfer_countInput.value)){
            alert("El número de cuenta bancaria no es válido.")
            e.preventDefault();
        }
    }
})

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
                }   
            }
            showArticles(articles);
            showCosts(articles);
            totalPayment(articles);
            removeArticle(articles);
    })

    cart_form.addEventListener('submit', (e)=>{
        e.preventDefault();
        getJSONData(CART_BUY_URL)
            .then(function(result){
            if (result.status === "ok"){
                
                compra = result.data.msg;
                window.alert(compra);
                window.location = "index.html"
            }
        })
    })
});