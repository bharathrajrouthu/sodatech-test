# Steps to Run

## Step 1:
**_NOTE:_** Skip these steps to avoid setting up local MySQL DB and Server and move to Step 2 for testing the App.

First, run the MySQL Server from local laptop:

```bash
mysql -u test -p
```
Then, enter the *test* password

```bash
CREATE DATABASE todo_db;
CREATE USER 'test'@'localhost' IDENTIFIED BY 'test';
GRANT ALL PRIVILEGES ON todo_db.* TO 'test'@'localhost';
FLUSH PRIVILEGES;
exit;
```

Then, start the mysql server as test user

```bash
mysql -u test -p
```

## Testing the App

## Step 2:  Run the development server:

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


