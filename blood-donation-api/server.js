import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import cors from "cors";
import sql from "mssql/msnodesqlv8.js";

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

const conn = new sql.ConnectionPool(config).connect().then((pool) => {
	return pool;
});

sql.connect(config)
	.then(() => {
		console.log("Connected to SQL Server");
	})
	.catch((err) => {
		console.error("Error connecting to SQL Server", err);
	});

const app = express();
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(cors());

// Get user
app.get("/", async (req, res) => {
	var pool = await conn;
	var query = "select * from Users";
	return await pool.request().query(query, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json(users.recordset);
		}
	});
});

//Signin
app.post("/signin", async (req, res) => {
	const { email, password } = req.body;
	var pool = await conn;
	var stringQuery = `select Email,Password from Logins where Email = @email`;
	var stringQuery2 = `select * from Users where Email = @email`;
	await pool
		.request()
		.input("email", sql.NVarChar, email)
		.query(stringQuery, (err, result) => {
			if (err || result.recordset[0] === undefined) {
				res.status(400).json("Unable to signin");
			} else {
				if (bcrypt.compareSync(password, result.recordset[0].Password))
					return pool
						.request()
						.input("email", sql.NVarChar, email)
						.query(stringQuery2, (err, result) => {
							if (err) {
								res.status(400).json("Unable to signin");
							} else {
								res.json(result.recordset[0]);
							}
						});
				else {
					res.status(400).json("Unable to signin");
				}
			}
		});
});

//Register
app.post("/register", async (req, res) => {
	const { dob, email, name, gender, phone_number, password, blood_group } =
		req.body;
	var pool = await conn;
	var stringQuery = `insert into Users (Dob, Name, Email,Gender,Phone_number,Blood_group) 
  output inserted.*
  values (@dob,@name,@email,@gender,@phone_number,@blood_group)`;
	var stringQueryInserted = `insert into Logins (Email,Password) values (@email,@password)`;
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(password, salt);
	await pool
		.request()
		.input("email", sql.NVarChar, email)
		.input("password", sql.NVarChar, hash)
		.query(stringQueryInserted, (err) => {
			if (err) {
				res.status(400).json("Unable to register");
			} else {
				return pool
					.request()
					.input("dob", sql.Date, dob)
					.input("email", sql.NVarChar, email)
					.input("name", sql.NVarChar, name)
					.input("gender", sql.NVarChar, gender)
					.input("phone_number", sql.NVarChar, phone_number)
					.input("blood_group", sql.NVarChar, blood_group)
					.query(stringQuery, (err, user) => {
						if (err) {
							res.status(400).json("Unable to register");
						} else {
							res.json(user.recordset[0]);
						}
					});
			}
		});
});

//Get location
app.get("/get-location", async (req, res) => {
	var pool = await conn;
	var query = "select Location_id, Location_name, Address from Location";
	return await pool.request().query(query, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json(users.recordset);
		}
	});
});

//Get gift
app.get("/get-gift", async (req, res) => {
	var pool = await conn;
	var query = "select Gift_id, Gname, Point, Remain from Gift";
	return await pool.request().query(query, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json(users.recordset);
		}
	});
});

//User : Donate
app.post("/donate", async (req, res) => {
	const { uid, lid, unit, disease } = req.body;
	var pool = await conn;
	var stringQuery = `insert into Donate(Uid,Lid, Unit,Disease) values (@uid, @lid, @unit, @disease)`;

	return await pool
		.request()
		.input("uid", sql.Int, uid)
		.input("lid", sql.Int, lid)
		.input("unit", sql.Int, unit)
		.input("disease", sql.NVarChar, disease)
		.query(stringQuery, (err, result) => {
			if (err) {
				res.status(400).json("Insert Donate failed");
			} else {
				res.json("success");
			}
		});
});

