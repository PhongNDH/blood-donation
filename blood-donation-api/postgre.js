import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import cors from "cors";
import knex from "knex";

const database = knex({
	client: "pg",
	connection: {
		host: "localhost",
		port: 5432,
		user: "postgres",
		password: "Phongsql123",
		database: "blood-donation",
	},
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
	database
		.select("*")
		.from("location")
		.then((data) => {
			res.json(data);
		});
});

//! Register
app.post("/register", (req, res) => {
	const { dob, email, name, gender, phone_number, password, blood_group } =
		req.body;
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(password, salt);
	database.transaction((trx) => {
		trx.insert({
			email,
			password: hash,
		})
			.into("login")
			.returning("email")
			.then((loginEmail) => {
				trx("users")
					.returning("*")
					.insert({
						dob,
						email,
						name,
						gender,
						phone_number,
						blood_group,
					})
					.then((user) => {
						res.json(user[0]);
					})
					.catch((error) => res.status(404).json("Unable to register"));
			})
			.then(trx.commit)
			.catch((err) => {
				trx.rollback;
				res.status(404).json("Unable to register");
			});
	});
});

//! Sign in
app.post("/signin", (req, res) => {
	const { email, password } = req.body;
	database
		.select("email", "password")
		.from("login")
		.where("email", "=", email)
		.then((data) => {
			const isValid = bcrypt.compareSync(password, data[0].password);
			if (isValid) {
				database
					.select("*")
					.from("users")
					.where("email", "=", email)
					.then((user) => {
						res.json(user[0]);
					})
					.catch((error) => {
						res.status(400).json("Unable to signin");
					});
			} else {
				res.status(400).json("Unable to signin");
			}
		})
		.catch((error) => {
			res.status(400).json("Unable to signin");
		});
});

//! Get location
app.get("/get-location", (req, res) => {
	database
		.select("id", "name", "address")
		.from("location")
		.then((locations) => {
			res.json(locations);
		})
		.catch((err) => {
			res.status(400).json("Fail");
		});
});

//! Get gift
app.get("/get-gift", (req, res) => {
	database
		.select("id", "name", "point", "remain")
		.from("gift")
		.orderBy("id")
		.then((gifts) => {
			res.json(gifts);
		})
		.catch((err) => {
			res.status(400).json("Fail");
		});
});

//! User : Donate
app.post("/donate", (req, res) => {
	const { uid, lid, unit, disease } = req.body;
	database("donate")
		.insert({
			uid,
			lid,
			unit,
			disease,
		})
		.then(() => {
			res.json("success");
		})
		.catch((err) => {
			res.status(400).json("Insert donate failed");
		});
});

//! User : Request
app.post("/request", (req, res) => {
	const { uid, unit, reason } = req.body;
	console.log(uid, unit, reason);
	database("request")
		.insert({
			uid,
			unit,
			reason,
		})
		.then(() => {
			res.json("success");
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json("Insert request failed");
		});
});

//! User : Get donation history
app.post("/user-donation-history", (req, res) => {
	const { uid, order, field, content } = req.body;
	var a = order.split(" ");
	var command;
	if (field === "") {
		command = database
			.select("*")
			.from("donate")
			.where("uid", "=", uid)
			.orderBy(a[0], a[1]);
	} else {
		command = database
			.select("*")
			.from("donate")
			.where("uid", "=", uid)
			.andWhere(field, "=", content)
			.orderBy(a[0], a[1]);
	}
	command
		.then((users) => {
			res.json(users);
		})
		.catch((err) => {
			res.status(400).json("Fail");
		});
});

//! User : Get request history
app.post("/user-request-history", (req, res) => {
	const { uid, order, field, content } = req.body;
	var a = order.split(" ");
	var command;
	if (field === "") {
		command = database
			.select("*")
			.from("request")
			.where("uid", "=", uid)
			.orderBy(a[0], a[1]);
	} else {
		command = database
			.select("*")
			.from("request")
			.where("uid", "=", uid)
			.andWhere(field, "=", content)
			.orderBy(a[0], a[1]);
	}
	command
		.then((users) => {
			res.json(users);
		})
		.catch((err) => {
			res.status(400).json("Fail");
		});
});

