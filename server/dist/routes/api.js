"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mockData_1 = require("../data/mockData");
const router = express_1.default.Router();
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
exports.default = router;