//User : Request
app.post("/request", async (req, res) => {
	const { uid, unit, reason } = req.body;
	var pool = await conn;
	var stringQuery = `insert into Request(Uid,Unit,Reason) values (@uid, @unit, @reason)`;

	return await pool
		.request()
		.input("uid", sql.Int, uid)
		.input("unit", sql.Int, unit)
		.input("reason", sql.NVarChar, reason)
		.query(stringQuery, (err, result) => {
			if (err) {
				res.status(400).json("Insert Donate failed");
			} else {
				res.json("success");
			}
		});
});

//User : Get donation history
app.post("/user-donation-history", async (req, res) => {
	const { uid, order, field, content } = req.body;
	var pool = await conn;
	var stringQuery;
	if (field === "") {
		stringQuery = `select * from Donate where Uid = @uid order by ${order}`;
	} else {
		stringQuery = `select * from Donate where Uid = @uid and ${field} = '${content}' order by ${order}`;
	}
	return await pool
		.request()
		.input("uid", sql.Int, uid)
		.query(stringQuery, (err, users) => {
			if (err) {
				res.status(400).json("Fail");
			} else {
				res.json(users.recordset);
			}
		});
});

//User : Get request history
app.post("/user-request-history", async (req, res) => {
	const { uid, order, field, content } = req.body;
	var pool = await conn;
	var stringQuery;
	if (field === "") {
		stringQuery = `select * from Request where Uid = @uid order by ${order}`;
	} else {
		stringQuery = `select * from Request where Uid = @uid and ${field} = '${content}' order by ${order}`;
	}
	return await pool
		.request()
		.input("uid", sql.Int, uid)
		.query(stringQuery, (err, users) => {
			if (err) {
				res.status(400).json("Fail");
			} else {
				res.json(users.recordset);
			}
		});
});

//User : Delete donation
app.post("/user-delete-donation", async (req, res) => {
	var { donate_id } = req.body;
	var pool = await conn;
	var stringQuery = `delete Donate where Donate_id = ${donate_id}`;
	return await pool.request().query(stringQuery, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json("success");
		}
	});
});

//User : Delete request
app.post("/user-delete-request", async (req, res) => {
	var { request_id } = req.body;
	var pool = await conn;
	var stringQuery = `delete Request where Request_id = ${request_id}`;
	return await pool.request().query(stringQuery, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json("success");
		}
	});
});

// User : Update donation
app.put("/user-update-donation", async (req, res) => {
	var { donate_id, unit, location_id, disease } = req.body;
	var pool = await conn;
	var stringQuery = `update Donate set Lid = ${location_id}, Unit = ${unit}, Disease='${disease}' where Donate_id = ${donate_id}`;

	return await pool.request().query(stringQuery, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json("success");
		}
	});
});

// User : Update request
app.put("/user-update-request", async (req, res) => {
	var { request_id, unit, reason } = req.body;
	var pool = await conn;
	var stringQuery = `update Request set Unit = ${unit}, Reason='${reason}' where Request_id = ${request_id}`;

	return await pool.request().query(stringQuery, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json("success");
		}
	});
});

// User : Receive gift
app.put("/user-receive-gift", async (req, res) => {
	const { gift_id, user_id, point } = req.body;
	var pool = await conn;
	var stringQuery = `insert into Receive(Uid,Gid) values(${user_id},${gift_id})`;
	var stringQuery2 = `update Gift set Remain = Remain - 1 where Gift_id = ${gift_id}`;
	var stringQuery3 = `update Users set Point = Point - ${point} 
                      output inserted.*
                      where User_id = ${user_id}`;
	await pool.request().query(stringQuery, (err, result) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			pool.request().query(stringQuery2, (err, result) => {
				if (err) {
					res.status(400).json("Fail");
				} else {
					return pool.request().query(stringQuery3, (err, result) => {
						if (err) {
							res.status(400).json("Fail");
						} else {
							res.json(result.recordset[0]);
						}
					});
				}
			});
		}
	});
});

//User : Get number of donation
app.get("/get-donation-times/:user_id/:status", async (req, res) => {
	const { user_id, status } = req.params;
	var pool = await conn;
	var stringQuery = `select count(*) Numbers from Users 
                join Donate on Users.User_id = Donate.Uid
                where 1 = 1 ${
							status === "all" ? "" : ` and Donate.Status = '${status}'`
						}  and Users.User_id = ${user_id}`;
	return await pool.request().query(stringQuery, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json(users.recordset[0]);
		}
	});
});