//! User : Delete donation
app.delete("/user-delete-donation", (req, res) => {
	var { donate_id } = req.body;
	database("donate")
		.where("id", "=", donate_id)
		.del()
		.then(() => {
			res.json("success");
		})
		.catch(() => {
			res.status(400).json("Fail");
		});
});

//! User : Delete request
app.delete("/user-delete-request", (req, res) => {
	var { request_id } = req.body;
	database("request")
		.where("id", "=", request_id)
		.del()
		.then(() => {
			res.json("success");
		})
		.catch(() => {
			res.status(400).json("Fail");
		});
});

//! User : Update donation
app.put("/user-update-donation", (req, res) => {
	const { donate_id, unit, location_id, disease } = req.body;
	database("donate")
		.update({
			unit,
			lid: location_id,
			disease,
		})
		.where("id", "=", donate_id)
		.then(() => {
			res.json("success");
		})
		.catch(() => {
			res.status(400).json("Fail");
		});
});

//! User : Update request
app.put("/user-update-request", (req, res) => {
	const { request_id, unit, reason } = req.body;
	database("request")
		.update({
			unit,
			reason,
		})
		.where("id", "=", request_id)
		.then(() => {
			res.json("success");
		})
		.catch(() => {
			res.status(400).json("Fail");
		});
});

//! User : Receive gift
app.put("/user-receive-gift", (req, res) => {
	const { gift_id, user_id, point } = req.body;
	database.transaction((trx) => {
		trx("receive")
			.insert({
				uid: user_id,
				gid: gift_id,
			})
			.then(() => {
				trx("gift")
					.where("id", "=", gift_id)
					.decrement("remain", 1)
					.then(() => {
						trx("users")
							.returning("*")
							.where("id", "=", user_id)
							.decrement("point", point)
							.then((user) => {
								trx.commit();
								res.json(user[0]);
							})
							.catch((error) => {
								res.status(400).json("Fail" + error);
								trx.rollback;
							});
					})
					.catch((error) => {
						res.status(400).json("Fail" + error);
						trx.rollback;
					});
			})
			.catch((error) => {
				res.status(400).json("Fail" + error);
				trx.rollback;
			});
	});
});

//! User : Get number of donation
app.get("/get-donation-times/:user_id/:status", (req, res) => {
	const { user_id, status } = req.params;
	let query = database("users")
		.count("*")
		.innerJoin("donate", "users.id", "=", "donate.uid")
		.where(1, "=", 1)
		.andWhere("users.id", "=", user_id);
	if (status !== "all") {
		query = query.andWhere("status", "=", status);
	}
	query
		.then((count) => {
			res.json(count[0].count);
		})
		.catch((err) => {
			res.status(400).json("Fail" + err);
		});
});

//! User : Get number of donation
app.get("/get-donation-times/:user_id/:status", (req, res) => {
	const { user_id, status } = req.params;
	let query = database("users")
		.count("*")
		.innerJoin("donate", "users.id", "=", "donate.uid")
		.where("users.id", "=", user_id);
	if (status !== "all") {
		query = query.andWhere("status", "=", status);
	}
	query
		.then((count) => {
			res.json(count[0].count);
		})
		.catch((err) => {
			res.status(400).json("Fail" + err);
		});
});

//! User : Get number of request
app.get("/get-request-times/:user_id/:status", (req, res) => {
	const { user_id, status } = req.params;
	let query = database("users")
		.count("*")
		.innerJoin("request", "users.id", "=", "request.uid")
		.where("users.id", "=", user_id);
	if (status !== "all") {
		query = query.andWhere("status", "=", status);
	}
	query
		.then((count) => {
			res.json(count[0].count);
		})
		.catch((err) => {
			res.status(400).json("Fail" + err);
		});
});

//! User : Get gift statistic
app.get("/get-gift-statistics/:id", (req, res) => {
	const { id } = req.params;
	database("gift")
		.select("gift.name", "gift.point")
		.count("* as quantity")
		.innerJoin("receive", "gift.id", "=", "receive.gid")
		.where("receive.uid", "=", id)
		.groupBy("gift.name", "gift.point")
		.then((gifts) => {
			res.json(gifts);
		})
		.catch((err) => {
			res.status(400).json("Fail" + err);
		});
});

