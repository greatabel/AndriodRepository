import 'package:flutter/material.dart';
class AnimateRouteUtil extends PageRouteBuilder {

  final Widget widget;

  AnimateRouteUtil(this.widget)
      : super(
      transitionDuration: const Duration(milliseconds: 500), //设置动画时长500毫秒
      pageBuilder: (
          BuildContext context,
          Animation<double> animation1,
          Animation<double> animation2){
        return widget;
      },
      transitionsBuilder: (
          BuildContext context,
          Animation<double> animation1,
          Animation<double> animation2,
          Widget child
          ){
        //左右滑动
        return SlideTransition(
          position: Tween<Offset>(
              begin: Offset(1.0, 0.0),
              end: Offset(0.0, 0.0)
          )
              .animate(CurvedAnimation(parent: animation1, curve: Curves.fastOutSlowIn)),
          child: child,
        );
      }

  );
}