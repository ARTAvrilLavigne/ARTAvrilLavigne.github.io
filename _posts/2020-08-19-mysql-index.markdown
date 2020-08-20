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

2、复合索引：复合索引是在多个字段上创建的索引。**复合索引遵守“最左前缀”原则，即在查询条件中使用了复合索引的第一个字段，索引才会被使用。**因此，在复合索引中索引列的顺序至关重要。<br>

```
创建一个复合索引:
create index index_name on table_name(col_name1,col_name2,...); 

修改表结构的方式添加索引:
alter table table_name add index index_name(col_name,col_name2,...);
```

3、





















