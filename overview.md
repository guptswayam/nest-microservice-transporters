# Nest Microservice Transporters
1. Transporters are used for communication b/w microservices
2. With transporters, we can achieve both event-based(asynchronous) and request-response(synchronous) based communication
3. Request-response approach is possible with REST APIs, gRPC, message queues, pub-sub
4. In this project, we have implemented request-response and event-based approach using redis pub-sub model with inbuilt transporters and custom transporters
5. To enable the request-response message type, Nest creates two logical channels - one is responsible for transferring the data while the other waits for incoming responses
    - There can be overhead for this. More on this: https://stackoverflow.com/a/63179510
6. With redis pub-sub model, we need to deal with redis pub-sub subscribe issue across multiple instances of same microservice
    - To solve this issue, we have two
        1. Redlock
            - acquire the lock using requestId with retryLimit of *zero*. 
            - So once it's reached to any of the instance, it acquires lock and message can't processed by any other instance
        2. Load Blancing
            - To deal with it, redis doesn't provide built-in load-balancer, we need to implement load-balancing logic on our own
            - https://github.com/nestjs/nest/issues/358
            - https://stackoverflow.com/questions/62888050

# Source
1. [Build Custom Transporters from Scratch](https://dev.to/nestjs/integrate-nestjs-with-external-services-using-microservice-transporters-part-1-p3)
    - https://dev.to/nestjs/part-1-introduction-and-setup-1a2l
2. [Official Transporter Docs](https://docs.nestjs.com/microservices/basics)