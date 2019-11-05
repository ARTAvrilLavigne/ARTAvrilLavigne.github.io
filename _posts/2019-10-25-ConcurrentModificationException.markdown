---
layout:     post
title:      "集合遍历时ConcurrentModificationException异常"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2019-10-25 20:50:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - java
---
## 一、异常说明<br>

　　今天晚上下班途中同事讨论到使用HashMap遍历时删除key抛出异常报错的问题，搜索一些博文总结如下。在Java开发过程中，使用`iterator`或者`foreach`遍历集合的同时对集合进行修改(增加或删除)就会抛出`java.util.ConcurrentModificationException`异常，现在就以ArrayList(或者HashMap等集合)为例分析这种异常的出现。如下所示：<br>

```
public class Test {
    public static void main(String[] args) {
        ArrayList<Integer> arrayList = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            arrayList.add(Integer.valueOf(i));
        }

        // 复现异常方法一
        Iterator<Integer> iterator = arrayList.iterator();
        while (iterator.hasNext()) {
            Integer integer = iterator.next();
            if (integer.intValue() == 5) {
                arrayList.remove(integer);
            }
        }

        // 复现异常方法二
        for (Integer value : arrayList) {
            if (value == 5) {
                arrayList.remove(value);
            }
        }
    }
}
执行结果抛出异常：
Exception in thread "main" java.util.ConcurrentModificationException
	at java.util.ArrayList$Itr.checkForComodification(ArrayList.java:901)
	at java.util.ArrayList$Itr.next(ArrayList.java:851)
	at com.test.Test.main(Test.java:17)
```

## 二、单线程下问题分析及解决<br>

　　复现异常方法一中使用`Iterator`遍历ArrayList，抛出异常的是iterator.next()。看下Iterator next方法实现源码：<br>

```
public E next() {
            checkForComodification();
            int i = cursor;
            if (i >= size)
                throw new NoSuchElementException();
            Object[] elementData = ArrayList.this.elementData;
            if (i >= elementData.length)
                throw new ConcurrentModificationException();
            cursor = i + 1;
            return (E) elementData[lastRet = i];
        }

        final void checkForComodification() {
            if (modCount != expectedModCount)
                throw new ConcurrentModificationException();
        }
```

　　在next方法中首先调用了checkForComodification方法，该方法会判断modCount是否等于expectedModCount，不等于就会抛出java.util.ConcurrentModificationExcepiton异常。接下来跟踪看一下modCount和expectedModCount的赋值和修改。modCount是ArrayList的一个属性，继承自抽象类AbstractList，用于表示ArrayList对象被修改次数。<br>

```
protected transient int modCount = 0;
```

　　整个ArrayList中修改modCount的方法比较多，有add、remove、clear、ensureCapacityInternal等，凡是设计到ArrayList对象修改的都会自增modCount属性。在创建Iterator的时候会将modCount赋值给expectedModCount，在遍历ArrayList过程中，没有其他地方可以设置expectedModCount了，因此遍历过程中expectedModCount会一直保持初始值20(调用add方法添加了20个元素，修改了20次)。<br>
  
```
int expectedModCount = modCount; // 创建对象时初始化
```

　　遍历的时候是不会触发modCount自增的，但是遍历到value == 5的时候，执行了一次arrayList.remove(value)，这行代码执行后modCount++变为了21，但此时的expectedModCount仍然为20。<br>

```
final void checkForComodification() {
          if (modCount != expectedModCount)
             throw new ConcurrentModificationException();
}
```

　　在执行next方法时，遇到modCount != expectedModCount方法，导致抛出异常java.util.ConcurrentModificationException。明白了抛出异常的过程，但是为什么要这么做呢？很明显这么做是为了阻止程序员在不允许修改的时候修改对象，起到保护作用，避免出现未知异常。**Iterator 是工作在一个独立的线程中，并且拥有一个 mutex 锁。Iterator 被创建之后会建立一个指向原来对象的单链索引表，当原来的对象数量发生变化时，这个索引表的内容不会同步改变。当索引指针往后移动的时候就找不到要迭代的对象，所以按照 fail-fast 原则 Iterator 会马上抛出 java.util.ConcurrentModificationException 异常。所以 Iterator 在工作的时候是不允许被迭代的对象被改变的。但你可以使用 Iterator 本身的方法 remove() 来删除对象，Iterator.remove()方法会在删除当前迭代对象的同时维护索引的一致性。**<br>

