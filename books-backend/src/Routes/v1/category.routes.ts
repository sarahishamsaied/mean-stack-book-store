import { Router } from 'express';
import { create, show, update, remove, get } from '../../Controllers/Category.controller';
import { asyncWrapper } from '../../utils/asyncWrapper';
import { verifyAccessToken } from '../../middlewares/verifyAccessToken';

const router = Router();

router.post('/', asyncWrapper(create));
router.get('/', asyncWrapper(get));
router.get('/:id', asyncWrapper(show));
router.put('/:id', asyncWrapper(update));
router.delete('/:id', asyncWrapper(remove));

export default router;
