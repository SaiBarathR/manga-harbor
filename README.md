# Manga Harbor

Manga Harbor is a web application that allows users to discover, search, and download manga. It provides a user-friendly interface to explore a vast collection of manga titles and download them for offline reading. This repository contains the client-side code for Manga Harbor, which interacts with the Manga Harbor Server to fetch manga data and handle downloads.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Steps to Run the React App with Manga Harbor Spring Server](#steps-to-run-the-react-app-with-manga-harbor-spring-server)
  - [Clone the Repositories](#1-clone-the-repositories)
  - [Set Up the Manga Harbor Spring Server](#2-set-up-the-manga-harbor-spring-server)
  - [Set Up the Manga Harbor React Client](#3-set-up-the-manga-harbor-react-client)
  - [Configure API Endpoint (Optional)](#4-configure-api-endpoint-optional)
  - [Run the React App](#5-run-the-react-app)
- [Docker Setup](#docker-setup)
  - [Steps to Run the React App with Manga Harbor Spring Server Using Docker](#steps-to-run-the-react-app-with-manga-harbor-spring-server-using-docker)
  - [Pull the Docker Images](#1-pull-the-docker-images)
  - [Run the Docker Containers](#2-run-the-docker-containers)
- [Kubernetes Setup](#kubernetes-setup)
  - [Steps to Run the React App Using Kubernetes](#steps-to-run-the-react-app-using-kubernetes)
  - [Create the Kubernetes Deployment and Service](#1-create-the-kubernetes-deployment-and-service)
  - [Start the Kubernetes Service](#2-start-the-kubernetes-service)
  - [Access the Manga Harbor Web Application](#3-access-the-manga-harbor-web-application)
- [Additional Notes](#additional-notes)
- [Features](#features)
- [How It Works](#how-it-works)
  - [Components](#components)
  - [Interaction Flow](#interaction-flow)
  - [Offline Reading](#offline-reading)
- [Responsiveness](#responsiveness)
- [Manga Harbor Server Integration](#manga-harbor-server-integration)
- [Manga Harbor Server Repository](#manga-harbor-server-repository)
- [List of Topics](#list-of-topics)

### Prerequisites

Before you begin, ensure that you have the following software installed on your system:

- Node.js: Download and install Node.js from [nodejs.org](https://nodejs.org/).
- npm: npm comes bundled with Node.js, so there is no need for a separate installation.
- Git: Download and install Git from [git-scm.com](https://git-scm.com/).
- Java Development Kit (JDK): Download and install JDK from [oracle.com/java](https://www.oracle.com/java/technologies/javase-jdk15-downloads.html).

### Steps to Run the React App with Manga Harbor Spring Server

#### 1. Clone the Repositories

First, clone the Manga Harbor client and server repositories from GitHub.

```bash
# Clone the Manga Harbor client repository
git clone https://github.com/SaiBarathR/manga-harbor.git

# Clone the Manga Harbor server repository
git clone https://github.com/SaiBarathR/manga-harbor-server.git
```

#### 2. Set Up the Manga Harbor Spring Server

- Navigate to the `manga-harbor-server` directory:

  ```bash
  cd manga-harbor-server
  ```

- Build and run the Spring server using Maven:

  ```bash
  # Build the server
  mvn clean install

  # Run the server
  mvn spring-boot:run
  ```

The Manga Harbor Spring server should now be running on `http://localhost:9000/`.

#### 3. Set Up the Manga Harbor React Client

- Navigate to the `manga-harbor` directory:

  ```bash
  cd ../manga-harbor
  ```

- Install the dependencies:

  ```bash
  npm install
  ```

#### 4. Configure API Endpoint (Optional)

If the Spring server is running on a different port or host, update the API endpoint in the React app. Open the `src/config/app.json` file and modify the `baseUrl` accordingly:

```json
{
  "urls": {
        "manga": "manga/",
        "tags": "manga/tag",
        "grpMangaStats": "statistics/manga",
        "search": "manga/search/",
        "cover": "manga/cover?url=",
        "download": "manga/download/",
        "volumes": "manga/volumeList/"
    },
  "baseUrl": {
    "springBoot": "http://localhost:9000/",
    "mangaDex": "https://api.mangadex.org/"
  }
}
```

Replace `"http://localhost:9000/"` with the appropriate base URL of your Manga Harbor Spring server.

#### 5. Run the React App

- Start the React development server:

  ```bash
  npm start
  ```

The React app should now be running on `http://localhost:3034/`.

You can access the Manga Harbor web application by visiting `http://localhost:3034/` in your web browser.


## Docker Setup

The Manga Harbor client and server can be run using Docker. The Docker images for the client is available on Docker Hub at [saibarathr/manga-harbor-client-docker](https://hub.docker.com/r/meteoldrago/manga-harbor-docker).

### Steps to Run the React App with Manga Harbor Spring Server Using Docker

#### 1. Pull the Docker Images

First, pull the Docker images for the Manga Harbor client and server from Docker Hub.

```bash

# Pull the Manga Harbor client image

docker pull meteoldrago/manga-harbor-docker

```

#### 2. Run the Docker Containers

- Run the Manga Harbor React client using Docker:

  ```bash

  docker run -p 3000:3000 meteoldrago/manga-harbor-docker

  ```

The Manga Harbor React client should now be running on `http://localhost:3000/`.

You can access the Manga Harbor web application by visiting `http://localhost:3000/` in your web browser.

## Kubernetes Setup

The Manga Harbor client and server can be run using Kubernetes. The Kubernetes deployment and service configuration files for the client is available in the `kubernetes` directory.

### Steps to Run the React App Using Kubernetes

#### 1. Create the Kubernetes Deployment and Service

First, create the Kubernetes deployment and service for the Manga Harbor Client.

```bash

# Create Kubernetes namespace if not already created

kubectl create namespace manga-harbor

# Set the current context to the Kubernetes namespace

kubectl config set-context --current --namespace=manga-harbor

# Create the deployment and service for the Manga Harbor Spring server

kubectl apply -f kubernetes/deployment.yaml

kubectl apply -f kubernetes/service.yaml

```

#### 2. Start the Kubernetes Service

Next, start the Kubernetes service for the Manga Harbor client.

```bash

# Check the deployment status

kubectl get deployments -w -n manga-harbor

# Check the service status

kubectl get services -w -n manga-harbor

# start the service

minikube service manga-harbor-service -n manga-harbor

```

#### 3. Access the Manga Harbor Web Application

Starting the service should open the Manga Harbor web application in your default browser. If not, you can access the Manga Harbor web application by visiting the service URL in your web browser.
```bash

# Get the service URL

minikube service manga-harbor-service -n manga-harbor --url


```

### Additional Notes

- Make sure the Manga Harbor Spring server is running while using the React app to ensure seamless communication between the client and server.
- If you encounter any issues or errors during the setup process, refer to the respective documentation of the technologies used (React, Spring Boot) for troubleshooting assistance.

Now you are all set to explore and use Manga Harbor! If you have any more questions or need further assistance, feel free to ask. Happy coding! 🚀

## Features

- **Search:** Easily search for manga titles by name, author, or genre.
- **Detailed Information:** View detailed information about manga titles, including descriptions, ratings, and release status.
- **Download:** Download manga volumes and chapters for offline reading.
- **User-Friendly Interface:** Intuitive and responsive design for seamless user experience across devices.

## How It Works

The Manga Harbor client is built using React and Chakra UI. It communicates with the Manga Harbor Server, a Spring Boot application, to fetch manga data and handle download requests.

### Components

- **Home:** The main page that displays the header, manga details, and toolbar components.
- **Header:** The top bar containing the Manga Harbor logo, search bar, and theme switcher button.
- **Manga Details:** Displays detailed information about the selected manga, including title, description, status, rating, and download options.
- **Toolbar:** Provides options to download manga volumes and chapters. It organizes chapters into volumes for easy navigation and selection.

### Interaction Flow

1. **Search:** Users can enter the manga title they are looking for in the search bar on the header.
2. **View Details:** Upon selecting a manga title from the search results, detailed information about the manga is displayed in the Manga Details component.
3. **Download Manga:** Users can choose to download entire volumes or specific chapters of the manga using the Toolbar component. The selected manga data is sent to the Manga Harbor Server for processing and download.
4. **Offline Reading:** Once downloaded, users can access the downloaded manga volumes and chapters for offline reading.

## Responsiveness

Manga Harbor is designed to be responsive and works seamlessly on various devices, including desktops, tablets, and smartphones. The user interface adjusts dynamically to different screen sizes, ensuring a consistent experience across platforms.

## Manga Harbor Server Integration

The Manga Harbor client interacts with the Manga Harbor Server to fetch manga data and handle download requests. The server-side code provides the necessary API endpoints for the client to communicate with. The server is built using Spring Boot and serves as the backend for Manga Harbor.

## Manga Harbor Server Repository

The Manga Harbor Server repository can be found at [manga-harbor-server](https://github.com/SaiBarathR/manga-harbor-server). Please refer to the server repository for detailed information on server setup, API endpoints, and backend implementation.

## List of Topics

- **Search:** Discover manga titles by searching with keywords, author names, or genres.
- **Manga Details:** Access detailed information about manga, including title, description, status, and rating.
- **Download Options:** Download entire manga volumes or specific chapters for offline reading.
- **Responsiveness:** Seamless user experience across devices with responsive design.
- **Integration:** Client-server interaction and integration with the Manga Harbor Server.
- **Offline Reading:** Downloaded manga can be accessed and read offline.
