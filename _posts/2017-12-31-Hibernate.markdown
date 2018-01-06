---
layout:     post
title:      "Hibernate框架总结"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2017-12-31 18:46:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - javaee
---  
## Hibernate框架第一天 ##

----------

**学习路线**
	
	1. 使用Hibernate框架完成对客户的增删改查的操作
	
----------
	
**教学导航**
	
	1. 能够说出Hibernate的执行流程
	2. 能够独立使用Hibernate框架完成增删改查的操作
	
----------
	
**框架和CRM项目的整体介绍**
	
	1. 什么是CRM
		* CRM（Customer Relationship Management）客户关系管理，是利用相应的信息技术以及互联网技术来协调企业与顾客间在销售、营销和服务上的交互，向客户提供创新式的个性化的客户交互和服务的过程
		* 其最终目标是将面向客户的各项信息和活动集成起来，组建一个以客户为中心的企业，实现对面向客户的活动的全面管理
	
	2. CRM的模块
		* CRM系统实现了对企业销售、营销、服务等各阶段的客户信息、客户活动进行统一管理。
		* CRM系统功能涵盖企业销售、营销、用户服务等各各业务流程，业务流程中与客户相关活动都会在CRM系统统一管理。
		* 下边列出一些基本的功能模块，包括：
			* 客户信息管理
			* 联系人管理
			* 商机管理
			* 统计分析等
	
![Image text](https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2017-12-31-Hibernate/01-CRM%E6%A8%A1%E5%9D%97.png?raw=true)
	
	3. 模块的具体功能
		* 客户信息管理
			* 对客户信息统一维护，客户是指存量客户或拟营销的客户，通过员工录入形成公司的“客户库”是公司最重要的数据资源。
		
		* 联系人管理
			* 对客户的联系人信息统一管理，联系人是指客户企业的联系人，即企业的业务人员和客户的哪些人在打交道。
		
		* 客户拜访管理
			* 业务员要开发客户需要去拜访客户，客户拜访信息记录了业务员与客户沟通交流方面的不足、采取的策略不当、有待改进的地方或值得分享的沟通技巧等方面的信息。
		
		* 综合查询
			* 客户相关信息查询，包括：客户信息查询、联系人信息查询、商机信息查询等
		
		* 统计分析
			* 按分类统计客户信息，包括：客户信息来源统计、按行业统计客户、客户发展数量统计等
		
		* 系统管理
			系统管理属于crm系统基础功能模块，包括：数据字典、账户管理、角色管理、权限管理、操作日志管理等
	
![Image text](https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2017-12-31-Hibernate/02-SSH%E6%A1%86%E6%9E%B6.png?raw=true)
	
----------

**Hibernate框架的学习路线**
	
	1. 注意：Hibernate框架知识点非常多，比较杂乱，大家要做好笔记记录的工作
	2. 学习的路线
		* 第一天：主要是学习框架的入门，自己搭建框架，完成增删改查的操作
		* 第二天：主要学习一级缓存、事务管理和基本的查询
		* 第三天：主要学习一对多和多对多的操作等
		* 第四天：基本查询和查询的优化

![Image text](https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2017-12-31-Hibernate/03-Hibernate%E7%9A%84%E5%BC%80%E5%8F%91%E4%BD%8D%E7%BD%AE.png?raw=true)
	
----------

### 案例一：完成客户的CRUD的操作 ###

----------

**需求分析**
	
	1. CRM系统中客户信息管理模块功能包括
		* 新增客户信息
		* 客户信息查询
		* 修改客户信息
		* 删除客户信息
	
	2. 要实现客户的新增功能
	
----------
	
### 技术分析之Hibernate框架的概述 ###
	
----------
	
**Hibernate框架的概述**
	
	1. Hibernate框架的概述
		* Hibernate称为
		* Hibernate是一个开放源代码的对象关系映射（ORM）框架，它对JDBC进行了非常轻量级的对象封装，使得Java程序员可以随心所欲的使用对象编程思维来操纵数据库。 
		* Hibernate可以应用在任何使用JDBC的场合，既可以在Java的客户端程序使用，也可以在Servlet/JSP的Web应用中使用。
		* Hibernate是轻量级JavaEE应用的持久层解决方案，是一个关系数据库ORM框架
	
	2. 记住：Hibernate是一个持久层的ORM框架！！！
	
----------
	
**什么是ORM（对象关系映射）**
	
	1. ORM映射：Object Relational Mapping
		* O：面向对象领域的Object（JavaBean对象）
		* R：关系数据库领域的Relational（表的结构）
		* M：映射Mapping（XML的配置文件）
	
	2. 简单一句话：Hibernate使程序员通过操作对象的方式来操作数据库表记录
	
![Image text](https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2017-12-31-Hibernate/04-ORM%E6%A6%82%E8%BF%B0.png?raw=true)
	
----------
	
**Hibernate优点**
	
	1. 优点
		* Hibernate对JDBC访问数据库的代码做了封装，大大简化了数据访问层繁琐的重复性代码
		* Hibernate是一个基于jdbc的主流持久化框架，是一个优秀的orm实现，它很大程度的简化了dao层编码工作
		* Hibernate的性能非常好，因为它是一个轻量级框架。映射的灵活性很出色。它支持很多关系型数据库，从一对一到多对多的各种复杂关系
	
----------
	
### 技术分析之Hibernate框架的快速入门 ###
	
----------

**第一步：下载Hibernate5的运行环境**
	
	1. 下载相应的jar包等
		* http://sourceforge.net/projects/hibernate/files/hibernate-orm/5.0.7.Final/hibernate-release-5.0.7.Final.zip/download	
	
	2. 解压后对目录结构有一定的了解

----------

**第二步：创建表结构**
	
	1. 建表语句如下
		Create database hibernate_day01;
		Use hibernate_day01;
		CREATE TABLE `cst_customer` (
		  `cust_id` bigint(32) NOT NULL AUTO_INCREMENT COMMENT '客户编号(主键)',
		  `cust_name` varchar(32) NOT NULL COMMENT '客户名称(公司名称)',
		  `cust_user_id` bigint(32) DEFAULT NULL COMMENT '负责人id',
		  `cust_create_id` bigint(32) DEFAULT NULL COMMENT '创建人id',
		  `cust_source` varchar(32) DEFAULT NULL COMMENT '客户信息来源',
		  `cust_industry` varchar(32) DEFAULT NULL COMMENT '客户所属行业',
		  `cust_level` varchar(32) DEFAULT NULL COMMENT '客户级别',
		  `cust_linkman` varchar(64) DEFAULT NULL COMMENT '联系人',
		  `cust_phone` varchar(64) DEFAULT NULL COMMENT '固定电话',
		  `cust_mobile` varchar(16) DEFAULT NULL COMMENT '移动电话',
		  PRIMARY KEY (`cust_id`)
		) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8;

----------

**第三步：搭建Hibernate的开发环境**
	
	1. 创建WEB工程，引入Hibernate开发所需要的jar包
		* MySQL的驱动jar包
		* Hibernate开发需要的jar包（资料/hibernate-release-5.0.7.Final/lib/required/所有jar包）
		* 日志jar包（资料/jar包/log4j/所有jar包）
	
