---
title: spring-boot mongodb
---

```
$ docker exec -it mongodb bash
# mongo

> use admin;
> db.auth('admin', '123456');

db.oauth2_client_details.save({clientId: 'bms', clientSecret: '123456', registeredRedirectUri: ['http://example.com']});

db.sys_user.save({_id: '5e3e9361264dd3090c081103',username: 'bms', password: '$2a$10$gbTTR3dQQtNIvBHqFz52aukUyb4dqN1lEBsx2VKPvGhl08fux/qVC'});

```

idea mongo plugin

springboot 2.2.4.RELEASE > mongodb converter
```

package com.ud.bms.demo.mongodb;

import org.bson.Document;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.OAuth2Request;

import java.io.Serializable;
import java.util.*;

/**
 * <Description>
 *
 * @author : wk
 * @version : 1.0
 * @since : 2020/2/9 18:59
 * Company : Beijing Tepia (Wuhan R&D Center)
 */
@ReadingConverter
public class Document2OAuth2AuthenticationConverter implements Converter<Document, OAuth2Authentication> {

    @Override
    public OAuth2Authentication convert(Document source) {
        if (Objects.isNull(source)) {
            return null;
        }

        Document storedRequest = this.covertDocument(source, "storedRequest");
        OAuth2Request oAuth2Request = new OAuth2Request(
                (Map<String, String>) storedRequest.get("requestParameters"),
                (String) storedRequest.get("clientId"),
                getAuthorities((List<Map<String, String>>) storedRequest.get("authorities")),
                (Boolean) storedRequest.get("approved"),
                this.covertSet(storedRequest, "scope"),
                this.covertSet(storedRequest, "resourceIds"),
                null,
                this.covertSet(storedRequest, "responseTypes"),
                (Map<String, Serializable>) storedRequest.get("extensions")
        );

        //
        Document userAuthorization = this.covertDocument(source, "userAuthentication");
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                userAuthorization.get("principal"),
                userAuthorization.get("credentials"),
                getAuthorities((List<Map<String, String>>) userAuthorization.get("authorities"))
        );
        return new OAuth2Authentication(oAuth2Request, token);
    }

    private Collection<GrantedAuthority> getAuthorities(List<Map<String, String>> authorities) {
        Set<GrantedAuthority> grantedAuthorities = new HashSet<GrantedAuthority>(authorities.size());
        for (Map<String, String> authority : authorities) {
            grantedAuthorities.add(new SimpleGrantedAuthority(authority.get("role")));
        }
        return grantedAuthorities;
    }

    private Document covertDocument(Document document, String paramName) {
        return (Document) document.get(paramName);
    }

    private Set covertSet(Document document, String paramName) {
        return new HashSet((List) document.get(paramName));
    }

}


```


```
package com.ud.bms.demo.config;

import com.ud.bms.demo.mongodb.Document2OAuth2AuthenticationConverter;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.convert.CustomConversions;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.core.convert.*;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

import java.util.Arrays;

/**
 * <Description>
 *
 * @author : wk
 * @version : 1.0
 * @since : 2020/2/9 12:27
 * Company : Beijing Tepia (Wuhan R&D Center)
 */
@Configuration
public class MongodbConfig {

    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        return new MongoCustomConversions(Arrays.asList(
                new Document2OAuth2AuthenticationConverter()
        ));
    }

    /**
     *  ------------------- 暂不让其生效 --------------------
     *
     * @param factory
     * @param context
     * @param beanFactory
     * @return
     */
    //    @Bean
    public MappingMongoConverter mappingMongoConverter(MongoDbFactory factory, MongoMappingContext context, BeanFactory beanFactory) {

        DbRefResolver dbRefResolver = new DefaultDbRefResolver(factory);
        MappingMongoConverter mappingConverter = new MappingMongoConverter(dbRefResolver, context);

        // Don't save _class to mongo
        mappingConverter.setTypeMapper(new DefaultMongoTypeMapper(null));

        mappingConverter.setCustomConversions(beanFactory.getBean(CustomConversions.class));
        return mappingConverter;
    }

}

```
