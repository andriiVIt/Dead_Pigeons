dotnet tool install -g NSwag.ConsoleCore

nswag openapi2csclient /input:http://localhost:5000/api/swagger/v1/swagger.json /output:/Users/andriisavchenko/RiderProjects/DeadPigeons/server/ApiIntegrationTests/SwaggerClient.cs /namespace:Generated /wrapResponses:true