//! Admin : Get user detail
app.post("/user-detail", (req, res) => {
	const {
		order,
		age,
		blood_type,
		donate_location,
		request_location,
		donate_unit,
		request_unit,
	} = req.body;

	let query = database("users")
		.select(
			"dob",
			"name",
			"gender",
			"blood_group",
			"phone_number",
			"point",
			"register_datetime",
			database.raw(
				"SUM(DISTINCT CASE WHEN donate.status = 'approved' THEN donate.unit ELSE 0 END) as donated_amount"
			),
			database.raw(
				"SUM(DISTINCT CASE WHEN request.status = 'approved' THEN request.unit ELSE 0 END) as requested_amount"
			)
		)
		.fullOuterJoin("donate", "users.id", "=", "donate.uid")
		.fullOuterJoin("request", "users.id", "=", "request.uid")
		.where("is_admin", "=", "false");

	if (blood_type !== "") {
		query = query.andWhere("blood_group", "=", blood_type);
	}
	if (donate_location !== "") {
		query = query.andWhere("donate.lid", "=", donate_location);
	}
	if (request_location !== "") {
		query = query.andWhere("request.lid", "=", request_location);
	}
	if (age === 18) {
		query = query.andWhere(
			database.raw("EXTRACT(EPOCH FROM AGE(NOW(), dob)) / 3600 / 8766"),
			"<",
			18
		);
	} else if (age === 60) {
		query = query
			.andWhere(
				database.raw("EXTRACT(EPOCH FROM AGE(NOW(), dob)) / 3600 / 8766"),
				">=",
				18
			)
			.andWhere(
				database.raw("EXTRACT(EPOCH FROM AGE(NOW(), dob)) / 3600 / 8766"),
				"<",
				60
			);
	} else if (age > 60) {
		query = query.andWhere(
			database.raw("EXTRACT(EPOCH FROM AGE(NOW(), dob)) / 3600 / 8766"),
			">=",
			60
		);
	}
	query = query
		.groupBy(
			"dob",
			"name",
			"gender",
			"blood_group",
			"phone_number",
			"point",
			"register_datetime"
		)
		.having(1, "=", 1);
	if (donate_unit !== 0) {
		query = query.andHaving(
			database.raw(
				"SUM(DISTINCT CASE WHEN donate.status = 'approved' THEN donate.unit ELSE 0 END)"
			),
			">=",
			donate_unit
		);
	}
	if (request_unit !== 0) {
		query = query.andHaving(
			database.raw(
				"SUM(DISTINCT CASE WHEN request.status = 'approved' THEN request.unit ELSE 0 END)"
			),
			">=",
			request_unit
		);
	}

	query = query.orderBy(order);

	query
		.then((users) => {
			res.json(users);
		})
		.catch((err) => {
			res.status(400).json("Fail" + err);
		});
});

//! Admin : Get blood-type statistics
app.get("/blood-type-statistics/:location", (req, res) => {
	const { location } = req.params;
	let query = database("location")
		.sum("group_a_plus as a_plus")
		.sum("group_a_minus as a_minus")
		.sum("group_b_plus as b_plus")
		.sum("group_b_minus as b_minus")
		.sum("group_o_plus as o_plus")
		.sum("group_o_minus as o_minus")
		.sum("group_ab_plus as ab_plus")
		.sum("group_ab_minus as ab_minus");
	if (location.length === 0) {
		query = query.where("id", "=", location);
	} else {
		query = query.whereRaw(`id in (${location})`);
	}
	query
		.then((statistics) => {
			res.json(statistics);
		})
		.catch((err) => {
			res.status(400).json("Fail");
		});
});

//! Admin : Get total donors
app.get("/get-total-donors/:location", (req, res) => {
	const { location } = req.params;
	let query = database("donate")
		.countDistinct("users.id as total_donors")
		.join("location", "location.id", "=", "donate.lid")
		.join("users", "users.id", "=", "donate.id")
		.where("donate.status", "=", "approved");
	if (location.length === 0) {
		query = query.andWhere("location.id", "=", 0);
	} else {
		query = query.andWhereRaw(`location.id in (${location})`);
	}
	query
		.then((donors) => {
			res.json(donors);
		})
		.catch((err) => {
			res.status(400).json("Fail");
		});
});

