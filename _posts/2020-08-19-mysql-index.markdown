---
layout:     post
title:      "mysql索引总结"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2020-08-19 22:43:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - mysql
---
## 一、索引介绍<br>

　　索引是对数据库表中一列或多列的值进行排序的一种结构，使用索引可快速访问数据库表中的特定信息。建立索引的目的是加快对表中记录的查找或排序。<br>
  
### 1.1、索引原理<br>

　　索引一般以文件形式存在磁盘中（也可以存于内存中），存储的索引原理大致概括为以空间换时间，数据库在未添加索引的时候进行查询默认的是进行全量搜索，也就是进行全局扫描，有多少条数据就要进行多少次查询，然后找到相匹配的数据就把他放到结果集中，直到全表扫描完。而建立索引之后，会将建立索引的KEY值放在一个n叉树上（BTree）。因为B树的特点就是适合在磁盘等直接存储设备上组织动态查找表，每次以索引进行条件查询时，会去树上根据key值直接进行搜索。<br>
　　索引优点：<br>
* 建立索引的列可以保证行的唯一性，生成唯一的rowId<br>
* 建立索引可以有效缩短数据的检索时间<br>
* 建立索引可以加快表与表之间的连接<br>
* 为用来排序或者是分组的字段添加索引可以加快分组和排序顺序<br>

　　索引缺点：<br>
* 创建索引和维护索引需要时间成本，这个成本随着数据量的增加而加大<br>
* 创建索引和维护索引需要空间成本，每一条索引都要占据数据库的物理存储空间，数据量越大，占用空间也越大（数据表占据的是数据库的数据空间）<br>
* 会降低表的增删改的效率，因为每次增删改索引需要进行动态维护，导致时间变长<br>

## 二、索引的分类与创建<br>

### 2.1、基本索引类型<br>

　　基本索引类型包括普通索引（单列索引）、复合索引（组合索引）、唯一索引、主键索引、全文索引<br>

### 2.2、创建句法格式<br>

```
CREATE TABLE table_name[col_name data type]
[unique|fulltext][index|key][index_name](col_name[length])[asc|desc]
```
* unique|fulltext为可选参数，分别表示唯一索引、全文索引<br>
* index和key为同义词，两者作用相同，用来指定创建索引<br>
* col_name为需要创建索引的字段列，该列必须从数据表中该定义的多个列中选择<br>
* index_name指定索引的名称，为可选参数，如果不指定，默认col_name为索引值<br>
* length为可选参数，表示索引的长度，只有字符串类型的字段才能指定索引长度<br>
* asc或desc指定升序或降序的索引值存储<br>

### 2.3、索引创建语句写法<br>

1、普通索引（单列索引）：单列索引是最基本的索引，它没有任何限制。<br>

```
直接创建索引:
CREATE INDEX index_name ON table_name(col_name);

修改表结构的方式添加索引:
ALTER TABLE table_name ADD INDEX index_name(col_name);

创建表的时候同时创建索引:
CREATE TABLE `news` (
    `id` int(11) NOT NULL AUTO_INCREMENT ,
    `title` varchar(255)  NOT NULL ,
    `content` varchar(255)  NULL ,
    `time` varchar(20) NULL DEFAULT NULL ,
    PRIMARY KEY (`id`),
    INDEX index_name (title(255))
)

删除索引:
DROP INDEX index_name ON table_name;
或者
alter table `表名` drop index 索引名;
```

2、复合索引：复合索引是在多个字段上创建的索引。**复合索引遵守"最左前缀"原则，即在查询条件中使用了复合索引的第一个字段，索引才会被使用。**因此，在复合索引中索引列的顺序至关重要。<br>

```
创建一个复合索引:
create index index_name on table_name(col_name1,col_name2,...); 

修改表结构的方式添加索引:
alter table table_name add index index_name(col_name,col_name2,...);
```

3、唯一索引：唯一索引和普通索引类似，主要的区别在于，唯一索引限制列的值必须唯一，但允许存在空值（只允许存在一条空值）。如果在已经有数据的表上添加唯一性索引的话：<br>
* 如果添加索引的列的值存在两个或者两个以上的空值，则不能创建唯一性索引会失败。（一般在创建表的时候，要对自动设置唯一性索引，需要在字段上加上 not null）<br>
* 如果添加索引的列的值存在两个或者两个以上的null值，还是可以创建唯一性索引，只是后面创建的数据不能再插入null值 ，并且严格意义上此列并不是唯一的，因为存在多个null值。<br>

　　对于多个字段创建唯一索引规定列值的组合必须唯一。比如：在order表创建orderId字段和productId字段的唯一性索引，那么这两列的组合值必须唯一。<br>

