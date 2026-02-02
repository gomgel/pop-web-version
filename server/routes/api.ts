import express, { Request, Response } from 'express';
import { mockAccounts } from '../data/mockData';
import { getEmployees } from '../services/pmemplymService';
import { getPmautolb } from '../services/pmautolbService';
import { getPmautobx } from '../services/pmautobxService';
import { getTables, getTableMetadata, getTableData } from '../services/pmtableService';
import { login } from '../services/authService';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { plant, emplCode, password } = req.body;
        if (!plant || !emplCode || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const result = await login(plant, emplCode, password);
        res.json(result);
    } catch (error) {
        console.error('Error in /api/login:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.get('/search', (req: Request, res: Response) => {
    try {
        const {
            query,
            jobTitle,
            status,
            department,
            dateIsLessThan,
            dateIsEqualTo
        } = req.query;

        let results = [...mockAccounts];

        // Text search (in name or description)
        if (query) {
            const q = (query as string).toLowerCase();
            results = results.filter(account =>
                account.name.toLowerCase().includes(q) ||
                account.description.toLowerCase().includes(q)
            );
        }

        // Filter by Job Title (Contains)
        if (jobTitle) {
            const jt = (jobTitle as string).toLowerCase();
            results = results.filter(account =>
                account.jobTitle.toLowerCase().includes(jt)
            );
        }

        // Filter by Status
        if (status && status !== 'Select') {
            const s = (status as string).toLowerCase();
            results = results.filter(account =>
                account.status.toLowerCase() === s
            );
        }

        // Filter by Department
        if (department) {
            // Assuming department might come as array or comma separated if multiple selected
            // For simple single select/string match:
            const d = (department as string).toLowerCase();
            results = results.filter(account =>
                account.department.toLowerCase().includes(d)
            );
        }

        // NOTE: Date filtering logic would go here. 
        // Given the mock string dates, we'd parse them.
        // Simplifying for now.

        // Filter by Purchase Order
        if (req.query.purchaseOrder) {
            const po = (req.query.purchaseOrder as string).toLowerCase();
            results = results.filter(account =>
                account.purchaseOrder && account.purchaseOrder.toLowerCase().includes(po)
            );
        }

        // Filter by Hiring Date (Simplified string match/logic for mock)
        if (req.query.hiringDate) {
            const hd = req.query.hiringDate as string;
            results = results.filter(account =>
                account.hiringDate === hd
            );
        }

        // Filter by Expected Arrival Date (Simplified string match/logic for mock)
        if (req.query.expectedArrivalDate) {
            // For "Is Less than" logic in mock, we'd need date parsing.
            // Keeping it simple: exact match for now as per plan, or basic string comparison if formatted same.
            const ad = req.query.expectedArrivalDate as string;
            results = results.filter(account =>
                account.expectedArrivalDate === ad
            );
        }

        res.json({
            data: results,
            total: results.length,
            page: 1,
            pageSize: 10
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/employee', async (req: Request, res: Response) => {
    try {
        const plantCode = req.query.plantCode as string;
        const emplCode = req.query.emplCode as string;
        const emplName = req.query.emplName as string;

        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const { data, total } = await getEmployees(plantCode, emplCode, emplName, page, pageSize);

        res.json({
            data,
            total,
            page,
            pageSize
        });
    } catch (error) {
        console.error('Error in /api/employee:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/label/product', async (req: Request, res: Response) => {
    try {
        const plantCode = req.query.plantCode as string;
        const prdtTpcd = req.query.prdtTpcd as string;
        const prvsName = req.query.prvsName as string;
        const possInfo = req.query.possInfo as string;

        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const { data, total } = await getPmautolb(plantCode, prdtTpcd, prvsName, possInfo, page, pageSize);

        res.json({
            data,
            total,
            page,
            pageSize
        });
    } catch (error) {
        console.error('Error in /api/label/product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/label/box', async (req: Request, res: Response) => {
    try {
        const plantCode = req.query.plantCode as string;
        const prdtTpcd = req.query.prdtTpcd as string;
        const prvsName = req.query.prvsName as string;
        const possInfo = req.query.possInfo as string;

        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const { data, total } = await getPmautobx(plantCode, prdtTpcd, prvsName, possInfo, page, pageSize);

        res.json({
            data,
            total,
            page,
            pageSize
        });
    } catch (error) {
        console.error('Error in /api/label/box:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/tables', async (req: Request, res: Response) => {
    try {
        const tables = await getTables();
        res.json(tables);
    } catch (error) {
        console.error('Error in /api/tables:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/table/metadata', async (req: Request, res: Response) => {
    try {
        const tableName = req.query.tableName as string;
        if (!tableName) return res.status(400).json({ message: 'tableName is required' });
        const metadata = await getTableMetadata(tableName);
        res.json(metadata);
    } catch (error) {
        console.error('Error in /api/table/metadata:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/table/data', async (req: Request, res: Response) => {
    try {
        const { tableName, page, pageSize, ...filters } = req.query;
        if (!tableName) return res.status(400).json({ message: 'tableName is required' });

        const p = parseInt(page as string) || 1;
        const ps = parseInt(pageSize as string) || 10;

        const { data, total } = await getTableData(tableName as string, filters as any, p, ps);

        res.json({
            data,
            total,
            page: p,
            pageSize: ps
        });
    } catch (error) {
        console.error('Error in /api/table/data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
