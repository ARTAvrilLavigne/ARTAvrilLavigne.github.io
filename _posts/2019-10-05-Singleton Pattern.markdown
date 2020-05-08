---
layout:     post
title:      "JAVA设计模式之单例模式"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2019-10-05 11:18:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - java
---
## 一、简介<br>

　　单例模式是一种常用的软件设计模式，其定义是单例对象的类只能允许一个实例存在。许多时候整个系统只需要拥有一个的全局对象，这样有利于我们协调系统整体的行为。比如在某个服务器程序中，该服务器的配置信息存放在一个文件中，这些配置数据由一个单例对象统一读取，然后服务进程中的其他对象再通过这个单例对象获取这些配置信息。这种方式简化了在复杂环境下的配置管理。<br>
　　单例模式要求类能够有返回对象一个引用(永远是同一个)和一个获得该实例的方法（必须是静态方法，通常使用`getInstance`这个名称）。单例的实现主要是通过以下两个步骤：<br>
　　1、将该类的构造方法定义为私有方法，这样其他处的代码就无法通过调用该类的构造方法来实例化该类的对象，只有通过该类提供的静态方法来得到该类的唯一实例。<br>
　　2、在该类内提供一个静态方法，当我们调用这个方法时，如果类持有的引用不为空就返回这个引用，如果类保持的引用为空就创建该类的实例并将实例的引用赋予该类保持的引用。<br>
　　**注意：单例模式在多线程的应用场合下必须小心使用。如果当唯一实例尚未创建时，有两个线程同时调用创建方法，那么它们同时没有检测到唯一实例的存在，从而同时各自创建了一个实例，这样就有两个实例被构造出来，从而违反了单例模式中实例唯一的原则。 解决这个问题的办法是为指示类是否已经实例化的变量提供一个互斥锁(虽然这样会降低效率)。**<br>

## 二、单例模式的八种写法<br>

### 2.1、饿汉式（静态常量）[推荐用]<br>

```
public class Singleton {

    private final static Singleton INSTANCE = new Singleton();

    private Singleton(){}

    public static Singleton getInstance(){
        return INSTANCE;
    }
}
```

* 优点：这种写法比较简单，就是在类装载的时候就完成实例化。避免了线程同步问题。
* 缺点：在类装载的时候就完成实例化，没有达到 Lazy Loading 的效果。如果从始至终从未使用过这个实例，则会造成内存的浪费。

### 2.2、饿汉式（静态代码块）[可用]<br>

```
public class Singleton {

    private static Singleton instance;

    static {
        instance = new Singleton();
    }

    private Singleton() {}

    public Singleton getInstance() {
        return instance;
    }
}
```

* 这种方式和上面的方式其实类似，只不过将类实例化的过程放在了静态代码块中，也是在类装载的时候，就执行静态代码块中的代码，初始化类的实例。优缺点和上面是一样的。

### 2.3、懒汉式(线程不安全)[不可用]<br>

```
public class Singleton {

    private static Singleton singleton;

    private Singleton() {}

    public static Singleton getInstance() {
        if (singleton == null) {
            singleton = new Singleton();
        }
        return singleton;
    }
}
```

* 这种写法起到了`Lazy Loading`的效果，但是只能在单线程下使用。如果在多线程下，一个线程进入了`if (singleton == null)`判断语句块，还未来得及往下执行，另一个线程也通过了这个判断语句，这时便会产生多个实例。所以在多线程环境下不可使用这种方式。

### 2.4、懒汉式(线程安全，同步方法)[不推荐用]<br>

```
public class Singleton {

    private static Singleton singleton;

    private Singleton() {}

    public static synchronized Singleton getInstance() {
        if (singleton == null) {
            singleton = new Singleton();
        }
        return singleton;
    }
}
```

　　解决上面第三种实现方式的线程不安全问题，做个线程同步就可以了，于是就对`getInstance()`方法进行了线程同步。<br>
* 缺点：效率太低了，每个线程在想获得类的实例时候，执行`getInstance()`方法都要进行同步。而其实这个方法只执行一次实例化代码就够了，后面的想获得该类实例，直接`return`就行了。方法进行同步效率太低需要进行改进。<br>

### 2.5、懒汉式(线程安全，同步代码块)[不可用]<br>

```
public class Singleton {

    private static Singleton singleton;

    private Singleton() {}

    public static Singleton getInstance() {
        if (singleton == null) {
            synchronized (Singleton.class) {
                singleton = new Singleton();
            }
        }
        return singleton;
    }
}
```

* 由于2.4实现方式同步效率太低，所以摒弃同步方法，改为同步产生实例化的的代码块。但是这种同步并不能起到线程同步的作用。跟第 3 种实现方式遇到的情形一致，假如一个线程进入了`if (singleton == null)`判断语句块，还未来得及往下执行，另一个线程也通过了这个判断语句，这时便会产生多个实例。<br>

### 2.6、双重检查[推荐用]<br>

