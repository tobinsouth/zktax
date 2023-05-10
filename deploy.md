# Deployment

The folowing instructions are specific to our deployment on zktax.media.mit.edu

Code was put on to the server using git clone.

---
Notes by Tobin

First you’re going to need to install nginx and nodejs (via nvm).

Start with `sudo apt update` and `sudo apt install nginx`

You make want to convert to `bash` and make an easily edited user home directory for local installs (e.g. `sudo mkdir -m 777 /home/tsouth`).
`sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash` and run `source ~/.bashrc` (you may need to manually add the lines or create the file if it doesn’t exist). 

You can then run `nvm install 20` and `nvm use 20`.

I had to manually add this local node installation to the sudo path by adding `Defaults secure_path=“/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin:/home/tsouth/.nvm/versions/node/v20.1.0/bin”` to `/etc/sudoers` (you can use `sudo visudo` to edit this file).

Now we create the nginx files to run the server. `sudo nano /etc/nginx/sites-available/default` should become:
```
server {
    listen 80;
    server_name zktax.media.mit.edu;
    root /var/www/html/zktax/build;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Each time there is a change to the code, you can pull and rebuild on the server. In order to build you will have to have the flags `export NODE_OPTIONS="--max-old-space-size=8192 --openssl-legacy-provider"` set to fix key build issues on the server with node version 20 (`nvm use 20`, which must be set each time). 

We can then run:
```
cd ~/zktax/app && rm -rf /var/www/html/zktax/build && rm -rf node_modules/.cache 
yarn build && mv build /var/www/html/zktax && sudo service nginx restart
```