//User : Get number of request
app.get("/get-request-times/:user_id/:status", async (req, res) => {
	const { user_id, status } = req.params;
	var pool = await conn;
	var stringQuery = `select count(*) Numbers from Users 
                join Request on Users.User_id = Request.Uid
                where 1 = 1 ${
							status === "all" ? "" : ` and Request.Status = '${status}'`
						}  and Users.User_id = ${user_id}`;
	return await pool.request().query(stringQuery, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json(users.recordset[0]);
		}
	});
});

//User : Get gift statistic
app.get("/get-gift-statistics/:id", async (req, res) => {
	const { id } = req.params;
	var pool = await conn;
	var stringQuery = `select Gift.Gname, Gift.Point, count(*) as Quantity from Gift 
                      join Receive on Gift.Gift_id = Receive.Gid
                      where Receive.Uid = ${id}
                      group by Gift.Gname, Gift.Point`;
	return await pool.request().query(stringQuery, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json(users.recordset);
		}
	});
});

// Admin : Get user-detail
app.post("/user-detail", async (req, res) => {
	const {
		order,
		age,
		blood_type,
		donate_location,
		request_location,
		donate_unit,
		request_unit,
	} = req.body;
	var pool = await conn;
	var conditionQuery =
		`${blood_type === "" ? "" : ` and Blood_group = '${blood_type}'`} ` +
		`${donate_location === "" ? "" : ` and d.Lid = '${donate_location}'`} ` +
		`${request_location === "" ? "" : ` and r.Lid = '${request_location}'`} `;

	var principleQuery = `select Dob, Name, Gender, Blood_group, Phone_number, Point, Register_datetime, 
                        sum(distinct case when d.Status = 'approved' then d.Unit else 0 end) Donated_amount,
                        sum(distinct case when r.Status = 'approved' then r.Unit else 0 end) Requested_amount
                        from Users u 
                        full join Donate d on u.User_id = d.Uid
                        full join Request r on u.User_id = r.Uid
                        where IsAdmin = 0  `;
	var orderQuery = `order by ${order}`;
	var groupByQuery = `group by Dob, Name, Gender, Blood_group, Phone_number, Point, Register_datetime `;
	var havingQuery =
		`having 1 = 1` +
		`${
			donate_unit === 0
				? ""
				: ` and sum(distinct case when d.Status = 'approved' then d.Unit else 0 end) >= ${donate_unit}`
		} ` +
		`${
			request_unit === 0
				? ""
				: ` and sum(distinct case when r.Status = 'approved' then r.Unit else 0 end) >= ${request_unit}`
		} `;

	var queryString;

	if (age === "") {
		queryString =
			principleQuery +
			conditionQuery +
			groupByQuery +
			havingQuery +
			orderQuery;
	} else {
		if (age === 18) {
			queryString =
				principleQuery +
				conditionQuery +
				` and DATEDIFF(hour,Dob,GETDATE())/8766 < 18` +
				groupByQuery +
				havingQuery +
				orderQuery;
		} else if (age === 60) {
			queryString =
				principleQuery +
				conditionQuery +
				` and DATEDIFF(hour,Dob,GETDATE())/8766 > 17` +
				` and DATEDIFF(hour,Dob,GETDATE())/8766 < 61` +
				groupByQuery +
				havingQuery +
				orderQuery;
		} else {
			queryString =
				principleQuery +
				conditionQuery +
				` and DATEDIFF(hour,Dob,GETDATE())/8766 > 60` +
				groupByQuery +
				havingQuery +
				orderQuery;
		}
	}

	return await pool.request().query(queryString, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json(users.recordset);
		}
	});
});

