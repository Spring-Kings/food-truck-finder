# Food Truck Finder

## Local Environment Setup
### food-truck-api: Backend Setup
* Install Java 14 (OpenJDK) if needed
    * Run `brew cask install java`
    * Consider using jenv: [https://www.jenv.be/](https://www.jenv.be/)
      * Install jenv if needed
      * Run `jenv add /Library/Java/JavaVirtualMachines/openjdk-14.0.2.jdk/Contents/Home`
* Install Docker Desktop for Mac from [DockerHub](https://docs.docker.com/docker-for-mac/install/)
    * Increase Memory for Docker Engine to at least 4.00 GB so SQL Server container has sufficient resources (Docker Desktop > Preferences > Resources > Memory, "Apply & Restart")
* Setup Project in IntelliJ
    * Import the project at the food-truck-finder parent dir (root of repository) into IntelliJ using existing sources
    * Import the inner food-truck-api sub directory
        * Go File > Project Structure > Modules > + > Import Module
        * For this, choose to import using external model with Gradle
        * IntelliJ should autodetect your Gradle project and download dependencies
    * Configure Lombok
        * Install Lombok Plugin for IntelliJ (IntelliJ IDEA > Preferences > Plugins ... Search for "Lombok" by Michail Plushnikov)
        * Enable Annotation Processing in IntelliJ Compliation (IntelliJ IDEA > Preferences > Build, Execution, Deployment > Compiler > Annotation Processors > Check "Enable annotation processing")
* Deploy MySQL, Localstack, Flask: `docker-compose -f ./docker/local.docker-compose.yml up -d`
    * If you need to stop the containers (`docker-compose -f ./docker/local.docker-compose.yml stop` or ctrl+C), you can 
    restart the containers with: `docker-compose -f ./docker/local.docker-compose.yml start`   
* From IntelliJ, create the default `food-truck-finder` database on the server: File > New > Data Source > Mysql  
    * Configure the connection:
      * Name: FTF - Local
      * Host: localhost
      * Port: 3306
      * User: root
      * Password: password
    * Test Connection and hit OK
    * On the right-hand side of IntelliJ, click on the "Database" option
    * For the food-truck-finder database, right click and navigate to New > Database
    * Add a new database named food-truck-finder and hit OK

* Start the API from IntelliJ SpringBoot Run Configuration
    * Specify VM Options
	```
	-Dspring.profiles.active=dev
	```
    * Specify Environment Variables
    ```
    GOOGLE_SMTP_USERNAME=your.smtp.email@gmail.com
    GOOGLE_SMTP_PASSWORD=your_smtp_password
    SIMILARITY_URL=http://localhost:5000
    S3_URL=http://localhost:4572
    S3_BUCKET_NAME=ftbucket
    AWS_ACCESS_KEY_ID=development
    AWS_SECRET_ACCESS_KEY=development
    S3_REGION=us-east-2
    ```
 
### food-truck-frontend: Frontend Setup
**Local Development Instructions (Mac):**
1. Install Homebrew if you don't already have it: https://brew.sh/
2. Run Homebrew to install Node: `brew install node`
3. Run Homebrew to install Yarn: `brew install yarn`
4. Navigate to the food-truck-frontend directory
5. Install frontend dependencies: `yarn install` 
6. Run the frontend dev server: `yarn dev` 
7. Navigate to http://localhost:3000 - you should see the food truck application

**Local Development Instructions (Windows):**

## Common Errors
**Issue**: `docker-compose up` fails with
`ERROR: Couldn't connect to Docker daemon. You might need to start Docker for Mac.`  
**Solution**: Ensure Docker Desktop for Mac is running locally (Spotlight Search Cmd+Space > Docker)
