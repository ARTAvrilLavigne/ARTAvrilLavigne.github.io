---
layout:     post
title:      "Spring之Bean的加载过程"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2020-12-13 19:42:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - javaee
---
## 一、概述<br>

### 1.1、说明<br>

　　Spring 作为 Ioc 框架，实现了依赖注入，由一个中心化的 Bean 工厂来负责各个 Bean 的实例化和依赖管理。各个 Bean 可以不需要关心各自的复杂的创建过程，达到了很好的解耦效果。对Spring 的工作流进行一个粗略的概括，主要为两大环节：<br>
* `解析`:读 xml 配置，扫描类文件，从配置或者注解中获取 Bean 的定义信息，注册一些扩展功能。<br>
* `加载`:通过解析完的定义信息获取 Bean 实例。<br>




## 参考文献<br>

[1].https://www.jianshu.com/p/9ea61d204559<br>
[2].https://www.cnblogs.com/wyq178/p/11415877.html<br>
[3].https://blog.csdn.net/whp404/article/details/81412417<br>
