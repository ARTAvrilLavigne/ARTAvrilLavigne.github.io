---
layout:     post
title:      "JDK8移除永久代"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2020-05-25 20:47:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - java
---
## 一、移除永久代的原因<br>

　　HotSpot团队选择移除永久代，移到本地内存(native memory)的元空间(Metaspace)。如下图所示<br>

![object](https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-05-25-java-metaspace/3.jpg?raw=true)<br>

　　其中有内因和外因两部分原因：<br>
　　一、从外因来说，如下所示JEP 122的Motivation（动机）部分。意思为移除永久代也是为了和JRockit进行融合而做的努力，JRockit用户并不需要配置永久代（因为JRockit就没有永久代）。<br>

```
This is part of the JRockit and Hotspot convergence effort. JRockit customers do not need to 
configure the permanent generation (since JRockit does not have a permanent generation) and 
are accustomed to not configuring the permanent generation.
```

　　二、从内因来说，永久代大小受到-XX：PermSize和-XX：MaxPermSize两个参数的限制，而这两个参数又受到JVM设定的内存大小限制，这就导致在使用中可能会出现永久代内存溢出的问题，因此在Java 8及之后的版本中彻底移除了永久代而使用Metaspace来进行替代。为什么会内存溢出：永久代这一部分用于存放Class和Meta的信息,Class在被加载的时候被放入永久代，它和和存放Instance的堆区域不同,所以如果应用程序会加载很多CLASS的话,就很可能出现OutOfMemoryError：PermGen space错误。这种错误常见在web服务器对JSP进行pre compile的时候。<br>

　　元空间的本质和永久代类似，都是对JVM规范中方法区的实现。**不过元空间与永久代之间最大的区别在于：元空间并不在虚拟机JVM内存中，而是使用本地内存。因此，默认情况下，元空间的大小仅受本地内存限制。**因此Metaspace具体大小理论上取决于32位/64位系统可用内存的大小，可见也不是无限制的，需要配置参数。在永久代移除后，常量池中的字符串常量池也不再放在永久代了，但是也没有放到元空间里，而是留在了堆中。而运行时常量池和class文件常量池则跟着移到了元空间中。<br>
  
　　java8的内存模型总结如下图所示：<br>
<div>
	   <a class="fancybox_mydefine" rel="group" href="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-05-25-java-metaspace/1.jpg?raw=true">
               <img id="jdk8_JVM" src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-05-25-java-metaspace/1.jpg?raw=true" alt="JVM"/>
	   </a>
</div>
  

## 二、JVM堆与本地内存区别<br>

　　操作系统会创建一个进程来执行java程序，而每个进程都有自己的虚拟地址空间，JVM用到的内存（包括堆、栈和方法区）就是从进程的虚拟地址空间上分配的。注意JVM内存只是进程空间的一部分，除此之外进程空间内还有代码段、数据段、内存映射区、内核空间等。JVM的角度看，JVM内存之外的部分叫作本地内存，C语言程序代码在运行过程中用到的内存就是本地内存中分配的。下面我们通过一张图来理解一下:<br>

![object](https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-05-25-java-metaspace/2.png?raw=true)<br>

## 三、元空间的组成<br>

　　metaspace其实由两大部分组成:**Klass Metaspace**和**NoKlass Metaspace**<br>
　　Klass Metaspace就是用来存klass的，klass是我们熟知的class文件在jvm里的运行时数据结构，不过有点要提的是我们看到的类似A.class其实是存在heap里的，是java.lang.Class的一个对象实例。这块内存是紧接着Heap的，和之前的perm一样，这块内存大小可通过-XX:CompressedClassSpaceSize参数来控制，这个参数默认是1G，但是这块内存也可以没有，假如没有开启压缩指针就不会有这块内存，这种情况下klass都会存在NoKlass Metaspace里，另外如果把-Xmx设置大于32G的话，其实也是没有这块内存的，因为这么大内存会关闭压缩指针开关。还有就是这块内存最多只会存在一块。<br>
　　NoKlass Metaspace专门来存klass相关的其他的内容，比如method，constantPool等，这块内存是由多块内存组合起来的，所以可以认为是不连续的内存块组成的。这块内存是必须的，虽然叫做NoKlass Metaspace，但是其实也可以存klass的内容，上一段已经提到了对应场景。<br>
　　Klass Metaspace和NoKlass Mestaspace都是所有classloader共享的，所以类加载器们要分配内存，但是每个类加载器都有一个SpaceManager，来管理属于这个类加载的内存小块。如果Klass Metaspace用完了，那就会OOM了，不过一般情况下不会，NoKlass Mestaspace是由一块块内存慢慢组合起来的，在没有达到限制条件的情况下，会不断加长这条链，让它可以持续工作。<br>

