<a name="readme-top"></a>


<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest



  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>


## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* Node.js 20.* and above
* Pnpm - [Download & Install pnpm](https://pnpm.io/installation). Pnpm package manager.

### A typical top-level directory layout

    .
    ├── ...
    ├── datawow-blog                    # Your project directory
    │   ├── data-wow-frontend         # clone and installation frontend
    │   ├────── .env                         # Your Frontend environments
    │   ├── data-wow-backend         # clone and installation backend
    │   ├────── .env                         # Your Backend environments
    │   └── docker-compose.yml          # docker file for start web application


## Installation

```bash
$ pnpm install
```


## Setup

> Use your own env or retrive it from ".env.example"

```
NODE_ENV=development
PORT=4444

# * BACKEND BASE ENDPOINT
BASE_ENDPOINT="http://localhost:4444"

# * JWT SECRET
JWT_SECRET=tottee

# * DATABASE URL
# postgresql://{database_username}:{database_password}@db:5432/{database_name}
DATABASE_URL=
```


## Running the app

```bash
# development
$ pnpm start

# watch mode
$ pnpm start:dev

# production mode
$ pnpm start:prod
```


## Contact

Pongsakorn Parsoppornpiboon - pongsakorn.psb@gmail.com
<br />
Github : https://github.com/Pongsakorn2341

<p align="right">(<a href="#readme-top">back to top</a>)</p>
