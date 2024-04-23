import pkg from 'pg';
const { Pool } = pkg;

const config = {
	server: "DESKTOP-K11NF9M",
	user: "sa",
	password: "phongSQL",
	database: "BloodDonation",
	driver: "msnodesqlv8",
	options: {
		trustedConnection: true,
	},
};

const config2 = {
	user: "postgres",
	password: "Phongsql123",
	host: "localhost",
	database: "blood-donation",
	port: 5432, // PostgreSQL default port is 5432
};

const pool = new Pool(config2);


async function connectToDatabase() {
	try {
		await pool.connect();
		console.log("Connected to PostgreSQL");
	} catch (error) {
		console.error("Error connecting to PostgreSQL:", error);
	}
}

connectToDatabase();
