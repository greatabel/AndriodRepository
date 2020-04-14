import 'package:http/http.dart' as http;

void main() async {
    var test = await http.get("https://www.baidu.com/");
    print("test:");
    print(test);
}