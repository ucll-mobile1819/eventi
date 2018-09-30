# Project structure
Due to the issue of GitHub Classroom not supporting multiple repositories, both our back-end and front-end for the Eventi application are included in this directory. They are seperated by using different branches: `master-back-end` and `master-react-native`. The master branch remains empty.

### Run
First time:
```sh
$ npm install
$ cp .env-example .env # Fill in .env with correct info
```

Run server:
```sh
$ node bin/www
```