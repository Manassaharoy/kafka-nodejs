Start Zookeper Container and expose PORT 2181.

```
docker run -d -p 2181:2181 zookeeper
```

Start Kafka Container, expose PORT 9092 and setup ENV variables.

```

docker run -d -p 9092:9092 \
-e KAFKA_ZOOKEEPER_CONNECT=192.168.68.106:2181 \
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.68.106:9092 \
-e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
confluentinc/cp-kafka
```
