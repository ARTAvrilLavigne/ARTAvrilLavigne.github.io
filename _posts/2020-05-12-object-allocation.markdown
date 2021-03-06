---
layout:     post
title:      "JAVA对象分配"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2020-05-12 20:54:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - java
---
## 一、JAVA创建对象分配<br>

　　似乎加班太多拖更好久了，最近刚好在充电，该补补作业了...Java语言中，new的对象是分配在堆空间中的，但是实际的情况是大部分的new对象会进入堆空间中，而并非是全部的对象，还有另外两个地方也可以存储new的对象，我们称之为**栈上分配**以及**TLAB**(Thread Local Allocation Buffer,即线程本地分配缓存区,这是一个线程专用的内存分配区域)。<br>
　　**java中对象的分配流程为：如果开启栈上分配，JVM会先进行栈上分配，如果没有开启栈上分配或则不符合条件的则会进行TLAB分配，如果TLAB分配不成功，再尝试在eden区分配，如果对象满足了直接进入老年代的条件，那就直接分配在老年代。**如下图所示：<br>
　　　　　　　　　　　　　　　　　　![object](https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-05-12-Object-Allocation/1.png?raw=true)<br>

## 二、为什么不都在堆上分配<br>

　　因为堆是由所有线程共享的，既然如此那它就是竞争资源，对于竞争资源，必须采取必要的同步，所以当使用new关键字在堆上分配对象时，是需要锁的。既然有锁，就必定存在锁带来的开销，而且由于是对整个堆加锁，相对而言锁的粒度还是比较大的，影响效率。而无论是TLAB还是栈都是线程私有的，私有即避免了竞争。所以对于某些特殊情况，可以采取避免在堆上分配对象的办法，以提高对象创建和销毁的效率。<br>
　　**(当锁的竞争很少或者基本没有时，JVM使用偏向锁来处理同步锁，这基本就算是没加锁。锁竞争越激烈的场景，JVM会把锁的处理方案会按照偏向锁==>轻量级锁(自旋锁)==>重量级锁的顺序不断升级（或者叫锁的膨胀），这些锁的方案会消耗越来越多的资源，锁的效率也越来越低，所以JVM能用前面的方案就不会用后面的方案。)具体的，java对象的内存布局为三部分:**<br>
**第一部分:对象头**<br>
　　**1.1、存储对象自身的运行时数据：Mark Word**（在32bit和64bit虚拟机上长度分别为32bit和64bit），包含如下信息：<br>
　　**a、对象hashCode**<br>
　　**b、对象GC分代年龄**<br>
　　**c、锁状态标志（轻量级锁、重量级锁）**<br>
　　**d、线程持有的锁（轻量级锁、重量级锁）**<br>
　　**e、偏向锁相关**：偏向锁、自旋锁、轻量级锁以及其他的一些锁优化策略是JDK1.6加入的，这些优化使得Synchronized的性能与ReentrantLock的性能持平，在Synchronized可以满足要求的情况下，优先使用Synchronized，除非是使用一些ReentrantLock独有的功能，例如指定时间等待等。<br>
<br>
　　**1.2、类型指针class pointer(元数据指针Klass\*)**：对象指向类元数据的指针（32bit-->32bit，64bit-->64bit(未开启压缩指针)，32bit(开启压缩指针)），JVM通过这个指针来确定这个对象是哪个类的实例（根据对象确定其Class的指针）<br>
<br>
**第二部分:实例数据instance data**：对象真正存储的有效信息<br>
<br>
**第三部分:对齐填充padding**<br>
　　JVM要求对象的大小必须是8的整数倍，若不是，需要补位对齐<br>
===================================================================<br>
　　**Synchronized加锁的执行过程：** <br>
　　1. 检测Mark Word里面是不是当前线程的ID，如果是，表示当前线程处于偏向锁。<br>
　　2. 如果不是，则使用CAS将当前线程的ID替换Mard Word，如果成功则表示当前线程获得偏向锁，置偏向标志位1。<br>
　　3. 如果失败，则说明发生竞争，撤销偏向锁，进而升级为轻量级锁。<br>
　　4. 当前线程使用CAS将对象头的Mark Word替换为锁记录指针，如果成功，当前线程获得锁。<br>
　　5. 如果失败，表示其他线程竞争锁，当前线程便尝试使用自旋来获取锁。<br>
　　6. 如果自旋成功则依然处于轻量级状态。<br> 
　　7. 如果自旋失败，则升级为重量级锁。<br>

## 三、栈上分配<br>

