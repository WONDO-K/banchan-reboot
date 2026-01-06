package com.__105.Banchan.common.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Banchan API",
                version = "v1",
                description = "Banchan Application API",
                contact = @Contact(name = "201105", email = "your.email@example.com")
        ),
        servers = @Server(
//                url = "https://i11e105.p.ssafy.io", // 실제 배포된 URL로 변경 필요
                url = "http://localhost:8080",
                description = "Default Server URL"
        )
)
@SecurityScheme(
        name = "Bearer Authentication",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class SwaggerConfig {

    private static final String BEARER_TOKEN_PREFIX = "Bearer";
    private static final String SECURITY_SCHEME_NAME = "Bearer Authentication";

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("public")
                .pathsToMatch("/**")
                .build();
    }

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new io.swagger.v3.oas.models.security.SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP)
                                .scheme(BEARER_TOKEN_PREFIX)
                                .bearerFormat("JWT")))
                .info(new io.swagger.v3.oas.models.info.Info()
                        .title("Banchan API")
                        .version("1.0")
                        .description("API documentation for Banchan application")
                        .contact(new io.swagger.v3.oas.models.info.Contact()
                                .name("Your Name")
                                .email("your.email@example.com"))
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")));
    }
}