```
"空值"和"NULL"的概念： 
1：空值是不占用空间的.
2: MySQL中的NULL其实是占用空间的.
长度验证：注意空值的之间是没有空格的。

> select length(''),length(null),length(' ');
+------------+--------------+-------------+
| length('') | length(null) | length(' ') |
+------------+--------------+-------------+
|          0 |         NULL |           1 |
+------------+--------------+-------------+

```

```
创建唯一索引:
# 创建单个索引
CREATE UNIQUE INDEX index_name ON table_name(col_name);
# 创建多个索引
CREATE UNIQUE INDEX index_name on table_name(col_name,...);
=======================
修改表结构:
# 单个
ALTER TABLE table_name ADD UNIQUE index index_name(col_name);
# 多个
ALTER TABLE table_name ADD UNIQUE index index_name(col_name,...);
=======================
创建表的时候直接指定索引:
CREATE TABLE `news` (
    `id` int(11) NOT NULL AUTO_INCREMENT ,
    `title` varchar(255)  NOT NULL ,
    `content` varchar(255)  NULL ,
    `time` varchar(20) NULL DEFAULT NULL ,
    PRIMARY KEY (`id`),
    UNIQUE index_name_unique(title)
)
```

4、主键索引:一种特殊的唯一索引，一个表只能有一个主键，不允许有空值。一般是在建表的时候同时创建主键索引。<br>

```
主键索引(创建表时添加):
CREATE TABLE `news` (
    `id` int(11) NOT NULL AUTO_INCREMENT ,
    `title` varchar(255)  NOT NULL ,
    `content` varchar(255)  NULL ,
    `time` varchar(20) NULL DEFAULT NULL ,
    PRIMARY KEY (`id`)
)

主键索引(创建表后添加):
CREATE TABLE `order` (
    `orderId` varchar(36) NOT NULL,
    `productId` varchar(36)  NOT NULL ,
    `time` varchar(20) NULL DEFAULT NULL
)

alter table `order` add primary key(`orderId`);
```

5、全文索引：在一般情况下，模糊查询都是通过`like`的方式进行查询。但是对于海量数据，这并不是一个好办法，在 like "value%" 可以使用索引，但是对于 like "%value%" 这样的方式，执行全表查询，这在数据量小的表，不存在性能问题，但是对于海量数据，全表扫描是非常可怕的事情,所以like进行模糊匹配性能很差。<br>
　　这种情况下，需要考虑使用全文搜索的方式进行优化。全文搜索在MySQL中是一个FULLTEXT类型索引。FULLTEXT索引在MySQL5.6版本之后支持InnoDB，而之前的版本只支持MyISAM表。<br>
　　全文索引主要用来查找文本中的关键字，而不是直接与索引中的值相比较。fulltext索引跟其它索引大不相同，它更像是一个搜索引擎，而不是简单的where语句的参数匹配。fulltext索引配合match against操作使用，而不是一般的where语句加like。目前只有char、varchar，text列上可以创建全文索引。<br>
　　小技巧：在数据量较大时候，先将数据放入一个没有全局索引的表中，然后再用CREATE index创建fulltext索引，要比先为一张表建立fulltext然后再将数据写入的速度快很多。<br>
　　注意：默认MySQL不支持中文全文检索！<br>

```
创建表的适合添加全文索引:
CREATE TABLE `news` (
    `id` int(11) NOT NULL AUTO_INCREMENT ,
    `title` varchar(255)  NOT NULL ,
    `content` text  NOT NULL ,
    `time` varchar(20) NULL DEFAULT NULL ,
     PRIMARY KEY (`id`),
    FULLTEXT (content)
)

修改表结构添加全文索引:
ALTER TABLE table_name ADD FULLTEXT index_fulltext_content(col_name)

直接创建索引:
CREATE FULLTEXT INDEX index_fulltext_content ON table_name(col_name)
```

　　MySQL全文搜索只是一个临时方案，对于全文搜索场景，更专业的做法是使用全文搜索引擎，例如ElasticSearch或Solr。<br>

## 三、索引的查询和删除<br>

索引的查询和删除语句为:<br>

```
#查看:
show indexes from `表名`;
#或者
show keys from `表名`;
 
#删除
alter table `表名` drop index 索引名;
```

查看索引使用情况:<br>

```
show status like 'Handler_read%';

其中：
handler_read_key:这个值越高越好，越高表示使用索引查询到的次数
handler_read_rnd_next:这个值越高，说明查询低效
```

## 四、常见索引失效情况<br>

　　创建一个students表，其中stud_id为主键。<br>
  
```
  DROP TABLE IF EXISTS `students`;
  CREATE TABLE `students` (
  `stud_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(1) NOT NULL,
  `create_date` date DEFAULT NULL,
  PRIMARY KEY (`stud_id`)
 
)

