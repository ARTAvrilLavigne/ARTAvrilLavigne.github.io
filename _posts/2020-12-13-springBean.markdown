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
            <img id="springBean" src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/1.png?raw=true" alt="springBean"/>
	</a>
</div>

　　从上面的流程图中，可以看到一个 Bean 加载会经历这么几个阶段（用绿色标记）：<br>

* `获取 BeanName`：对传入的 name 进行解析，转化为可以从 Map 中获取到 BeanDefinition 的 bean name。<br>
* `合并 Bean 定义`：对父类的定义进行合并和覆盖，如果父类还有父类，会进行递归合并，以获取完整的 Bean 定义信息。<br>
* `实例化`：使用构造或者工厂方法创建 Bean 实例。<br>
* `属性填充`：寻找并且注入依赖，依赖的 Bean 还会递归调用 getBean 方法获取。<br>
* `初始化`：调用自定义的初始化方法。<br>
* `获取最终的Bean`：如果是 FactoryBean 需要调用 getObject 方法，如果需要类型转换调用 TypeConverter 进行转化。<br>

　　整个流程最为复杂的是对循环依赖的解决，下一节3.3会进行细节分析。<br>
  
## 三、细节分析<br>

### 3.1、转化BeanName<br>

　　解析完配置文件后创建的Map，使用的是 beanName 作为 key。如下DefaultListableBeanFactory：<br>
  
```
/** Map of bean definition objects, keyed by bean name */
private final Map<String, BeanDefinition> beanDefinitionMap = new ConcurrentHashMap<String, BeanDefinition>(256);
```

　　BeanFactory.getBean 中传入的 name，有可能是这几种情况：<br>
* `bean name`，可以直接获取到定义 BeanDefinition。<br>
* `alias name`，别名，需要转化。<br>
* `factorybean name, 带 & 前缀`，通过它获取 BeanDefinition 的时候需要去除 & 前缀。<br>

　　为了能够获取到正确的BeanDefinition，需要先对 name 做一个转换，得到 beanName。如下所示：<br>
<div>
	<a class="fancybox_mydefine" rel="group" href="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/2.png?raw=true">
            <img id="beanName" src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/2.png?raw=true" alt="beanName"/>
	</a>
</div>

转化类：AbstractBeanFactory.doGetBean如下所示：<br>

```
protected <T> T doGetBean ... {
    ...
    
    // 转化工作 
    final String beanName = transformedBeanName(name);
    ...
}
```

如果是`alias name`，在解析阶段，alias name 和 bean name 的映射关系被注册到 SimpleAliasRegistry 中。从该注册器中取到 beanName。如下SimpleAliasRegistry.canonicalName：<br>

```
public String canonicalName(String name) {
    ...
    resolvedName = this.aliasMap.get(canonicalName);
    ...
}
```

如果是`factorybean name`，表示这是个工厂 bean，有携带前缀修饰符 & 的，直接把前缀去掉。如下BeanFactoryUtils.transformedBeanName：<br>

```
public static String transformedBeanName(String name) {
    Assert.notNull(name, "'name' must not be null");
    String beanName = name;
    while (beanName.startsWith(BeanFactory.FACTORY_BEAN_PREFIX)) {
        beanName = beanName.substring(BeanFactory.FACTORY_BEAN_PREFIX.length());
    }
    return beanName;
}
```

### 3.2、合并RootBeanDefinition<br>

　　从配置文件读取到的 BeanDefinition 是 GenericBeanDefinition。它的记录了一些当前类声明的属性或构造参数，但是对于父类只用了一个`parentName`来记录。<br>

```
public class GenericBeanDefinition extends AbstractBeanDefinition {
    ...
    private String parentName;
    ...
}
```

　　接下来会发现一个问题，在后续实例化 Bean 的时候，使用的 BeanDefinition 是 RootBeanDefinition 类型而非 GenericBeanDefinition。这是为什么？<br>
　　答案很明显，GenericBeanDefinition 在有继承关系的情况下，定义的信息不足：<br>

* 如果不存在继承关系，GenericBeanDefinition 存储的信息是完整的，可以直接转化为 RootBeanDefinition。<br>
* 如果存在继承关系，GenericBeanDefinition 存储的是 增量信息 而不是 全量信息。<br>

