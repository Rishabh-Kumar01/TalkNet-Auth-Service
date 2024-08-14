const utils = require("./utils/index.util");
const config = require("./config/index.config");
const routes = require("./routes/index.route");

const app = utils.imports.express();

// Function to setup and start the server
const setupAndStartServer = () => {

    // Middlewares
  app.use(utils.imports.morgan("dev"));
  app.use(utils.imports.cors());
  app.use(utils.imports.helmet());
  app.use(utils.imports.compression());
  app.use(utils.imports.bodyParser.json());
  app.use(utils.imports.bodyParser.urlencoded({ extended: true }));

  app.use(utils.imports.session({
    secret: config.serverConfig.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: config.serverConfig.NODE_ENV === 'production' }
  }));


  app.use(utils.imports.passport.initialize());
  app.use(utils.imports.passport.session());
  
  // Routes
  app.use("/api", routes);

  // Home Route
  app.get("/", (request, response) => {
    response.send("Hello Server!!!😊😊😊😊");
  });

  app.use(utils.errorHandler.BaseError);

  // Start the server on the specified port and connect to the database
  app.listen(config.serverConfig.PORT, async () => {
    console.log(`SERVER IS RUNNING ON PORT ${config.serverConfig.PORT}`);
  });
  config.connection();
};

// Call the function to setup and start the server
setupAndStartServer();



module.exports = app;
