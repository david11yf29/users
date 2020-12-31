const graphql = require('graphql');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} = graphql;


// {
//   "users": [
//     { "id": "23", "firstName": "Bill", "age": 20, "companyId": "1" },
//     { "id": "40", "firstName": "Alex", "age": 40, "companyId": "2" },
//     { "id": "41", "firstName": "Nick", "age": 40, "companyId": "2" }
//   ],
//   "companies": [
//     { "id": "1", "name": "Apple", "description": "iphone" },
//     { "id": "2", "name": "Google", "description": "search" }
//   ]
// }

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString }
  }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        // console.log(parentValue, args);
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then(res => res.data);
      }
    }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(res => res.data);
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(res => res.data);
      } 
    }
  }
}); 

module.exports = new GraphQLSchema({
  query: RootQuery
});