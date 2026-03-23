"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mockData_1 = require("../data/mockData");
const pmemplymService_1 = require("../services/pmemplymService");
const pmautolbService_1 = require("../services/pmautolbService");
const pmautobxService_1 = require("../services/pmautobxService");
const pmtableService_1 = require("../services/pmtableService");
const p2000ProdTotalService_1 = require("../services/p2000ProdTotalService");
const authService_1 = require("../services/authService");
const router = express_1.default.Router();
router.post('/login', async (req, res) => {
    try {
        const { plant, emplCode, password } = req.body;
        if (!plant || !emplCode || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const result = await (0, authService_1.login)(plant, emplCode, password);
        res.json(result);
    }
    catch (error) {
        console.error('Error in /api/login:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
router.get('/search', (req, res) => {
    try {
        const { query, jobTitle, status, department, dateIsLessThan, dateIsEqualTo } = req.query;
        let results = [...mockData_1.mockAccounts];
        // Text search (in name or description)
        if (query) {
            const q = query.toLowerCase();
            results = results.filter(account => account.name.toLowerCase().includes(q) ||
                account.description.toLowerCase().includes(q));
        }
        // Filter by Job Title (Contains)
        if (jobTitle) {
            const jt = jobTitle.toLowerCase();
            results = results.filter(account => account.jobTitle.toLowerCase().includes(jt));
        }
        // Filter by Status
        if (status && status !== 'Select') {
            const s = status.toLowerCase();
            results = results.filter(account => account.status.toLowerCase() === s);
        }
        // Filter by Department
        if (department) {
            // Assuming department might come as array or comma separated if multiple selected
            // For simple single select/string match:
            const d = department.toLowerCase();
            results = results.filter(account => account.department.toLowerCase().includes(d));
        }
        // NOTE: Date filtering logic would go here. 
        // Given the mock string dates, we'd parse them.
        // Simplifying for now.
        // Filter by Purchase Order
        if (req.query.purchaseOrder) {
            const po = req.query.purchaseOrder.toLowerCase();
            results = results.filter(account => account.purchaseOrder && account.purchaseOrder.toLowerCase().includes(po));
        }
        // Filter by Hiring Date (Simplified string match/logic for mock)
        if (req.query.hiringDate) {
            const hd = req.query.hiringDate;
            results = results.filter(account => account.hiringDate === hd);
        }
        // Filter by Expected Arrival Date (Simplified string match/logic for mock)
        if (req.query.expectedArrivalDate) {
            // For "Is Less than" logic in mock, we'd need date parsing.
            // Keeping it simple: exact match for now as per plan, or basic string comparison if formatted same.
            const ad = req.query.expectedArrivalDate;
            results = results.filter(account => account.expectedArrivalDate === ad);
        }
        res.json({
            data: results,
            total: results.length,
            page: 1,
            pageSize: 10
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.get('/employee', async (req, res) => {
    try {
        const plantCode = req.query.plantCode;
        const emplCode = req.query.emplCode;
        const emplName = req.query.emplName;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const { data, total } = await (0, pmemplymService_1.getEmployees)(plantCode, emplCode, emplName, page, pageSize);
        res.json({
            data,
            total,
            page,
            pageSize
        });
    }
    catch (error) {
        console.error('Error in /api/employee:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.get('/label/product', async (req, res) => {
    try {
        const plantCode = req.query.plantCode;
        const prdtTpcd = req.query.prdtTpcd;
        const prvsName = req.query.prvsName;
        const possInfo = req.query.possInfo;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const { data, total } = await (0, pmautolbService_1.getPmautolb)(plantCode, prdtTpcd, prvsName, possInfo, page, pageSize);
        res.json({
            data,
            total,
            page,
            pageSize
        });
    }
    catch (error) {
        console.error('Error in /api/label/product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.get('/label/box', async (req, res) => {
    try {
        const plantCode = req.query.plantCode;
        const prdtTpcd = req.query.prdtTpcd;
        const prvsName = req.query.prvsName;
        const possInfo = req.query.possInfo;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const { data, total } = await (0, pmautobxService_1.getPmautobx)(plantCode, prdtTpcd, prvsName, possInfo, page, pageSize);
        res.json({
            data,
            total,
            page,
            pageSize
        });
    }
    catch (error) {
        console.error('Error in /api/label/box:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.get('/tables', async (req, res) => {
    try {
        const tables = await (0, pmtableService_1.getTables)();
        res.json(tables);
    }
    catch (error) {
        console.error('Error in /api/tables:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.get('/table/metadata', async (req, res) => {
    try {
        const tableName = req.query.tableName;
        if (!tableName)
            return res.status(400).json({ message: 'tableName is required' });
        const metadata = await (0, pmtableService_1.getTableMetadata)(tableName);
        res.json(metadata);
    }
    catch (error) {
        console.error('Error in /api/table/metadata:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.get('/table/data', async (req, res) => {
    try {
        const { tableName, page, pageSize, ...filters } = req.query;
        if (!tableName)
            return res.status(400).json({ message: 'tableName is required' });
        const p = parseInt(page) || 1;
        const ps = parseInt(pageSize) || 10;
        const { data, total } = await (0, pmtableService_1.getTableData)(tableName, filters, p, ps);
        res.json({
            data,
            total: data.length,
            page: p,
            pageSize: ps
        });
    }
    catch (error) {
        console.error('Error in /api/table/data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.get('/production/total', async (req, res) => {
    try {
        const plantCode = req.query.plantCode || '2000';
        const mkpdDate = req.query.mkpdDate || '20260203';
        const data = await (0, p2000ProdTotalService_1.getP2000ProdTotal)(plantCode, mkpdDate);
        res.json({
            data,
            total: data.length
        });
    }
    catch (error) {
        console.error('Error in /api/production/total:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.default = router;
