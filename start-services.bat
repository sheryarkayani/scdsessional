@echo off
echo Starting Cafe Management System Services...

echo Starting API Gateway...
start "API Gateway" cmd /k "cd api-gateway && npm run dev"

echo Starting Menu Service...
start "Menu Service" cmd /k "cd menu-services && npm run dev"

echo Starting Order Service...
start "Order Service" cmd /k "cd order-services && npm run dev"

echo Starting Inventory Service...
start "Inventory Service" cmd /k "cd inventory-services && npm run dev"

echo Starting Customer Service...
start "Customer Service" cmd /k "cd customer-services && npm run dev"

echo Starting Payment Service...
start "Payment Service" cmd /k "cd payment-services && npm run dev"

echo All services started. Access the API Gateway at http://localhost:3000
echo Press any key to exit this window (services will continue running)
pause 