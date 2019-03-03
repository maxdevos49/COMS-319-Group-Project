const config = {
    name: "B.R.T.D. (Battle Royal Top Down Shooter)",
    version: "1.0.0",
    owner: [
        "Maxwell DeVos",
        "Mason Timmerman",
        "Joeseph Naberhaus",
        "John Jago"
    ],
    Developers: [
        "Maxwell DeVos",
        "Mason Timmerman",
        "Joeseph Naberhaus",
        "John Jago"
    ],
    server: {
        enviroment: process.env.NODE_ENVIROMENT,
        port: process.env.SERVER_PORT,
        domain: process.env.DOMAIN,
        transport: process.env.TRANSPORT,
    },
    controllers: [
        { controller: "Home" },
    ]
};

export default config;
