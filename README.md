# Bullet Journal API
This is a bullet journal API built using TypeScript and Prisma. Mostly here to experiment with Prisma. Still in draft phase. 

## Requirements
Node.js v14.x or later
npm (or yarn)

### Installation
Clone this repository:
```
git clone https://github.com/robhittme/ts-prisma-bujo.git
```

### Install dependencies:
```
cd ts-prisma-bujo 
npm install
```

Set up your database:
* Create a new PostgreSQL database
* Create a .env file in the project root directory with the following contents (replace DATABASE_URL with your actual database URL):

```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

### Run database migrations:
```
npx prisma migrate dev
```

### Usage
To start the server in development mode, run:

```
npm run dev
```

This will start the server on http://localhost:3000.

![Road Map](roadmap.png "Road Map")