　　为了能够正确初始化对象，需要完整的信息才行。需要递归`合并父类的定义`：<br>
<div>
	<a class="fancybox_mydefine" rel="group" href="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/3.png?raw=true">
            <img id="BeanDefinition" src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/3.png?raw=true" alt="BeanDefinition"/>
	</a>
</div>

　　如下`AbstractBeanFactory.doGetBean`：<br>

```
protected <T> T doGetBean ... {
    ...
    
    // 合并父类定义
    final RootBeanDefinition mbd = getMergedLocalBeanDefinition(beanName);
        
    ...
        
    // 使用合并后的定义进行实例化
    bean = getObjectForBeanInstance(prototypeInstance, name, beanName, mbd);
        
    ...
}
```

　　在判断`parentName`存在的情况下，说明存在父类定义，启动合并。如果父类还有父类怎么办？递归调用，继续合并。如下`AbstractBeanFactory.getMergedBeanDefinition`方法：<br>

```
    protected RootBeanDefinition getMergedBeanDefinition(
            String beanName, BeanDefinition bd, BeanDefinition containingBd)
            throws BeanDefinitionStoreException {

        ...
        
        String parentBeanName = transformedBeanName(bd.getParentName());

        ...
        
        // 递归调用，继续合并父类定义
        pbd = getMergedBeanDefinition(parentBeanName);
        
        ...

        // 使用合并后的完整定义，创建 RootBeanDefinition
        mbd = new RootBeanDefinition(pbd);
        
        // 使用当前定义，对 RootBeanDefinition 进行覆盖
        mbd.overrideFrom(bd);

        ...
        return mbd;
    
    }
```

　　每次合并完父类定义后，都会调用`RootBeanDefinition.overrideFrom`对父类的定义进行覆盖，获取到当前类能够正确实例化的**全量信息**。<br>

### 3.3、处理循环依赖<br>

　　循环依赖概念：如下图所示例子，这里有三个类 A、B、C，然后 A 关联 B，B 关联 C，C 又关联 A，这就形成了一个循环依赖。如果是方法调用是不算循环依赖的，循环依赖必须要持有引用。<br>
<div>
	<a class="fancybox_mydefine" rel="group" href="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/4.png?raw=true">
            <img id="BeanDefinition" src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/4.png?raw=true" alt="BeanDefinition"/>
	</a>
</div>

　　循环依赖根据注入的时机分成两种类型：<br>
* `构造器循环依赖`：依赖的对象是通过构造器传入的，发生在实例化 Bean 的时候。<br>
* `设值循环依赖`：依赖的对象是通过 setter 方法传入的，对象已经实例化，发生属性填充和依赖注入的时候。<br>

　　**如果是构造器循环依赖，本质上是无法解决的。**比如我们调用 A 的构造器，发现依赖 B，于是去调用 B 的构造器进行实例化，发现又依赖 C，于是调用 C 的构造器去初始化，结果依赖 A，整个形成一个死结，导致 A 无法创建。<br>
　　**如果是设值循环依赖，Spring 框架只支持单例下的设值循环依赖。**Spring 通过对还在创建过程中的单例，缓存并提前暴露该单例，使得其他实例可以引用该依赖。<br>

### 3.3.1、原型模式的循环依赖<br>

　　**Spring不支持原型模式的任何循环依赖。**检测到循环依赖会直接抛出 BeanCurrentlyInCreationException 异常。<br>
　　使用了一个ThreadLocal变量`prototypesCurrentlyInCreation`来记录当前线程正在创建中的 Bean 对象，见`AbtractBeanFactory#prototypesCurrentlyInCreation`：<br>

```
/** Names of beans that are currently in creation */

private final ThreadLocal<Object> prototypesCurrentlyInCreation =
            new NamedThreadLocal<Object>("Prototype beans currently in creation");
```

　　在 Bean 创建前进行记录，在 Bean 创建后删除记录。见`AbstractBeanFactory.doGetBean`：<br>

```
...
if (mbd.isPrototype()) {
    // It's a prototype -> create a new instance.
    Object prototypeInstance = null;
    try {
    
        // 添加记录
        beforePrototypeCreation(beanName);
        prototypeInstance = createBean(beanName, mbd, args);
    }
    finally {
        // 删除记录
        afterPrototypeCreation(beanName);
    }
    bean = getObjectForBeanInstance(prototypeInstance, name, beanName, mbd);
}
...     
```

