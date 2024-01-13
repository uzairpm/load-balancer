
# Load Balancer

An application load balancer(ALB) built using NodeJS.

## Deployment

Start the app servers using 
```
npm run server --port 8080
npm run server --port 8081
npm run server --port 8082
```

To start the load balancer

`
  npm run start
`

- A health check for available app servers happens every 5 seconds.
- The load balancer is accessible by accessing [localhost](http://localhost) at port 80.
- When a node goes offline/online, the load balancer gets notified.
- Subsequent requests to [localhost](http://localhost) will fetch the response from either of the available servers.


## Next steps

- Other load balancing algorithms instead of round robin.
- assigning weights to app servers depending on performance(response time/ server load handling capability). By doing this we will be sending more requests to particular app servers in the pool.
