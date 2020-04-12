void main() {
    print('Hello, Dart from abel!!');
    helloDartA();
    List<String> greetings = [
    'World',
    'Mars',
    'Oregon'];
    for(var name in greetings) {
        helloDart(name);
    }

}

void helloDartA() {
    print('Hello, Dart!');
}

void helloDart(String name) {
    print('Hllo, $name !');
}