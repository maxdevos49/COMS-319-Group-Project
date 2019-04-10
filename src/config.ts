import { IConfig } from "./helpers/vash/lib/Interfaces/IConfig";

export const config: IConfig = {
    title: "B.R.T.D. (Battle Royal Top Down Shooter)",
    versionRelease: "April 5, 2019",
    versionTitle: "Alpha",
    version: "1.0.0",
    description: "B.R.T.D is a Top Down Battle Royal Shooter Game. ",
    owner: ["Maxwell DeVos", "Mason Timmerman", "Joeseph Naberhaus", "John Jago"],
    developers: [
        {
            name: "Maxwell DeVos",
            major: "Software Engineering",
            year: 2021,
            github: "https://github.com/Maxdevos49",
            website: "",
            bio: "",
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
            website: "",
            bio: "",
            image: "/images/default-user.png"
        },
        {
            name: "Joseph Naberhaus",
            major: "Software Engineering",
            year: 2021,
            github: "https://github.com/JosephNaberhaus",
            website: "",
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