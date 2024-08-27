import { Router } from 'express';

import categoryRoutes from './v1/category.routes';
import authorRoutes from './v1/author.routes';
import bookRoutes from './v1/book.routes';
import publisherRoutes from './v1/publisher.routes';

const router = Router();

router.use('/category', categoryRoutes);
router.use('/author', authorRoutes);
router.use('/book', bookRoutes);
router.use('/publisher', publisherRoutes);

export default router;
