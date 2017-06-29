## Installation

This library built on top of NodeJS. You can run the library using docker-compose for easy deployment or developing.

##### Using UNIX Based
1. Install dependencies using `npm install`
2. Build the library using Gulp `gulp build`
3. Run the server using `npm start`

#### Using Docker
1. Build the container using `docker-compose build`
2. Build the library using Gulp `docker-compose run web gulp build`
3. Run the server using `docker-compose up`