　　再来分析下第二种`foreach`循环抛异常的源码：<br>

```
public void forEach(Consumer<? super E> action) {
        Objects.requireNonNull(action);
        final int expectedModCount = modCount;
        @SuppressWarnings("unchecked")
        final E[] elementData = (E[]) this.elementData;
        final int size = this.size;
        for (int i=0; modCount == expectedModCount && i < size; i++) {
            action.accept(elementData[i]);
        }
        if (modCount != expectedModCount) {
            throw new ConcurrentModificationException();
        }
    }
```

　　在foreach循环中一开始也是对expectedModCount采用modCount进行赋值。在进行for循环时每次都会有判定条件modCount == expectedModCount，当执行完arrayList.remove(value)之后，该判定条件返回false退出循环，然后执行if语句，结果同样抛出java.util.ConcurrentModificationException异常。因此上述两种复现异常方法都是同一个原因导致的。<br>

### 2.1、解决方法<br>

代码如下所示：<br>

```
public class Test {
    public static void main(String[] args) {
        ArrayList<Integer> arrayList = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            arrayList.add(Integer.valueOf(i));
        }

        Iterator<Integer> iterator = arrayList.iterator();
        while (iterator.hasNext()) {
            Integer integer = iterator.next();
            if (integer.intValue() == 5) {
                iterator.remove();//调用iterator的remove方法即可
            }
        }
    }
}
```

　　通过调用iterator的remove方法就能避免抛出ConcurrentModificationException异常，其remove方法源码如下：<br>

```
public void remove() {
            if (lastRet < 0)
                throw new IllegalStateException();
            checkForComodification();

            try {
                ArrayList.this.remove(lastRet);
                cursor = lastRet;
                lastRet = -1;
                expectedModCount = modCount;
            } catch (IndexOutOfBoundsException ex) {
                throw new ConcurrentModificationException();
            }
        }
```

　　在iterator.remove()方法中，同样调用了ArrayList自身的remove方法，但是调用完之后并非就return了，而是expectedModCount = modCount重置了expectedModCount值，使二者的值继续保持相等。针对forEach循环并没有修复方案，因此在遍历过程中同时需要修改ArrayList对象，则需要`采用iterator遍历`或者`对于hashmap集合采用使用ConcurrentHashMap解决`。上面提出的解决方案调用的是iterator.remove()方法，如果不仅仅是想调用remove方法移除元素，还想增加元素，或者替换元素，是否可以呢？查看Iterator源码可以发现这是不行的，Iterator只提供了remove方法。但是ArrayList实现了ListIterator接口，ListIterator接口继承了Iterator接口，这些操作都是可以实现的，使用示例如下：<br>

```
//对于ArrayList集合可以使用Iterator的remove方法解决
public class Test {
    public static void main(String[] args) {
        ArrayList<Integer> arrayList = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            arrayList.add(Integer.valueOf(i));
        }

        ListIterator<Integer> iterator = arrayList.listIterator();
        while (iterator.hasNext()) {
            Integer integer = iterator.next();
            if (integer.intValue() == 5) {
                iterator.set(Integer.valueOf(6));
                iterator.remove();
                iterator.add(integer);
            }
        }
    }
}

//对于HashMap集合可以使用ConcurrentHashMap解决
public class Test1 {
    public static void main(String[] args) {
        ConcurrentHashMap<String, String> concurrentHashMap = new ConcurrentHashMap<>();
        concurrentHashMap.put("aa","avrillavigne");
        concurrentHashMap.put("bb","IU");
        concurrentHashMap.put("cc","sasakinozomi");
        concurrentHashMap.put("dd","SongJiHyo");
        concurrentHashMap.put("ee","SongHyeKyo");
        for (String key : concurrentHashMap.keySet()) {
            System.out.println("concurrent");
            if(key.equals("bb")){
                concurrentHashMap.remove("bb");
            }
        }
    }
}
```

## 三、多线程下问题分析及解决<br>