### 3.1、metaspace的相关参数<br>
　　如果要改变metaspace的一些行为，一般会对其相关的一些参数做调整，因为metaspace的参数本身不是很多，所以将涉及到的所有参数都做一个介绍。<br>
**1. UseLargePagesInMetaspace**<br>
　　默认false，这个参数是说是否在metaspace里使用LargePage，一般情况下使用4KB的page size，这个参数依赖于UseLargePages这个参数开启，不过这个参数一般不开。<br>

**2. InitialBootClassLoaderMetaspaceSize**<br>
　　64位下默认4M，32位下默认2200K，metasapce前面已经提到主要分了两大块，Klass Metaspace以及NoKlass Metaspace，而NoKlass Metaspace是由一块块内存组合起来的，这个参数决定了NoKlass Metaspace的第一个内存Block的大小，即2*InitialBootClassLoaderMetaspaceSize，同时为bootstrapClassLoader的第一块内存chunk分配了InitialBootClassLoaderMetaspaceSize的大小<br>

**3. MetaspaceSize**<br>
　　默认20.8M左右(x86下开启c2模式)，主要是控制metaspaceGC发生的初始阈值，也是最小阈值，但是触发metaspaceGC的阈值是不断变化的，与之对比的主要是指Klass Metaspace与NoKlass Metaspace两块committed的内存和。<br>

**4. MaxMetaspaceSize**<br>
　　默认基本是无穷大，但是还是建议设置这个参数，因为很可能会因为没有限制而导致metaspace被无止境使用(一般是内存泄漏)而被OS Kill。这个参数会限制metaspace(包括了Klass Metaspace以及NoKlass Metaspace)被committed的内存大小，会保证committed的内存不会超过这个值，一旦超过就会触发GC，这里要注意和MaxPermSize的区别，MaxMetaspaceSize并不会在jvm启动的时候分配一块这么大的内存出来，而MaxPermSize是会分配一块这么大的内存的。<br>

**5. CompressedClassSpaceSize**<br>
　　默认1G，这个参数主要是设置Klass Metaspace的大小，不过这个参数设置了也不一定起作用，前提是能开启压缩指针，假如-Xmx超过了32G，压缩指针是开启不来的。如果有Klass Metaspace，那这块内存是和Heap连着的。<br>
  
**6. MinMetaspaceExpansion**<br>
　　MinMetaspaceExpansion和MaxMetaspaceExpansion这两个参数或许和所认识的并不一样，也许很多人会认为这两个参数不就是内存不够的时候，然后扩容的最小大小吗？其实这两个参数和扩容其实并没有直接的关系，也就是并不是为了增大committed的内存，而是为了增大触发metaspace GC的阈值。<br>
　　这两个参数主要是在比较特殊的场景下救急使用，比如gcLocker或者should_concurrent_collect的一些场景，因为这些场景下接下来会做一次GC，相信在接下来的GC中可能会释放一些metaspace的内存，于是先临时扩大下metaspace触发GC的阈值，而有些内存分配失败其实正好是因为这个阈值触顶导致的，于是可以通过增大阈值暂时绕过去。<br>
　　默认332.8K，增大触发metaspace GC阈值的最小要求。假如要救急分配的内存很小，没有达到MinMetaspaceExpansion，但是我们会将这次触发metaspace GC的阈值提升MinMetaspaceExpansion，之所以要大于这次要分配的内存大小主要是为了防止别的线程也有类似的请求而频繁触发相关的操作，不过如果要分配的内存超过了MaxMetaspaceExpansion，那MinMetaspaceExpansion将会是要分配的内存大小基础上的一个增量。<br>
  
