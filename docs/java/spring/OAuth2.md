---
title: OAuth2
---

### client_id:client_secret 生成加密串
1.base64加密工具生成
```
工具地址：http://tool.oschina.net/encrypt?type=3

client_id:client_secret
如： sk:sk = c2s6c2s=

```
2.postman生成

```
1.生成
postman -> Authorization -> username/password => client_id/client_secret(sk/sk) -> update request

2.
postman -> Headers -> Authorization=Basic c2s6c2s=
```


```

http://localhost:8081/oauth/authorize?response_type=code&client_id=bms&scope=all&redirect_uri=http://example.com



```