```
public class Test {
    public static void main(String[] args) {
        ArrayList<Integer> arrayList = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            arrayList.add(Integer.valueOf(i));
        }

        Thread thread1 = new Thread(new Runnable() {
            @Override
            public void run() {
                ListIterator<Integer> iterator = arrayList.listIterator(); //使用ArrayList实现的listIterator接口
                while (iterator.hasNext()) {
                    System.out.println("thread1 " + iterator.next().intValue());
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        });

        Thread thread2 = new Thread(new Runnable() {
            @Override
            public void run() {
                ListIterator<Integer> iterator = arrayList.listIterator(); //使用ArrayList实现的listIterator接口
                while (iterator.hasNext()) {
                    System.out.println("thread2 " + iterator.next().intValue());
                    iterator.remove();
                }
            }
        });
        
        thread1.start();
        thread2.start();
    }
}

执行结果：
thread1 0
thread2 0
thread2 1
thread2 2
thread2 3
thread2 4
thread2 5
thread2 6
thread2 7
thread2 8
thread2 9
thread2 10
thread2 11
thread2 12
thread2 13
thread2 14
thread2 15
thread2 16
thread2 17
thread2 18
thread2 19
Exception in thread "Thread-0" java.util.ConcurrentModificationException
	at java.util.ArrayList$Itr.checkForComodification(ArrayList.java:901)
	at java.util.ArrayList$Itr.next(ArrayList.java:851)
	at com.snow.ExceptionTest$1.run(ExceptionTest.java:74)
	at java.lang.Thread.run(Thread.java:745)
  
```

　　虽然使用了ArrayList实现的listIterator接口，但在多线程中从上面代码执行结果可以看出thread2遍历结束后，thread1 sleep完1000ms准备遍历第二个元素，next的时候抛出异常了。我们从时间点分析一下抛异常的原因：两个thread都是使用的同一个arrayList，thread2修改完后modCount = 21，此时thread2的expectedModCount = 21 可以一直遍历到结束；thread1的expectedModCount仍然为20，因为thread1的expectedModCount只是在初始化的时候赋值，其后并未被修改过。因此当arrayList的modCount被thread2修改为21之后，thread1想继续遍历必定会抛出异常了。在这个示例代码里面，两个thread，每个thread都有自己的iterator，当thread2通过iterator方法修改expectedModCount必定不会被thread1感知到。这个跟ArrayList非线程安全是无关的，即使这里面的ArrayList换成Vector也是一样的结果，测试代码如下：<br>

```
public class Test {
    public static void main(String[] args) {
        Vector<Integer> vector = new Vector<>();
        for (int i = 0; i < 20; i++) {
            vector.add(Integer.valueOf(i));
        }

        Thread thread1 = new Thread(new Runnable() {
            @Override
            public void run() {
                ListIterator<Integer> iterator = vector.listIterator();
                while (iterator.hasNext()) {
                    System.out.println("thread1 " + iterator.next().intValue());
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        });

        Thread thread2 = new Thread(new Runnable() {
            @Override
            public void run() {
                ListIterator<Integer> iterator = vector.listIterator();
                while (iterator.hasNext()) {
                    Integer integer = iterator.next();
                    System.out.println("thread2 " + integer.intValue());
                    if (integer.intValue() == 5) {
                        iterator.remove();
                    }
                }
            }
        });
        
        thread1.start();
        thread2.start();
    }
}
执行结果：
thread1 0
thread2 0
thread2 1
thread2 2
thread2 3
thread2 4
thread2 5
thread2 6
thread2 7
thread2 8
thread2 9
thread2 10
thread2 11
thread2 12
thread2 13
thread2 14
thread2 15
thread2 16
thread2 17
thread2 18
thread2 19
Exception in thread "Thread-0" java.util.ConcurrentModificationException
	at java.util.Vector$Itr.checkForComodification(Vector.java:1184)
	at java.util.Vector$Itr.next(Vector.java:1137)
	at com.snow.ExceptionTest$3.run(ExceptionTest.java:112)
	at java.lang.Thread.run(Thread.java:745)

```

### 3.1、解决方法<br>

　　可以在iterator遍历过程中加同步锁，锁住整个arrayList即可解决。代码如下：<br>

```
public class Test {
    public static void main(String[] args) {
        ArrayList<Integer> arrayList = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            arrayList.add(Integer.valueOf(i));
        }

        Thread thread1 = new Thread(new Runnable() {
            @Override
            public void run() {
                synchronized (arrayList) { //加锁
                    ListIterator<Integer> iterator = arrayList.listIterator();
                    while (iterator.hasNext()) {
                        System.out.println("thread1 " + iterator.next().intValue());
                        try {
                            Thread.sleep(100);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        });

        Thread thread2 = new Thread(new Runnable() {
            @Override
            public void run() {
                synchronized (arrayList) {  //加锁
                    ListIterator<Integer> iterator = arrayList.listIterator();
                    while (iterator.hasNext()) {
                        Integer integer = iterator.next();
                        System.out.println("thread2 " + integer.intValue());
                        if (integer.intValue() == 5) {
                            iterator.remove();
                        }
                    }
                }
            }
        });
        
        thread1.start();
        thread2.start();
    }
}
```

