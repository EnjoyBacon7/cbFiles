FROM node AS web_build
WORKDIR /web
ADD web/ .
RUN npm install;
RUN npm run build

FROM golang AS go_build
WORKDIR /
ADD . /
COPY --from=web_build /web/build/ /web/build/
RUN CGO_ENABLED=0 go build -o /cbFiles server/main.go

FROM scratch
COPY --from=go_build /cbFiles /cbFiles

EXPOSE 8080

ENTRYPOINT [ "/cbFiles" ]

LABEL "org.opencontainers.image.authors"="camille.bizeul@icloud.com"