----------
	
**第四步：编写JavaBean实体类**
	
	1. Customer类的代码如下：
		public class Customer {
			private Long cust_id;
			private String cust_name;
			private Long cust_user_id;
			private Long cust_create_id;
			private String cust_source;
			private String cust_industry;
			private String cust_level;
			private String cust_linkman;
			private String cust_phone;
			private String cust_mobile;
			// 省略get和set方法
		}

----------

**第五步：创建类与表结构的映射**
	
	1. 在JavaBean所在的包下创建映射的配置文件
		* 默认的命名规则为：实体类名.hbm.xml
		* 在xml配置文件中引入约束（引入的是hibernate3.0的dtd约束，不要引入4的约束）
			<!DOCTYPE hibernate-mapping PUBLIC 
			    "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
			    "http://www.hibernate.org/dtd/hibernate-mapping-3.0.dtd">
	
	2. 特殊情况：如果电脑不能上网，编写配置文件时alt+/是没有提示的，需要自己来配置使用本地的DTD
		* 先复制http://www.hibernate.org/dtd/hibernate-mapping-3.0.dtd --> window --> preferences --> 搜索xml --> 选择xml catalog --> 点击add --> key type选择URI --> 粘贴复制的地址 --> 选择location，选择本地的DTD的路径
	
	3. 编写映射的配置文件
		<?xml version="1.0" encoding="UTF-8"?>
		<!DOCTYPE hibernate-mapping PUBLIC 
		    "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
		    "http://www.hibernate.org/dtd/hibernate-mapping-3.0.dtd">
		
		<hibernate-mapping>
			<class name="com.itheima.domain.Customer" table="cst_customer">
				<id name="cust_id" column="cust_id">
					<generator class="native"/>
				</id>
				<property name="cust_name" column="cust_name"/>
				<property name="cust_user_id" column="cust_user_id"/>
				<property name="cust_create_id" column="cust_create_id"/>
				<property name="cust_source" column="cust_source"/>
				<property name="cust_industry" column="cust_industry"/>
				<property name="cust_level" column="cust_level"/>
				<property name="cust_linkman" column="cust_linkman"/>
				<property name="cust_phone" column="cust_phone"/>
				<property name="cust_mobile" column="cust_mobile"/>
			</class>
		</hibernate-mapping>
	
----------
	
**第六步：编写Hibernate核心的配置文件**
	
	1. 在src目录下，创建名称为hibernate.cfg.xml的配置文件
	2. 在XML中引入DTD约束
		<!DOCTYPE hibernate-configuration PUBLIC
			"-//Hibernate/Hibernate Configuration DTD 3.0//EN"
			"http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd">
	
	3. 打开：资料/hibernate-release-5.0.7.Final/project/etc/hibernate.properties，可以查看具体的配置信息	
		* 必须配置的4大参数					
			#hibernate.connection.driver_class com.mysql.jdbc.Driver
			#hibernate.connection.url jdbc:mysql:///test
			#hibernate.connection.username gavin
			#hibernate.connection.password
		
		* 数据库的方言（必须配置的）
			#hibernate.dialect org.hibernate.dialect.MySQLDialect
		
		* 可选的配置
			#hibernate.show_sql true
			#hibernate.format_sql true
			#hibernate.hbm2ddl.auto update
		
		* 引入映射配置文件（一定要注意，要引入映射文件，框架需要加载映射文件）
			* <mapping resource="com/itheima/domain/Customer.hbm.xml"/>				
	
	4. 具体的配置如下
		<?xml version="1.0" encoding="UTF-8"?>
		<!DOCTYPE hibernate-configuration PUBLIC
			"-//Hibernate/Hibernate Configuration DTD 3.0//EN"
			"http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd">
		
		<hibernate-configuration>
			<session-factory>
				<property name="hibernate.connection.driver_class">com.mysql.jdbc.Driver</property>
				<property name="hibernate.connection.url">jdbc:mysql:///hibernate_day01</property>
				<property name="hibernate.connection.username">root</property>
				<property name="hibernate.connection.password">root</property>
				<property name="hibernate.dialect">org.hibernate.dialect.MySQLDialect</property>
				
				<mapping resource="com/itheima/domain/Customer.hbm.xml"/>
			</session-factory>
		</hibernate-configuration>

----------

**第七步：编写Hibernate入门代码**	

	1. 具体的代码如下
		/**
		 * 测试保存客户
		 */
		@Test
		public void testSave(){
			// 先加载配置文件
			Configuration config = new Configuration();
			// 默认加载src目录下的配置文件
			config.configure();
			// 创建SessionFactory对象
			SessionFactory factory = config.buildSessionFactory();
			// 创建session对象
			Session session = factory.openSession();
			// 开启事务
			Transaction tr = session.beginTransaction();
			// 编写保存代码
			Customer c = new Customer();
			// c.setCust_id(cust_id);	已经自动递增
			c.setCust_name("测试名称");
			c.setCust_mobile("110");
			// 保存客户
			session.save(c);
			// 提交事务
			tr.commit();
			// 释放资源
			session.close();
			factory.close();
		}

----------

**回忆：快速入门**

	1. 下载Hibernate框架的开发包
	2. 编写数据库和表结构
	3. 创建WEB的项目，导入了开发的jar包
		* MySQL驱动包、Hibernate开发的必须要有的jar包、日志的jar包
	4. 编写JavaBean，以后不使用基本数据类型，使用包装类Long、Integer等
	5. 编写映射的配置文件（核心），先导入开发的约束，里面正常配置标签
	6. 编写hibernate的核心的配置文件，里面的内容是固定的
	7. 编写代码，使用的类和方法

----------

### 技术分析之：Hibernate常用的配置文件 ###

----------

**Hibernate配置文件之映射配置文件**
	
	1. 映射文件，即Stu.hbm.xml的配置文件
		* <class>标签		-- 用来将类与数据库表建立映射关系
			* name			-- 类的全路径
			* table			-- 表名.(类名与表名一致,那么table属性也可以省略)
			* catalog		-- 数据库的名称，基本上都会省略不写
		
		* <id>标签			-- 用来将类中的属性与表中的主键建立映射，id标签就是用来配置主键的。
			* name			-- 类中属性名
			* column 		-- 表中的字段名.(如果类中的属性名与表中的字段名一致,那么column可以省略.)
			* length		-- 字段的程度，如果数据库已经创建好了，那么length可以不写。如果没有创建好，生成表结构时，length最好指定。
		
		* <property>		-- 用来将类中的普通属性与表中的字段建立映射.
			* name			-- 类中属性名
			* column		-- 表中的字段名.(如果类中的属性名与表中的字段名一致,那么column可以省略.)
			* length		-- 数据长度
			* type			-- 数据类型（一般都不需要编写，如果写需要按着规则来编写）
				* Hibernate的数据类型	type="string"
				* Java的数据类型		type="java.lang.String"
				* 数据库字段的数据类型	<column name="name" sql-type="varchar"/>

----------

