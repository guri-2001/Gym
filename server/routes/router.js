const express = require('express');
const Clients = require('../models/client');
// const Clients = require('../models/client');
const Event = require('../models/event');
const Gallery = require('../models/gallery');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();
const cron = require('node-cron');
const moment = require("moment")

// Route to upload an image
router.post('/addClient', upload.single('image'), async (req, res) => {
    try {
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.png';
        const checkedValues = JSON.parse(req.body.checkedValues);


        if (!Array.isArray(checkedValues)) {
            return res.status(400).json({ message: 'Invalid values' })
        }

        const { name, fname, mobileno, dob, weight, address } = req.body
        const newImage = new Clients({ image: imageUrl, name, fname, mobileno, dob, weight, address, checkedValues });
        await newImage.save();
        res.status(201).json({ message: 'Image uploaded successfully', imageUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading image', error });
    }
});

// Route to update an client

router.put('/userUpdate/:id', upload.single("image"), async (req, res) => {
    const id = req.params.id

    // const imageUrl = req.file.filename;
    const data = await Clients.find({})

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : data.image;

    const { name, fname, mobileno, dob, weight, address, fees, duration, enddate } = req.body;
    console.log(imageUrl);


    await Clients.findOneAndUpdate({ _id: id }, { name, fname, mobileno, dob, weight, address, fees, duration, enddate, image: imageUrl })
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
});

// router.put('/update/:id', upload.single('image'), async (req, res) => {
//     try {
//         console.log(req.params.id);

//         const image = await Clients.findById(req.params.id);
//         if (!image) return res.status(404).json({ message: 'Image not found' });

//         const { name, fname, mobileno, dob, weight, address, fees, duration, enddate } = req.body;

//         image.imageUrl = `/uploads/${req.file.filename}`; // Update image URL
//         await image.save();
//         res.status(200).json({ message: 'Image updated successfully', imageUrl: image.imageUrl });
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating image', error });
//     }
// });

// user data get
// router.get('/', async (req, res) => {
//     try {
//         const images = await Clients.find();
//         res.status(200).json(images);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching images', error });
//     }
// });

router.get('/imageById/:id', async (req, res) => {
    try {
        const image = await Clients.findById(req.params.id);
        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching images', error });
    }
})


// ===============get clients with limits=================

router.get("/getUsers", async (req, res) => {
    try {
        const clients = await Clients.find()
            .sort({ createdAt: -1 }) // Sort by creation date in descending order
            .limit(5) // Limit to 5 users
            .then((data) => {
                res.send({ status: "ok", data: data });
            });
        console.log(clients);

    } catch (error) {
        res.json({ status: error });
    }
});



// =================get all clients with paginations================


router.get('/paginatedUsers', async (req, res) => {

    let query = {};
    const searchData = req.query.search;
    if (searchData) {
        query = {
            $or: [
                { name: { $regex: searchData, $options: "i" } }
            ],
        };
    }

    const allUsers = await Clients.find(query);
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const lastIndex = (page) * limit;

    const results = {}
    results.totalUsers = allUsers.length;
    results.pageCount = Math.ceil(allUsers.length / limit)

    if (lastIndex < allUsers.length) {
        results.next = {
            page: page + 1,
        }
    }

    if (startIndex > 0) {
        results.prev = {
            page: page - 1,
        }
    }

    results.result = allUsers.slice(startIndex, lastIndex)
    res.json(results);
})


// ==============update the client status false====================

router.put('/update-status/:id', async (req, res) => {
    const usersId = req.params.id
    const allUsers = await Clients.findByIdAndUpdate(usersId, { $set: { status: false } })
    res.status(200).json(allUsers)
})

// ==============update the client status true====================

router.put('/addUser/:id', async (req, res) => {
    const usersId = req.params.id
    const allUsers = await Clients.findByIdAndUpdate(usersId, { $set: { status: true } })
    res.status(200).json(allUsers)
})

// ================delete the client================

// router.delete('/deleteUser/:id', async (req, res) => {
//     const usersId = req.params.id
//     const allUsers = await Clients.findByIdAndDelete(usersId)
//     res.status(200).json(allUsers)
// })






// =============calendar Events Routes=================

router.post('/create-event', async (req, res) => {
    const event = Event(req.body);
    await event.save()
    res.sendStatus(201)
})

router.get('/get-event', async (req, res) => {
    const events = await Event.find({
        start: { $gte: moment(req.query.start).toDate() },
        end: { $lte: moment(req.query.end).toDate() }
    });

    res.send(events)
})

router.get("/getAllEvents", async (req, res) => {
    try {
        Event.find({})
            .then((data) => {
                res.send({ status: "ok", data: data });
            });
    } catch (error) {
        res.json({ status: error });
    }
});

router.delete('/deleteEvent/:id', async (req, res) => {
    const usersId = req.params.id
    const allUsers = await Event.findByIdAndDelete(usersId)
    res.status(200).json(allUsers)
})


// =================fees reminder=================

function isBirthday(user) {
    return moment().isSame(user.enddate, 'day');
}

// Cron job function
async function checkBirthdays() {
    try {
        const users = await Clients.find({ enddate: { $type: 'string' } });

        const birthdaysToday = users.filter(user => isBirthday(user));

        return birthdaysToday;
    } catch (error) {
        console.error('Error checking Notifications:', error);
        throw error;
    }
}

// Schedule the cron job to run hourly
cron.schedule('*/60 * * * * *', () => {
    checkBirthdays().then(data => {
        // console.log('Birthdays today:', data);
        // In a real application, you might want to send this data to a queue or cache system
    }).catch(error => {
        console.error('Cron job failed:', error);
    });
});


router.post('/notifications', async (req, res) => {
    try {
        const birthdays = await checkBirthdays();
        res.json(birthdays);
    } catch (error) {
        console.error('Error fetching Notifications:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





// ===========Add Gallery===================


router.post("/addGallery", upload.single("image"), async (req, res) => {
    const imageName = req.file.filename;

    console.log(imageName);


    try {
        await Gallery.create({ image: imageName }).then;
        res.json({ status: "ok" });
    } catch (error) {
        res.json({ status: error });
    }
})

router.get("/getAllImages", async (req, res) => {
    try {
        Gallery.find({})
            .then((data) => {
                res.send({ status: "ok", data: data });
            });

    } catch (error) {
        res.json({ status: error });
    }
});



// ===============Birthday Reminder===============


// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
let upcomingBirthdayUsers = []; // Temporary storage for users with birthdays in 7 days

// Schedule a Cron job to run every day at 9:00 AM
cron.schedule('*/10 * * * * *', async () => {
    const sevenDaysFromNow = moment().add(7, 'days');
    const targetMonth = sevenDaysFromNow.month() + 1; // 0-indexed in moment
    const targetDay = sevenDaysFromNow.date();

    // console.log(`Checking for birthdays on ${targetDay}/${targetMonth}`);

    try {
        // Query MongoDB to find users with birthdays 7 days from now (ignoring year)
        const users = await Clients.find({
            $expr: {
                $and: [
                    { $eq: [{ $dayOfMonth: "$dob" }, targetDay] },
                    { $eq: [{ $month: "$dob" }, targetMonth] }
                ]
            }
        });

        // console.log('Fetched users:', users);

        upcomingBirthdayUsers = users; // Store users in memory
        users.forEach(user => {
        });
        checkUsersBirthdays();
        // console.log('Users with birthdays in 7 days:', users.name);
    } catch (error) {
        console.error('Error fetching users with upcoming birthdays:', error);
    }
});


// Export the upcoming birthday users
const getUpcomingBirthdayUsers = () => upcomingBirthdayUsers;

// Define an API route to get users with birthdays in 7 days
router.get('/upcoming-birthday-users', (req, res) => {
    const users = getUpcomingBirthdayUsers();
    res.json(users);
});


let todaysBirthdays = [];
const checkUsersBirthdays = async () => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;

    try {
        // Query to find users whose birthday is today
        const birthdaysToday = await Clients.aggregate([
            {
                $project: {
                    day: { $dayOfMonth: "$dob" },
                    month: { $month: "$dob" },
                    name: 1,
                    dob: 1,
                    mobileno: 1,
                }
            },
            {
                $match: {
                    day: currentDay,
                    month: currentMonth
                }
            }
        ]);

        // console.log(birthdaysToday);


        // Update the global array with today's birthdays
        todaysBirthdays = birthdaysToday;
    } catch (error) {
        console.error('Error fetching birthdays:', error);
    }
};


checkUsersBirthdays();

// API endpoint to serve today's birthdays to the frontend
router.get('/birthdays', (req, res) => {
    res.json(todaysBirthdays);
});


module.exports = router;
