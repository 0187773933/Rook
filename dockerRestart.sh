#!/bin/bash
sudo docker rm rook-php-app -f
#sudo docker build --no-cache -t rook-php-app .
sudo docker build -t rook-php-app .
ContainerID=$(sudo docker run -dit --restart='always' --name rook-php-app -p 9300:9300 rook-php-app | tail -1)
echo $ContainerID
sudo docker logs -f $ContainerID