**Hibernate配置文件之核心配置文件**
	
	1. 核心配置文件的两种方式
		* 第一种方式是属性文件的形式，即properties的配置文件
			* hibernate.properties
				* hibernate.connection.driver_class=com.mysql.jdbc.Driver
			* 缺点
				* 不能加载映射的配置文件，需要手动编写代码去加载
		
		* 第二种方式是XML文件的形式，开发基本都会选择这种方式
			* hibernate.cfg.xml
				* <property name="hibernate.connection.driver_class" >com.mysql.jdbc.Driver</property>
			* 优点
				* 格式比较清晰
				* 编写有提示
				* 可以在该配置文件中加载映射的配置文件（最主要的）
	
	2. 关于hibernate.cfg.xml的配置文件方式
		* 必须有的配置
			* 数据库连接信息:
				hibernate.connection.driver_class  			-- 连接数据库驱动程序
				hibernate.connection.url   					-- 连接数据库URL
				hibernate.connection.username  				-- 数据库用户名
				hibernate.connection.password   			-- 数据库密码
			
			* 方言:
				hibernate.dialect   						-- 操作数据库方言
		
		* 可选的配置
			* hibernate.show_sql							-- 显示SQL
			* hibernate.format_sql							-- 格式化SQL
			* hibernate.hbm2ddl.auto						-- 通过映射转成DDL语句
				* create				-- 每次都会创建一个新的表.---测试的时候
				* create-drop			-- 每次都会创建一个新的表,当执行结束之后,将创建的这个表删除.---测试的时候
				* update				-- 如果有表,使用原来的表.没有表,创建一个新的表.同时更新表结构.
				* validate				-- 如果有表,使用原来的表.同时校验映射文件与表中字段是否一致如果不一致就会报错.
		
		* 加载映射
			* 如果XML方式：<mapping resource="cn/itcast/hibernate/domain/User.hbm.xml" />
	
----------
	
### 技术分析之Hibernate常用的接口和类 ###
	
----------
	
**Configuration类和作用**
	
	1. Configuration类
		* Configuration对象用于配置并且启动Hibernate。
		* Hibernate应用通过该对象来获得对象-关系映射文件中的元数据，以及动态配置Hibernate的属性，然后创建SessionFactory对象。
		
		* 简单一句话：加载Hibernate的配置文件，可以获取SessionFactory对象。
	
	2. Configuration类的其他应用（了解）
		* 加载配置文件的种类，Hibernate支持xml和properties类型的配置文件，在开发中基本都使用XML配置文件的方式。
			* 如果采用的是properties的配置文件，那么通过Configuration configuration = new Configuration();就可以加载配置文件
				* 但是还需要自己手动加载映射文件
				* 例如：config.addResource("cn/itcast/domain/Student.hbm.xml");
			
			* 如果采用的XML的配置文件，通过Configuration configuration = new Configuration().configure();加载配置文件即可
	
----------
	
**SessionFactory：重要**
	
	1. 是工厂类，是生成Session对象的工厂类
	2. SessionFactory类的特点
		* 由Configuration通过加载配置文件创建该对象。
		* SessionFactory对象中保存了当前的数据库配置信息和所有映射关系以及预定义的SQL语句。同时，SessionFactory还负责维护Hibernate的二级缓存。
			* 预定义SQL语句
				* 使用Configuration类创建了SessionFactory对象是，已经在SessionFacotry对象中缓存了一些SQL语句
				* 常见的SQL语句是增删改查（通过主键来查询）
				* 这样做的目的是效率更高
		
		* 一个SessionFactory实例对应一个数据库，应用从该对象中获得Session实例。
		* SessionFactory是线程安全的，意味着它的一个实例可以被应用的多个线程共享。
		* SessionFactory是重量级的，意味着不能随意创建或销毁它的实例。如果只访问一个数据库，只需要创建一个SessionFactory实例，且在应用初始化的时候完成。
		* SessionFactory需要一个较大的缓存，用来存放预定义的SQL语句及实体的映射信息。另外可以配置一个缓存插件，这个插件被称之为Hibernate的二级缓存，被多线程所共享
	
	3. 总结
		* 一般应用使用一个SessionFactory,最好是应用启动时就完成初始化。
	
