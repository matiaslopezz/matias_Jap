//Declaramos las variables a utilizar en el filtrado
var products = []; //Objeto que contendrá la información de los productos a analizar
let menor;
let mayor;

//Construimos el filtrado según el precio del producto
let filtradoPrecio =  function(array){
    menor = document.getElementById("precioMenor").value;
    mayor = document.getElementById("precioMayor").value;

    function filtroArray(elemento){
        return (!menor || elemento.cost >= menor) && (!mayor || elemento.cost <= mayor);
    } 
    
    if (menor != " " && mayor != " ") { 
        return array.filter(filtroArray);
    }else {
        return array;
    }   
}

function showProductsList(array){
    
    let htmlContentToAppend="";
    array = filtradoPrecio(array);

    for (let i = 0;i < array.length; i++) {
        let product = array[i];
        
        //Elementos a incorporar al HTML
        htmlContentToAppend += `
        <a href="product-info.html?producto=` + product.name + `" class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="` + product.imgSrc + `" alt="` + `" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">`+ product.name +`</h4>
                        <small class="text-muted">` + 'Artículos vendidos:' + " " + product.soldCount + ` </small>
                    </div>
                    <p class="mb-1">` + product.description + `</p>
                    <p class="mb-1">` + product.currency + " " + product.cost + `</p>
                </div>
            </div>
        </div>
        </a>
        `; 
    }
    //Incorporamos la información al HTML
    document.getElementById('prod-list-container').innerHTML = htmlContentToAppend;
}

//Incorporamos la opción al usuario de introducir un rango de precios a conveniencia
document.getElementById('form-filtrado').addEventListener('submit',(evento)=> {
    evento.preventDefault();
    showProductsList(filtradoPrecio(products));
})

//Limpiamos el rango ingresado por el usuario
document.getElementById("limpiarFiltrado").addEventListener("click",(evento)=> {
    document.getElementById("precioMenor").value = "";
    document.getElementById("precioMayor").value = "";

    menor = undefined;
    mayor = undefined;

    showProductsList(products);
    
});

//Ordenamos los productos según los precios de menor a mayor
document.getElementById('ordenarPrecioAscendente').addEventListener('click',(evento) => {
    products.sort((a,b) => a.cost - b.cost);
    showProductsList(products);
})

//Ordenamos los productos según los precios de mayor a menor
document.getElementById('ordenarPrecioDescendente').addEventListener('click',(evento) => {
    products.sort((a,b) => b.cost - a.cost);
    showProductsList(products);
})

//Ordenamos los productos según la cantidad de vendidos de mayor a menor (relevancia)
document.getElementById('ordenarRelevancia').addEventListener('click',(evento) => {
    products.sort((a,b) => b.soldCount - a.soldCount);
    showProductsList(products);
})

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL)
        .then(function(result){
            if (result.status == 'ok'){
                products = result.data;
                showProductsList(products);
            }
        })     
});