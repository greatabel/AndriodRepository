import 'dart:convert';
import 'package:demo_one/generated/json/base/json_field.dart';
import 'package:demo_one/generated/json/news_modle_entity.g.dart';

@JsonSerializable()
class NewsModleEntity {

	late String reason;
	late NewsModleResult result;
	@JSONField(name: "error_code")
	late int errorCode;
  
  NewsModleEntity();

  factory NewsModleEntity.fromJson(Map<String, dynamic> json) => $NewsModleEntityFromJson(json);

  Map<String, dynamic> toJson() => $NewsModleEntityToJson(this);

  @override
  String toString() {
    return jsonEncode(this);
  }
}

@JsonSerializable()
class NewsModleResult {

	late String stat;
	late List<NewsModleResultData> data;
	late String page;
	late String pageSize;
  
  NewsModleResult();

  factory NewsModleResult.fromJson(Map<String, dynamic> json) => $NewsModleResultFromJson(json);

  Map<String, dynamic> toJson() => $NewsModleResultToJson(this);

  @override
  String toString() {
    return jsonEncode(this);
  }
}

@JsonSerializable()
class NewsModleResultData {

	late String uniquekey;
	late String title;
	late String date;
	late String category;
	@JSONField(name: "author_name")
	late String authorName;
	late String url;
	@JSONField(name: "thumbnail_pic_s")
	late String thumbnailPicS;
	@JSONField(name: "is_content")
	late String isContent;
	@JSONField(name: "thumbnail_pic_s02")
	late String thumbnailPicS02;
	@JSONField(name: "thumbnail_pic_s03")
	late String thumbnailPicS03;
  
  NewsModleResultData();

  factory NewsModleResultData.fromJson(Map<String, dynamic> json) => $NewsModleResultDataFromJson(json);

  Map<String, dynamic> toJson() => $NewsModleResultDataToJson(this);

  @override
  String toString() {
    return jsonEncode(this);
  }
}