//Admin : Get blood-type statistics
app.get("/blood-type-statistics/:location", async (req, res) => {
	const { location } = req.params;
	var pool = await conn;
	var stringQuery;
	if (location.length === 0) {
		stringQuery = `select sum(Group_A_Plus) as A_Plus,sum(Group_A_Minus) as A_Minus,sum(Group_B_Plus) as B_Plus,sum(Group_B_Minus) as B_Minus,sum(Group_AB_Plus) as AB_Plus,sum(Group_AB_Minus) as AB_Minus,sum(Group_O_Plus) as O_Plus,sum(Group_O_Minus) as O_Minus from Location where Location_id = 0`;
	} else {
		stringQuery = `select sum(Group_A_Plus) as A_Plus,sum(Group_A_Minus) as A_Minus,sum(Group_B_Plus) as B_Plus,sum(Group_B_Minus) as B_Minus,sum(Group_AB_Plus) as AB_Plus,sum(Group_AB_Minus) as AB_Minus,sum(Group_O_Plus) as O_Plus,sum(Group_O_Minus) as O_Minus from Location where Location_id in (${location})`;
	}
	return await pool.request().query(stringQuery, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json(users.recordset);
		}
	});
});

//Admin : Get total donors
app.get("/get-total-donors/:location", async (req, res) => {
	const { location } = req.params;
	var pool = await conn;
	var stringQuery;
	if (location.length === 0) {
		stringQuery = `select count(distinct Users.User_id) as Total_donors from Donate 
                    join Location on Location.Location_id = Donate.Lid
                    join Users on Users.User_id = Donate.Uid
                    where Donate.Status = 'approved' and Location.Location_id = 0`;
	} else {
		stringQuery = `select count(distinct Users.User_id) as Total_donors from Donate 
                    join Location on Location.Location_id = Donate.Lid
                    join Users on Users.User_id = Donate.Uid
                    where Donate.Status = 'approved' and Location.Location_id in (${location})`;
	}
	return await pool.request().query(stringQuery, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json(users.recordset);
		}
	});
});

//Admin : Get total unit
app.get("/get-total-units/:location", async (req, res) => {
	const { location } = req.params;
	var pool = await conn;
	var stringQuery;
	if (location.length === 0) {
		stringQuery = `select SUM(Group_A_Plus) + SUM(Group_A_Minus)+ SUM(Group_B_Plus)+SUM(Group_B_Minus)+
                    SUM(Group_AB_Plus)+ SUM(Group_AB_Minus)+ SUM(Group_O_Plus)+ SUM(Group_O_Minus) as Total_units
                    from Location where Location_id in (0)`;
	} else {
		stringQuery = `select SUM(Group_A_Plus) + SUM(Group_A_Minus)+ SUM(Group_B_Plus)+SUM(Group_B_Minus)+
                    SUM(Group_AB_Plus)+ SUM(Group_AB_Minus)+ SUM(Group_O_Plus)+ SUM(Group_O_Minus) as Total_units
                    from Location where Location_id in (${location})`;
	}
	return await pool.request().query(stringQuery, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json(users.recordset);
		}
	});
});

//Admin : Get total approved requests
app.get("/get-total-requests/:location", async (req, res) => {
	const { location } = req.params;
	var pool = await conn;
	var stringQuery;
	if (location.length === 0) {
		stringQuery = `select count( Users.User_id) as Total_requests from Request 
                    join Location on Location.Location_id = Request.Lid
                    join Users on Users.User_id = Request.Uid
                    where Request.Status = 'approved' and Location.Location_id in (0)`;
	} else {
		stringQuery = `select count( Users.User_id) as Total_requests from Request 
                    join Location on Location.Location_id = Request.Lid
                    join Users on Users.User_id = Request.Uid
                    where Request.Status = 'approved' and Location.Location_id in (${location})`;
	}
	return await pool.request().query(stringQuery, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json(users.recordset);
		}
	});
});

