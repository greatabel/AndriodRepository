import 'dart:io';

void main() {
    stdout.writeln('Greet somebdy');
    String input = stdin.readLineSync();
    return helloDart(input);
}

void helloDart(String name) {
    print('Hllo, $name !');
}