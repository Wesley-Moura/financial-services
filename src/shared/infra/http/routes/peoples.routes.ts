import { Router } from "express";

import { CreateAccountController } from "../../../../modules/accounts/useCases/createAccount/CreateAccountController";
import { ListAccountController } from "../../../../modules/accounts/useCases/listAccount/ListAccountController";
import { ListPeopleCardsController } from "../../../../modules/cards/useCases/listPeopleCards/ListPeopleCardsController";
import { CreatePeopleController } from "../../../../modules/people/useCases/createPeople/CreatePeopleController";

const peoplesRoutes = Router();

const createPeopleController = new CreatePeopleController();
const createAccountController = new CreateAccountController();
const listAccountController = new ListAccountController();
const listPeopleCardsController = new ListPeopleCardsController();

peoplesRoutes.post("/", createPeopleController.handle);
peoplesRoutes.post("/:peopleId/accounts", createAccountController.handle);
peoplesRoutes.get("/:peopleId/accounts", listAccountController.handle);
peoplesRoutes.get("/:peopleId/cards", listPeopleCardsController.handle);

export { peoplesRoutes };