![Image text](https://github.com/ARTAvrilLavigne/ARTAvrilLavigne.github.io/blob/master/myblog/2017-12-31-Hibernate/05-SessionFactory.png?raw=true)	
	
----------
	
**编写HibernateUtil的工具类**
	
	1. 具体代码如下
		public class HibernateUtil {
			private static final Configuration cfg;
			private static final SessionFactory factory;
			static{
				// 给常量赋值 
				// 加载配置文件
				cfg = new Configuration().configure();
				// 生成factory对象
				factory = cfg.buildSessionFactory();
			}
			// 获取Session对象
			public static Session openSession(){
				return factory.openSession();
			}
		}
	
----------
	
**Session接口**
	
	1. 概述
		* Session是在Hibernate中使用最频繁的接口。也被称之为持久化管理器。它提供了和持久化有关的操作，比如添加、修改、删除、加载和查询实体对象
		* Session 是应用程序与数据库之间交互操作的一个单线程对象，是 Hibernate 运作的中心
		* Session是线程不安全的
		* 所有持久化对象必须在 session 的管理下才可以进行持久化操作
		* Session 对象有一个一级缓存，显式执行 flush 之前，所有的持久化操作的数据都缓存在 session 对象处
		* 持久化类与 Session 关联起来后就具有了持久化的能力
	
	2. 特点
		* 不是线程安全的。应避免多个线程使用同一个Session实例
		* Session是轻量级的，它的创建和销毁不会消耗太多的资源。应为每次客户请求分配独立的Session实例
		* Session有一个缓存，被称之为Hibernate的一级缓存。每个Session实例都有自己的缓存
	
	3. 常用的方法
		* save(obj)
		* delete(obj)  
		* get(Class,id)
		* update(obj)
		* saveOrUpdate(obj)					-- 保存或者修改（如果没有数据，保存数据。如果有，修改数据）
		* createQuery() 					-- HQL语句的查询的方式
	
----------
	
**Transaction接口**
	
	1. Transaction是事务的接口
	2. 常用的方法
		* commit()				-- 提交事务
		* rollback()			-- 回滚事务
	
	3. 特点
		* Hibernate框架默认情况下事务不自动提交.需要手动提交事务
		* 如果没有开启事务，那么每个Session的操作，都相当于一个独立的事务
	
----------
	
**开发步骤**
	
	1. 准备环境
		* 在资料/crm/ui/WebRoot下所有的文件，拷贝到工程中
		* JSP页面会报错，因为缺jstl包  导入JSTL的标签库jar包即可
	
----------
	
**编写代码**

----------
## Hibernate框架第二天 ##

----------

**课程回顾：Hibernate框架的第一天**

	1. Hibernate框架的概述：ORM
	2. 框架的入门的程序
		* 编写映射的配置文件
		* 编写核心的配置文件
		* 编写程序
	
	3. 配置的文件
	4. 使用的接口和方法

----------
	
**今天内容**
	
	1. Hibernate持久化对象的状态
	2. Hibernate的一级缓存
	3. Hibernate操作持久化对象的方法
	4. Hibernate的基本查询
	
----------
	
### Hibernate的持久化类 ###
	
----------
	
**什么是持久化类**
	
	1. 持久化类:就是一个Java类（咱们编写的JavaBean），这个Java类与表建立了映射关系就可以成为是持久化类。
		* 持久化类 = JavaBean + xxx.hbm.xml
	
----------
	
**持久化类的编写规则**
	
	1. 提供一个无参数 public访问控制符的构造器				-- 底层需要进行反射.
	2. 提供一个标识属性，映射数据表主键字段					-- 唯一标识OID.数据库中通过主键.Java对象通过地址确定对象.持久化类通过唯一标识OID确定记录
	3. 所有属性提供public访问控制符的 set或者get 方法
	4. 标识属性应尽量使用基本数据类型的包装类型
	
----------
	
**区分自然主键和代理主键**
	
	1. 创建表的时候
		* 自然主键:对象本身的一个属性.创建一个人员表,每个人都有一个身份证号.(唯一的)使用身份证号作为表的主键.自然主键.（开发中不会使用这种方式）
		* 代理主键:不是对象本身的一个属性.创建一个人员表,为每个人员单独创建一个字段.用这个字段作为主键.代理主键.（开发中推荐使用这种方式）
	
	2. 创建表的时候尽量使用代理主键创建表
	
----------
	
**主键的生成策略**
	
	1. increment:适用于short,int,long作为主键.   不是使用的数据库自动增长机制.
		* Hibernate中提供的一种增长机制.  
			* 先进行主键最大值的查询	:select max(id) from user;
			* 再进行插入	:获得最大值+1作为新的记录的主键.
		
		* 问题:不能在集群环境下或者有并发访问的情况下使用.
	
	2. identity:适用于short,int,long作为主键。但是这个必须使用在有自动增长数据库中.采用的是数据库底层的自动增长机制.  适用于MySQL
		* 底层使用的是数据库的自动增长(auto_increment).像Oracle数据库没有自动增长.
	
	3. sequence:适用于short,int,long作为主键.底层使用的是序列的增长方式.   适用于Oracle
		* Oracle数据库底层没有自动增长,想自动增长需要使用序列.
	
	4. uuid:适用于char,varchar类型的作为主键.(开发)
		* 使用随机的字符串作为主键.
	
	5. native:本地策略.根据底层的数据库不同,自动选择适用于该种数据库的生成策略.(short,int,long)  (开发)
		* 如果底层使用的MySQL数据库:相当于identity.
		* 如果底层使用Oracle数据库:相当于sequence.
	
	6. assigned:主键的生成不用Hibernate管理了.必须手动设置主键.	

----------

### Hibernate持久化对象的状态 ###
	
----------
	
**持久化对象的状态**
	
	1. Hibernate的持久化类
		* 持久化类:Java类与数据库的某个表建立了映射关系.这个类就称为是持久化类.
			* 持久化类 = Java类 + hbm的配置文件
	
	2. Hibernate的持久化类的状态
		* Hibernate为了管理持久化类：将持久化类分成了三个状态
			* 瞬时态:Transient  Object
				* 没有持久化标识OID, 没有被纳入到Session对象的管理.
			
			* 持久态:Persistent Object
				* 有持久化标识OID,已经被纳入到Session对象的管理.
			
			* 脱管态:Detached Object
				* 有持久化标识OID,没有被纳入到Session对象的管理.
	
----------
	
**Hibernate持久化对象的状态的转换**
	
	1. 瞬时态	-- 没有持久化标识OID, 没有被纳入到Session对象的管理
		* 获得瞬时态的对象
			* User user = new User()
		* 瞬时态对象转换持久态
			* save()/saveOrUpdate();
		* 瞬时态对象转换成脱管态
			* user.setId(1)
	
	2. 持久态	-- 有持久化标识OID,已经被纳入到Session对象的管理
		* 获得持久态的对象
			* get()/load();
		* 持久态转换成瞬时态对象
			* delete();  --- 比较有争议的，进入特殊的状态(删除态:Hibernate中不建议使用的)
		* 持久态对象转成脱管态对象
			* session的close()/evict()/clear();
	
	3. 脱管态	-- 有持久化标识OID,没有被纳入到Session对象的管理
		* 获得托管态对象:不建议直接获得脱管态的对象.
			* User user = new User();
			* user.setId(1);
		* 脱管态对象转换成持久态对象
			* update();/saveOrUpdate()/lock();
		* 脱管态对象转换成瞬时态对象
			* user.setId(null);
	
	4. 注意：持久态对象有自动更新数据库的能力!!!

![](./图片/01-三个状态转换.bmp)	
	
----------
	
### Hibernate的一级缓存 ###
	
----------
	
**Session对象的一级缓存（重点）**
	
	1. 什么是缓存？
		* 其实就是一块内存空间,将数据源（数据库或者文件）中的数据存放到缓存中.再次获取的时候 ,直接从缓存中获取.可以提升程序的性能！
	
	2. Hibernate框架提供了两种缓存
		* 一级缓存	-- 自带的不可卸载的.一级缓存的生命周期与session一致.一级缓存称为session级别的缓存.
		* 二级缓存	-- 默认没有开启，需要手动配置才可以使用的.二级缓存可以在多个session中共享数据,二级缓存称为是sessionFactory级别的缓存.
	
	3. Session对象的缓存概述
		* Session接口中,有一系列的java的集合,这些java集合构成了Session级别的缓存(一级缓存).将对象存入到一级缓存中,session没有结束生命周期,那么对象在session中存放着
		* 内存中包含Session实例 --> Session的缓存（一些集合） --> 集合中包含的是缓存对象！
	
	4. 证明一级缓存的存在，编写查询的代码即可证明
		* 在同一个Session对象中两次查询，可以证明使用了缓存
	
	5. Hibernate框架是如何做到数据发生变化时进行同步操作的呢？
		* 使用get方法查询User对象
		* 然后设置User对象的一个属性，注意：没有做update操作。发现，数据库中的记录也改变了。
		* 利用快照机制来完成的（SnapShot）
	
![](./图片/02-Session的快照机制.bmp)	
	
----------
	
**控制Session的一级缓存（了解）**
	
	1. 学习Session接口中与一级缓存相关的方法
		* Session.clear()						-- 清空缓存。
		* Session.evict(Object entity)			-- 从一级缓存中清除指定的实体对象。
		* Session.flush()						-- 刷出缓存
	
----------
	
### Hibernate中的事务与并发 ###
	
----------
	
**事务相关的概念**
	
	1. 什么是事务
		* 事务就是逻辑上的一组操作，组成事务的各个执行单元，操作要么全都成功，要么全都失败.
		* 转账的例子：冠希给美美转钱，扣钱，加钱。两个操作组成了一个事情！
	
	2. 事务的特性
		* 原子性	-- 事务不可分割.
		* 一致性	-- 事务执行的前后数据的完整性保持一致.
		* 隔离性	-- 一个事务执行的过程中,不应该受到其他的事务的干扰.
		* 持久性	-- 事务一旦提交,数据就永久保持到数据库中.
	
	3. 如果不考虑隔离性:引发一些读的问题
		* 脏读			-- 一个事务读到了另一个事务未提交的数据.
		* 不可重复读	-- 一个事务读到了另一个事务已经提交的update数据,导致多次查询结果不一致.
		* 虚读			-- 一个事务读到了另一个事务已经提交的insert数据,导致多次查询结构不一致.
	
	4. 通过设置数据库的隔离级别来解决上述读的问题
		* 未提交读:以上的读的问题都有可能发生.
		* 已提交读:避免脏读,但是不可重复读，虚读都有可能发生.
		* 可重复读:避免脏读，不可重复读.但是虚读是有可能发生.
		* 串行化:以上读的情况都可以避免.
	
	5. 如果想在Hibernate的框架中来设置隔离级别，需要在hibernate.cfg.xml的配置文件中通过标签来配置
		* 通过：hibernate.connection.isolation = 4 来配置
		* 取值
			* 1—Read uncommitted isolation
			* 2—Read committed isolation
			* 4—Repeatable read isolation
			* 8—Serializable isolation
	
----------
	
**丢失更新的问题**
	
	1. 如果不考虑隔离性，也会产生写入数据的问题，这一类的问题叫丢失更新的问题。
	2. 例如：两个事务同时对某一条记录做修改，就会引发丢失更新的问题。
		* A事务和B事务同时获取到一条数据，同时再做修改
		* 如果A事务修改完成后，提交了事务
		* B事务修改完成后，不管是提交还是回滚，如果不做处理，都会对数据产生影响
	
	3. 解决方案有两种
		* 悲观锁  效率低
			* 采用的是数据库提供的一种锁机制，如果采用做了这种机制，在SQL语句的后面添加 for update 子句
				* 当A事务在操作该条记录时，会把该条记录锁起来，其他事务是不能操作这条记录的。
				* 只有当A事务提交后，锁释放了，其他事务才能操作该条记录
		
		* 乐观锁
			* 采用版本号的机制来解决的。会给表结构添加一个字段version=0，默认值是0
				* 当A事务在操作完该条记录，提交事务时，会先检查版本号，如果发生版本号的值相同时，才可以提交事务。同时会更新版本号version=1.
				* 当B事务操作完该条记录时，提交事务时，会先检查版本号，如果发现版本不同时，程序会出现错误。
	
	4. 使用Hibernate框架解决丢失更新的问题
		* 悲观锁
			* 使用session.get(Customer.class, 1,LockMode.UPGRADE); 方法
		
		* 乐观锁
			* 1.在对应的JavaBean中添加一个属性，名称可以是任意的。例如：private Integer version; 提供get和set方法
			* 2.在映射的配置文件中，提供<version name="version"/>标签即可。
	
![](./图片/03-丢失更新.bmp)	
	
----------
	
**绑定本地的Session**
	
	1. 之前在讲JavaWEB的事务的时候，需要在业务层使用Connection来开启事务，
		* 一种是通过参数的方式传递下去
		* 另一种是把Connection绑定到ThreadLocal对象中
	
	2. 现在的Hibernate框架中，使用session对象开启事务，所以需要来传递session对象，框架提供了ThreadLocal的方式
		* 需要在hibernate.cfg.xml的配置文件中提供配置
			* <property name="hibernate.current_session_context_class">thread</property>
		
		* 重新修改一下HibernateUtil的工具类，使用SessionFactory的getCurrentSession()方法，获取当前的Session对象。并且该Session对象不用手动关闭，线程结束了，会自动关闭。
			添加新的一个方法：
			public static Session getCurrentSession(){
				return factory.getCurrentSession();
			}
		
		* 注意：想使用getCurrentSession()方法，必须要先配置才能使用。
	
----------
	
### Hibernate框架的查询方式 ###

----------

**Query查询接口**
	
	1. 具体的查询代码如下
		// 1.查询所有记录
		/*Query query = session.createQuery("from Customer");
		List<Customer> list = query.list();
		System.out.println(list);*/
		
		// 2.条件查询:
		/*Query query = session.createQuery("from Customer where name = ?");
		query.setString(0, "李健");
		List<Customer> list = query.list();
		System.out.println(list);*/
		
		// 3.条件查询:
		/*Query query = session.createQuery("from Customer where name = :aaa and age = :bbb");
		query.setString("aaa", "李健");
		query.setInteger("bbb", 38);
		List<Customer> list = query.list();
		System.out.println(list);*/
	
----------
	
**Criteria查询接口（做条件查询非常合适）**
	
	1. 具体的查询代码如下
		// 1.查询所有记录
		/*Criteria criteria = session.createCriteria(Customer.class);
		List<Customer> list = criteria.list();
		System.out.println(list);*/
		
		// 2.条件查询
		/*Criteria criteria = session.createCriteria(Customer.class);
		criteria.add(Restrictions.eq("name", "李健"));
		List<Customer> list = criteria.list();
		System.out.println(list);*/
		
		// 3.条件查询
		/*Criteria criteria = session.createCriteria(Customer.class);
		criteria.add(Restrictions.eq("name", "李健"));
		criteria.add(Restrictions.eq("age", 38));
		List<Customer> list = criteria.list();
		System.out.println(list);*/
	
----------
	
## Hibernate框架第三天 ##

----------

**课程回顾：Hibernate第二天**
	
	1. 持久化类和一级缓存
		* 持久化类：JavaBean + 映射的配置文件
		* 持久化对象的三种状态
			* 瞬时态
			* 持久态：有自动更新数据的能力
			* 托管态
		* Session的一级缓存，快照机制	
		* 主键的生成策略
	
	2. 管理事务
		* 设置隔离级别
		* 丢失更新的问题，乐观锁：添加属性version，配置<version name="version">
		* 绑定本地的Session，事务需要service层开启，dao层需要使用Session对象
	
	3. 查询的接口
		* Query接口：HQL的查询
		* Criteria接口：QBC查询（按条件进行查询）
		
----------
	
**今天内容**
	
	1. Hibernate关联关系映射

----------

### 案例一：完成CRM的联系人的保存操作 ###

----------
	
**需求分析**
	
	1. 因为客户和联系人是一对多的关系，在有客户的情况下，完成联系人的添加保存操作
	
----------
	
**技术分析之Hibernate的关联关系映射之一对多映射（重点）**
	
	1. JavaWEB中一对多的设计及其建表原则
	
	2. 先导入SQL的建表语句
		* 创建今天的数据库：create database hibernate_day03;
		* 在资料中找到客户和联系人的SQL脚本
	
	3. 编写客户和联系人的JavaBean程序（注意一对多的编写规则）
		* 客户的JavaBean如下
			public class Customer {
				private Long cust_id;
				private String cust_name;
				private Long cust_user_id;
				private Long cust_create_id;
				private String cust_source;
				private String cust_industry;
				private String cust_level;
				private String cust_linkman;
				private String cust_phone;
				private String cust_mobile;
				
				private Set<Linkman> linkmans = new HashSet<Linkman>();

			}
		
		* 联系人的JavaBean如下
			public class Linkman {
				private Long lkm_id;
				private String lkm_name;
				private String lkm_gender;
				private String lkm_phone;
				private String lkm_mobile;
				private String lkm_email;
				private String lkm_qq;
				private String lkm_position;
				private String lkm_memo;
				
				private Customer customer;
				
			}
	
	4. 编写客户和联系人的映射配置文件（注意一对多的配置编写）
		* 客户的映射配置文件如下
			<class name="com.itheima.domain.Customer" table="cst_customer">
				<id name="cust_id" column="cust_id">
					<generator class="native"/>
				</id>
				<property name="cust_name" column="cust_name"/>
				<property name="cust_user_id" column="cust_user_id"/>
				<property name="cust_create_id" column="cust_create_id"/>
				<property name="cust_source" column="cust_source"/>
				<property name="cust_industry" column="cust_industry"/>
				<property name="cust_level" column="cust_level"/>
				<property name="cust_linkman" column="cust_linkman"/>
				<property name="cust_phone" column="cust_phone"/>
				<property name="cust_mobile" column="cust_mobile"/>
				
				<set name="linkmans">
					<key column="lkm_cust_id"/>
					<one-to-many class="com.itheima.domain.Linkman"/>
				</set>
			</class>
		
		* 联系人的映射配置文件如下
			<class name="com.itheima.domain.Linkman" table="cst_linkman">
				<id name="lkm_id" column="lkm_id">
					<generator class="native"/>
				</id>
				<property name="lkm_name" column="lkm_name"/>
				<property name="lkm_gender" column="lkm_gender"/>
				<property name="lkm_phone" column="lkm_phone"/>
				<property name="lkm_mobile" column="lkm_mobile"/>
				<property name="lkm_email" column="lkm_email"/>
				<property name="lkm_qq" column="lkm_qq"/>
				<property name="lkm_position" column="lkm_position"/>
				<property name="lkm_memo" column="lkm_memo"/>

				<many-to-one name="customer" class="com.itheima.domain.Customer" column="lkm_cust_id"/>
			</class>
	
----------
	
**技术分析之保存客户和联系人的数据**
	
	1. 进行双向关联进行数据的保存
	
----------
	
**技术分析之级联保存**
	
	1. 测试：如果现在代码只插入其中的一方的数据
		* 如果只保存其中的一方的数据，那么程序会抛出异常。
		* 如果想完成只保存一方的数据，并且把相关联的数据都保存到数据库中，那么需要配置级联！！
		
		* 级联保存是方向性
	
	2. 级联保存效果
		* 级联保存：保存一方同时可以把关联的对象也保存到数据库中！！
		* 使用cascade="save-update"
	
----------
	
**技术分析之级联删除**
	
	1. 先来给大家在数据库中演示含有外键的删除客户功能，那么SQL语句是会报出错误的
		* 例如：delete from customers where cid = 1;
	
	2. 如果使用Hibernate框架直接删除客户的时候，测试发现是可以删除的
	
	3. 上述的删除是普通的删除，那么也可以使用级联删除，注意：级联删除也是有方向性的！！
		* <many-to-one cascade="delete" />
	
----------
	
**技术分析之级联的取值（cascade的取值）和孤儿删除**
	
	1. 需要大家掌握的取值如下
		* none						-- 不使用级联
		* save-update				-- 级联保存或更新
		* delete					-- 级联删除
		* delete-orphan				-- 孤儿删除.(注意：只能应用在一对多关系)
		* all						-- 除了delete-orphan的所有情况.（包含save-update delete）
		* all-delete-orphan			-- 包含了delete-orphan的所有情况.（包含save-update delete delete-orphan）
	
	2. 孤儿删除（孤子删除），只有在一对多的环境下才有孤儿删除
		* 在一对多的关系中,可以将一的一方认为是父方.将多的一方认为是子方.孤儿删除:在解除了父子关系的时候.将子方记录就直接删除。
		* <many-to-one cascade="delete-orphan" />

----------

**技术分析之让某一方放弃外键的维护，为多对多做准备**
	
	1. 先测试双方都维护外键的时候，会产生多余的SQL语句。
		* 想修改客户和联系人的关系，进行双向关联，双方都会维护外键，会产生多余的SQL语句。
		
		* 产生的原因：session的一级缓存中的快照机制，会让双方都更新数据库，产生了多余的SQL语句。
	
	2. 如果不想产生多余的SQL语句，那么需要一方来放弃外键的维护！
		* 在<set>标签上配置一个inverse=”true”.true:放弃.false:不放弃.默认值是false
		* <inverse="true">

----------

**技术分析之cascade和inverse的区别**

	1. cascade用来级联操作（保存、修改和删除）
	2. inverse用来维护外键的

----------

### Hibernate的关联关系映射之多对多映射 ###

----------

**技术分析之多对多的建表原则**

	1. JavaWEB的多对多

----------

**技术分析之多对多JavaBean的编写**
	
	1. 编写用户和角色的JavaBean
		* 用户的JavaBean代码如下
			public class User {
				private Long user_id;
				private String user_code;
				private String user_name;
				private String user_password;
				private String user_state;
				
				private Set<Role> roles = new HashSet<Role>();
			}
		
		* 角色的JavaBean代码如下
			public class Role {
				private Long role_id;
				private String role_name;
				private String role_memo;
				
				private Set<User> users = new HashSet<User>();
			}
	
	2. 用户和角色的映射配置文件如下
		* 用户的映射配置文件如下
			<class name="com.itheima.domain.User" table="sys_user">
				<id name="user_id" column="user_id">
					<generator class="native"/>
				</id>
				<property name="user_code" column="user_code"/>
				<property name="user_name" column="user_name"/>
				<property name="user_password" column="user_password"/>
				<property name="user_state" column="user_state"/>
				
				<set name="roles" table="sys_user_role">
					<key column="user_id"/>
					<many-to-many class="com.itheima.domain.Role" column="role_id"/>
				</set>
			</class>
		
		* 角色的映射配置文件如下
			<class name="com.itheima.domain.Role" table="sys_role">
				<id name="role_id" column="role_id">
					<generator class="native"/>
				</id>
				<property name="role_name" column="role_name"/>
				<property name="role_memo" column="role_memo"/>
				
				<set name="users" table="sys_user_role">
					<key column="role_id"/>
					<many-to-many class="com.itheima.domain.User" column="user_id"/>
				</set>
			</class>
	
	3. 多对多进行双向关联的时候:必须有一方去放弃外键维护权
	
----------
	
**技术分析之多对多的级联保存**
	
	1. 级联保存
		* <set cascade="save-update">
	
----------
	
**级联删除（在多对多中是很少使用的）**
	
	1. 级联删除
	
	
----------

## Hibernate框架的第四天 ##

----------

**回顾：Hibernate框架的第三天**
	
	1. 一对多关联关系映射
		* JavaBean的编写
		* 编写映射的配置文件
		* 使用级联保存、删除、孤儿删除，使用cascade="save-update,delete,delete-orphan"
		* 放弃外键的维护的权力，使用inverse="true"
	
	2. 多对多关联关系映射
		* 保存，必须放弃外键的维护的权力
	
----------
	
**今天内容**
	
	1. Hibernate的查询方式
	2. Hibernate的查询策略
	
----------
	
### 案例一：使用Hibernate完成查询所有联系人功能 ###
	
----------
	
**需求分析**

	1. 完成所有的联系人的查询

----------

**技术分析之Hibernate框架的查询方式**
	
	1. 唯一标识OID的检索方式
		* session.get(对象.class,OID)
	2. 对象的导航的方式
	
	3. HQL的检索方式
		* Hibernate Query Language	-- Hibernate的查询语言
	
	4. QBC的检索方式
		* Query By Criteria	-- 条件查询
	
	5. SQL检索方式（了解）
		* 本地的SQL检索
	
----------
	
**技术分析之HQL的查询方式概述**
	
	1. HQL的介绍
		* HQL(Hibernate Query Language) 是面向对象的查询语言, 它和 SQL 查询语言有些相似
		* 在 Hibernate 提供的各种检索方式中, HQL 是使用最广的一种检索方式
	
	2. HQL与SQL的关系
		* HQL 查询语句是面向对象的,Hibernate负责解析HQL查询语句, 然后根据对象-关系映射文件中的映射信息, 把 HQL 查询语句翻译成相应的 SQL 语句. 
		* HQL 查询语句中的主体是域模型中的类及类的属性
		* SQL 查询语句是与关系数据库绑定在一起的. SQL查询语句中的主体是数据库表及表的字段
	
----------
	
**技术分析之HQL的查询演示**
	
	1. HQL基本的查询格式
		* 支持方法链的编程，即直接调用list()方法
		* 简单的代码如下
			* session.createQuery("from Customer").list();
	
	2. 使用别名的方式
		* 可以使用别名的方式
			* session.createQuery("from Customer c").list();
			* session.createQuery("select c from Customer c").list();
	
	3. 排序查询
		* 排序查询和SQL语句中的排序的语法是一样的
			* 升序
				* session.createQuery("from Customer order by cust_id").list();
			
			* 降序
				* session.createQuery("from Customer order by cust_id desc").list();
	
	4. 分页查询
		* Hibernate框架提供了分页的方法，咱们可以调用方法来完成分页      (当前页-1)*pagesize
		* 两个方法如下
			* setFirstResult(a)		-- 从哪条记录开始，如果查询是从第一条开启，值是0
			* setMaxResults(b)		-- 每页查询的记录条数
			
		* 演示代码如下
			* List<LinkMan> list = session.createQuery("from LinkMan").setFirstResult(0).setMaxResults().list();
	
	5. 带条件的查询
		* setParameter("?号的位置，默认从0开始","参数的值"); 不用考虑参数的具体类型
		* 按位置绑定参数的条件查询（指定下标值，默认从0开始）
		* 按名称绑定参数的条件查询（HQL语句中的 ? 号换成 :名称 的方式）
		* 例如代码如下
			Query query = session.createQuery("from Linkman where lkm_name like ? order by lkm_id desc");
			query.setFirstResult(0).setMaxResults(3);
			query.setParameter(0, "%熊%");
			List<Linkman> list = query.list();
			for (Linkman linkman : list) {
				System.out.println(linkman);
			}
	
----------
	
**HQL的投影查询**
	
	1. 投影查询就是想查询某一字段的值或者某几个字段的值
	2. 投影查询的案例
		* 如果查询多个字段，例如下面这种方式
			List<Object[]> list = session.createQuery("select c.cust_name,c.cust_level from Customer c").list();
			for (Object[] objects : list) {
				System.out.println(Arrays.toString(objects));
			}
		
		* 如果查询两个字段，也可以把这两个字段封装到对象中
			* 先在持久化类中提供对应字段的构造方法
			* 使用下面这种HQL语句的方式
				List<Customer> list = session.createQuery("select new Customer(c.cust_name,c.cust_level) from Customer c").list();
				for (Customer customer : list) {
					System.out.println(customer);
				}
	
----------
	
**技术分析之聚合函数查询**
	
	1. 获取总的记录数
		Session session = HibernateUtils.getCurrentSession();
		Transaction tr = session.beginTransaction();
		List<Number> list = session.createQuery("select count(c) from Customer c").list();
		Long count = list.get(0).longValue();
		System.out.println(count);
		tr.commit();
	
	2. 获取某一列数据的和
		Session session = HibernateUtils.getCurrentSession();
		Transaction tr = session.beginTransaction();
		List<Number> list = session.createQuery("select sum(c.cust_id) from Customer c").list();
		Long count = list.get(0).longValue();
		System.out.println(count);
		tr.commit();
	
----------
	
**技术分析之QBC检索方式**
	
	0. QBC：Query By Criteria  按条件进行查询
	
	1. 简单查询，使用的是Criteria接口
		List<Customer> list = session.createCriteria(Customer.class).list();
		for (Customer customer : list) {
			System.out.println(customer);
		}
	
	2. 排序查询
		* 需要使用addOrder()的方法来设置参数，参数使用org.hibernate.criterion.Order对象
		* 具体代码如下：
			Session session = HibernateUtils.getCurrentSession();
			Transaction tr = session.beginTransaction();
			Criteria criteria = session.createCriteria(Linkman.class);
			// 设置排序
			criteria.addOrder(Order.desc("lkm_id"));
			List<Linkman> list = criteria.list();
			for (Linkman linkman : list) {
				System.out.println(linkman);
			}
			tr.commit();
	
	3. 分页查询
		* QBC的分页查询也是使用两个方法
			* setFirstResult();
			* setMaxResults();
		
		* 代码如下;
			Session session = HibernateUtils.getCurrentSession();
			Transaction tr = session.beginTransaction();
			Criteria criteria = session.createCriteria(Linkman.class);
			// 设置排序
			criteria.addOrder(Order.desc("lkm_id"));
			criteria.setFirstResult(0);
			criteria.setMaxResults(3);
			List<Linkman> list = criteria.list();
			for (Linkman linkman : list) {
				System.out.println(linkman);
			}
			tr.commit();
	
	4. 条件查询（Criterion是查询条件的接口，Restrictions类是Hibernate框架提供的工具类，使用该工具类来设置查询条件）
		* 条件查询使用Criteria接口的add方法，用来传入条件。
		* 使用Restrictions的添加条件的方法，来添加条件，例如：
			* Restrictions.eq			-- 相等
			* Restrictions.gt			-- 大于号
			* Restrictions.ge			-- 大于等于
			* Restrictions.lt			-- 小于
			* Restrictions.le			-- 小于等于
			* Restrictions.between		-- 在之间
			* Restrictions.like			-- 模糊查询
			* Restrictions.in			-- 范围
			* Restrictions.and			-- 并且
			* Restrictions.or			-- 或者
		
		* 测试代码如下
			Session session = HibernateUtils.getCurrentSession();
			Transaction tr = session.beginTransaction();
			Criteria criteria = session.createCriteria(Linkman.class);
			// 设置排序
			criteria.addOrder(Order.desc("lkm_id"));
			// 设置查询条件
			criteria.add(Restrictions.or(Restrictions.eq("lkm_gender", "男"), Restrictions.gt("lkm_id", 3L)));
			List<Linkman> list = criteria.list();
			for (Linkman linkman : list) {
				System.out.println(linkman);
			}
			tr.commit();
	
	5. 聚合函数查询（Projection的聚合函数的接口，而Projections是Hibernate提供的工具类，使用该工具类设置聚合函数查询）
		* 使用QBC的聚合函数查询，需要使用criteria.setProjection()方法
		* 具体的代码如下
			Session session = HibernateUtils.getCurrentSession();
			Transaction tr = session.beginTransaction();
			Criteria criteria = session.createCriteria(Linkman.class);
			criteria.setProjection(Projections.rowCount());
			List<Number> list = criteria.list();
			Long count = list.get(0).longValue();
			System.out.println(count);
			tr.commit();

----------

**技术分析之离线条件查询**
	
	1. 离线条件查询使用的是DetachedCriteria接口进行查询，离线条件查询对象在创建的时候，不需要使用Session对象，只是在查询的时候使用Session对象即可。
	2. 创建离线条件查询对象
		* DetachedCriteria criteria = DetachedCriteria.forClass(Linkman.class);
	
	3. 具体的代码如下
		Session session = HibernateUtils.getCurrentSession();
		Transaction tr = session.beginTransaction();
		
		DetachedCriteria criteria = DetachedCriteria.forClass(Linkman.class);
		// 设置查询条件
		criteria.add(Restrictions.eq("lkm_gender", "男"));
		// 查询数据
		List<Linkman> list = criteria.getExecutableCriteria(session).list();
		for (Linkman linkman : list) {
			System.out.println(linkman);
		}
		tr.commit();

----------
	
**技术分析之SQL查询方式（了解）**
	
	1. 基本语法
		Session session = HibernateUtils.getCurrentSession();
		Transaction tr = session.beginTransaction();
		
		SQLQuery sqlQuery = session.createSQLQuery("select * from cst_linkman where lkm_gender = ?");
		sqlQuery.setParameter(0,"男");
		sqlQuery.addEntity(Linkman.class);
		List<Linkman> list = sqlQuery.list();
		System.out.println(list);
		tr.commit();

----------
	
**技术分析之HQL多表查询**
	
	1. 多表的查询进来使用HQL语句进行查询，HQL语句和SQL语句的查询语法比较类似。
		* 内连接查询
			* 显示内连接
				* select * from customers c inner join orders o on c.cid = o.cno;
			* 隐式内连接
				* select * from customers c,orders o where c.cid = o.cno;
		
		* 外连接查询
			* 左外连接
				* select * from customers c left (outer) join orders o on c.cid = o.cno;
			* 右外连接
				* select * from customers c right (outer) join orders o on c.cid = o.cno;
	
	2. HQL的多表查询
		* 迫切和非迫切：
			* 非迫切返回结果是Object[]
			* 迫切连接返回的结果是对象，把客户的信息封装到客户的对象中，把订单的信息封装到客户的Set集合中。
	
	3. 内连接查询
		* 内连接使用 inner join ，默认返回的是Object数组
			Session session = HibernateUtils.getCurrentSession();
			Transaction tr = session.beginTransaction();
			List<Object[]> list = session.createQuery("from Customer c inner join c.linkmans").list();
			for (Object[] objects : list) {
				System.out.println(Arrays.toString(objects));
			}
			tr.commit();
		
		* 迫切内连接:inner join fetch ，返回的是实体对象
			Session session = HibernateUtils.getCurrentSession();
			Transaction tr = session.beginTransaction();
			List<Customer> list = session.createQuery("from Customer c inner join fetch c.linkmans").list();
			Set<Customer> set = new HashSet<Customer>(list);
			for (Customer customer : set) {
				System.out.println(customer);
			}
			tr.commit();
	
	4. 左外连接查询
		* 左外连接:	封装成List<Object[]>
		
		* 迫切左外连接
			Session session = HibernateUtils.getCurrentSession();
			Transaction tr = session.beginTransaction();
			List<Customer> list = session.createQuery("from Customer c left join fetch c.linkmans").list();
			Set<Customer> set = new HashSet<Customer>(list);
			for (Customer customer : set) {
				System.out.println(customer);
			}
			tr.commit();
	
----------
	
**案例一代码实现**
	
----------
	
### 案例二：对查询功能优化  ###
	
----------
	
**需求分析**
	
	1. 对Hibernate框架的查询进行优化
	
----------
	
**技术分析之延迟加载**
	
	1. 延迟加载先获取到代理对象，当真正使用到该对象中的属性的时候，才会发送SQL语句，是Hibernate框架提升性能的方式
	2. 类级别的延迟加载
		* Session对象的load方法默认就是延迟加载
		* Customer c = session.load(Customer.class, 1L);没有发送SQL语句，当使用该对象的属性时，才发送SQL语句
		
		* 使类级别的延迟加载失效
			* 在<class>标签上配置lazy=”false”
		    * Hibernate.initialize(Object proxy);
	
	3. 关联级别的延迟加载（查询某个客户，当查看该客户下的所有联系人是是否是延迟加载）
		* 默认是延迟加载
			Session session = HibernateUtils.getCurrentSession();
			Transaction tr = session.beginTransaction();
			Customer c = session.get(Customer.class, 1L);
			System.out.println("=============");
			System.out.println(c.getLinkmans().size());
			tr.commit();
	
----------
	
**技术分析之Hibernate框架的查询策略**
	
	1. 查询策略：使用Hibernate查询一个对象的时候，查询其关联对象.应该如何查询.是Hibernate的一种优化手段!!!	
	2. Hibernate框架的检索策略解决的问题
		* 查询的时机
			Customer c1 = (Customer) session.get(Customer.class, 1);
			System.out.println(c1.getLinkmans().size());
			
			* lazy属性解决查询的时机的问题，需要配置是否采用延迟加载！！
		
		* 查询的语句形式
			List<Customer> list = session.createQuery("from Customer").list();
			for(Customer c : list){
				System.out.println(c.getLinkmans());
			}
			
			* fetch属性就可以解决查询语句的形式的问题！！
	
----------
	
**技术分析之在set标签上配置策略**
	
	1. 在<set>标签上使用fetch和lazy属性
		* fetch的取值				-- 控制SQL语句生成的格式
			* select				-- 默认值.发送查询语句
			* join					-- 连接查询.发送的是一条迫切左外连接!!!如果配置了join那么lazy就失效了
			* subselect				-- 子查询.发送一条子查询查询其关联对象.(需要使用list()方法进行测试)
		
		* lazy的取值				-- 查找关联对象的时候是否采用延迟!
			* true					-- 默认.延迟
			* false					-- 不延迟
			* extra					-- 及其懒惰加载
	
	2. set标签上的默认值是fetch="select"和lazy="true"
	
	3. 总结：Hibernate框架都采用了默认值，开发中基本上使用的都是默认值。特殊的情况才用。
	
----------
	
**技术分析之在many-to-one标签上配置策略**
	
	1. 在<many-to-one>标签上使用fetch和lazy属性
		* fetch的取值		-- 控制SQL的格式.
			* select		-- 默认。发送基本select语句查询
			* join			-- 发送迫切左外连接查询
		
		* lazy的取值		-- 控制加载关联对象是否采用延迟.
			* false			-- 不采用延迟加载.
			* proxy			-- 默认值.代理.现在是否采用延迟.
				* 由另一端的<class>上的lazy确定.如果在一对多的一这端的class上的lazy=”true”.proxy的值就是true(延迟加载).
				* 如果class上lazy=”false”.proxy的值就是false(不采用延迟.)
	
	2. 在<many-to-one>标签上的默认值是fetch="select"和proxy
	
----------
	
**代码实现**

	

	
	
