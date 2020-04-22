import 'package:flutter/material.dart';

void main() => runApp(MaterialApp(
  title: "send data demo",
  home: ProductList(
    products: List.generate(20, (i) => Product('商品 $i', '这是一个商品详情 $i')),
  ),
));

class Product {
  final String title;
  final String description;

  Product(this.title, this.description);
}

class ProductList extends StatelessWidget {
  final List<Product> products;


  ProductList({Key key, @required this.products}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
      appBar: AppBar(title: Text('列表'),),
      body: ListView.builder(
        itemCount: products.length,
          itemBuilder: (context, index) {
            return ListTile(
              title: Text(products[index].title),
              onTap: () {
                Navigator.push(
                  context, MaterialPageRoute(
                  builder: (context) =>
                      ProductDetail(product: products[index])),

                );
              },
            );
          }
      ),
    );
  }
}

class ProductDetail extends StatelessWidget {
  //商品数据
  final Product product;

  //构造方法 将传入的商品数据赋值给product
  ProductDetail({Key key, @required this.product}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        //展示数据
        title: Text("${product.title}"),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        //展示数据
        child: Text('${product.description}'),
      ),
    );
  }
}
