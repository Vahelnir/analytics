FROM node:18-alpine

COPY --from=builder /usr/src/analytics/ .
CMD ["node", "backend/dist/main.js"]
EXPOSE 3000