//! Admin : Get total unit
app.get("/get-total-units/:location", (req, res) => {
	const { location } = req.params;
	console.log(location);
	let query = database("location");
	if (location.length === 0) {
		query = query.select("group_a_plus").where("id", "=", 0); // Purpose is return null
	} else {
		query = query
			.select(
				database.raw(
					`SUM(group_a_plus) + SUM(group_a_minus)+ SUM(group_b_plus)+SUM(group_b_minus)+SUM(group_ab_plus)+ SUM(group_ab_minus)+ SUM(group_O_plus)+ SUM(group_O_minus) as total_units`
				)
			)
			.whereRaw(`id in (${location})`);
	}
	query
		.then((units) => {
			res.json(units);
			console.log(units);
		})
		.catch((err) => {
			res.status(400).json("Fail" + err);
			console.log(err);
		});
});

//! Admin : Get total approved requests
app.get("/get-total-requests/:location", (req, res) => {
	const { location } = req.params;
	let query = database("request")
		.countDistinct("users.id as total_requests")
		.join("location", "location.id", "=", "request.lid")
		.join("users", "users.id", "=", "request.id")
		.where("request.status", "=", "approved");

	if (location.length === 0) {
		query = query.andWhere("location.id", "=", 0);
	} else {
		query = query.andWhereRaw(`location.id in (${location})`);
	}
	query
		.then((request) => {
			res.json(request);
		})
		.catch((err) => {
			res.status(400).json("Fail");
		});
});

//! Admin : Get user donation
app.post("/admin-get-donation", (req, res) => {
	const { order, field, content } = req.body;
	let query = database("users")
		.select(
			"users.id as uid",
			"users.name",
			"users.dob",
			"users.blood_group",
			"donate.donate_date",
			"donate.lid",
			"donate.disease",
			"donate.status",
			"donate.unit",
			"donate.id"
		)
		.join("donate", "users.id", "=", "donate.uid")
		.where("donate.status", "=", "pending")
		.orderBy(order);

	if (field !== "all") {
		if (field === "disease" && content === "Have") {
			query = query.andWhere("disease", "!=", "None");
		} else {
			query = query.andWhere(field, "=", content);
		}
	}
	query
		.then((donations) => {
			res.json(donations);
		})
		.catch((error) => {
			res.status(400).json("Fail");
		});
});

//! Admin : Get user request
app.post("/admin-get-request", (req, res) => {
	const { order, field, content, reason } = req.body;
	let query = database("users")
		.select(
			"users.name",
			"users.dob",
			"users.blood_group",
			"request.request_date",
			"request.reason",
			"request.status",
			"request.unit",
			"request.id"
		)
		.join("request", "users.id", "=", "request.uid")
		.where("request.status", "=", "pending")
		.orderBy(order);

	if (field !== "all") {
		if (field === "reason" && content === "Other") {
			query = query.andWhereRaw(`request.reason not in (${reason})`);
		} else {
			query = query.andWhere(field, "=", content);
		}
	}
	query
		.then((donations) => {
			res.json(donations);
		})
		.catch((error) => {
			res.status(400).json("Fail");
		});
});

//! Admin : Get available location
app.post("/admin-get-available-location", (req, res) => {
	const { blood_group, unit } = req.body;
	database("location")
		.select("id", "name", "address")
		.where(blood_group, ">=", unit)
		.then((locations) => {
			res.json(locations);
		})
		.catch((err) => {
			res.status(400).json("Fail");
		});
});

//! Admin : Reject user donation
app.put("/admin-reject-donation", (req, res) => {
	const { donate_id, aid } = req.body;
	console.log(donate_id, aid);
	database("donate")
		.where("id", "=", donate_id)
		.update({
			status: "rejected",
			aid: aid,
			censor_datetime: new Date(),
		})
		.then(() => {
			res.json("Success");
		})
		.catch((err) => {
			console.error(err);
			res.status(400).json("Fail");
		});
});

//! Admin : Reject user request
app.put("/admin-reject-request", (req, res) => {
	const { request_id, aid } = req.body;
	database("request")
		.where("id", "=", request_id)
		.update({
			status: "rejected",
			aid: aid,
			censor_datetime: new Date(),
		})
		.then(() => {
			res.json("Success");
		})
		.catch(() => {
			res.status(400).json("Fail");
		});
});

