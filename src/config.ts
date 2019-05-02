import { IConfig } from "./helpers/vash/lib/Interfaces/IConfig";

export const config: IConfig = {
    title: "B.R.T.D. (Battle Royal Top Down Shooter)",
    versionRelease: "May 1, 2019",
    versionTitle: "Release",
    version: "3.0.0",
    description: `B.R.T.D is a Top Down Battle Royal Shooter Game. B.R.T.D was
                    inspired from many of the currently popular battle royal games
                    but we wanted to make a different take on what we saw as an
                    entertaining game. One of the biggest differences we made from
                    many of the battle royal games we have seen is to make being outside
                    of the storm not initially hurt you. We instead made enemies spawn
                    outside to encourage you to stay outside the storm.`,
    owner: ["Maxwell DeVos", "Mason Timmerman", "Joeseph Naberhaus", "John Jago"],
    developers: [
        {
            name: "Maxwell DeVos",
            major: "Software Engineering",
            year: 2021,
            github: "https://github.com/Maxdevos49",
            website: "https://thatonespot.herokuapp.com/index.html",
            bio: "Software Engineering undergraduate at Iowa State University, President of the Web Development Club, and Full Stack Developer at the ISU EH&S department.",
            image: "/images/default-user.png"
        },
        {
            name: "Mason Timmerman",
            major: "Software Engineering",
            year: 2021,
            github: "https://github.com/MasonLT199",
            website: "",
            bio: "",
            image: "/images/default-user.png"
        },
        {
            name: "John Jago",
            major: "Software Engineering",
            year: 2020,
            github: "https://github.com/johnjago",
            website: "https://johnjago.com",
            bio: "",
            image: "/images/default-user.png"
        },
        {
            name: "Joseph Naberhaus",
            major: "Software Engineering",
            year: 2021,
            github: "https://github.com/JosephNaberhaus",
            website: "https://www.naberhausj.com",
            bio: "",
            image: "/images/default-user.png"
        }
    ],
    server: {
        enviroment: process.env.NODE_ENVIROMENT,
        port: process.env.PORT,
        domain: process.env.DOMAIN,
        transport: process.env.TRANSPORT
    },
    email: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD
    },
    hash: {
        salt: process.env.HASH_SALT
    },
    database: {
        dbUrl: process.env.MONGODB_URI
    },
    session: {
        secret: process.env.SECRET
    },
    controllers: [{ controller: "Home" }, { controller: "Game" }]
};