　　这种方案本质上是将多线程通过加锁来转变为单线程操作，确保同一时间内只有一个线程去使用iterator遍历arrayList，其它线程等待，效率显然是只有单线程的效率。<br>

## 四、为什么要这样做？<br>

　　Iterator 是工作在一个独立的线程中，并且拥有一个 mutex 锁。 Iterator 被创建之后会建立一个指向原来对象的单链索引表，当原来的对象数量发生变化时，这个索引表的内容不会同步改变，所以当索引指针往后移动的时候就找不到要迭代的对象，所以按照 fail-fast 原则 Iterator 会马上抛出 java.util.ConcurrentModificationException 异常。所以 Iterator 在工作的时候是不允许被迭代的对象被改变的。但你可以使用 Iterator 本身的方法 remove() 来删除对象，Iterator.remove() 方法会在删除当前迭代对象的同时维护索引的一致性。<br>
　　如果你的 Collection / Map 对象实际只有一个元素的时候， ConcurrentModificationException 异常并不会被抛出。这也就是为什么在 javadoc 里面指出： it would be wrong to write a program that depended on this exception for its correctness: ConcurrentModificationException should be used only to detect bugs.<br>
　　下面是 fail-fast的介绍:<br>
　　An iterator is considered fail-fast if it throws a ConcurrentModificationException under either of the following two conditions:<br>
　　1.In multithreaded processing: if one thread is trying to modify a Collection while another thread is iterating over it.<br>

　　2.In single-threaded or in multithreaded processing: if after the creation of the Iterator, the container is modified at any time by any method other than the Iterator's own remove or add methods.<br>
　　Note in particular what is implied by the second condition: After we create a container's iterator, during a loop that iterates over the container we must only use the remove (and when applicable add) methods defined for the iterator and that we must NOT use the same methods defined for the container itself. To illustrate this point, suppose we declare and initialize a List in the following manner:<br>
```
　　　　List list = new ArrayList();
　　　　list.add("Peter");
　　　　list.add("Paul");
　　　　list.add("Mary");
```
　　Let's say we wish to iterate over this list. We'd need to declare a ListIterator as follows:<br>
```
　　　　ListIterator iter = list.listIterator();
```
　　Having created this iterator, we could now set up a loop like: 
```
　　　　while(iter1.hasNext()){
　　　　　　String str = iter1.next();
　　　　　　// do something with str
　　　　}
```
　　Because iter is fail-fast, we are not allowed to invoke List's add or remove methods inside the loop. Inside the loop, we are only allowed to use ListIterator's add and remove methods. This makes sense because it is the Iterator object that knows where it is in a List as the List is being scanned. The List object itself would have no idea of that.<br>
  
　　The Iterators supported by all the work-horse container classes, such as ArrayList, LinkedList, TreeSet, and HashSet, are fail-fast. The Iterator type retrofitted to the older container class Vector is also fail-fast. For associative containers, such as HashMap and the older HashTable, the Iterator type for the Collections corresponding to either the keys or the values or the <key, value> pairs are fail-fast with respect to the container itself. That means that even if you are iterating over, say, just the keys of the container, any illegal concurrent modifications to the underlying container would be detected.<br>

　　One final note regarding iterators versus enumerations: It is also possible to use an Enumeration object returned by the elements() method for iterating over the older container types such as Vector. However, Enumerations do not provide a fail-fast method. On the other hand, the more modern Iterator returned by a Vector's iterator() and listIterator() methods are fail-fast. Hence, iterators are recommended over enumerations for iterating over the elements of the older container types.<br>

## 五、为什么ConcurrentHashMap不会出现ConcurrentModificationException异常<br>


## 六、参考博客<br>
1、https://www.cnblogs.com/snowater/p/8024776.html<br>
2、https://www.iteye.com/blog/lz12366-675016<br>
3、https://www.cnblogs.com/xiayudashan/p/10180413.html<br>
