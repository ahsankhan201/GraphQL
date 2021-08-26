var express = require("express");

const app = express();
const PORT = 6969;
const userData = require("./mockdata.json");
const graphql = require("graphql");
const {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLInt,
	GraphQLString,
	GraphQLList,
	GraphQLID,
} = graphql;
var { graphqlHTTP } = require("express-graphql");

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: { type: GraphQLInt },
		firstName: { type: GraphQLString },
		lastName: { type: GraphQLString },
		email: { type: GraphQLString },
		password: { type: GraphQLString },
	}),
});

const RootQuery = new GraphQLObjectType({
	name: "query",
	fields: {
		getAllUsers: {
			type: new GraphQLList(UserType),
			args: { id: { type: GraphQLInt } },
			resolve(parent, args) {
				return userData;
			},
		},
	},
});
const Mutation = new GraphQLObjectType({
	name: "mutation",
	fields: {
		createUser: {
			type: UserType,
			args: {
				firstName: { type: GraphQLString },
				lastName: { type: GraphQLString },
				email: { type: GraphQLString },
				password: { type: GraphQLString },
			},

			resolve(parent, args) {
				userData.push({
					id: userData.length + 1,
					firstName: "test",
					lastName: "tst",
					email: args.email,
					password: args.password,
				});
				return args;
			},
		},
	},
	fields: {
		findUser: {
			type: new GraphQLList(UserType),
			args: {
				id: { type: GraphQLID },
			},

			resolve(parent, args) {
				const id = args.id;
				let user = userData.map((data) => {
					if (data.id === 1) {
						return data;
					}
				});
				if (user && user.length) {
					console.log("data", user);

					return user;
				}
			},
		},
	},
});

const schema = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
app.use(
	"/graphql",
	graphqlHTTP({
		schema,
		graphiql: true,
	})
);
app.listen(PORT, () => {
	console.log("App is Listening to port number ", `${PORT}`);
    console.log("URL: <hostName>:6969/graphql");
});
