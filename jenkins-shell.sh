#Default compose args
COMPOSE_ARGS="-f docker-compose.yml -p jenkins"

#Make sure old containers are gone
sudo docker-compose $COMPOSE_ARGS stop
sudo docker-compose $COMPOSE_ARGS rm --force -v

#build the system
echo "build"
sudo docker-compose $COMPOSE_ARGS build --no-cache

#unit Test
sudo docker-compose $COMPOSE_ARGS run --no-deps --rm -e ENV=TEST ds18b20
ERR=$?

if [ $ERR -eq 0 ]; then

    #Rename
    echo "rename"
    HASH=$(git rev-parse --short HEAD)
    sudo docker tag jenkins_ds18b20 localhost:5000/ds18b20:$HASH
    sudo docker tag jenkins_ds18b20 localhost:5000/ds18b20:latest

    #Pushing
    echo "Pushing"
    sudo docker push localhost:5000/ds18b20:$HASH
    sudo docker push localhost:5000/ds18b20:latest

    #Delete Images
    echo "Delete Images"
    sudo docker rmi localhost:5000/ds18b20:$HASH
    sudo docker rmi localhost:5000/ds18b20:latest
else
    echo "error"
    ERR=1
fi

#Pull down the system
echo "Pull down the system"
sudo docker-compose $COMPOSE_ARGS stop
sudo docker-compose $COMPOSE_ARGS rm  --force -v

sudo docker rmi jenkins_ds18b20 --force

return $ERR
