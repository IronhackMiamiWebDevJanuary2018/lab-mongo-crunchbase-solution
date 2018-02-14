const MongoDB = require('mongodb');
const mongoClient = MongoDB.MongoClient;
const clear = require('clear');
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const url = `mongodb://localhost:27017/crunchbase`

mongoClient.connect(url, (error, db) => {
	function mainMenu(){
		clear();
		printMenu();
		rl.question('Type an option: ', (option) => {
			switch(option){
				case "1":
					// List by name all companies.
					db.collection('companies').find({}, {name: 1, _id: 0}).toArray((error, result) => {
						if (error) {
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
							result.forEach( (company, index) => { console.log(`${index+1}.- ${company.name}`) } );
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					})
					break;
				case "2":
					// How many companies are there?
					db.collection('companies').count({}, (error, result) => {
						if (error) {
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
							console.log(`There are ${result}`);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					});
					break;
				case "3":
					// How many companies were founded in 2004?
					db.collection('companies').count({"founded_year": 2004}, (error, result)=>{
						if (error) { 
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
							console.log(`Number of companies founded in 2004: ${result}`);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					});
					break;
				case "4":
					// List by name all companies founded in february of 2004.
					db.collection('companies').find({"founded_year": 2004, "founded_month": 2},{name: 1, founded_month:1, _id:0}).toArray((error, result)=>{
						if (error) { 
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
							result.forEach( (company)=>{ console.log(`name: ${company.name} - month: ${company.founded_month}`) } )
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					});
					break;
				case "5":
					// List by name all companies founded in the summer of 2004 (april to june) sorted by date
					db.collection('companies').find({
						"founded_year": 2004,
							$and: [
								{"founded_month": {$gte: 4}},
								{"founded_month": {$lte: 6}}
							]
						}
						,{name: 1, founded_month: 1, founded_year: 1, _id:0}).toArray((error, result)=>{
						if (error) { 
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
							result.forEach( (company)=>{ console.log(`name: ${company.name} - month: ${company.founded_month}`) } )
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					});
					break;
				case "6":
					// What companies have offices in "Barcelona"
					db.collection('companies').find({"offices.city": "Barcelona"},{name: 1, _id:0}).toArray((error, result)=>{
						if (error) { 
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
							result.forEach(company => console.log(`${company.name}`))
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					});
					break;
				case "7":
					// List the 10 companies with more employees sorted ascending (show name and employees).
					// db.companies.createIndex({number_of_employees: -1})
					db.collection('companies').find({}, {name: 1, number_of_employees: 1}).sort({number_of_employees: -1}).limit(10).toArray((error, result)=>{
						if (error) { 
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
							result.forEach( (company) => {console.log(`${company.name}: ${company.number_of_employees} employees`);})
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					});
					break;
				case "8":
					// Find the company with the name "Facebook"
					db.collection('companies').find({name: "Facebook"}).toArray((error, result)=>{
						if (error) { 
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
							console.dir(result[0].name);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					});
					break;
				case "9":
					// How many employees has Facebook?
					db.collection('companies').find({name: "Facebook"}, {name: 1, number_of_employees: 1}).toArray((error, result)=>{
						if (error) { 
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
							let company = result[0]
							console.dir(`${company.name} has ${company.number_of_employees}`);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					});
					break;
				case "10":
					// List the name of all the products of Facebook
					db.collection('companies').find({name: "Facebook"}, {"products.name": 1}).toArray((error, result)=>{
						if (error) { 
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
							result[0].products.forEach( product => console.log(product.name) );
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					});
					break;
				case "11":
					// List the people that are working at Facebook right now (check relationships field)
					db.collection('companies').find({name: "Facebook"}, {"relationships": 1}).toArray((error, result)=>{
						if (error) { 
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
							result[0].relationships.filter((person)=>{
								return person.is_past === false;
							}).forEach((worker)=>{
								console.log(`${worker.person.first_name} ${worker.person.last_name}: ${worker.is_past}`);
							})
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					});
					break;
				case "12":
					// How many people are not working anymore at Facebook
					db.collection('companies').find({name: "Facebook"}, {"relationships": 1}).toArray((error, result)=>{
						if (error) { 
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
							console.log(result[0].relationships.filter( person => person.is_past === false ).length);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					});
					break;
				case "13":
					// List all the companies where "david-ebersman" has worked
					db.collection('companies').find({"relationships.person.permalink": "david-ebersman"}, {"name": 1 ,"relationships": 1}).toArray((error, result)=>{
						if (error) { 
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
							result.forEach((company) => {
								console.log(`${company.name}`)	
							})
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					});
					break;
				case "14":
					// List by name the competitors of Facebook
					db.collection('companies').find({name: "Facebook"}, {"competitions": 1}).toArray((error, result)=>{
						if (error) { 
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
								result[0].competitions.forEach((competitor)=>{
								console.log(`${competitor.competitor.name}`);
							})
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					});
					break;
				case "15":
					// Names of the companies that has "social-networking" in tag-list (be aware that the value of field is a string check regex operators)
					db.collection('companies').find({tag_list: {$regex: /social-networking/ }}, {"name": 1, "tag_list": 1}).toArray((error, result)=>{
						if (error) { 
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
							result.forEach((company)=>{
								console.log(`${company.name} tag list is: ${company.tag_list}`);
							})
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					});
					break;
				case "16":
					// How many companies that has "social-network" in tag-list and founded between 2002 and 2016 inclusive
					db.collection('companies').find({
						tag_list: {$regex: /social-networking/ },
						$and: [ {founded_year: { $gte: 2002}}, {founded_year: { $lte: 2016}} ]
					}, {"name": 1, "founded_year": 1,"tag_list": 1}).toArray((error, result)=>{
						if (error) { 
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
							result.forEach((company)=>{
								console.log(`${company.name} tag list is: ${company.tag_list}`);
							})
							console.log(`Total: ${result.length}`);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					});
					break;
				case "17":
					// Names and locations of companies that have offices in London
					db.collection('companies').find({"offices.city": "London"},{name: 1, offices:1, _id:0}).toArray((error, result)=>{
						if (error) { 
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
							result.forEach((company)=>{
								let cities = company.offices.map(office => ` ${office.city}`)
								console.log(`${company.name} has offices in: ${cities}`);
							})
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					});
					break;
				case "18":
					// How many companies that has "social-network" in tag-list and founded between 2002 and 2016 inclusive and has offices in New York
					db.collection('companies').find(
						{	
							"offices.city": "New York",
							tag_list: {$regex: /social-networking/ },
							$and: [ {founded_year: { $gte: 2002}}, {founded_year: { $lte: 2016}} ]
						}
						,{name: 1, offices:1, "founded_year": 1, _id:0}).toArray((error, result)=>{
						if (error) { 
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
							console.dir(`Total: ${result.length}`);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					});
					break;
				case "19":
					// Extra
					db.collection('companies').distinct('category_code', (error, result)=>{
						if (error) { 
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
							console.log(result);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					});
					break;
				case "20":
					// Extra
					db.collection('companies').find(
						{	
							$text:
					    {
					      $search: "Google"
					    }
						}
						,{name: 1, _id:0}).toArray((error, result)=>{
						if (error) { 
							console.log(error);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
						} else {
							console.dir(result);
							rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
						}
					});
					break;
				case "21":
					// Extra
					db.collection('companies').aggregate([
							{ $match: { founded_year: 2004 } },
					    { $project: {
					        _id: 0,
					        name: 1,
					        funding_rounds: 1,
					        num_rounds: { $size: "$funding_rounds" }
					    } },
					    { $match: { num_rounds: { $gte: 5 } } },
					    { $project: {
					        name: 1,
					        avg_round: { $avg: "$funding_rounds.raised_amount" }
					    } },
					    { $sort: { avg_round: 1 } }
						],
						(err, result) => {
							if (error) { 
								console.log(error);
								rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});
							} else {
								console.dir(result);
								rl.question(`\nType enter to continue: `, (answer) => {mainMenu()});	
							}
						}
					)
					break;
				case "0":
					console.log(`Bye\n`);
					db.close((error) => {
						process.exit(0);	
					});
					break;
				default:
					mainMenu();
					break;
			}
		});
	}	
	mainMenu();
});




function printMenu(){
	console.log(`
0.- Exit
1.- List by name all companies.
2.- How many companies are there?
3.- How many companies were founded in 2004?
4.- List by name all companies founded in february of 2004.
5.- List by name all companies founded in the summer of 2004 (april to june) sorted by date.
6.- What companies have offices in "Barcelona".
7.- List the 10 companies with more employees sorted ascending (show name and employees).
8.- Find the company with the name "Facebook"
9.- How many employees has Facebook?
10.- List the name of all the products of Facebook
11.- List the people that are working at Facebook right now (check relationships field)
12.- How many people are not working anymore at Facebook
13.- List all the companies where "david-ebersman" has worked. 
14.- List by name the competitors of Facebook
15.- Names of the companies that has "social-networking" in tag-list (be aware that the value of field is a string check regex operators)
16.- How many companies that has "social-network" in tag-list and founded between 2002 and 2016 inclusive
17.- Names and locations of companies that have offices in London
18.- How many companies that has "social-network" in tag-list and founded between 2002 and 2016 inclusive and has offices in New York
19.- Find all the distinct categories, so list all unique categories
20.- How many companies mention Google in their overview.
21.- Find companies founded in 2004 and having 5 or more rounds of funding, calculate the average amount raised.
`);
}