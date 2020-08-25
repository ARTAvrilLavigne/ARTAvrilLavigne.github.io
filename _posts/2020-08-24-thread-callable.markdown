---
layout:     post
title:      "多线程之Callable接口"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2020-08-24 21:14:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - java
---
## 一、创建线程的方法<br>

　　常见的四种创建线程的方式：Thread、Runnable接口、线程池、Callable接口<br>
* 1、`通过继承Thread类实现` 特点：多个线程之间无法共享该线程类的实例变量<br>
* 2、`实现Runnable接口` 特点：较继承Thread类，避免继承的局限性，适合资源共享。需要实现不返回任何内容的run()方法<br>
* 3、`创建线程池实现` 特点：线程池提供了一个线程队列，队列中保存所有等待状态的线程，避免创建与销毁额外开销，提高了响应速度<br>
* 4、`实现Callable接口` 特点：方法中可以有返回值，并且抛出异常。此方式需要配合Future接口使用，实现在完成时返回结果的call()方法。**使用Callable和Future来实现获取任务结果的操作。Callable用来执行任务产生结果，而Future用来获得结果**<br>
  
## 二、Callable接口与Futrue接口定义<br>

Callable接口定义如下：<br>

```
@FunctionalInterface
public interface Callable<V> {
    /**
     * Computes a result, or throws an exception if unable to do so.
     *
     * @return computed result
     * @throws Exception if unable to compute a result
     */
    V call() throws Exception;
}
```

　　Future提供了3种功能：(1)能够中断执行中的任务、(2)判断任务是否执行完成、(3)获取任务执行完成后的结果。<br>
　　Future接口是Java标准API的一部分，在java.util.concurrent包中。Future接口是Java线程Future模式的实现，可以来进行异步计算。<br>
　　Future模式可以这样来描述：我有一个任务，提交给了Future，Future替我完成这个任务。期间我自己可以去做任何想做的事情。一段时间之后，我就便可以从Future那儿取出结果。就相当于下了一张订货单，一段时间后可以拿着提订单来提货，这期间可以干别的任何事情。其中Future 接口就是订货单，真正处理订单的是Executor类，它根据Future接口的要求来生产产品。<br>
　　Future接口提供方法来检测任务是否被执行完，等待任务执行完获得结果，也可以设置任务执行的超时时间。这个设置超时的方法就是实现Java程序执行超时的关键。
Future接口定义如下：<br>

```
public interface Future<V> {
	// 尝试取消此次任务  mayInterruptIfRunning - true如果执行该任务的线程应该被中断，否则正在进行的任务被允许完成 
    boolean cancel(boolean mayInterruptIfRunning);
	// 如果此任务在正常完成之前被取消，则返回 true 。 
    boolean isCancelled();
	// 返回true如果任务已完成。 完成可能是由于正常终止，异常或取消 - 在所有这些情况下，此方法将返回true 。 
    boolean isDone();
	// 等待计算完成然后返回结果
    V get() throws InterruptedException, ExecutionException;
    // 在指定的时间之内进行等待，超时不等待
    V get(long timeout, TimeUnit unit) throws InterruptedException, ExecutionException, TimeoutException;
}
```
  
## 三、使用方法<br>

　　使用Callable和Future来获取任务结果的两种常用写法例子如下：<br>

```
public class TestMain {
    public static void main(String[] args) throws Exception {
    
        // 方式一：不直接构造Future对象，使用ExecutorService.submit方法来获得Future对象，submit方法即支持以Callable接口类型，也支持Runnable接口作为参数
	
        // 定义线程池，可以为多种不同类型线程池
        ExecutorService executor = Executors.newCachedThreadPool();
        // 提交执行任务
        Future<String> future = executor.submit(new AddNumberTask());
        // 获取线程执行结果
        String str = future.get();
        // 打印结果
        System.out.println(str);
        // 关闭线程池
        if (executor != null) {
            executor.shutdown();
        }
	
	
	// =======================分割线=======================
	
	
        // 方式二：使用FutureTask来处理任务。FutureTask类除了实现Future接口外还实现了Runnable接口，所以可以直接提交给Executor执行
	
	// 定义线程池，可以为多种不同类型线程池
        ExecutorService executor = Executors.newCachedThreadPool();
	// 提交执行任务
        FutureTask<String> future = new FutureTask<String>(new AddNumberTask());
	// 执行任务
	executor.execute(future);
	// 获取线程执行结果
        String str = future.get();
        // 打印结果
        System.out.println(str);
        // 关闭线程池
        if (executor != null) {
            executor.shutdown();
        }
	
    }

}


// 线程执行的任务类，此处换成实现Runnable接口重写run方法也是一样的用法也可以通过Future取得线程执行完后的结果
class AddNumberTask implements Callable<String> {
    public AddNumberTask() {
        // 可通过构造传参在call方法中使用 do something
    }
    // 返回类型由实现Callable接口的泛型决定
    @Override
    public String call() throws Exception {
    	// 具体执行的业务逻辑
        System.out.println(">>>" + taskNum + "任务启动");
        Date dateTmp1 = new Date();
        Thread.sleep(1000);
        Date dateTmp2 = new Date();
        long time = dateTmp2.getTime() - dateTmp1.getTime();
        System.out.println(">>>" + taskNum + "任务终止");
        return taskNum + "任务返回运行结果,当前任务时间：" + time + "毫秒";
    }

}
```

## 参考文献<br>
[1]https://www.cnblogs.com/guanbin-529/p/11784914.html<br>
[2]https://www.cnblogs.com/binghe001/p/12321885.html<br>
[3]https://www.cnblogs.com/lililixuefei/p/13185986.html<br>
[4]https://www.jianshu.com/p/f17d300bf4a6<br>
[5]https://zhuanlan.zhihu.com/p/102656503<br>
[6]https://blog.csdn.net/qq_38345606/article/details/82829400<br>
[7]https://www.cnblogs.com/jenson138/p/4919497.html<br>
