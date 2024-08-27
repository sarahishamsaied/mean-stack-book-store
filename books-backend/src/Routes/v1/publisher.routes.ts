import { Router } from 'express';
import { create, show, get, update, remove } from '../../Controllers/Publisher.controller';
import { asyncWrapper } from '../../utils/asyncWrapper';

const router = Router();

router.post('/', asyncWrapper(create));
router.get('/:id', asyncWrapper(show));
router.get('/', asyncWrapper(get));
router.put('/:id', asyncWrapper(update));
router.delete('/:id', asyncWrapper(remove));

export default router;
