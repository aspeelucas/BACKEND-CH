class Product {
    constructor(title,description,price,thumbnail,code,stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    constructor() {
        this.products = [];
    }

    addProduct(product){
        const productCode = this.products.find((p) => p.code === product.code);
        if (productCode){
            console.log(`El producto con el código ${product.code} ya existe`)
        }
        else{
            if (this.products.length === 0){
                product.id = 1;
            }
            else{
                product.id = this.products[this.products.length - 1].id + 1;
            }
            if (product.title === "" || product.description === "" || product.price === ""|| product.thumbnail === "" || product.code === "" || product.stock === ""){
                console.log("Faltan datos, no se pudo agregar el producto");
            }
            else{
                this.products.push(product);
            }
        } 
    };

    getProducts(){
        if (this.products.length === 0){
            console.log("No hay productos");
        }
        else{
            return this.products;
        }
    }

    getProductById(id){
        const productIdFind = this.products.find((p)=>p.id=== id);
        if (productIdFind){
            console.log(`Producto encontrado: ${productIdFind.title}`)
            return productIdFind;
        }
        else{
            console.log(`Not Found`);
        }
    }

}


//TESTING 

// Instancias de clase Product
const product1 = new Product("producto prueba","Este es un producto prueba",200,"Sin imagen","abc123",25);
const product2 = new Product("producto prueba 2","Este es un producto prueba 2",300,"Sin imagen","abc123",30);

// Instancias de clase ProductManager
const manager = new ProductManager();

//Llamado al metodo getProducts

console.log(manager.getProducts());

//Llamado al metodo addProduct

manager.addProduct(product1);

console.log(manager.getProducts());

//Error codigo repetido, no se agrega el producto

manager.addProduct(product2);


//Llamado al metodo getProductById

console.log(manager.getProductById(1));  //Producto encontrado: producto prueba

console.log(manager.getProductById(2));  //Not Found






