FROM openjdk:16-jdk-alpine
# Install GraphViz
RUN apk add --update --no-cache graphviz ttf-freefont
# Set up the workdir
WORKDIR /app
# Downloads the PostgreSQL Java Driver
ADD "https://jdbc.postgresql.org/download/postgresql-42.2.18.jar" "/app/drivers/postgresql-42.2.18.jar"
# Downloads the SchemaSpy application
ADD "https://github.com/schemaspy/schemaspy/releases/download/v6.1.0/schemaspy-6.1.0.jar" "/app/schemaspy-6.1.0.jar"
# Copy your schema configuration
COPY database.cfg /app

# Our Command:
# java -jar /app/schemaspy-6.1.0.jar -configFile /app/database.cfg -o /output -imageformat svg -hq
CMD [ \
    "java", "-jar", "/app/schemaspy-6.1.0.jar", \
    "-configFile", "/app/database.cfg", \
    "-o", "/output", \
    "-imageformat", "svg", "-hq", "-nopages"\
]