// Admin : Get user donation
app.post("/admin-get-donation", async (req, res) => {
	const { order, field, content } = req.body;
	var pool = await conn;
	var stringQuery;
	if (field === "all") {
		stringQuery = `select Users.User_id, Users.Name, Users.Dob, Users.Blood_group,Donate.Donate_date, Donate.Lid,Donate.Disease, Donate.Status, Donate.Unit, Donate.Donate_id from Users
                        join Donate
                        on Users.User_id = Donate.Uid
                        where Status = 'pending'
                        order by ${order}  
                        `;
	} else {
		if (field === "Disease" && content === "Have") {
			stringQuery = `select Users.User_id, Users.Name, Users.Dob, Users.Blood_group,Donate.Donate_date, Donate.Lid,Donate.Disease, Donate.Status, Donate.Unit, Donate.Donate_id from Users
                        join Donate
                        on Users.User_id = Donate.Uid  
                        where Status = 'pending' and Disease  != 'None'
                        order by ${order}  
                        `;
		} else {
			stringQuery = `select Users.User_id, Users.Name, Users.Dob, Users.Blood_group,Donate.Donate_date, Donate.Lid,Donate.Disease, Donate.Status, Donate.Unit, Donate.Donate_id from Users
                        join Donate
                        on Users.User_id = Donate.Uid  
                        where Status = 'pending' and ${field} = '${content}'
                        order by ${order}  
                        `;
		}
	}

	return await pool.request().query(stringQuery, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json(users.recordset);
		}
	});
});

// Admin : Get user request
app.post("/admin-get-request", async (req, res) => {
	const { order, field, content, reason } = req.body;
	var pool = await conn;
	var stringQuery;
	if (field === "all") {
		stringQuery = `select Users.Name, Users.Dob, Users.Blood_group,Request.Request_date, Request.Status,Request.Reason, Request.Unit, Request.Request_id from Users
                  join Request
                  on Users.User_id = Request.Uid
                  where Status = 'pending'
                  order by ${order}  
                  `;
	} else {
		if (field === "Reason" && content === "Other") {
			stringQuery = `select Users.Name, Users.Dob, Users.Blood_group,Request.Request_date, Request.Lid,Request.Reason, Request.Status, Request.Unit, Request.Request_id from Users
                        join Request
                        on Users.User_id = Request.Uid  
                        where Status = 'pending' and Request.Reason not in (${reason})
                        order by ${order}  
                        `;
		} else {
			stringQuery = `select Users.Name, Users.Dob, Users.Blood_group,Request.Request_date, Request.Status,Request.Reason, Request.Unit, Request.Request_id from Users
                      join Request
                      on Users.User_id = Request.Uid
                      where Status = 'pending' and ${field} = '${content}'
                      order by ${order}  
                      `;
		}
	}

	return await pool.request().query(stringQuery, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json(users.recordset);
		}
	});
});

//Admin : Get available location,
app.post("/admin-get-available-location", async (req, res) => {
	const { blood_group, unit } = req.body;
	var pool = await conn;
	var stringQuery = `select Location_id, Location_name, Address from Location
                     where ${blood_group} >= ${unit}`;
	return await pool.request().query(stringQuery, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json(users.recordset);
		}
	});
});

//Admin : Reject user donation
app.put("/admin-reject-donation", async (req, res) => {
	const { donate_id, aid } = req.body;
	var pool = await conn;
	var stringQuery = `update Donate set Status = 'rejected', Aid =${aid} where Donate_id = ${donate_id}`;
	return await pool.request().query(stringQuery, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json("Success");
		}
	});
});

//Admin : Approve user donation
app.put("/admin-approve-donation", async (req, res) => {
	const { donate_id, aid, lid, blood_group, unit, uid } = req.body;
	console.log([donate_id, aid, lid, blood_group, unit, uid]);
	var point;
	if (unit === 250) point = 1;
	else if (unit === 350) point = 2;
	else if (unit === 450) point = 3;

	var pool = await conn;
	var stringQuery = `update Donate set Status = 'approved', Aid =${aid} where Donate_id = ${donate_id}`;
	var stringQuery2 = `update Location set ${blood_group} = ${blood_group} + ${unit} where Location_id = ${lid}`;
	var stringQuery3 = `update Users set Point = Point + ${point} where User_id = ${uid}`;
	await pool.request().query(stringQuery, (err, result) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			pool.request().query(stringQuery2, (err, result) => {
				if (err) {
					res.status(400).json("Fail");
				} else {
					pool.request().query(stringQuery3, (err, result) => {
						if (err) {
							res.status(400).json("Fail");
						} else {
							res.json("Success");
						}
					});
				}
			});
		}
	});
});

