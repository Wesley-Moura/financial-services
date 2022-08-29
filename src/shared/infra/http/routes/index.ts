import { Router } from "express";

import { accountsRoutes } from "./accounts.routes";
import { peoplesRoutes } from "./peoples.routes";

const router = Router();

router.use("/people", peoplesRoutes);
router.use("/accounts", accountsRoutes);

export { router };
