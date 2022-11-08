import 'package:demo_one/generated/json/base/json_convert_content.dart';
import 'package:demo_one/news_modle_entity.dart';

NewsModleEntity $NewsModleEntityFromJson(Map<String, dynamic> json) {
	final NewsModleEntity newsModleEntity = NewsModleEntity();
	final String? reason = jsonConvert.convert<String>(json['reason']);
	if (reason != null) {
		newsModleEntity.reason = reason;
	}
	final NewsModleResult? result = jsonConvert.convert<NewsModleResult>(json['result']);
	if (result != null) {
		newsModleEntity.result = result;
	}
	final int? errorCode = jsonConvert.convert<int>(json['error_code']);
	if (errorCode != null) {
		newsModleEntity.errorCode = errorCode;
	}
	return newsModleEntity;
}

Map<String, dynamic> $NewsModleEntityToJson(NewsModleEntity entity) {
	final Map<String, dynamic> data = <String, dynamic>{};
	data['reason'] = entity.reason;
	data['result'] = entity.result.toJson();
	data['error_code'] = entity.errorCode;
	return data;
}

NewsModleResult $NewsModleResultFromJson(Map<String, dynamic> json) {
	final NewsModleResult newsModleResult = NewsModleResult();
	final String? stat = jsonConvert.convert<String>(json['stat']);
	if (stat != null) {
		newsModleResult.stat = stat;
	}
	final List<NewsModleResultData>? data = jsonConvert.convertListNotNull<NewsModleResultData>(json['data']);
	if (data != null) {
		newsModleResult.data = data;
	}
	final String? page = jsonConvert.convert<String>(json['page']);
	if (page != null) {
		newsModleResult.page = page;
	}
	final String? pageSize = jsonConvert.convert<String>(json['pageSize']);
	if (pageSize != null) {
		newsModleResult.pageSize = pageSize;
	}
	return newsModleResult;
}

Map<String, dynamic> $NewsModleResultToJson(NewsModleResult entity) {
	final Map<String, dynamic> data = <String, dynamic>{};
	data['stat'] = entity.stat;
	data['data'] =  entity.data.map((v) => v.toJson()).toList();
	data['page'] = entity.page;
	data['pageSize'] = entity.pageSize;
	return data;
}

NewsModleResultData $NewsModleResultDataFromJson(Map<String, dynamic> json) {
	final NewsModleResultData newsModleResultData = NewsModleResultData();
	final String? uniquekey = jsonConvert.convert<String>(json['uniquekey']);
	if (uniquekey != null) {
		newsModleResultData.uniquekey = uniquekey;
	}
	final String? title = jsonConvert.convert<String>(json['title']);
	if (title != null) {
		newsModleResultData.title = title;
	}
	final String? date = jsonConvert.convert<String>(json['date']);
	if (date != null) {
		newsModleResultData.date = date;
	}
	final String? category = jsonConvert.convert<String>(json['category']);
	if (category != null) {
		newsModleResultData.category = category;
	}
	final String? authorName = jsonConvert.convert<String>(json['author_name']);
	if (authorName != null) {
		newsModleResultData.authorName = authorName;
	}
	final String? url = jsonConvert.convert<String>(json['url']);
	if (url != null) {
		newsModleResultData.url = url;
	}
	final String? thumbnailPicS = jsonConvert.convert<String>(json['thumbnail_pic_s']);
	if (thumbnailPicS != null) {
		newsModleResultData.thumbnailPicS = thumbnailPicS;
	}
	final String? isContent = jsonConvert.convert<String>(json['is_content']);
	if (isContent != null) {
		newsModleResultData.isContent = isContent;
	}
	final String? thumbnailPicS02 = jsonConvert.convert<String>(json['thumbnail_pic_s02']);
	if (thumbnailPicS02 != null) {
		newsModleResultData.thumbnailPicS02 = thumbnailPicS02;
	}
	final String? thumbnailPicS03 = jsonConvert.convert<String>(json['thumbnail_pic_s03']);
	if (thumbnailPicS03 != null) {
		newsModleResultData.thumbnailPicS03 = thumbnailPicS03;
	}
	return newsModleResultData;
}

Map<String, dynamic> $NewsModleResultDataToJson(NewsModleResultData entity) {
	final Map<String, dynamic> data = <String, dynamic>{};
	data['uniquekey'] = entity.uniquekey;
	data['title'] = entity.title;
	data['date'] = entity.date;
	data['category'] = entity.category;
	data['author_name'] = entity.authorName;
	data['url'] = entity.url;
	data['thumbnail_pic_s'] = entity.thumbnailPicS;
	data['is_content'] = entity.isContent;
	data['thumbnail_pic_s02'] = entity.thumbnailPicS02;
	data['thumbnail_pic_s03'] = entity.thumbnailPicS03;
	return data;
}