//Admin : Reject user request
app.put("/admin-reject-request", async (req, res) => {
	const { request_id, aid } = req.body;
	var pool = await conn;
	var stringQuery = `update Request set Status = 'rejected', Aid =${aid} where Request_id = ${request_id}`;
	return await pool.request().query(stringQuery, (err, users) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			res.json("Success");
		}
	});
});

//Admin : Approve user request
app.put("/admin-approve-request", async (req, res) => {
	const { request_id, aid, lid, blood_group, unit, blood_type } = req.body;
	var pool = await conn;
	var stringQuery = `update Request set Status = 'approved', Aid =${aid}, Lid = ${lid}, Blood_group_suggestion = '${blood_type}' where Request_id = ${request_id}`;
	var stringQuery2 = `update Location set ${blood_group} = ${blood_group} - ${unit} where Location_id = ${lid}`;
	await pool.request().query(stringQuery, (err, result) => {
		if (err) {
			res.status(400).json("Fail");
		} else {
			return pool.request().query(stringQuery2, (err, result) => {
				if (err) {
					res.status(400).json("Fail");
				} else {
					res.json("Success");
				}
			});
		}
	});
});

//Admin : Get donation history
app.post("/admin-donation-history", async (req, res) => {
	const { aid, order, field, content } = req.body;
	var pool = await conn;
	var stringQuery;
	if (field === "all") {
		stringQuery = `select Name,Dob,Disease,Blood_group,Unit,Donate_date,Lid,Status,Donate_id,Censor_datetime from Donate join Users
                    on Donate.Uid = Users.User_id
                    where Aid = @aid
                    order by ${order}`;
	} else {
		stringQuery = `select Name,Dob,Disease,Blood_group,Unit,Donate_date,Lid,Status,Donate_id,Censor_datetime from Donate join Users
                    on Donate.Uid = Users.User_id
                    where Aid = @aid and ${field} = '${content}'
                    order by ${order} `;
	}
	return await pool
		.request()
		.input("aid", sql.Int, aid)
		.query(stringQuery, (err, users) => {
			if (err) {
				res.status(400).json("Fail");
			} else {
				res.json(users.recordset);
			}
		});
});

//Admin : Get request history
app.post("/admin-request-history", async (req, res) => {
	const { aid, order, field, content, reason } = req.body;
	var pool = await conn;
	var stringQuery;
	if (field === "all") {
		stringQuery = `select Name,Dob,Reason,Blood_group,Unit,Request_date,Lid,Status,Request_id,Censor_datetime,Blood_group_suggestion from Request join Users
                    on Request.Uid = Users.User_id
                    where Aid = @aid
                    order by ${order}`;
	} else {
		if (field === "Reason" && content === "Other") {
			stringQuery = `select Name,Dob,Reason,Blood_group,Unit,Request_date,Lid,Status,Request_id,Censor_datetime,Blood_group_suggestion from Request join Users
                    on Request.Uid = Users.User_id
                    where Aid = @aid and Reason not in (${reason})
                    order by ${order} `;
		} else {
			stringQuery = `select Name,Dob,Reason,Blood_group,Unit,Request_date,Lid,Status,Request_id,Censor_datetime,Blood_group_suggestion from Request join Users
                    on Request.Uid = Users.User_id
                    where Aid = @aid and ${field} = '${content}'
                    order by ${order} `;
		}
	}
	return await pool
		.request()
		.input("aid", sql.Int, aid)
		.query(stringQuery, (err, users) => {
			if (err) {
				res.status(400).json("Fail");
			} else {
				res.json(users.recordset);
			}
		});
});

app.listen(3000, () => {
	console.log("App is running");
});
