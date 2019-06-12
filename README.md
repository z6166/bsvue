# bs-vue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# Nginx部署

修改/etc/nginx/sites-enabled/default
```$xslt
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        root /var/www/dist; #根目录

        index index.html;

        server_name _;

        location / {
                root /var/www/dist; #根目录
                try_files $uri $uri/ /index.html =404;
        }
}
```
