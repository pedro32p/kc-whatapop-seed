import { Inject, Injectable } from "@angular/core";
import { Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { Product } from "../models/product";
import { ProductFilter } from "../models/product-filter";
import { BackendUri } from "../app.settings";

@Injectable()
export class ProductService {

    filter: ProductFilter;

    constructor(
        @Inject(BackendUri) private _backendUri: string,
        private _http: Http) { }

    getProducts(filter: ProductFilter = undefined): Observable<Product[]> {

        this.filter = filter;

        //console.log("hola desde fuera");

        if(this.filter !== null) {

            console.log(this.filter.text);
            console.log(this.filter.category);

            if(this.filter.text === "") {
                this.filter.text = undefined;
            }
            if(this.filter.category === "") {
                this.filter.category = undefined;
            }
            let search = new URLSearchParams();
            search.set("name", this.filter.text);
            search.set("category.id", this.filter.category);
            search.set("state", "selling");

            let options = new RequestOptions();
            options.search = search;
            console.log(this.filter.text);
            console.log(this.filter.category);
            
            return this._http.get(`${this._backendUri}/products?_sort=publishedDate&_order=DESC`, options)
                             .map((data: Response): Product[] => Product.fromJsonToList(data.json()));
        }
        else{
            console.log("en el else");
            return this._http
                            .get(`${this._backendUri}/products?_sort=publishedDate&_order=DESC&state=selling `)
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
        | igualmente. La querystring debe tener estos parámetros:          |
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
        | querystring debe tener estos parámetros:                         |
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
        | querystring debe tener estos parámetros:                         |
        |                                                                  |
        |   - Búsqueda por estado:                                         |
        |       state=x (siendo x el estado)                               |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

    }

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
