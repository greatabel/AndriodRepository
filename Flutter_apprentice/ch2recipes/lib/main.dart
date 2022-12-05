import 'package:flutter/material.dart';
import 'recipe.dart';
import 'recipe_detail.dart';

void main() {
  runApp(const RecipeApp());
}

class RecipeApp extends StatelessWidget {
  const RecipeApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Recipe Calculator1',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or simply save your changes to "hot reload" in a Flutter IDE).
        // Notice that the counter didn't reset back to zero; the application
        // is not restarted.
        primaryColor: Colors.white, colorScheme: ColorScheme.fromSwatch().copyWith(secondary: Colors.black)
      ),
      home: const MyHomePage(title: 'Recipe Calculator2'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {

  Widget buildRecipeCard(Recipe recipe) {

    return Card(
    // 1
    elevation: 2.0,
    // 2
    shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(10.0)),
    // 3
      child: Padding(
      padding: const EdgeInsets.all(16.0),
    // 4
        child: Column(
    children: <Widget>[
    Image(image: AssetImage(recipe.imageUrl)),
    // 5
    const SizedBox(
    height: 14.0,
    ),
    // 6
    Text(
    recipe.label,
    style: const TextStyle(
    fontSize: 20.0,
    fontWeight: FontWeight.w700,
    fontFamily: 'Palatino',
    ),
    )
    ],
    ),
    ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // 1
    return Scaffold(
      // 2
      appBar: AppBar(
        backgroundColor: Colors.red,
        centerTitle: true,
        title: Text(widget.title),
      ),
      // 3
      body: SafeArea(
        // 4
        child: ListView.builder(
          itemCount: Recipe.samples.length,
          itemBuilder: (BuildContext context, int index) {
            // return Text(Recipe.samples[index].label);
            // return buildRecipeCard(Recipe.samples[index]);
            return GestureDetector(
              onTap: () {
                Navigator.push(context,
                MaterialPageRoute(builder: (context) {
                  // return Text('Detail Page!');
                  return RecipeDetail(recipe: Recipe.samples[index]);
                },)

                );
              },
              child: buildRecipeCard(Recipe.samples[index]),
            );
          },

        ),
      ),
    );
  }
}