　　在java应用程序中，其实有很多的对象的作用域都不会逃逸出方法外，也就是说该对象的生命周期会随着方法的调用开始而开始，方法的调用结束而结束，一旦分配在堆空间中，当方法调用结束，没有了引用指向该对象，该对象就需要被gc回收，而如果存在大量的这种情况，对gc来说无疑是一种负担。因此，JVM提供了一种叫做栈上分配的概念，**针对那些作用域不会逃逸出方法的对象**，在分配内存时不在将对象分配在堆内存中，而是**将对象属性打散后分配在栈上（线程私有的，属于栈内存）**，这样随着方法的调用结束，栈空间的回收就会随着将栈上分配的打散后的对象回收掉，不再给gc增加额外的无用负担，从而提升应用程序整体的性能。<br>
　　**栈上分配的前提条件是启用逃逸分析和标量替换**(-XX:+DoEscapeAnalysis：开启逃逸分析，-XX:+EliminateAllocations：开启标量替换)。其中逃逸分析的目的是判断对象的作用域是否有可能逃逸出函数体，而标量替换启用后将允许把对象打散分配在栈上(比如user对象有id和name属性，在启用标量替换后，user对象的id和name属性会视为局部变量分配在栈上)。<br>
　　总结：小对象（一般几十个bytes）在没有逃逸的情况下可以直接分配在栈上，这样可以自动回收减轻GC压力，而大对象或者逃逸对象则无法栈上分配。其实目前Hotspot并没有实现真正意义上的栈上分配，实际上是标量替换<br>

## 四、TLAB<br>

　　由于对象一般会分配在堆上，而堆是全局共享的。因此在同一时间，可能会有多个线程在堆上申请空间。因此，每次对象分配都必须要进行同步（虚拟机采用CAS配上失败重试的方式保证更新操作的原子性），而在竞争激烈的场合分配的效率又会进一步下降。JVM使用TLAB来避免多线程冲突，在给对象分配内存时，每个线程使用自己的TLAB，这样可以避免线程同步，提高了对象分配的效率。因此**为了加速对象的分配，在开启TLAB的情况(默认开启-XX:+UseTLAB 使用TLAB)下，JVM会为每个线程分配一小块私有的堆空间，即TLAB是一块线程私有的堆空间（实际上是Eden区中划出的）**。<br>
　　总结：由于TLAB空间一般不会很大(默认占有整个Eden空间的1%)，所以大对象无法进行TLAB分配，只能直接分配到堆上。<br>

## 五、对象内存分配的两种方法<br>

　　为对象分配空间的任务等同于把一块确定大小的内存从Java堆中划分出来。<br>

1)**指针碰撞**(Serial、ParNew等带Compact过程的收集器)<br>

　　假设Java堆中内存是绝对规整的，所有用过的内存都放在一边，空闲的内存放在另一边，中间放着一个指针作为分界点的指示器，那所分配内存就仅仅是把那个指针向空闲空间那边挪动一段与对象大小相等的距离，这种分配方式称为“指针碰撞”（Bump the Pointer）。<br>

2)**空闲列表**(CMS这种基于Mark-Sweep算法的收集器)<br>

　　如果Java堆中的内存并不是规整的，已使用的内存和空闲的内存相互交错，那就没有办法简单地进行指针碰撞了，虚拟机就必须维护一个列表，记录上哪些内存块是可用的，在分配的时候从列表中找到一块足够大的空间划分给对象实例，并更新列表上的记录，这种分配方式称为“空闲列表”（Free List）。<br>
　　选择哪种分配方式由Java堆是否规整决定，而Java堆是否规整又由所采用的垃圾收集器是否带有压缩整理功能决定。因此，在使用Serial、ParNew等带Compact过程的收集器时，系统采用的分配算法是指针碰撞，而使用CMS这种基于Mark-Sweep算法的收集器时，通常采用空闲列表。<br>

## 六、参考<br>

[1]https://www.jianshu.com/p/f1e5e03ed2f8<br>
[2]https://blog.csdn.net/zhaohong_bo/article/details/89419480<br>
[3]https://blog.csdn.net/yangsnow_rain_wind/article/details/80434323<br>
[4]https://www.cnblogs.com/BlueStarWei/p/9358757.html<br>
[5]java同步锁：https://www.cnblogs.com/linghu-java/p/8944784.html<br>
[6]java同步锁：https://blog.csdn.net/lkforce/article/details/81128358<br>
[7]java同步锁：https://blog.csdn.net/lengxiao1993/article/details/81568130<br>