其中`AbtractBeanFactory.beforePrototypeCreation`的记录操作：<br>

```
    protected void beforePrototypeCreation(String beanName) {
        Object curVal = this.prototypesCurrentlyInCreation.get();
        if (curVal == null) {
            this.prototypesCurrentlyInCreation.set(beanName);
        }
        else if (curVal instanceof String) {
            Set<String> beanNameSet = new HashSet<String>(2);
            beanNameSet.add((String) curVal);
            beanNameSet.add(beanName);
            this.prototypesCurrentlyInCreation.set(beanNameSet);
        }
        else {
            Set<String> beanNameSet = (Set<String>) curVal;
            beanNameSet.add(beanName);
        }
    }
```

而`AbtractBeanFactory.beforePrototypeCreation`的删除记录操作：<br>

```
    protected void afterPrototypeCreation(String beanName) {
        Object curVal = this.prototypesCurrentlyInCreation.get();
        if (curVal instanceof String) {
            this.prototypesCurrentlyInCreation.remove();
        }
        else if (curVal instanceof Set) {
            Set<String> beanNameSet = (Set<String>) curVal;
            beanNameSet.remove(beanName);
            if (beanNameSet.isEmpty()) {
                this.prototypesCurrentlyInCreation.remove();
            }
        }
    }
```

　　为了节省内存空间，在单个元素时 prototypesCurrentlyInCreation 只记录 String 对象，在有多个依赖元素时改用 Set 集合。这里是 Spring 使用的一个节约内存的小技巧。接着看看读取以及判断循环的方式。这里要分两种情况讨论。<br>
* 构造函数循环依赖。<br>
* 设置循环依赖。<br>

　　1、如果是构造函数依赖的，比如 A 的构造函数依赖了 B，会有这样的情况。实例化 A 的阶段中，匹配到要使用的构造函数，发现构造函数有参数 B，会使用 BeanDefinitionValueResolver 来检索 B 的实例。如下`BeanDefinitionValueResolver.resolveReference`：我们发现这里继续调用`beanFactory.getBean`去加载 B。<br>

```
private Object resolveReference(Object argName, RuntimeBeanReference ref) {

    ...
    Object bean = this.beanFactory.getBean(refName);
    ...
}
```

　　2、如果是设值循环依赖的，比如我们这里不提供构造函数，并且使用了 @Autowired 的方式(还有其他设值方式就不一一举例了)注解依赖：<br>

```
public class A {
    @Autowired
    private B b;
    ...
}
```

　　加载过程中，找到无参数构造函数，不需要检索构造参数的引用，实例化成功。接着执行下去，进入到属性填充阶段`AbtractBeanFactory.populateBean`，在这里会进行 B 的依赖注入。为了能够获取到 B 的实例化后的引用，最终会通过检索类 DependencyDescriptor 中去把依赖读取出来，如下`DependencyDescriptor.resolveCandidate`：发现`beanFactory.getBean`方法又被调用到了。<br>

```
public Object resolveCandidate(String beanName, Class<?> requiredType, BeanFactory beanFactory)
            throws BeansException {
    return beanFactory.getBean(beanName, requiredType);
}
```

　　**在这里，两种循环依赖达成了统一。**无论是构造函数的循环依赖还是设置循环依赖，在需要注入依赖的对象时，会继续调用`beanFactory.getBean`去加载对象，形成一个递归操作。而每次调用` beanFactory.getBean`进行实例化前后，都使用了 prototypesCurrentlyInCreation 这个变量做记录。按照这里的思路走，整体效果等同于**建立依赖对象的构造链。**其中原型模式的循环依赖之
prototypesCurrentlyInCreation 中的值的变化如下：<br>
<div>
	<a class="fancybox_mydefine" rel="group" href="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/5.png?raw=true">
            <img id="BeanDefinition" src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/5.png?raw=true" alt="BeanDefinition"/>
	</a>
</div>

　　调用判定的地方在`AbstractBeanFactory.doGetBean`中，所有对象的实例化均会从这里启动。如下所示：<br>

```
// Fail if we're already creating this bean instance:
// We're assumably within a circular reference.

if (isPrototypeCurrentlyInCreation(beanName)) {
    throw new BeanCurrentlyInCreationException(beanName);
}
```

