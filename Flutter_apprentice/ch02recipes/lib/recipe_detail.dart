import 'package:flutter/material.dart';
import 'recipe.dart';

class RecipeDetail extends StatefulWidget {
  final Recipe recipe;

  const RecipeDetail({Key? key, required this.recipe}): super(key:key);

  @override
  _RecipeDetailState createState() {
    return _RecipeDetailState();
  }
}

class _RecipeDetailState extends State<RecipeDetail> {

  int _sliderVal = 1;

@override
Widget build(BuildContext context) {
  // 1
  return Scaffold(
    appBar: AppBar(
      backgroundColor: Colors.red,
      centerTitle: true,
      title: Text(widget.recipe.label),
    ),
    // 2
    body: SafeArea(
      // 3
      child: Column(
        children: <Widget>[
          // 4
          SizedBox(
            height: 300,
            width: double.infinity,
            child: Image(image:
            AssetImage(widget.recipe.imageUrl)),
          ),
          // 5
          const SizedBox(
            height: 4,
          ),
          // 6
          Text(
            widget.recipe.label,
            style: const TextStyle(fontSize: 18),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(7.0),
              itemCount: widget.recipe.ingredients.length,
              itemBuilder: (BuildContext context, int index){
                final ingredient = widget.recipe.ingredients[index];
                return Text(
                    '${ingredient.quantity} ${ingredient.measure} ${ingredient.name}'

                );
              },
            ),
          ),

          Slider(
            min:1,
            max: 10,
            divisions: 10,
            label: '${_sliderVal * widget.recipe.servings} servings',
            value: _sliderVal.toDouble(),
            onChanged: (newVaue) {
              setState(() {
                _sliderVal = newVaue.round();
              });
            },
            activeColor: Colors.green,
            inactiveColor: Colors.black,
          ),


        ],
      ),
    ),
  );
}
}
