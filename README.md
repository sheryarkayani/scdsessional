# Cafe Management System

A microservices-based cafe management system with separate services for menu, orders, inventory, customer management, and payments.

## GitHub Actions CI/CD

This project uses GitHub Actions for Continuous Integration and Continuous Deployment:

1. **CI Pipeline** - Runs on push and pull requests to main/master/develop branches:
   - Lints the code for each service
   - Runs tests for each service
   - Builds Docker images for verification

2. **Docker Publish Pipeline** - Runs on push to main/master or when tags are pushed:
   - Builds Docker images for all services
   - Pushes images to Docker Hub
   - Tags images with both 'latest' and the commit SHA

### Setting up Docker Hub Integration

To enable pushing to Docker Hub, add these secrets to your GitHub repository:

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_TOKEN`: Your Docker Hub access token (create one in Docker Hub account settings)

## Docker Images

The following Docker images are available on Docker Hub:

- `<username>/cafe-api-gateway`: API Gateway service
- `<username>/cafe-menu-service`: Menu service
- `<username>/cafe-order-service`: Order service
- `<username>/cafe-inventory-service`: Inventory service
- `<username>/cafe-customer-service`: Customer service
- `<username>/cafe-payment-service`: Payment service

You can pull these images directly from Docker Hub:

```bash
docker pull <username>/cafe-api-gateway:latest
```

## Running with Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed on your system

### Steps to Run
1. Clone the repository
2. Navigate to the project root directory
3. Run the following command:
   ```bash
   docker-compose up
   ```
4. Access the API Gateway at http://localhost:3000

### To Stop
```bash
docker-compose down
```

### To Rebuild
```bash
docker-compose up --build
```

## Running Locally (Without Docker)

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or accessible)
- npm or yarn

### Setup Each Service

For each service folder (api-gateway, customer-services, inventory-services, menu-services, order-services, payment-services), run:

```bash
cd <service-folder>
npm install
```

### Start Services

Start each service in a separate terminal window:

```bash
# Terminal 1
cd api-gateway
npm run dev

# Terminal 2
cd menu-services
npm run dev

# Terminal 3
cd order-services
npm run dev

# Terminal 4
cd inventory-services
npm run dev

# Terminal 5
cd customer-services
npm run dev

# Terminal 6
cd payment-services
npm run dev
```

### Access the API Gateway

The API gateway will be available at http://localhost:3000

Use the following endpoints:
- Menu service: http://localhost:3000/menu
- Order service: http://localhost:3000/orders
- Payment service: http://localhost:3000/payments
- Inventory service: http://localhost:3000/inventory
- Customer service: http://localhost:3000/customers

## Service Ports

- API Gateway: 3000
- Menu Service: 3001
- Order Service: 3002
- Payment Service: 3003
- Inventory Service: 3004
- Customer Service: 3005

## Directory Structure

- `api-gateway`: Entry point for all client requests, routes to appropriate services
- `menu-services`: Handles menu items and availability
- `order-services`: Processes and tracks customer orders
- `inventory-services`: Tracks and manages cafe inventory
- `customer-services`: Manages customer data and loyalty
- `payment-services`: Handles payment processing 