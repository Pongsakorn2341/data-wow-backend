FROM node:20-alpine AS base

RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
USER node

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
# RUN pnpm build
# RUN pnpm prune --prod

FROM base AS deploy


WORKDIR /app
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules
COPY entrypoint.sh ./
ENTRYPOINT ["sh", "entrypoint.sh"]

# CMD [ "node", "dist/main.js" ]


# # Create app directory
# WORKDIR /usr/src/app

# # Copy application dependency manifests to the container image.
# COPY package.json pnpm-lock.yaml ./

# # Install pnpm globally
# RUN npm install -g pnpm

# # Install app dependencies using pnpm
# RUN pnpm install

# # Copy all local files to the container, excluding node_modules
# COPY . ./

# # Use the node user from the image (instead of the root user)
# USER node

# ###################
# # BUILD FOR PRODUCTION
# ###################

# FROM node:20-alpine AS build

# WORKDIR /usr/src/app

# # Copy application dependency manifests to the container image
# COPY package.json pnpm-lock.yaml ./

# # Install pnpm globally
# RUN npm install -g pnpm

# # Install dependencies including Prisma CLI
# RUN pnpm install

# # Copy the node_modules from the development stage
# COPY --from=development /usr/src/app/node_modules ./node_modules

# # Copy all local files to the container, excluding node_modules
# COPY . ./

# # Generate Prisma client
# RUN npx prisma generate

# # Run the build command which creates the production bundle
# RUN pnpm build

# USER node

# ###################
# # PRODUCTION
# ###################

# FROM node:20-alpine AS production

# WORKDIR /usr/src/app

# # Copy the node_modules and built files from the build stage to the production image
# COPY --from=build /usr/src/app/node_modules ./node_modules
# COPY --from=build /usr/src/app/dist ./dist
# COPY --from=build /usr/src/app/.env .env
# COPY --from=build /usr/src/app/prisma ./prisma

# # Copy the entrypoint script to the production image
# COPY entrypoint.sh ./

# EXPOSE 4444

# # Start the server using the production build
# ENTRYPOINT ["sh", "entrypoint.sh"]