**7. MaxMetaspaceExpansion**<br>
　　默认5.2M，增大触发metaspace GC阈值的最大要求。假如说要分配的内存超过了MinMetaspaceExpansion但是低于MaxMetaspaceExpansion，那增量是MaxMetaspaceExpansion，如果超过了MaxMetaspaceExpansion，那增量是MinMetaspaceExpansion加上要分配的内存大小。<br>

　　注：每次分配只会给对应的线程一次扩展触发metaspace GC阈值的机会，如果扩展了，但是还不能分配，那就只能等着做GC了。<br>

**8. MinMetaspaceFreeRatio**<br>
　　MinMetaspaceFreeRatio和下面的MaxMetaspaceFreeRatio，主要是影响触发metaspaceGC的阈值。<br>
　　默认40，表示每次GC完之后，假设我们允许接下来metaspace可以继续被commit的内存占到了被commit之后总共committed的内存量的MinMetaspaceFreeRatio%，如果这个总共被committed的量比当前触发metaspaceGC的阈值要大，那么将尝试做扩容，也就是增大触发metaspaceGC的阈值，不过这个增量至少是MinMetaspaceExpansion才会做，不然不会增加这个阈值。<br>
　　这个参数主要是为了避免触发metaspaceGC的阈值和gc之后committed的内存的量比较接近，于是将这个阈值进行扩大。一般情况下在gc完之后，如果被committed的量还是比较大的时候，换个说法就是离触发metaspaceGC的阈值比较接近的时候，这个调整会比较明显。<br>

　　注：这里不用gc之后used的量来算，主要是担心可能出现committed的量超过了触发metaspaceGC的阈值，这种情况一旦发生会很危险，会不断做gc，这应该是jdk8在某个版本之后才修复的bug。<br>

**9. MaxMetaspaceFreeRatio**<br>
　　默认70，这个参数和上面的参数基本是相反的，是为了避免触发metaspaceGC的阈值过大，而想对这个值进行缩小。这个参数在gc之后committed的内存比较小的时候并且离触发metaspaceGC的阈值比较远的时候，调整会比较明显。<br>

## 四、元空间内存管理<br>

　　元空间的内存管理由**元空间虚拟机**来完成。<br>
　　JDK8之前对于类的元数据我们需要不同的垃圾回收器进行处理，现在只需要执行元空间虚拟机的C++代码即可完成。在元空间中，类和其元数据的生命周期和其对应的类加载器是相同的。换句话说，只要类加载器存活，其加载的类的元数据也是存活的，因而不会被回收掉。准确的来说，每一个类加载器的存储区域都称作一个元空间，所有的元空间合在一起就是我们一直说的元空间。当一个类加载器被垃圾回收器标记为不再存活，其对应的元空间会被回收。在元空间的回收过程中没有重定位和压缩等操作，但是元空间内的元数据会进行扫描来确定java引用。<br>
　　具体管理：元空间虚拟机负责元空间的分配，其采用的形式为组块分配。组块的大小因类加载器的类型而异，在元空间虚拟机中存在一个全局的空闲组块列表。<br>
　　1. 当一个类加载器需要组块时，它就会从这个全局的组块列表中获取并维持一个自己的组块列表。<br>
　　2. 当一个类加载器不再存活时，那么其持有的组块将会被释放，并返回给全局组块列表。<br>
　　3. 类加载器持有的组块又会被分成多个块，每一个块存储一个单元的元信息，而组块中的块是线性分配（指针碰撞分配形式）。组块分配自内存映射区域，这些全局的虚拟内存映射区域以链表形式连接，一旦某个虚拟内存映射区域清空，这部分内存就会返回给操作系统。<br>


## 五、参考
[1]https://www.cnblogs.com/duanxz/p/3520829.html<br>
[2]https://blog.csdn.net/pzxwhc/article/details/46722411<br>
[3]https://blog.csdn.net/u010515202/article/details/106056592/<br>
[4]https://www.cnblogs.com/xrq730/p/8688203.html<br>
[5]https://blog.csdn.net/q5706503/article/details/84621210<br>
[6]http://www.imooc.com/article/294626<br>
[7]蚂蚁金服JVM团队：http://lovestblog.cn/blog/2016/10/29/metaspace/<br>

