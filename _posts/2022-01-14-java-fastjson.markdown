---
layout:     post
title:      "fastjson泛型踩坑"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2022-01-14 09:16:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - java
---
## 一、fastjson泛型报错<br>

### 1.1、现象简述<br>

　　项目代码开发过程中，继续新增方法利用fastjson泛型转换API接口的响应字符串为对象后获取元素抛异常为com.alibaba.fastjson.JSONObject cannot be cast to com.xxxx.JobZoneInfo.<br>
<div>
	<a class="fancybox_mydefine" rel="group" href="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2022-01-14-java-fastjson/1.png?raw=true">
            <img id="exception" src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2022-01-14-java-fastjson/1.png?raw=true" alt="exception"/>
	</a>
</div>

　　fastjson泛型转换报错位置写法如下所示：<br>
```
Response<List<JobZoneInfo>> res = JSONObject.parseObject(response, new TypeReference<Response<List<JobZoneInfo>>>() {});
List<JobZoneInfo> jobZoneInfoList = res.getData();
JobZoneInfo jobZoneInfo = jobZoneInfoList.get(0);
```

### 1.2、问题原因<br>

　　debug断点调试发现JSONObject利用TypeReference泛型转换出来的data不是List类型而是JSONArray类型导致下面获取时抛异常，如下所示：<br>
<div>
	<a class="fancybox_mydefine" rel="group" href="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2022-01-14-java-fastjson/2.png?raw=true">
            <img id="beforeSuccess" src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2022-01-14-java-fastjson/2.png?raw=true" alt="beforeSuccess"/>
	</a>
</div>

　　单独把这段代码取出来查找原因调试时，发现没有任何报错，如下所示：<br>
```
public static void main(String[] args) {
    try{
         String response = "{\"code\":\"0\",\"msg\":\"success\",\"data\":[{\"JobManagerAddr\":\"1.1.1.1\",\"JobManagerType\":\"test\",\"id\":1638523853,\"text\":\"Cluster_name\",\"JobManagerPort\":\"8080\"}]}";
         Response<List<JobZoneInfo>> res = JSONObject.parseObject(response, new TypeReference<Response<List<JobZoneInfo>>>() {});
         List<JobZoneInfo> jobZoneInfoList = res.getData();
         JobZoneInfo jobZoneInfo = jobZoneInfoList.get(0);
         long id = jobZoneInfo.getId();
    }catch(Exception e){
         LOGGER.error(" ", e);
     }
    }
```

　　该异常只在项目运行时会抛出，于是查阅资料发现问题出在FastJson对类解析的缓存上，在源码`ParserConfig`类的`getDeserializer`方法中定义为如下所示:

```
if (type instanceof Class<?>) {
   return getDeserializer((Class<?>) type, type);
}
 
if (type instanceof ParameterizedType) {
    Type rawType = ((ParameterizedType) type).getRawType();
    if (rawType instanceof Class<?>) {
        return getDeserializer((Class<?>) rawType, type);
    } else {
        return getDeserializer(rawType);
    }
}
```
  
　　第一个if判断是否是class，第二个if是判断是否泛型类型，`getRawType`是获取泛型的类型，然后进入`getDeserializer`方法，这个方法里有一个缓存,缓存的放入是在`putDeserializer`这个方法中，可以看到缓存的key是Type。如下所示：

```
if (type instanceof WildcardType || type instanceof TypeVariable || type instanceof ParameterizedType) {
      derializer = derializers.get(clazz);
}


public void putDeserializer(Type type, ObjectDeserializer deserializer) {
      derializers.put(type, deserializer);
}

```

　　查看项目代码，发现在抛异常的方法执行之前另一个方法执行过程中也使用fastjson泛型转换，但是没有加上具体的泛型处理，因为那一处API返回的响应中data为null，代码如下：<br>

```
Response res = JSONObject.parseObject(result, new TypeReference<Response>() {});
String code = res.getCode();
```

　　由此引发的问题：首先项目启动服务执行后，代码中先解析`new TypeReference<Response>()`，走了`getDeserializer`的第一个if，这样`putDeserializer`方法里放入的是Response。接着执行到抛出异常的这个方法时进行解析`new TypeReference<Response<List<JobZoneInfo>>>()`，这个时候走了`getDeserializer`的第二个if，结果rawType是Response，所以直接从缓存中返回了第一次解析的结果。这样就相当于丢失了泛型类型`List<JobZoneInfo>`，导致最后类型转换失败为JSONArray。


## 二、解决办法<br>

　　项目开发中统一必须带上泛型类型，项目中不允许没有泛型类型的Response进行解析即可。<br>
　　如下所示将前一处方法中未带具体泛型的代码修改为，然后抛出异常的方法报错位置即可解析正确：<br>

```
Response<Object> res = JSONObject.parseObject(result, new TypeReference<Response<Object>>() {});
String code = res.getCode();
```

<div>
	<a class="fancybox_mydefine" rel="group" href="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2022-01-14-java-fastjson/3.png?raw=true">
            <img id="afterSuccess" src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2022-01-14-java-fastjson/3.png?raw=true" alt="afterSuccess"/>
	</a>
</div>

## 参考文献<br>
[1].https://blog.csdn.net/ykdsg/article/details/50432494<br>
[2].https://www.cnblogs.com/eoooxy/p/6186205.html<br>
[3].https://blog.csdn.net/weixin_34319640/article/details/93507385<br>
[4].https://www.cnblogs.com/nizuimeiabc1/p/9397985.html<br>

