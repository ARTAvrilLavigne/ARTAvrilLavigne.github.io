---
layout:     post
title:      "vultr搭建shadowsocks"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2017-10-31 14:41:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - shadowsocks
---
## 1、租用云服务器  
　　选择vultr:https://my.vultr.com/  
　　备注：Vultr是一家提供日本、美国、欧洲等多个国家和地区机房的VPS主机商，硬盘都是采用SSD，VPS主机都是KVM架构，VPS配置最少的内存512MB、硬盘为15GB的VPS只要2.5美元/月（2017.3.2修改），vultr是根据VPS使用小时来计费（0.007/h,折合人民币4分6/小时）的，使用多长时间就算多长时间，计费对应的款。Vultr是KVM系统架构，目前已开通15个机房，比较适合国内的是日本东京（tokyo）,美国洛杉矶（ Los Angeles ），美国西雅图（ Seattle ）这三个机房相对国内线路较好。vultr支持使用支付宝（Alipay）付款。  
　　**我选择的是洛杉矶机房，ubuntu17.10 X64版本,Server Hostname & Label填写的是avrillavigne,其余均不用填写。**  
　　**推荐**:如果是学生，可以使用github学生包。用学校的学生邮箱进行github认证就可以得到DigitalOcean的优惠码--50刀(要预先给digitalocean账户充值5美元)。  
　　DigitalOcean官网:https://cloud.digitalocean.com  
## 2、连接VPS  
　　使用xshell登录服务器，新建用户对话，填入服务器IP地址，用户名root,密码服务器所给的password。首先进入测试工具地址：http://ping.chinaz.com ping一下服务器IP是否被墙(如果被墙重新删掉换一个服务器IP)。这些都正常的话，出现connection failed连接失败，则关闭windows下的防火墙即可成功登录。  
## 3、安装shadowsocks-libev  
　　github官网地址：https://github.com/shadowsocks/shadowsocks-libev  
　　在VPS上部署shadowsocks，推荐使用C语言编写的基于libev的shadowsocks-libev的服务端。下面介绍在Linux系统的VPS上安装并配置的方法。由于shadowsocks-libev变动频繁，请以shadowsocks-libev的Github页面的readme为准。  
### 3.1、apt-get安装shadowsocks-libev：  
　　#对于Ubuntu 16.10及以上版本则可以直接从Ubuntu的官方repo安装：  
    sudo apt update  
    sudo apt install shadowsocks-libev  
　　#对于Ubuntu 14.04/16.04 版本需要添加作者的PPA：  
    sudo apt-get install software-properties-common -y  
    sudo add-apt-repository ppa:max-c-lv/shadowsocks-libev -y  
    sudo apt-get update  
    sudo apt install shadowsocks-libev  
### 3.2、配置与启动服务  
　　#Edit the configuration file编辑配置文件：  
    sudo vim /etc/shadowsocks-libev/config.json  
    
　　格式说明：  
　　{  
　　"server":"租用服务器IP地址",  
　　"server_port":服务器监听端口(可设为8388),  
　　"local_port":1080(默认本地端口),  
　　"password":"密码",  
　　"method":"aes-256-cfb(可以设置为其它)",  
　　"timeout":60  
　　}  
  
　　#Start the service启动服务端：  
    sudo /etc/init.d/shadowsocks-libev start  

## 4、开启TCP的BBR拥塞算法加速  
    wget --no-check-certificate https://github.com/teddysun/across/raw/master/bbr.sh  
    chmod +x bbr.sh  
    ./bbr.sh  

## 可选项  
　　一、使用基于KCP的shadowsocks加速：  
　　#Setup your server  
    server_linux_amd64 -l :21 -t 127.0.0.1:443 --crypt none --mtu 1200 --nocomp --mode normal --dscp 46 & ss-server -s 0.0.0.0 -p 443 -k passwd -m chacha20 -u  
　　#Setup your client  
    client_linux_amd64 -l 127.0.0.1:1090 -r <服务器IP>:21 --crypt none --mtu 1200 --nocomp --mode normal --dscp 46 & ss-local -s 127.0.0.1 -p 1090 -k passwd -m chacha20 -l 1080 -b 0.0.0.0 & ss-local -s <服务器IP> -p 443 -k passwd -m chacha20 -l 1080 -U -b 0.0.0.0  


　　二、设置最大连接数：  
　　#Security Tips  
　　#Although shadowsocks-libev can handle thousands of concurrent connections nicely, we still recommend setting up your server's 
firewall rules to limit connections from each user:  
　　#Up to 32 connections are enough for normal usage：  
    iptables -A INPUT -p tcp --syn --dport ${SHADOWSOCKS_PORT} -m connlimit --connlimit-above 32 -j REJECT --reject-with tcp-reset  


## 备注参考地址  

　　中文博客参考地址：https://cokebar.info/archives/767  
　　Ubuntu TCP BBR 改进版/增强版：https://moeclub.org/2017/06/24/278/  


