FROM php:7.4-cli
RUN docker-php-ext-install sockets
RUN docker-php-ext-enable sockets
COPY . /usr/src/myapp
WORKDIR /usr/src/myapp
CMD [ "php", "./server.php" ]
