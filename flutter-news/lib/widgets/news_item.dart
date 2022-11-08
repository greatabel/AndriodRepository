import 'package:flutter/material.dart';
import '../news_modle_entity.dart';
import '../pages/WebViewPage.dart';
import '../utils/AnimateRouteUtil.dart';
class NewsItem extends StatelessWidget {
  final NewsModleResultData newsData;
  const NewsItem({Key? key,required this.newsData}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: (){
        Navigator.push(context, AnimateRouteUtil(WebViewPage(url: newsData.url, title: newsData.title)));
      },
      child: Container(
        width: double.infinity,
        height: 96,
        margin: const EdgeInsets.only(bottom: 10,left: 10,right: 10),
        child: DecoratedBox(
            decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(5),
                color: Colors.white,
                boxShadow: const [
                  BoxShadow(
                      color:Colors.black12,
                      offset: Offset(1.0,1.0),
                      blurRadius: 2.0
                  )
                ]
            ),
            child:  ClipRRect( //剪裁为圆角矩形
              borderRadius: BorderRadius.circular(5),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Image.network(newsData.thumbnailPicS,width: 170,),
                  Expanded(child: Container(
                    padding: EdgeInsets.all(3),
                    child: Column(
                      mainAxisSize: MainAxisSize.max,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(newsData.title,maxLines: 2,overflow: TextOverflow.ellipsis,style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold
                        ),),
                        Expanded(
                          child: Align(
                            alignment: Alignment.bottomLeft,
                            child: Text(newsData.date,maxLines: 1,overflow: TextOverflow.ellipsis,),
                          ),
                        )
                      ],
                    ),
                  ))
                ],
              ),
            )
        ),
      ),
    );
  }
}

