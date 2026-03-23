"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const api_1 = __importDefault(require("./routes/api"));
const oracledb_1 = __importDefault(require("oracledb"));
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
// Initialize Oracle Client for Thick Mode (Required for Oracle 10g)
try {
    let libDir = process.env.ORACLE_LIB_DIR;
    // On Windows, if no libDir is specified, it might use PATH. 
    // On macOS/Linux, explicit path is often needed if not in default system lib paths.
    if (libDir) {
        oracledb_1.default.initOracleClient({ libDir: libDir });
        console.log('Oracle Client initialized in Thick mode');
    }
    else {
        // Attempt to initialize without explicit path (relies on system PATH/LD_LIBRARY_PATH)
        // Only do this if we suspect we are in an environment needing Thick mode but user didn't set env var,
        // OR we can just log a warning.
        // For now, let's just log.
        console.log('ORACLE_LIB_DIR not set. Using node-oracledb default (Thin mode unless libraries found in system path)');
        // Forced Thick Mode check:
        // oracledb.initOracleClient(); 
        // Uncommenting the above line would FORCE Thick mode search. 
        // If the user wants 10g, they MUST Use Thick mode. 
        // Let's being helpful: if connection string implies 10g or user said so, we should probably try initOracleClient() even without args 
        // to see if it finds instant client in path. 
        // But safe default is: if they provided the dir, use it.
    }
}
catch (err) {
    console.error('Failed to initialize Oracle Client:', err);
    // Proceeding intentionally; maybe they only need mock data or the error is recoverable
}
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server is running');
});
app.use('/api', api_1.default);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
