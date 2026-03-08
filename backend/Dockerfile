FROM php:8.2-cli

# System deps + PHP extensions for Laravel/MySQL
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring zip \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy app files
COPY . .

# Install PHP deps (optimized for production)
RUN composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction

# Ensure storage/bootstrap cache are writable
RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Render injects PORT env var
CMD ["sh", "-c", "php artisan config:cache && php artisan route:cache && php artisan migrate --force && php -S 0.0.0.0:${PORT} -t public"]
