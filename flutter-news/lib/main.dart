import 'dart:convert';
import 'dart:ffi';

import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'news_modle_entity.dart';
import 'widgets/news_item.dart';
import 'dart:io';
import 'dart:async';
import 'package:path_provider/path_provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.red,
      ),
      home: const MyHomePage(title: '学习强企app测试'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  Dio dio = Dio();


  Future<File> _getLocalFile() async {
    // 获取应用目录
    String dir = (await getExternalStorageDirectories(type: StorageDirectory.downloads))!.first.path;
    return File('$dir/data.json');
  }

  Future<String> _readCounter() async {
    try {
      File file = await _getLocalFile();
      // 读取点击次数（以字符串）
      String contents = await file.readAsString();
      return contents;
    } on FileSystemException {
      return "";
    }
  }

  // https://daily-dev-tips.com/posts/flutter-bottom-tabbar-placement/
  // mutiple tab
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: FutureBuilder(
          future: _readCounter(),
          builder: (BuildContext context, AsyncSnapshot snapshot){
            if(snapshot.connectionState == ConnectionState.done){
              print("snapshot.hasError >>>>>#####>>>");
              print(snapshot.hasError);
              // 排除ios 这里出错
              if(snapshot.hasError && Platform.isAndroid){
                return const Text("请求失败");
              }else{
                var resJson = snapshot.data.toString();

                resJson = '''
{"reason":"success!","result":{"stat":"1","data":[{"uniquekey":"da51d8497b392c95c90ad5fd4a163db3",
"title":"人类面临的最大能源挑战是什么？","date":"2022-11-17 09:36:00","category":"学习材料","author_name":"管理员","url":"https://mini.eastday.com/mobile/220317093600272729495.html","thumbnail_pic_s":"https://dfzximg02.dftoutiao.com/news/20220317/20220317093600_619e0860f6d58a2fd29d100fec323f86_1_mwpm_03201609.jpeg","thumbnail_pic_s02":"https://dfzximg02.dftoutiao.com/news/20220317/20220317093600_619e0860f6d58a2fd29d100fec323f86_2_mwpm_03201609.jpeg","thumbnail_pic_s03":"https://dfzximg02.dftoutiao.com/news/20220317/20220317093600_619e0860f6d58a2fd29d100fec323f86_3_mwpm_03201609.jpeg","is_content":"1"},
{"uniquekey":"ef4c6e7e1a33cb4e63d45755c99ca990","title":"1迈向清洁低碳.pdf","date":"2022-11-17 09:35:00","category":"学习材料","author_name":"管理员","url":"https://mini.eastday.com/mobile/220317093510596993546.html","thumbnail_pic_s":"https://dfzximg02.dftoutiao.com/minimodify/20220317/1393x681_6232904e2feca_mwpm_03201609.jpeg","is_content":"1"},
{"uniquekey":"ad912fc05da13a91da79200c4c099cc5","title":"可再生能源有哪些？","date":"2022-11-17 04:51:00","category":"学习材料","author_name":"管理员","url":"https://mini.eastday.com/mobile/220317045153940595640.html","thumbnail_pic_s":"https://dfzximg02.dftoutiao.com/news/20220317/20220317045153_47ade9aa0895d8ba1592ae9b92af5521_1_mwpm_03201609.jpeg","is_content":"1"},
{"uniquekey":"ad912fc05da13a91da79200c4c099cc5","title":"可再生能源有哪些2？","date":"2022-11-17 04:51:00","category":"学习材料","author_name":"管理员","url":"https://mini.eastday.com/mobile/220317045153940595640.html","thumbnail_pic_s":"https://dfzximg02.dftoutiao.com/news/20220317/20220317045153_47ade9aa0895d8ba1592ae9b92af5521_1_mwpm_03201609.jpeg","is_content":"1"},
{"uniquekey":"ad912fc05da13a91da79200c4c099cc5","title":"可再生能源有哪些3？","date":"2022-11-17 04:51:00","category":"学习材料","author_name":"管理员","url":"https://mini.eastday.com/mobile/220317045153940595640.html","thumbnail_pic_s":"https://dfzximg02.dftoutiao.com/news/20220317/20220317045153_47ade9aa0895d8ba1592ae9b92af5521_1_mwpm_03201609.jpeg","is_content":"1"},
{"uniquekey":"ad912fc05da13a91da79200c4c099cc5","title":"可再生能源有哪些4？","date":"2022-11-17 04:51:00","category":"学习材料","author_name":"管理员","url":"https://mini.eastday.com/mobile/220317045153940595640.html","thumbnail_pic_s":"https://dfzximg02.dftoutiao.com/news/20220317/20220317045153_47ade9aa0895d8ba1592ae9b92af5521_1_mwpm_03201609.jpeg","is_content":"1"},
{"uniquekey":"ef4c6e7e1a33cb4e63d45755c99ca990","title":"1迈向清洁低碳2.pdf","date":"2022-11-17 09:35:00","category":"学习材料","author_name":"管理员","url":"https://mini.eastday.com/mobile/220317093510596993546.html","thumbnail_pic_s":"https://dfzximg02.dftoutiao.com/minimodify/20220317/1393x681_6232904e2feca_mwpm_03201609.jpeg","is_content":"1"},
{"uniquekey":"ef4c6e7e1a33cb4e63d45755c99ca990","title":"1迈向清洁低碳3.pdf","date":"2022-11-17 09:35:00","category":"学习材料","author_name":"管理员","url":"https://mini.eastday.com/mobile/220317093510596993546.html","thumbnail_pic_s":"https://dfzximg02.dftoutiao.com/minimodify/20220317/1393x681_6232904e2feca_mwpm_03201609.jpeg","is_content":"1"}

],

"page":"1","pageSize":"30"},"error_code":0}
''';
                // Finding the length
                int length = resJson.length;
                // Printing the length of the string
                print("resJson.length >>>>>#####>>>");
                print(length);

                var newsEntry = NewsModleEntity.fromJson(json.decode(resJson));
                return ListView.builder(
                    itemCount: newsEntry.result.data.length,
                    itemBuilder: (BuildContext context, int index){
                      return NewsItem(newsData: newsEntry.result.data[index]);
                    }
                );
              }
            }else{
              return const Text("请求中");
            }
          },
        )
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed, ///This allow more than 3 items
        items: [
          BottomNavigationBarItem(
              icon: Icon(Icons.book), label: '学习'),
          BottomNavigationBarItem(
              icon: Icon(Icons.directions_transit), label: '工号'),
          BottomNavigationBarItem(
              icon: Icon(Icons.directions_transit), label: '考试'),
          BottomNavigationBarItem(
              icon: Icon(Icons.people), label: '我的'),
        ],
      ),
    );
  }
}
