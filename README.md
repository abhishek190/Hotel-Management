# Vitual labs

# Description 
This is a project build for the students who are pursuing any kind of engineering degree or any field 
which requires lab practices.! In this project anyone can register his/her account and practices any
lab which he/she need. Anyone can register through his social media account such as google /facebook etc.
One can also register through his/her local account. 
Besides that anyone who have build a lab and wants to add it to the virtual lab can do so.!
To publish the lab one should sent the request containing the branch and description of the lab he have built.! Based on the request admin can accept/reject his her lab.!

---
## Requirements

For development, you will only need Node.js and a node global package, npm/yarn , installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###
### Yarn installation
  After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn

---

## Installing the required libraries.!

   Step 1: Open the project in any text editor eg: sublime / vs code etc. 
   Step 2: Open the terminal(mac/linux/ubuntu)/command prompt(windows) and move to the directory of the  project i.e the folder of the project in which you have saved it.
   Step 3: To run the project one need to install the required libraries:
           Run: $ npm install
                or 
                $ yarn install to download all the required libraries.
            wait for the process to finish (might take some time :/)

## Running the project

    $ npm start
    or
    $ yarn start


## Simple build for production

    $ yarn build
    or 
    $ npm build