const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    info: () => `This is an API clone of HackerNews`,
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany();
    },
    link: (parent, args, context) => {
      return context.prisma.link.findUnique({
        where: {
          id: Number(args.id),
        },
      });
    },
  },
  Mutation: {
    post: (parent, args, context, info) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      });
      return newLink;
    },
    updateLink: (parent, args, context, info) => {
      const oldLink = context.prisma.link.findUnique({
        where: {
          id: Number(args.id),
        },
      });
      const newLink = context.prisma.link.update({
        where: {
          id: Number(args.id),
        },
        data: {
          id: Number(args.id),
          url: args.url != null ? args.url : oldLink.url,
          description:
            args.description != null ? args.description : oldLink.description,
        },
      });
      return newLink;
    },
    deleteLink: (parent, args, context, info) => {
      const record = context.prisma.link.delete({
        where: {
          id: Number(args.id),
        },
      });
      return record;
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