//! Admin : Approve user donation
app.put("/admin-approve-donation", (req, res) => {
	const { donate_id, aid, lid, blood_group, unit, uid } = req.body;
	console.log(donate_id, aid, lid, blood_group, unit, uid);
	let point;
	if (unit === 250) point = 1;
	else if (unit === 350) point = 2;
	else if (unit === 450) point = 3;
	database.transaction((trx) => {
		trx("donate")
			.where("id", "=", donate_id)
			.update({
				status: "approved",
				aid: aid,
				censor_datetime: new Date(),
			})
			.then(() => {
				trx("location")
					.where("id", "=", lid)
					.update(blood_group, database.raw(`${blood_group} + ${unit}`))
					.then(() => {
						trx("users")
							.where("id", "=", uid)
							.update("point", database.raw(`point + ${point}`))
							.then(() => {
								trx.commit();
								res.json("Success");
							})
							.catch((error) => {
								res.status(400).json("Fail");
								trx.rollback;
							});
					})
					.catch((error) => {
						res.status(400).json("Fail");
						trx.rollback;
					});
			})
			.catch((error) => {
				// console.error(error);
				res.status(400).json("Fail");
				trx.rollback;
			});
	});
});

//! Admin : Approve user request
app.put("/admin-approve-request", (req, res) => {
	const { request_id, aid, lid, blood_group, unit, blood_type } = req.body;
	let point;
	if (unit === 250) point = 1;
	else if (unit === 350) point = 2;
	else if (unit === 450) point = 3;
	database.transaction((trx) => {
		trx("request")
			.where("id", "=", request_id)
			.update({
				status: "approved",
				aid: aid,
				censor_datetime: new Date(),
				lid: lid,
				blood_group_suggestion: blood_type,
			})
			.then(() => {
				trx("location")
					.where("id", "=", lid)
					.update(blood_group, database.raw(`${blood_group} - ${unit}`))
					.catch((error) => {
						res.status(400).json("Fail");
					});
			})
			.then(trx.commit)
			.then(() => {
				res.json("Success");
			})
			.catch((error) => {
				res.status(400).json("Fail");
				trx.rollback;
			});
	});
});

//! Admin : Get donation history
app.post("/admin-donation-history", (req, res) => {
	const { aid, order, field, content } = req.body;
	var a = order.split(" ");
	let query = database("donate")
		.select(
			"name",
			"dob",
			"blood_group",
			"unit",
			"disease",
			"donate_date",
			"lid",
			"status",
			"donate.id",
			"censor_datetime"
		)
		.join("users", "donate.uid", "=", "users.id")
		.where("aid", "=", aid);
	if (field !== "all") {
		query = query.andWhere(field, "=", content);
	}
	if (a.length === 0) {
		query = query.orderBy(order);
	} else {
		query = query.orderBy(a[0], a[1]);
	}
	query
		.then((users) => {
			res.json(users);
		})
		.catch((err) => {
			res.status(400).json("Fail");
		});
});

//! Admin : Get request history
app.post("/admin-request-history", (req, res) => {
	const { aid, order, field, content, reason } = req.body;
	var a = order.split(" ");
	let query = database("request")
		.select(
			"name",
			"dob",
			"blood_group",
			"unit",
			"reason",
			"request_date",
			"lid",
			"status",
			"request.id",
			"censor_datetime",
			"blood_group_suggestion"
		)
		.join("users", "request.uid", "=", "users.id")
		.where("aid", "=", aid);
	if (field !== "all") {
		if (field === "reason" && content === "Other") {
			query = query.andWhereRaw(`reason not in (${reason})`);
		} else {
			query = query.andWhere(field, "=", content);
		}
	}
	if (a.length === 0) {
		query = query.orderBy(order);
	} else {
		query = query.orderBy(a[0], a[1]);
	}
	query
		.then((users) => {
			res.json(users);
		})
		.catch((err) => {
			res.status(400).json("Fail" + err);
		});
});

app.listen(3000, () => {
	console.log("App is running on port 3000");
});