INSERT INTO `learn_mybatis`.`students` (`stud_id`, `name`, `email`, `phone`, `create_date`) VALUES ('1', 'admin', 'student1@gmail.com', '12345678', '1988-08-08');
INSERT INTO `learn_mybatis`.`students` (`stud_id`, `name`, `email`, `phone`, `create_date`) VALUES ('2', 'root', '123456@gmail.com', '2', '1999-08-08');
INSERT INTO `learn_mybatis`.`students` (`stud_id`, `name`, `email`, `phone`, `create_date`) VALUES ('3', '888', '654321@gmail.com', '3dsad', '2020-08-23');
```

使用explain查看索引是否生效,[explain用法](https://blog.csdn.net/u010648555/article/details/81106983)<br>

1、在where后使用or，导致索引可能会失效（尽量少用or）<br>

**存在索引生效的条件为：需要保证or两边的列都有索引，并且有一个列是主键。**<br>

```
创建两个普通索引:email和phone
CREATE INDEX index_name_email ON students(email);
CREATE INDEX index_name_phone ON students(phone);
================================================
使用下面查询sql:
# 使用了索引
EXPLAIN select * from students where stud_id='1' or phone='12345678'
# 使用了索引
EXPLAIN select * from students where stud_id='2' or email='123456@gmail.com'
#--------------------------
# 没有使用索引
EXPLAIN select * from students where phone='12345678' or email='student1@gmail.com'
# 没有使用索引
EXPLAIN select * from students where stud_id='1' or phone='12345678' or email='student1@gmail.com'
```

2、使用like ，like查询是以%开头<br>
　　在1的基础上，还是使用index_name_email索引<br>

```
# 使用了index_name_email索引
EXPLAIN select * from students where email like '12345678@gmail.com%'

# 没有使用index_name_email索引，索引失效
EXPLAIN select * from students where email like '%12345678@gmail.com'

# 没有使用index_name_email索引，索引失效
EXPLAIN select * from students where email like '%12345678@gmail.com%'
```

3、复合索引遵守“最左前缀”原则，即在查询条件中使用了复合索引的第一个字段，索引才会被使用<br>
　　删除1的基础创建的index_name_email和index_name_phone索引。重新创建一个复合索引：create index index_email_phone on students(email,phone);<br>

```
# 使用了 index_email_phone 索引
EXPLAIN select * from students where email='12345678@gmail.com' and  phone='12345678'

# 使用了 index_email_phone 索引
EXPLAIN select * from students where phone='12345678' and  email='12345678@gmail.com'

# 使用了 index_email_phone 索引
EXPLAIN select * from students where email='12345678@gmail.com' and name='admin'

# 没有使用index_email_phone索引，复合索引失效
EXPLAIN select * from students where phone='12345678' and name='admin'
```

4、如果列类型是字符串，那一定要在条件中将数据使用引号引用起来,否则不使用索引<br>

```
给name创建一个索引:
CREATE INDEX index_name ON students(name);
==========================================
# 使用索引
EXPLAIN select * from students where name='888'

# 没有使用索引
EXPLAIN select * from students where name=888
```

5、使用in导致索引失效<br>

```
# 使用索引
EXPLAIN select * from students where name='admin'

# 没有使用索引
EXPLAIN SELECT * from students where name in ('admin')
```

6、DATE_FORMAT()格式化时间，格式化后的时间再去比较，可能会导致索引失效<br>

　　删除students上的创建的索引，重新在create_date创建一个索引:CREATE INDEX index_create_date ON students(create_date);<br>
```
# 使用索引
EXPLAIN SELECT * from students where create_date >= '1999-08-08'

# 没有使用索引
EXPLAIN SELECT * from students where DATE_FORMAT(create_date,'%Y-%m-%d') >= '1999-08-08'
```

7、对于order by、group by、union、distinct中的字段出现在where条件中时，才会利用索引<br>

更多索引请参考[索引的使用](https://www.cnblogs.com/duanxz/p/5244703.html)<br>

## 五、总结<br>

　　MySQL改善查询性能改善的最好方式，就是通过数据库中合理地使用索引。一般当数据量较大的时候，遇到sql查询性能问题，首先想到的应该是查询的sql时候使用了索引，如果使用了索引性能还是提高不大，就要检查索引是否使用正确，索引是否在sql查询中生效了。如果索引生效了，并且索引的使用也是合理的，最后sql性能还是不高，那就考虑重新优化sql语句。<br>

## 参考文献<br>
[1]https://www.jianshu.com/p/6ea21b739c67<br>
[2]https://blog.csdn.net/u010648555/article/details/81106983<br>
[3]https://www.cnblogs.com/duanxz/p/5244703.html<br>
[4]https://www.cnblogs.com/digdeep/p/4975977.html<br>
[5]https://www.cnblogs.com/yuerdongni/p/4255395.html<br>
[6]https://blog.csdn.net/suifeng3051/article/details/52669644/<br>
[7]https://mp.weixin.qq.com/s/oHDmnG_J1j3UWLOwUA5HOw<br>
[8]https://www.2cto.com/database/201803/726894.html<br>