　　判定的实现方法为如下所示`AbstractBeanFactory.isPrototypeCurrentlyInCreation`：<br>

```
protected boolean isPrototypeCurrentlyInCreation(String beanName) {
    Object curVal = this.prototypesCurrentlyInCreation.get();
    return (curVal != null &&
        (curVal.equals(beanName) || (curVal instanceof Set && ((Set<?>) curVal).contains(beanName))));
}
```

　　所以在原型模式下，构造函数循环依赖和设值循环依赖，本质上使用同一种方式检测出来。Spring无法解决，直接抛出 BeanCurrentlyInCreationException 异常。<br>
  
### 3.3.2、单例模式的构造循环依赖<br>

　　**Spring也不支持单例模式的构造循环依赖。**检测到构造循环依赖也会抛出 BeanCurrentlyInCreationException 异常。<br>
　　和原型模式相似，单例模式也用了一个数据结构来记录正在创建中的 beanName。如下`DefaultSingletonBeanRegistry`:<br>

```
/** Names of beans that are currently in creation */
private final Set<String> singletonsCurrentlyInCreation =
            Collections.newSetFromMap(new ConcurrentHashMap<String, Boolean>(16));
```

　　这会在创建前进行记录，创建化后删除记录。如下`DefaultSingletonBeanRegistry.getSingleton`:<br>

```
public Object getSingleton(String beanName, ObjectFactory<?> singletonFactory) {
        ...
        
        // 记录正在加载中的 beanName
        beforeSingletonCreation(beanName);
        ...
        // 通过 singletonFactory 创建 bean
        singletonObject = singletonFactory.getObject();
        ...
        // 删除正在加载中的 beanName
        afterSingletonCreation(beanName);
        
}
```

　　记录和判定的方式如下`DefaultSingletonBeanRegistry.beforeSingletonCreation`：<br>

```
    protected void beforeSingletonCreation(String beanName) {
        if (!this.inCreationCheckExclusions.contains(beanName) && !this.singletonsCurrentlyInCreation.add(beanName)) {
            throw new BeanCurrentlyInCreationException(beanName);
        }
    }
```


　　这里会尝试往`singletonsCurrentlyInCreation`记录当前实例化的 bean。我们知道 singletonsCurrentlyInCreation 的数据结构是 Set，是不允许重复元素的，所以一旦前面记录了，这里的 add 操作将会返回失败。<br> 
　　比如加载 A 的单例，和原型模式类似，单例模式也会调用匹配到要使用的构造函数，发现构造函数有参数 B，然后使用 BeanDefinitionValueResolver 来检索 B 的实例，根据上面的分析，继续调用 beanFactory.getBean 方法。所以拿 A，B，C 的例子来举例 singletonsCurrentlyInCreation 的变化，这里可以看到和原型模式的循环依赖判断方式的算法是一样：<br>
<div>
	<a class="fancybox_mydefine" rel="group" href="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/6.png?raw=true">
            <img id="BeanDefinition" src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/6.png?raw=true" alt="BeanDefinition"/>
	</a>
</div>
* 加载 A。记录 singletonsCurrentlyInCreation = [a]，构造依赖 B，开始加载 B。<br>
* 加载 B，记录 singletonsCurrentlyInCreation = [a, b]，构造依赖 C，开始加载 C。<br>
* 加载 C，记录 singletonsCurrentlyInCreation = [a, b, c]，构造依赖 A，又开始加载 A。<br>
* 加载 A，执行到 DefaultSingletonBeanRegistry.beforeSingletonCreation ，singletonsCurrentlyInCreation 中 a 已经存在了，检测到构造循环依赖，直接抛出异常结束操作。<br>

### 3.3.3、单例模式的设值循环依赖<br>

