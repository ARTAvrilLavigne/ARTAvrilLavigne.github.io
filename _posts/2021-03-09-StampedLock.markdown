---
layout:     post
title:      "JDK1.8之StampedLock读写锁"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2021-03-09 22:39:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - java
---
## 一、StampedLock<br>

### 1.1、简述<br>

　　`StampedLock`是Java8引入的一种新的所机制,可以认为它是`读写锁ReentrantReadWriteLock`的一个改进版本,读写锁虽然分离了读和写的功能,使得读与读之间可以完全并发,但是读和写之间依然是冲突的,读锁会完全阻塞写锁,它使用的依然是悲观的锁策略。如果有大量的读线程,也有可能引起写线程的饥饿。而StampedLock则提供了一种乐观的读策略,这种乐观策略的锁非常类似于无锁的操作,使得乐观锁完全不会阻塞写线程。<br>
　　**核心思想：StampedLock读写锁中不仅多个读不互相阻塞，同时在读操作时不会阻塞写操作。**在读的时候如果发生了写，应该通过重试的方式来获取新的值，而不应该阻塞写操作。这种模式也就是典型的无锁编程思想，和CAS自旋的思想一样。这种操作方式决定了StampedLock在读多写少的场景下非常适用，同时还避免了写饥饿情况的发生。<br>

### 1.2、读不阻塞写的思路<br>

　　在读的时候如果发生了写，则应当重读而不是在读的时候直接阻塞写。因为在读多而写比较少的情况下，写线程可能发生饥饿现象，也就是因为大量的读线程存在并且读线程都阻塞写线程，因此写线程可能很少被调度成功。当读执行的时候另一个线程执行了写，则读线程发现数据不一致则执行重读即可。所以读写都存在的情况下，使用StampedLock就可以实现一种无障碍操作，即读写之间不会阻塞对方，但是写和写之间还是阻塞的。<br>

## 二、StampedLock实现思想<br>

<div>
	<a class="fancybox_mydefine" rel="group" href="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2021-03-09-StampedLock/1.png?raw=true">
            <img id="StampedLock" src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2021-03-09-StampedLock/1.png?raw=true" alt="StampedLock"/>
	</a>
</div>

　　在StampedLock中使用了CLH自旋锁，如果发生了读失败，不立刻把读线程挂起，锁当中维护了一个等待线程队列。所有申请锁但是没有成功的线程都会记录到这个队列中，每一个节点（一个节点表示一个线程）保存一个标记位（locked），用于判断当前线程是否已经释放锁。当一个未标记到队列中的线程试图获得锁时，会取得当前等待队列尾部的节点作为其前序节点，并使用类似如下代码（一个空的死循环）判断前序节点是否已经成功的释放了锁：<br>

```
while(pred.locked){  

}
```

　　解释：pred表示当前试图获取锁的线程的前序节点，如果前序节点没有释放锁，则当前线程就执行该空循环并不断判断前序节点的锁释放，即类似一个自旋锁的效果，避免被系统挂起。当循环一定次数后，前序节点还没有释放锁，则当前线程就被挂起而不再自旋，因为空的死循环执行太多次比挂起更消耗资源。<br>
  
## 三、StampedLock与ReentrantReadWriteLock对比<br>

xxxxxxx

## 四、StampedLock示例代码<br>

```
public class Point {

	private double x, y;
	// 定义StampedLock锁
	private final StampedLock stampedLock = new StampedLock();
	
	// 方法一：写锁的使用
	void move(double deltaX, double deltaY){
	        // 获取写锁
		long stamp = stampedLock.writeLock(); 
		try {
			x += deltaX;
			y += deltaY;
		} finally {
		        // 释放写锁
			stampedLock.unlockWrite(stamp); 
		}
	}
	
	// 方法二：乐观读锁的使用
	double distanceFromOrigin() {
		// 获得一个乐观读锁
		long stamp = stampedLock.tryOptimisticRead(); 
		double currentX = x;
		double currentY = y;
		// 检查乐观读锁后是否有其他写锁发生，有则返回false
		if (!stampedLock.validate(stamp)) { 
			// 获取一个悲观读锁
			stamp = stampedLock.readLock(); 
			
			try {
				currentX = x;
			} finally {
			        // 释放悲观读锁
				stampedLock.unlockRead(stamp); 
			}
		} 
		return Math.sqrt(currentX*currentX + currentY*currentY);
	}
	
	// 方法三：悲观读锁以及读锁升级写锁的使用
	void moveIfAtOrigin(double newX,double newY) {
		// 悲观读锁
		long stamp = stampedLock.readLock(); 
		try {
			while (x == 0.0 && y == 0.0) {
			        // 读锁转换为写锁
				long ws = stampedLock.tryConvertToWriteLock(stamp); 
				// 条件判断是否转换成功
				if (ws != 0L) { 
					// 锁升级
					stamp = ws; 
					x = newX;
					y = newY;
					break;
				} else {
				        // 转换失败释放读锁
					stampedLock.unlockRead(stamp); 
					// 强制获取写锁
					stamp = stampedLock.writeLock(); 
				}
			}
		} finally {
		        // 释放所有锁
			stampedLock.unlock(stamp); 
		}
	}
}
```

## 参考文献<br>

[1].https://blog.csdn.net/ryo1060732496/article/details/109253430<br>
[2].https://www.jianshu.com/p/27b61935b07a<br>
[3].https://www.cnblogs.com/Booker808-java/p/8724598.html<br>
[4].https://www.cnblogs.com/ten951/p/6590579.html<br>
