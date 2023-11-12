import * as path from "path"

export const root: string = path.resolve(__dirname, "..")

export const environment = {

  ClientUrl: "http://localhost:4200/",
  StakeholderUrl: "http://localhost:2222/",
  ResetPasswordClientRoute: "reset-password",
  CreatePasswordClientRoute: "create-password",
  ConnectSmartWatchRoute: "connect-smart",

  jwtConstants: {
    secret: 'ThaServe!',
    expire: 10
  },

  typeormConfig: {
    // type: "sqlite",
    // database: `${root}/data/test.sqllite`,
    // entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
    // logging: false,
    // synchronize: true,
    // driver: require("sqlite3")

    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: "root",
    password: '',
    database: 'beba',
    entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: false,
    cli: {
      entitiesDir: "src/entities"
    },
    extra: {
      connectionLimit: 10
    },
  }
  ,
  typeormTestConfig: {
    //   type: "sqlite",
    //   database: `${root}/data/test${Math.random()}.testdb.sqllite`,
    //   entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
    //   logging: false,
    //   synchronize: true,
    //   driver: require("sqlite3")
    //   name: 'default', // add this line
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: "root",
    //   password: '',
    //   database: 'beba_test',
    //   entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
    //   synchronize: true,
    //   logging: false,
    //   cli: {
    //     entitiesDir: "src/entities"
    //   },
    //   extra: {
    //     connectionLimit: 10
    //   }
  }
  ,

  excelTemplates: {
    milestones: path.resolve(__dirname, '../recourses/milestones.xlsx'),
    immunization: path.resolve(__dirname, '../recourses/Immunization.xlsx'),
    weightForAge: path.resolve(__dirname, '../recourses/Road to Health_Simplified.xlsx'),
    heightForAge: path.resolve(__dirname, '../recourses/Height For Age HFA Chart BeBa App.xlsx'),
    headForAge: path.resolve(__dirname, '../recourses/head for age.xlsx'),
  }
};