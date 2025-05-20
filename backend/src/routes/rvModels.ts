import { Router } from 'express';
import { db } from '../db';
import { rv_models } from '../schema';
import { eq, and, like, SQL } from 'drizzle-orm';

const router = Router();

// Search RV models by make, model, and year
router.get('/search', async (req, res) => {
  try {
    const { make, model, year } = req.query;
    const conditions: SQL[] = [];

    if (make) {
      conditions.push(like(rv_models.make, `%${make}%`));
    }
    if (model) {
      conditions.push(like(rv_models.model, `%${model}%`));
    }
    if (year) {
      conditions.push(eq(rv_models.year, Number(year)));
    }

    const models = await db
      .select()
      .from(rv_models)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    res.json(models);
  } catch (error) {
    console.error('Error searching RV models:', error);
    res.status(500).json({ error: 'Failed to search RV models' });
  }
});

// Get specific RV model by make, model, and year
router.get('/:make/:model/:year', async (req, res) => {
  try {
    const { make, model, year } = req.params;

    const rvModel = await db
      .select()
      .from(rv_models)
      .where(
        and(
          eq(rv_models.make, make),
          eq(rv_models.model, model),
          eq(rv_models.year, Number(year))
        )
      )
      .limit(1);

    if (rvModel.length === 0) {
      return res.status(404).json({ error: 'RV model not found' });
    }

    res.json(rvModel[0]);
  } catch (error) {
    console.error('Error fetching RV model:', error);
    res.status(500).json({ error: 'Failed to fetch RV model' });
  }
});

export default router; 