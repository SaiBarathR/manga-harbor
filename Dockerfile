# Build React app
FROM node:20-alpine as react-build
WORKDIR /app
COPY . ./
RUN npm install
RUN npm run build   

# Production environment 
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# docker build -t manga-harbor-mh .
# docker run -p 8080:80 manga-harbor-mh
