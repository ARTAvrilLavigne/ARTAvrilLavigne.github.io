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

## 二、流程概括<br>

　　为了能够很好地理解 Bean 加载流程，省略一些异常、日志和分支处理和一些特殊条件的判断，流程图如下所示：<br>
<div>
	<a class="fancybox_mydefine" rel="group" href="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/1.png?raw=true">
            <img id="java_lock" src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/1.png?raw=true" alt="lock"/>
	</a>
</div>

　　从上面的流程图中，可以看到一个 Bean 加载会经历这么几个阶段（用绿色标记）：<br>

* `获取 BeanName`：对传入的 name 进行解析，转化为可以从 Map 中获取到 BeanDefinition 的 bean name。<br>
* `合并 Bean 定义`：对父类的定义进行合并和覆盖，如果父类还有父类，会进行递归合并，以获取完整的 Bean 定义信息。<br>
* `实例化`：使用构造或者工厂方法创建 Bean 实例。<br>
* `属性填充`：寻找并且注入依赖，依赖的 Bean 还会递归调用 getBean 方法获取。<br>
* `初始化`：调用自定义的初始化方法。<br>
* `获取最终的Bean`：如果是 FactoryBean 需要调用 getObject 方法，如果需要类型转换调用 TypeConverter 进行转化。<br>

　　整个流程最为复杂的是对循环依赖的解决，下一节会进行细节分析。<br>
  
## 三、细节分析<br>

　　S艾




## 参考文献<br>

[1].https://www.jianshu.com/p/9ea61d204559<br>
[2].https://www.cnblogs.com/wyq178/p/11415877.html<br>
[3].https://blog.csdn.net/whp404/article/details/81412417<br>
