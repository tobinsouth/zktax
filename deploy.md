# Deployment

The following instructions are specific to our deployment on zktax.media.mit.edu

The website is running on a small VM hosted at MIT. To set up this server you’re going to need `nginx` and `nodejs` (via nvm as some node versions cause issues). We recommend using node version 20.

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

To deploy the code to the server, we use a GitHub action in `.github/workflows/ssh.yaml` to build on Github and then scp the new files to the server. You need to set the ssh secret repository variables for this to work. Not that the scp should copy but not use the rm flag as we will want to keep some large files.

We now need to manually scp some files that are too large for Github to the server. Specifically `verification_key1500.json` is too large to live on Github, and if you want to process large JSON tax files, you'll need to generate it using `app/src/zkproof/README.md` and a large powers of tau. 
