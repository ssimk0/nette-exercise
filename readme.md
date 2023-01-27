Nette Web Exercise

Requirements
------------

- Web Project for Nette 3.1 requires PHP 8

Web Server Setup
----------------

The simplest way to get started is to start the built-in PHP server in the root directory of your project:
    
    composer install
    yarn install && yarn dev
	php -S localhost:8091 -t www 

Then visit `http://localhost:8091` in your browser to see the welcome page.

The port localhost 8091 enable vite to hot reload and improve the speed of development less / react app for the purpose of testing without debug and vite support use diffrent, but firstly run:
   
    yarn run build

to compile source code for react part

**It is CRITICAL that whole `app/`, `config/`, `log/` and `temp/` directories are not accessible directly
via a web browser. See [security warning](https://nette.org/security-warning).**
