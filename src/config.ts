const config = {
    name: "B.R.T.D. (Battle Royal Top Down Shooter)",
    versionRelease: "March 23, 2019",
    versionTitle: "Alpha",
    version: "1.0.0",
    description:
        "B.R.T.D is a Top Down Battle Royal Game inspired from the many currently popular battle royal games. Add more and also add it too layout file...",
    owner: [
        "Maxwell DeVos",
        "Mason Timmerman",
        "Joeseph Naberhaus",
        "John Jago"
    ],
    Developers: [
        {
            name: "Maxwell DeVos",
            major: "Software Engineering",
            year: "",
            github: "https://github.com/Maxdevos49",
            website: "",
            bio: "",
            image: ""
        },
        {
            name: "Mason Timmerman",
            major: "Software Engineering",
            year: "",
            github: "https://github.com/MasonLT199",
            website: "",
            bio: "",
            image: ""
        },
        {
            name: "John Jago",
            major: "Software Engineering",
            year: "",
            github: "https://github.com/johnjago",
            website: "",
            bio: "",
            image: ""
        },
        {
            name: "Joseph Naberhaus",
            major: "Software Engineering",
            year: "",
            github: "https://github.com/JosephNaberhaus",
            website: "",
            bio: "",
            image: ""
        }
    ],
    server: {
        enviroment: process.env.NODE_ENVIROMENT,
        port: process.env.SERVER_PORT,
        domain: process.env.DOMAIN,
        transport: process.env.TRANSPORT
    },
    controllers: [{ controller: "Home" }, { controller: "Game" }]
};

export default config;
