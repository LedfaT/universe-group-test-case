# README

## Project Structure

```plaintext
.
├── config
│   ├── nats
│   └── nginx
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── docker-compose.yml
├── initialization.sh
├── monitoring
│   ├── dashboards
│   ├── datasources
│   └── prometheus.yml
├── prisma
│   ├── migrations
│   └── schema.prisma
├── README.md
└── services
    ├── fb-collector
    ├── gateway
    ├── reporter
    └── ttk-collector
```

## Project Initialization

To initialize and start the project, run the following commands in the project root:

```bash
chmod +x ./initialize.sh
./initialize.sh
```

---

## Load Balancing

NGINX is used to balance the load between multiple instances of the `gateway` service.

---

## Running Multiple Instances with Docker Compose

To run multiple instances of the `gateway` or other services, add the `deploy` section with the number of replicas in `docker-compose.yml`, for example:

```yaml
services:
  gateway:
    image: your-gateway-image
    deploy:
      replicas: 3  # Run 3 instances of gateway
    ...
```

---

## Running Publisher on Non-ARM Systems

If you are running the `publisher` service on a non-ARM system, you need to start the QEMU emulator first to ensure compatibility:

```bash
docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
```

---

## Notes

- All services are located inside the `services/` folder.
- The root directory contains `docker-compose.yml`, and folders for configuration (`config/`) and monitoring (`monitoring/`).
- The initialization script `.initialize.sh` is located in the project root.

---
