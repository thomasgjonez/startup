# CS 260 Notes

[My startup](https://simon.cs260.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS Notes

I am renting a server that is a t2.nano with a public and elastic ip address: 44.223.153.237 Please note that this is free for a year. Additonally, the elastic ip address will reset when I stop the server. This was all done through AWS EC2 instances. I rented a domain called cs260-catchphrase.click for $3 a year and then made the website secure by editing my caddy file and updating it with my domain name. Link to the website- https://cs260-catchphrase.click/

## HTML Notes

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### General Notes

During the github excercise I learned how to synch changes made between terminal, vscode, and the online version.


### Deploying to prod

Sometimes the json packages/dependcies don't carry over so you have to install it on the machine through ssh ing in. Also some paths might not line up right in dev since they are meant for prod. Only the ones relating to the shared folder/gameEvent.js with the websocket.