# Backend: Laravel (PHP 8.2)

# 1) Dependencies/build stage (Composer)
FROM composer:2 AS composer
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist --optimize-autoloader

# 2) Runtime stage (PHP-FPM)
FROM php:8.2-fpm-alpine AS runtime

# Install system deps and PHP extensions commonly needed by Laravel
RUN apk add --no-cache \
    bash \
    git \
    libzip \
    libpng \
    oniguruma \
    icu-libs \
    freetype \
    libjpeg-turbo \
    libxml2 \
    curl \
    tzdata \
    && apk add --no-cache --virtual .build-deps \
    $PHPIZE_DEPS \
    libzip-dev \
    oniguruma-dev \
    icu-dev \
    libpng-dev \
    freetype-dev \
    libjpeg-turbo-dev \
    libxml2-dev \
    curl-dev \
    linux-headers \
    && docker-php-ext-configure gd \
        --with-freetype=/usr/include/ \
        --with-jpeg=/usr/include/ \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        exif \
        gd \
        intl \
        mbstring \
        opcache \
        pdo \
        pdo_mysql \
        xml \
        zip \
    && apk del .build-deps

WORKDIR /var/www/html

# Copy app source
COPY . .

# Copy vendor from composer stage
COPY --from=composer /app/vendor ./vendor

# Optimize autoloader
RUN php -d detect_unicode=0 -r "copy('.env.example', '.env');" || true \
    && php -d detect_unicode=0 -r "file_exists('artisan') ? 0 : 1;" \
    && php artisan config:clear || true \
    && php artisan route:clear || true \
    && php artisan view:clear || true \
    && php -r "file_exists('artisan') ? 0 : 1;" \
    && php -v

# Ensure storage permissions
RUN addgroup -g 1000 laravel && adduser -G laravel -g laravel -s /bin/sh -D laravel \
    && chown -R laravel:laravel /var/www/html/storage /var/www/html/bootstrap/cache

USER laravel

EXPOSE 8000

# Start with Laravel's built-in server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
