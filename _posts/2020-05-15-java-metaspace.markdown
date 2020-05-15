---
layout:     post
title:      "JDK8移除永久代"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2020-05-15 20:47:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - java
---
## 一、移除永久代的原因<br>

　　HotSpot团队选择移除永久代，使用本地内存native memory的。有内因和外因两部分：<br>
一、从外因来说，如下所示JEP 122的Motivation（动机）部分。意思为移除永久代也是为了和JRockit进行融合而做的努力，JRockit用户并不需要配置永久代（因为JRockit就没有永久代）。

```
This is part of the JRockit and Hotspot convergence effort. JRockit customers do not need to configure the permanent generation (since JRockit does not have a permanent generation) and are accustomed to not configuring the permanent generation.
```

二、从内因来说，持久代大小受到-XX：PermSize和-XX：MaxPermSize两个参数的限制，而这两个参数又受到JVM设定的内存大小限制，这就导致在使用中可能会出现永久代内存溢出的问题，因此在Java 8及之后的版本中彻底移除了永久代而使用Metaspace来进行替代。
