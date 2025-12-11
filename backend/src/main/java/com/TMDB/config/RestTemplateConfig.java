package com.TMDB.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {
    
    @Bean
    public RestTemplate restTemplate(ObjectMapper objectMapper) {
        // Create a copy of the default ObjectMapper and configure it
        ObjectMapper customObjectMapper = objectMapper.copy();
        customObjectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);

        // Create a message converter using the custom ObjectMapper
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(customObjectMapper);

        RestTemplate restTemplate = new RestTemplate();
        // Remove existing MappingJackson2HttpMessageConverter if any, and add our custom one
        restTemplate.getMessageConverters().removeIf(
                m -> m instanceof MappingJackson2HttpMessageConverter);
        restTemplate.getMessageConverters().add(converter);

        return restTemplate;
    }
}