　　**单例模式下，构造函数的循环依赖无法解决，但设值循环依赖是可以解决的。**<br>
　　这里有一个重要的设计：**提前暴露创建中的单例**。拿上面的 A、B、C 的的设值依赖做分析，如下所示：<br>
* => 1. A 创建 -> A 构造完成，开始注入属性，发现依赖 B，启动 B 的实例化<br>
* => 2. B 创建 -> B 构造完成，开始注入属性，发现依赖 C，启动 C 的实例化<br>
* => 3. C 创建 -> C 构造完成，开始注入属性，发现依赖 A<br>
　　重点来了，在我们的阶段 1中， A 已经构造完成，Bean 对象在堆中也分配好内存了，即使后续往 A 中填充属性（比如填充依赖的 B 对象），也不会修改到 A 的引用地址。所以，这个时候是否可以`提前拿 A 实例的引用来先注入到 C `，去完成 C 的实例化，于是流程变成如下这样:<br>
* => 3. C 创建 -> C 构造完成，开始注入依赖，发现依赖 A，发现 A 已经构造完成，直接引用，完成 C 的实例化。<br>
* => 4. C 完成实例化后，B 注入 C 也完成实例化，A 注入 B 也完成实例化。<br>
　　这就是 Spring 解决单例模式设值循环依赖应用的技巧。单例模式创建流程图如下所示为：<br>
<div>
	<a class="fancybox_mydefine" rel="group" href="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/7.png?raw=true">
            <img id="BeanDefinition" src="https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2020-12-13-springBean/7.png?raw=true" alt="BeanDefinition"/>
	</a>
</div>
　　为了能够实现单例的提前暴露。Spring 使用了三级缓存，如下`DefaultSingletonBeanRegistry`：<br>

```
/** Cache of singleton objects: bean name --> bean instance */
private final Map<String, Object> singletonObjects = new ConcurrentHashMap<String, Object>(256);

/** Cache of singleton factories: bean name --> ObjectFactory */
private final Map<String, ObjectFactory<?>> singletonFactories = new HashMap<String, ObjectFactory<?>>(16);

/** Cache of early singleton objects: bean name --> bean instance */
private final Map<String, Object> earlySingletonObjects = new HashMap<String, Object>(16);
```

　　这三个缓存的区别如下：<br>
* `singletonObjects`，单例缓存，存储已经实例化完成的单例。<br>
* `singletonFactories`，生产单例的工厂的缓存，存储工厂。<br>
* `earlySingletonObjects`，提前暴露的单例缓存，这时候的单例刚刚创建完，但还会注入依赖。<br>

　　从`getBean("a")`开始，添加的 SingletonFactory 具体实现如下：<br>

```
protected Object doCreateBean ...  {

    ...
    addSingletonFactory(beanName, new ObjectFactory<Object>() {
        @Override
        public Object getObject() throws BeansException {
            return getEarlyBeanReference(beanName, mbd, bean);
        }
    });
    ...
}
```

　　可以看到如果使用该 SingletonFactory 获取实例，使用的是`getEarlyBeanReference`方法，返回一个未初始化的引用。<br>
　　读取缓存的地方如下`DefaultSingletonBeanRegistry`:<br>

```
protected Object getSingleton(String beanName, boolean allowEarlyReference) {
    Object singletonObject = this.singletonObjects.get(beanName);
    if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
        synchronized (this.singletonObjects) {
            singletonObject = this.earlySingletonObjects.get(beanName);
            if (singletonObject == null && allowEarlyReference) {
                ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
                if (singletonFactory != null) {
                    singletonObject = singletonFactory.getObject();
                    this.earlySingletonObjects.put(beanName, singletonObject);
                    this.singletonFactories.remove(beanName);
                }
            }
        }
    }
    return (singletonObject != NULL_OBJECT ? singletonObject : null);
}
```

　　先尝试从`singletonObjects`和`singletonFactory`读取，没有数据，然后尝试`singletonFactories`读取`singletonFactory`，执行`getEarlyBeanReference`获取到引用后，存储到` earlySingletonObjects`中。<br>
　　这个`earlySingletonObjects`的好处是，如果此时又有其他地方尝试获取未初始化的单例，可以从`earlySingletonObjects`直接取出而不需要再调用`getEarlyBeanReference`。<br>
　　从流程图上看，实际上注入 C 的 A 实例，还在填充属性阶段，并没有完全地初始化。等递归回溯回去，A 顺利拿到依赖 B，才会真实地完成 A 的加载。<br>








## 参考文献<br>

[1].https://www.jianshu.com/p/9ea61d204559<br>
[2].https://www.cnblogs.com/wyq178/p/11415877.html<br>
[3].https://blog.csdn.net/whp404/article/details/81412417<br>
