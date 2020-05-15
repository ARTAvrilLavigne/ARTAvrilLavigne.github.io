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

　　HotSpot团队选择移除永久代，移到本地内存(native memory)的元空间(Metaspace)。有内因和外因两部分：<br>
　　一、从外因来说，如下所示JEP 122的Motivation（动机）部分。意思为移除永久代也是为了和JRockit进行融合而做的努力，JRockit用户并不需要配置永久代（因为JRockit就没有永久代）。<br>

```
This is part of the JRockit and Hotspot convergence effort. JRockit customers do not need to 
configure the permanent generation (since JRockit does not have a permanent generation) and 
are accustomed to not configuring the permanent generation.
```

　　二、从内因来说，永久代大小受到-XX：PermSize和-XX：MaxPermSize两个参数的限制，而这两个参数又受到JVM设定的内存大小限制，这就导致在使用中可能会出现永久代内存溢出的问题，因此在Java 8及之后的版本中彻底移除了永久代而使用Metaspace来进行替代。为什么会内存溢出：永久代这一部分用于存放Class和Meta的信息,Class在被加载的时候被放入永久代，它和和存放Instance的堆区域不同,所以如果应用程序会加载很多CLASS的话,就很可能出现OutOfMemoryError：PermGen space错误。这种错误常见在web服务器对JSP进行pre compile的时候。<br>

　　元空间的本质和永久代类似，都是对JVM规范中方法区的实现。**不过元空间与永久代之间最大的区别在于：元空间并不在虚拟机JVM内存中，而是使用本地内存。因此，默认情况下，元空间的大小仅受本地内存限制。**因此Metaspace具体大小理论上取决于32位/64位系统可用内存的大小，可见也不是无限制的，需要配置参数。在永久代移除后，常量池中的字符串常量池也不再放在永久代了，但是也没有放到新的方法区---元空间里，而是留在了堆里。而运行时常量池和class文件常量池跟着移到了元空间中。<br>

## 二、JVM堆与本地内存区别<br>
　　操作系统会创建一个进程来执行java程序，而每个进程都有自己的虚拟地址空间，JVM用到的内存（包括堆、栈和方法区）就是从进程的虚拟地址空间上分配的。注意JVM内存只是进程空间的一部分，除此之外进程空间内还有代码段、数据段、内存映射区、内核空间等。JVM的角度看，JVM内存之外的部分叫作本地内存，C语言程序代码在运行过程中用到的内存就是本地内存中分配的。下面我们通过一张图来理解一下:<br>


## 三、元空间的组成


## 四、元空间内存管理



## 五、参考
[1]https://www.cnblogs.com/duanxz/p/3520829.html<br>
[2]https://blog.csdn.net/pzxwhc/article/details/46722411<br>
[3]https://blog.csdn.net/u010515202/article/details/106056592/<br>
[4]https://www.cnblogs.com/xrq730/p/8688203.html<br>
[5]https://blog.csdn.net/q5706503/article/details/84621210<br>

