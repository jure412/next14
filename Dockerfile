FROM node:20.11.0 as base

RUN apt-get update && apt-get install -y postgresql-client

WORKDIR /app

FROM base AS deps

# Copy package.json to /app
COPY package.json ./

# Copy available lock file
COPY package.json yarn.lock* ./

# Instal dependencies according to the lockfile
RUN  yarn install

# Disable the telementary
ENV NEXT_TELEMETRY_DISABLED 1

# ***********
# inter stage
# ***********
FROM deps AS inter

# Copy all other files excluding the ones in .dockerignore
COPY . .

COPY docker-entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

RUN npx prisma generate

# exposing the port
EXPOSE 3000

# **********
# prod stage
# **********
FROM inter AS prod

RUN npm run build

CMD ["yarn", "run", "start"]

ENTRYPOINT ["./docker-entrypoint.sh"]

# **********
# dev stage
# **********
FROM inter AS dev

CMD ["yarn", "run", "dev"]

ENTRYPOINT ["./docker-entrypoint.sh"]

