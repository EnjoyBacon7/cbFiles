FROM node AS node
WORKDIR /web
ADD web/package.json web/package-lock.json ./
RUN npm install;
ADD web/ .
RUN npm run build

FROM golang AS golang
WORKDIR /
ADD . /
COPY --from=node /web/build/ /web/build/
RUN CGO_ENABLED=0 go build -o /cbFiles server/main.go

FROM scratch
COPY --from=golang /cbFiles /cbFiles

EXPOSE 8080

ENTRYPOINT [ "/cbFiles" ]

LABEL "org.opencontainers.image.authors"="camille.bizeul@icloud.com"