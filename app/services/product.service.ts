import { Inject, Injectable } from "@angular/core";
import { Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { Product } from "../models/product";
import { ProductFilter } from "../models/product-filter";
import { BackendUri } from "../app.settings";

@Injectable()
export class ProductService {


    private consultaGet: string;

    constructor(
        @Inject(BackendUri) private _backendUri: string,
        private _http: Http) { }

    getProducts(filter: ProductFilter = undefined): Observable<Product[]> {

         this.consultaGet = `?_sort=publishedDate&_order=DESC`;
         let options = new RequestOptions();
         let search = new URLSearchParams();

         if(filter){
            console.log("Aquí entra 1");
            // if(filter.text !== "") {
            //     console.log("entra en el vacio");
            //         typeof filter.text === 'undefined';
            // }
            if(typeof filter.text !== 'undefined' && filter.text !== ""){
                console.log("Aquí entra 2");
                console.log(typeof filter.text);
                console.log("Estoy dentro de filter.text !== undefined");
                search.set("name", filter.text);
                //this.consultaGet = `${this.consultaGet}&q=${filter.text}`;
            }
            if(typeof filter.category !== 'undefined') {
                console.log("Aquí entra 3");
                search.set("category.id", filter.category);
                //this.consultaGet = `${this.consultaGet}&category.id=${filter.category}`;
            }
            // if(filter){
            // console.log("Aquí entra 4");
            // console.log(filter);
            // console.log(filter.state);
                if(typeof filter.state !== 'undefined'){
                    console.log("Aquí entra 4");
                    search.set("state", "sold")
                    //this.consultaGet = `${this.consultaGet}&state=${filter.state}`;
                }
        //    }
         }
        
        //  if(filter){
        //     console.log("Aquí entra 4");
        //     console.log(filter);
        //     console.log(filter.state);
        //     if(typeof filter.state !== 'undefined'){
        //         search.set("state", "sold")
        //         //this.consultaGet = `${this.consultaGet}&state=${filter.state}`;
        //     }
        //  }

         options.search = search;

          return this._http
                   //.get(`${this._backendUri}/products${this.consultaGet}`)
                   .get(`${this._backendUri}/products${this.consultaGet}`, options)
                   .map((data: Response): Product[] => Product.fromJsonToList(data.json()));
    }
           
 
        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Pink Path                                                        |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Pide al servidor que te retorne los productos ordenados de más   |
        | reciente a menos, teniendo en cuenta su fecha de publicación.    |
        |                                                                  |
        | En la documentación de 'JSON Server' tienes detallado cómo hacer |
        | la ordenación de los datos en tus peticiones, pero te ayudo      |
        | igualmente. La consultaGet debe tener estos parámetros:          |
        |                                                                  |
        |   _sort=publishedDate&_order=DESC                                |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Red Path                                                         |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Pide al servidor que te retorne los productos filtrados por      |
        | texto y/ por categoría.                                          |
        |                                                                  |
        | En la documentación de 'JSON Server' tienes detallado cómo       |
        | filtrar datos en tus peticiones, pero te ayudo igualmente. La    |
        | consultaGet debe tener estos parámetros:                         |
        |                                                                  |
        |   - Búsqueda por texto:                                          |
        |       q=x (siendo x el texto)                                    |
        |   - Búsqueda por categoría:                                      |
        |       category.id=x (siendo x el identificador de la categoría)  |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Yellow Path                                                      |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Pide al servidor que te retorne los productos filtrados por      |
        | estado.                                                          |
        |                                                                  |
        | En la documentación de 'JSON Server' tienes detallado cómo       |
        | filtrar datos en tus peticiones, pero te ayudo igualmente. La    |
        | consultaGet debe tener estos parámetros:                         |
        |                                                                  |
        |   - Búsqueda por estado:                                         |
        |       state=x (siendo x el estado)                               |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

    getProduct(productId: number): Observable<Product> {
        return this._http
                   .get(`${this._backendUri}/products/${productId}`)
                   .map((data: Response): Product => Product.fromJson(data.json()));
    }

    buyProduct(productId: number): Observable<Product> {
        let body: any = { "state": "sold" };
        return this._http
                   .patch(`${this._backendUri}/products/${productId}`, body)
                   .map((data: Response): Product => Product.fromJson(data.json()));
    }

    setProductAvailable(productId: number): Observable<Product> {
        let body: any = { "state": "selling" };
        return this._http
                   .patch(`${this._backendUri}/products/${productId}`, body)
                   .map((data: Response): Product => Product.fromJson(data.json()));
    }
}
