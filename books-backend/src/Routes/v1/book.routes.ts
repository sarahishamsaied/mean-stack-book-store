import { Router } from 'express';
import { create, show, get, update, remove } from '../../Controllers/Book.controller';
import upload from '../../config/multer.config';
import { asyncWrapper } from '../../utils/asyncWrapper';

const router = Router();

router.post('/', upload.single('cover'), asyncWrapper(create));

router.put('/:id', upload.single('cover'), asyncWrapper(update));

router.get('/:id', asyncWrapper(show));
router.get('/', asyncWrapper(get));
router.delete('/:id', asyncWrapper(remove));

export default router;
