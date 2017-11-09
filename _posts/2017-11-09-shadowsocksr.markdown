---
layout:     post
title:      "搭建shadowsocksR"
subtitle:   " \"welcome to ARTAvrilLavigne Blog\""
date:       2017-11-09 15:23:00
author:     "ARTAvrilLavigne"
header-img: "img/post-bg-2015.jpg"
tags:
    - VPN
---
## 1、租用云服务器  
　　选择digitalocean:https://cloud.digitalocean.com  
　　**我选择的是旧金山机房，ubuntu17.10 X64版本,Server Hostname填写的是avrillavigne,其余均不用填写。**  
## 2、安装步骤  
　　首先root管理员身份进入/usr/local/  
　　下载ShadowsocksR服务端脚本:  
    wget -N --no-check-certificate https://raw.githubusercontent.com/ToyoDAdoubi/doubi/master/ssrmu.sh && chmod +x ssrmu.sh && bash ssrmu.sh  
　　下载运行后会提示你输入数字来选择要做什么  
　　输入 1 ，就会开始安装ShadowsocksR服务端，并且会提示你输入Shadowsocks的 端口/密码/加密方式/ 协议/混淆（混淆和协议是通过输入数字选择的） 等参数来添加用户。  
　　注意：用户名不支持中文，如果输入中文会一直保存下去  
　　(不输入回车就是默认参数)  
　　用户 : xxxxxxxx  
　　端口 : 8388  
　　密码 : password  
　　加密 : aes-256-cfb  
　　协议 : auth_sha1_v4_compatible  
　　混淆 : tls1.2_ticket_auth_compatible  
　　设备数限制: 0(无限)  
　　单线程限速: 0 KB/S (不限速)  
　　端口总限速: 0 KB/S (不限速)  
　　禁止的端口 : 无限制  
　　用户总流量 : XXXXXXXXX  

## 3、运行脚本  
    bash ssrmu.sh  

界面如下：  
  ShadowsocksR MuJSON一键管理脚本 [vX.X.X]  
  ---- Toyo | doub.io/ss-jc60 ----  
 
  1. 安装 ShadowsocksR  
  2. 更新 ShadowsocksR  
  3. 卸载 ShadowsocksR  
  4. 安装 libsodium(chacha20)  
————————————  
  5. 查看 账号信息  
  6. 显示 连接信息  
  7. 设置 用户配置  
  8. 手动 修改配置  
  9. 清零 已用流量  
————————————  
 10. 启动 ShadowsocksR  
 11. 停止 ShadowsocksR  
 12. 重启 ShadowsocksR  
 13. 查看 ShadowsocksR 日志  
————————————  
 14. 其他功能(安装BBR和速锐等功能)  
 15. 升级脚本  
 
 当前状态: 已安装 并 已启动  
 
请输入数字 [1-15]：  

**所有操作只用这个一键脚本即可完成**  

**其中安装BBR在14中可以安装、启动、停止**  

　　注意：添加/删除/修改用户配置后，无需重启ShadowsocksR服务端，ShadowsocksR服务端会定时读取数据库文件内的信息，不过修改用户配置后，可能要等个十几秒才能应用最新的配置（因为ShadowsocksR不是实时读取数据库的，所以有间隔时间）。  
　　ShadowsocksR安装后，自动设置为系统服务，所以支持使用服务来启动/停止等操作，同时支持开机启动。  

## 4、不用脚本手动操作  
    启动 ShadowsocksR：/etc/init.d/ssrmu start  
    停止 ShadowsocksR：/etc/init.d/ssrmu stop  
    重启 ShadowsocksR：/etc/init.d/ssrmu restart  
    查看 ShadowsocksR状态：/etc/init.d/ssrmu status  
    
　　ShadowsocksR 默认支持UDP转发，服务端无需任何设置  

　　开始BBR加速：  
wget -N --no-check-certificate https://raw.githubusercontent.com/ToyoDAdoubi/doubi/master/bbr.sh && chmod +x bbr.sh && bash bbr.sh  

　　下载并运行脚本后，会自动检测并开始安装，首先会提示你输入要下载的内核版本，可以安装自定义版本的内核，也可以直接回车安装最新版本的内核（内核版本获取）！  
　　一直选择keep the local version currently installed。如果没有出错，内核更换完毕后，会提示是否立即重启VPS，直接回车或者输入 Y   

　　需要重启VPS后，才能开启BBR，是否现在重启 ? [Y/n] : y  
　　[注意]  重启VPS后，请重新运行脚本查看BBR是否加载成功 bash bbr.sh status  
　　[信息]  VPS 重启中...  
　　等待十几秒，VPS启动后，重新通过SSH连接VPS，进入 bbr.sh 脚本的目录，然后执行下面这个命令查看BBR是否加载成功。  
    bash bbr.sh status  
　　然后就会自动开启BBR。  

**启动BBR**  
bash bbr.sh start  
 
**关闭BBR**  
bash bbr.sh stop  
 
**查看BBR状态**  
bash bbr.sh status  

注意：关闭BBR，需要重启VPS，所以脚本会提醒是否立即重启VPS  

## 5、参考教程  
　　『原创』ShadowsocksR MudbJSON模式多用户一键脚本：https://doub.io/ss-jc60/  
　　『原创』Debian/Ubuntu TCP-BBR 一键安装脚本：https://doub.io/wlzy-16/  

　　谷歌学术不能访问问题解决：  
            https://www.polarxiong.com/archives/%E9%80%9A%E8%BF%87VPS%E4%BD%BF%E7%94%A8VPN%E6%88%96ShadowSocks%E8%AE%BF%E9%97%AEGoogle%E6%88%96Google-Schoolar%E5%87%BA%E7%8E%B0%E9%AA%8C%E8%AF%81%E7%A0%81%E7%AD%89%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%B3%95.html  

    https://blog.finaltheory.me/note/Solve-Google-Problems.html  

　　使用过上述网址方法但还是不能访问谷歌学术。只能通过谷歌学术镜像访问：http://ac.scmor.com/