```
public class Singleton {

    private static volatile Singleton singleton;//加volatile为了禁止指令重排，比如类半初始化状态时字节码指令重排，多线程执行时可能会被其他线程使用半初始化状态的对象导致出现不可预知的错误

    private Singleton() {}

    public static Singleton getInstance() {
        if (singleton == null) {
            synchronized (Singleton.class) {
                if (singleton == null) {
                    singleton = new Singleton();
                }
            }
        }
        return singleton;
    }
}
```

　　**Double-Check 概念对于多线程开发者来说不会陌生，如代码中所示，我们进行了两次`if (singleton == null)`检查，这样就可以保证线程安全了。这样，实例化代码只用执行一次，后面再次访问时，判断`if (singleton == null)`，直接`return`实例化对象。**<br>
* 优点：线程安全、延迟加载、效率较高。

### 2.7、静态内部类[推荐用]<br>

```
public class Singleton {

    private Singleton() {}

    private static class SingletonInstance {
        private static final Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() {
        return SingletonInstance.INSTANCE;
    }
}
```

　　这种方式跟饿汉式方式采用的机制类似，但又有不同。两者都是采用了类装载的机制来保证初始化实例时只有一个线程。不同的地方在饿汉式方式是只要`Singleton`类被装载就会实例化，没有`Lazy-Loading`的作用，而静态内部类方式在`Singleton`类被装载时并不会立即实例化，而是在需要实例化时，调用 `getInstance`方法，才会装载`SingletonInstance`类，从而完成`Singleton`的实例化。<br>
　　**类的静态属性只会在第一次加载类的时候初始化，所以在这里，JVM 帮助我们保证了线程的安全性，在类进行初始化时，别的线程是无法进入的。**<br>
* 优点：避免了线程不安全，延迟加载，效率高。

### 2.8、枚举方式<br>

```
public enum Singleton {
    INSTANCE;
    public void whateverMethod() {

    }
}
```

　　借助JDK1.5中添加的枚举来实现单例模式。不仅能避免多线程同步问题，而且还能防止反序列化重新创建新的对象。可能是因为枚举在JDK1.5中才添加，所以在实际项目开发中，很少见人这么写过。<br>

## 3、模拟高并发下测试线程安全的单例模式<br>

　　**要求多个线程`同时`并发启动模拟高并发来测试，因此使用CountDownLatch类实现多个线程开始执行任务的最大并行性，实现多个线程在某一时刻同时开始执行。**`CountDownLatch`是JAVA提供在`java.util.concurrent`包下的一个辅助类，可以把它看成是一个计数器，其内部维护着一个count计数，只不过对这个计数器的操作都是原子操作，同时只能有一个线程去操作这个计数器，`CountDownLatch`通过构造函数传入一个初始计数值，调用者可以通过调用`CounDownLatch`对象的`cutDown()`方法，来使计数减1；如果调用对象上的`await()`方法，那么调用者就会一直阻塞在这里，直到别人通过`cutDown`方法，将计数减到0，所有因调用`await()`方法而处于等待状态的线程就会继续往下执行。<br>

```
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class Test {

    //模拟多个客户端同时并发访问请求
    private static int clientNum = 1000;

    //线程池的数量
    private static int threadsNum = 10;

    //计数器，总数为clientNum个
    private final static CountDownLatch doneSignal = new CountDownLatch(clientNum);

    //任务执行超时等待时间
    private final static long awaitTime = 10 * 1000;

    public static void main(String[] args) {

        //建立线程池
        ExecutorService exec = Executors.newFixedThreadPool(threadsNum);
        for(int i=0 ; i< clientNum; i++){
            MyRunnable myRunnable = new MyRunnable();
            exec.execute(myRunnable);
            doneSignal.countDown();//调用一次countDown则计数器减1
        }

        /**
         * 执行完任务后，正确关闭线程池的方法
         */
        try {
            // 向学生传达“问题解答完毕后请举手示意！”
            exec.shutdown();

            // 向学生传达“XX分之内解答不完的问题全部带回去作为课后作业！”后老师等待学生答题
            // 所有的任务都结束的时候，返回TRUE
            if(!exec.awaitTermination(awaitTime, TimeUnit.SECONDS)){
                // 超时的时候向线程池中所有的线程发出中断(interrupted)。
                exec.shutdownNow();
            }
        } catch (InterruptedException e) {
            // awaitTermination方法被中断的时候也中止线程池中全部的线程的执行。
            System.out.println("awaitTermination interrupted: " + e);
            exec.shutdownNow();
        }
    }

    private static class  MyRunnable implements  Runnable{
        @Override
        public void run() {
            try{
                doneSignal.await();//阻塞在这里，直到计数器为0时继续执行
            }catch (Exception e){
                e.printStackTrace();
            }
            System.out.println("线程id="+Thread.currentThread().getId()+"获取的单例对象地址为："+SingleModel.getInstance());
        }
    }
}
```

执行打印结果如图所示：<br>
![](https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2019-10-05-Singleton%20Pattern/1.png?raw=true)<br>


  
