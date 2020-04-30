---
title: oauth2 token自定义返回格式
---

利用aspect实现
```
package com.ud.bms.demo.oauth2;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * < /auth/token  自定义 返回数据格式>
 *
 * @author : wk
 * @version : 1.0
 * @since : 2020/2/11 13:44
 * Company : Beijing Tepia (Wuhan R&D Center)
 */
@Component
@Aspect
@Slf4j
public class CustomOAuth2AccessTokenAspect {
    @Around("execution(* org.springframework.security.oauth2.provider.endpoint.TokenEndpoint.postAccessToken(..))")
    public Object handle(ProceedingJoinPoint pjp) {

        Map<String, Object> response = new HashMap<>();
        try {
            Object proceed = pjp.proceed();

            Integer code = 0;
            String msg = "";

            ResponseEntity<OAuth2AccessToken> responseEntity;
            if (Objects.nonNull(proceed) && (responseEntity = (ResponseEntity<OAuth2AccessToken>) proceed).getStatusCode().is2xxSuccessful()) {
                response.put("data", responseEntity.getBody());
            } else {
                code = 1;
                msg = "授权失败";
            }
            response.put("code", code);
            response.put("msg", msg);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(response);

        } catch (Throwable throwable) {
            log.error("", throwable);
        }

        response.put("code", 1);
        response.put("msg", "出现异常，授权失败");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}


```
