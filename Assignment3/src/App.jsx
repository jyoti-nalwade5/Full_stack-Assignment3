const buttonStyle = {
    color: 'black',
    background: 'rgb(197, 223, 81)',
    alignContent: 'center',
}

function ProductRow(props) {
    const product = props.product;
    return (
        <tr>
            <td>{product.name}</td>
            <td>${product.pricePerUnit}</td>
            <td>{product.category}</td>
            <td><a href={product.imageUrl} target="_blank">View</a></td>
        </tr>
    );
}

function ProductTable(props) {
    const productRows = props.products.map(product =>
        <ProductRow key={product.id} product={product} />
    );

    return (
        <table className="bordered-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Image</th>
                </tr>
            </thead>
            <tbody>
                {productRows}
            </tbody>
        </table>
    );
}

class ProductAdd extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.productAdd;

        const product = {
            name: form.productName.value, 
            pricePerUnit: form.pricePerUnit.value.substr(1), 
            category: form.category.value, 
            imageUrl: form.imageUrl.value,
        }

        this.props.createProduct(product);
        form.productName.value = "";
        form.pricePerUnit.value = "$";
        form.category.value = "";
        form.imageUrl.value = "";
    }

    render() {
        return (
            <form name="productAdd" onSubmit={this.handleSubmit}>
                <table className="nonbordered-table">
				        <tr>
                        <td>
                            <div>Category
                                <br />
                                <select id="menu" name="category">
                                    <option value="Shirts">Shirts</option>
                                    <option value="Jeans">Jeans</option>
                                    <option value="Jackets">Jackets</option>
                                    <option value="Sweaters">Sweaters</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>
                        </td>
                        &nbsp;
                        <td>
                            <div>Price Per Unit
                                <br /><input type="text" name="pricePerUnit" defaultValue="$" />
                            </div>
                        </td>
                    </tr>
                    <br />
                    <tr>
                        <td>
                            <div>Product Name
                                <br /><input type="text" name="productName" />
                            </div>
                        </td>
                        <br />
                        <td>
                            <div>Image URL
                                <br /><input type="text" name="imageUrl" />
                            </div>
                        </td>
                    </tr>
                    <br />
                    <tr>
                        <td>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button style={buttonStyle}>Add Product</button>
                        </td>
                    </tr>
                    </table>
            </form>
        );
    }
}

class ProductList extends React.Component {
    constructor() {
        super();
        this.state = { products: [], };
        this.createProduct = this.createProduct.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        const query = `query {
            productList {
              id
              name
              pricePerUnit
              category
              imageUrl
            }
          }`;

        const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        const body = await response.text();
        const result = JSON.parse(body);
        this.setState({ products: result.data.productList });
    }

    async createProduct(product) {
        const query = `mutation addProduct($product: ProductInputs!) {
            addProduct(product: $product) {
                id
            }
          }`;
          const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { product } })
        });

        this.loadData();
    }

    render() {
        return (
            <React.Fragment>
                <h1>My Company Inventory</h1>
                <p>Showing all available products</p>
                <hr />
                <ProductTable products={this.state.products} />
                <br />
                <p>Add a new product to inventory</p>
                <hr />
                <ProductAdd createProduct={this.createProduct} />
            </React.Fragment>
        );
    }
}

const element = <ProductList />;
ReactDOM.render(element, document.getElementById('contents'));
